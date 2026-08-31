'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getNextPlayableChallengeId } from '@/lib/challenges/challenge-data'
import { validateChallengeSubmission } from '@/lib/challenges/challenge-validator'
import type {
  ChallengeDefinition,
  ChallengeSessionResult,
  ChallengeSubmission,
} from '@/lib/challenges/types'
import type { QuantumCircuit } from '@/lib/quantum/types'
import {
  useChallengeProgress,
  type UseChallengeProgressReturn,
} from './useChallengeProgress'

const HINT_SCORE_FACTORS = [1, 0.9, 0.75, 0.55]

export function calculateChallengeScore(
  challenge: ChallengeDefinition,
  attemptNumber: number,
  hintsUsed: number
): number {
  if (challenge.kind === 'upcoming') return 0
  const hintFactor =
    HINT_SCORE_FACTORS[Math.min(hintsUsed, HINT_SCORE_FACTORS.length - 1)]
  const attemptFactor = Math.max(0.7, 1 - Math.max(0, attemptNumber - 1) * 0.1)
  return Math.max(10, Math.round(challenge.baseXp * hintFactor * attemptFactor))
}

export interface UseChallengeSessionReturn {
  result: ChallengeSessionResult | null
  selectedOptionId: string | null
  hintsRevealed: number
  visibleHints: string[]
  nextChallengeId: string | null
  progressState: UseChallengeProgressReturn
  selectOption: (optionId: string) => void
  revealHint: () => void
  submitCircuit: (circuit: QuantumCircuit) => void
  submitChoice: () => void
  retry: () => void
  restart: () => void
}

export function useChallengeSession(
  challenge: ChallengeDefinition
): UseChallengeSessionReturn {
  const progressState = useChallengeProgress()
  const [result, setResult] = useState<ChallengeSessionResult | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const startedAtRef = useRef(Date.now())
  const submittingRef = useRef(false)
  const sessionAttemptsRef = useRef(0)

  useEffect(() => {
    setResult(null)
    setSelectedOptionId(null)
    setHintsRevealed(0)
    startedAtRef.current = Date.now()
    submittingRef.current = false
    sessionAttemptsRef.current = 0
  }, [challenge.id])

  const finishSubmission = useCallback(
    (submission: ChallengeSubmission) => {
      if (submittingRef.current || result || challenge.kind === 'upcoming') return
      submittingRef.current = true

      const validation = validateChallengeSubmission(challenge, submission)
      const attemptNumber = sessionAttemptsRef.current + 1
      sessionAttemptsRef.current = attemptNumber
      const elapsedMs = Math.max(0, Date.now() - startedAtRef.current)
      const score = validation.correct
        ? calculateChallengeScore(challenge, attemptNumber, hintsRevealed)
        : 0
      const sessionResult: ChallengeSessionResult = {
        ...validation,
        attemptNumber,
        elapsedMs,
        hintsUsed: hintsRevealed,
        score,
      }

      progressState.recordAttempt({
        id: `${challenge.id}-${Date.now()}`,
        challengeId: challenge.id,
        correct: validation.correct,
        score,
        hintsUsed: hintsRevealed,
        elapsedMs,
        submittedAt: new Date().toISOString(),
      })
      setResult(sessionResult)
    },
    [challenge, hintsRevealed, progressState, result]
  )

  const selectOption = useCallback(
    (optionId: string) => {
      if (!result) setSelectedOptionId(optionId)
    },
    [result]
  )

  const revealHint = useCallback(() => {
    if (result) return
    setHintsRevealed(current => Math.min(current + 1, challenge.hints.length))
  }, [challenge.hints.length, result])

  const submitCircuit = useCallback(
    (circuit: QuantumCircuit) => finishSubmission({ kind: 'circuit', circuit }),
    [finishSubmission]
  )

  const submitChoice = useCallback(() => {
    if (!selectedOptionId) return
    finishSubmission({ kind: 'choice', optionId: selectedOptionId })
  }, [finishSubmission, selectedOptionId])

  const retry = useCallback(() => {
    setResult(null)
    setSelectedOptionId(null)
    startedAtRef.current = Date.now()
    submittingRef.current = false
  }, [])

  const restart = useCallback(() => {
    setResult(null)
    setSelectedOptionId(null)
    setHintsRevealed(0)
    startedAtRef.current = Date.now()
    submittingRef.current = false
  }, [])

  return {
    result,
    selectedOptionId,
    hintsRevealed,
    visibleHints: challenge.hints.slice(0, hintsRevealed),
    nextChallengeId: getNextPlayableChallengeId(challenge.id),
    progressState,
    selectOption,
    revealHint,
    submitCircuit,
    submitChoice,
    retry,
    restart,
  }
}
