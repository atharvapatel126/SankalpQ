'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CHALLENGE_DIFFICULTIES,
  PLAYABLE_CHALLENGES,
} from '@/lib/challenges/challenge-data'
import {
  addChallengeAttempt,
  CHALLENGE_PROGRESS_STORAGE_KEY,
  createEmptyChallengeProgress,
  loadChallengeProgress,
  mergeChallengeProgress,
  parseChallengeProgress,
  saveChallengeProgress,
} from '@/lib/challenges/challenge-storage'
import type {
  ChallengeAttempt,
  ChallengeDifficulty,
  ChallengeProgressState,
  ChallengeProgressSummary,
  DifficultyProgress,
} from '@/lib/challenges/types'

function summarizeProgress(
  progress: ChallengeProgressState
): ChallengeProgressSummary {
  const playableIds = new Set(PLAYABLE_CHALLENGES.map(challenge => challenge.id))
  const entries = Object.values(progress.entries).filter(entry =>
    playableIds.has(entry.challengeId)
  )

  const byDifficulty = Object.fromEntries(
    CHALLENGE_DIFFICULTIES.map(difficulty => {
      const challengeIds = PLAYABLE_CHALLENGES.filter(
        challenge => challenge.difficulty === difficulty
      ).map(challenge => challenge.id)
      const completed = challengeIds.filter(
        challengeId => progress.entries[challengeId]?.completed
      ).length
      const difficultyProgress: DifficultyProgress = {
        completed,
        total: challengeIds.length,
        percentage:
          challengeIds.length === 0
            ? 0
            : Math.round((completed / challengeIds.length) * 100),
      }
      return [difficulty, difficultyProgress]
    })
  ) as Record<ChallengeDifficulty, DifficultyProgress>

  const beginnerComplete =
    byDifficulty.beginner.total > 0 &&
    byDifficulty.beginner.completed === byDifficulty.beginner.total
  const intermediateComplete =
    byDifficulty.intermediate.total > 0 &&
    byDifficulty.intermediate.completed === byDifficulty.intermediate.total
  const currentLevel: ChallengeDifficulty =
    intermediateComplete && byDifficulty.advanced.total > 0
    ? 'advanced'
    : beginnerComplete
      ? 'intermediate'
      : 'beginner'

  const totalAttempts = entries.reduce((sum, entry) => sum + entry.attempts, 0)
  const correctAttempts = entries.reduce(
    (sum, entry) => sum + entry.correctAttempts,
    0
  )

  return {
    completedChallenges: entries.filter(entry => entry.completed).length,
    totalChallenges: PLAYABLE_CHALLENGES.length,
    attemptedChallenges: entries.filter(entry => entry.attempts > 0).length,
    totalAttempts,
    correctAttempts,
    accuracy:
      totalAttempts === 0 ? 0 : Math.round((correctAttempts / totalAttempts) * 100),
    totalXp: entries.reduce((sum, entry) => sum + entry.bestScore, 0),
    bestScore: entries.reduce(
      (best, entry) => Math.max(best, entry.bestScore),
      0
    ),
    currentLevel,
    byDifficulty,
  }
}

export interface UseChallengeProgressReturn {
  progress: ChallengeProgressState
  summary: ChallengeProgressSummary
  isReady: boolean
  recordAttempt: (attempt: ChallengeAttempt) => void
  resetProgress: () => void
}

export function useChallengeProgress(): UseChallengeProgressReturn {
  const [progress, setProgress] = useState<ChallengeProgressState>(() =>
    createEmptyChallengeProgress()
  )
  const progressRef = useRef(progress)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const loaded = loadChallengeProgress(window.localStorage)
    progressRef.current = loaded
    setProgress(loaded)
    setIsReady(true)

    const syncProgress = (event: StorageEvent) => {
      if (event.key === CHALLENGE_PROGRESS_STORAGE_KEY) {
        const synced = parseChallengeProgress(event.newValue)
        progressRef.current = synced
        setProgress(synced)
      }
    }
    window.addEventListener('storage', syncProgress)
    return () => window.removeEventListener('storage', syncProgress)
  }, [])

  const recordAttempt = useCallback((attempt: ChallengeAttempt) => {
    const stored = loadChallengeProgress(window.localStorage)
    const next = addChallengeAttempt(
      mergeChallengeProgress(progressRef.current, stored),
      attempt
    )
    progressRef.current = next
    saveChallengeProgress(window.localStorage, next)
    setProgress(next)
  }, [])

  const resetProgress = useCallback(() => {
    const empty = createEmptyChallengeProgress()
    try {
      window.localStorage.removeItem(CHALLENGE_PROGRESS_STORAGE_KEY)
    } catch {
      // Keep the in-memory reset even if browser storage is unavailable.
    }
    progressRef.current = empty
    setProgress(empty)
  }, [])

  const summary = useMemo(() => summarizeProgress(progress), [progress])

  return {
    progress,
    summary,
    isReady,
    recordAttempt,
    resetProgress,
  }
}
