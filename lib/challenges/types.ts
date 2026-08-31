import type { QuantumCircuit } from '@/lib/quantum/types'

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type ChallengeType =
  | 'build-circuit'
  | 'predict-output'
  | 'fix-circuit'
  | 'identify-gate'
  | 'algorithm'

export interface ChallengeOption {
  id: string
  label: string
}

export interface CircuitExpectation {
  expectedProbabilities: Record<string, number>
  probabilityTolerance: number
  targetCircuit?: QuantumCircuit
  minimumFidelity?: number
}

export interface ChallengeFeedbackCopy {
  success: string
  emptyCircuit: string
  probabilityMismatch: string
  stateMismatch: string
}

interface ChallengeBase {
  id: string
  title: string
  shortDescription: string
  description: string
  goal: string
  difficulty: ChallengeDifficulty
  type: ChallengeType
  estimatedMinutes: number
  baseXp: number
  hints: string[]
  explanation: string
}

export interface CircuitChallenge extends ChallengeBase {
  kind: 'circuit'
  type: 'build-circuit' | 'fix-circuit'
  initialCircuit: QuantumCircuit
  expectation: CircuitExpectation
  feedback: ChallengeFeedbackCopy
}

export interface ChoiceChallenge extends ChallengeBase {
  kind: 'choice'
  type: 'predict-output' | 'identify-gate'
  options: ChallengeOption[]
  correctOptionId: string
  incorrectFeedback: string
  previewCircuit?: QuantumCircuit
  stateTransition?: {
    input: string
    output: string
  }
}

export interface UpcomingChallenge extends ChallengeBase {
  kind: 'upcoming'
  type: 'algorithm'
  availabilityNote: string
}

export type ChallengeDefinition =
  | CircuitChallenge
  | ChoiceChallenge
  | UpcomingChallenge

export type ChallengeSubmission =
  | { kind: 'circuit'; circuit: QuantumCircuit }
  | { kind: 'choice'; optionId: string }

export interface ChallengeValidationResult {
  correct: boolean
  feedback: string
  explanation: string
  actualProbabilities?: Record<string, number>
  fidelity?: number
}

export interface ChallengeSessionResult extends ChallengeValidationResult {
  attemptNumber: number
  elapsedMs: number
  hintsUsed: number
  score: number
}

export interface ChallengeAttempt {
  id: string
  challengeId: string
  correct: boolean
  score: number
  hintsUsed: number
  elapsedMs: number
  submittedAt: string
}

export interface ChallengeProgressEntry {
  challengeId: string
  completed: boolean
  attempts: number
  correctAttempts: number
  bestScore: number
  totalHintsUsed: number
  totalTimeMs: number
  bestTimeMs: number | null
  lastAttemptAt: string | null
}

export interface ChallengeProgressState {
  version: 1
  entries: Record<string, ChallengeProgressEntry>
  recentAttempts: ChallengeAttempt[]
}

export interface DifficultyProgress {
  completed: number
  total: number
  percentage: number
}

export interface ChallengeProgressSummary {
  completedChallenges: number
  totalChallenges: number
  attemptedChallenges: number
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  totalXp: number
  bestScore: number
  currentLevel: ChallengeDifficulty
  byDifficulty: Record<ChallengeDifficulty, DifficultyProgress>
}
