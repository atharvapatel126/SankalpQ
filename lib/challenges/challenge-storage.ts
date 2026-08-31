import type {
  ChallengeAttempt,
  ChallengeProgressEntry,
  ChallengeProgressState,
} from './types'

export const CHALLENGE_PROGRESS_STORAGE_KEY = 'sankalpq.challenge-progress.v1'
const MAX_RECENT_ATTEMPTS = 12

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function nonNegativeInteger(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback
}

function nullableTimestamp(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function sanitizeEntry(
  value: unknown,
  fallbackChallengeId: string
): ChallengeProgressEntry | null {
  if (!isRecord(value)) return null
  const attempts = nonNegativeInteger(value.attempts)
  const correctAttempts = Math.min(
    attempts,
    nonNegativeInteger(value.correctAttempts)
  )
  const bestTime = value.bestTimeMs

  return {
    challengeId: fallbackChallengeId,
    completed: value.completed === true || correctAttempts > 0,
    attempts,
    correctAttempts,
    bestScore: nonNegativeInteger(value.bestScore),
    totalHintsUsed: nonNegativeInteger(value.totalHintsUsed),
    totalTimeMs: nonNegativeInteger(value.totalTimeMs),
    bestTimeMs:
      typeof bestTime === 'number' && Number.isFinite(bestTime) && bestTime >= 0
        ? Math.floor(bestTime)
        : null,
    lastAttemptAt: nullableTimestamp(value.lastAttemptAt),
  }
}

function timestampValue(timestamp: string | null): number {
  if (!timestamp) return 0
  const value = new Date(timestamp).getTime()
  return Number.isFinite(value) ? value : 0
}

export function mergeChallengeProgress(
  current: ChallengeProgressState,
  stored: ChallengeProgressState
): ChallengeProgressState {
  const entries: Record<string, ChallengeProgressEntry> = { ...stored.entries }
  Object.entries(current.entries).forEach(([challengeId, currentEntry]) => {
    const storedEntry = stored.entries[challengeId]
    if (
      !storedEntry ||
      currentEntry.attempts > storedEntry.attempts ||
      timestampValue(currentEntry.lastAttemptAt) > timestampValue(storedEntry.lastAttemptAt)
    ) {
      entries[challengeId] = { ...currentEntry, challengeId }
    }
  })

  const attemptsById = new Map<string, ChallengeAttempt>()
  ;[...current.recentAttempts, ...stored.recentAttempts].forEach(attempt => {
    attemptsById.set(attempt.id, attempt)
  })
  const recentAttempts = Array.from(attemptsById.values())
    .sort(
      (left, right) =>
        timestampValue(right.submittedAt) - timestampValue(left.submittedAt)
    )
    .slice(0, MAX_RECENT_ATTEMPTS)

  return { version: 1, entries, recentAttempts }
}

function sanitizeAttempt(value: unknown): ChallengeAttempt | null {
  if (!isRecord(value)) return null
  if (
    typeof value.id !== 'string' ||
    typeof value.challengeId !== 'string' ||
    typeof value.submittedAt !== 'string'
  ) {
    return null
  }

  return {
    id: value.id,
    challengeId: value.challengeId,
    correct: value.correct === true,
    score: nonNegativeInteger(value.score),
    hintsUsed: nonNegativeInteger(value.hintsUsed),
    elapsedMs: nonNegativeInteger(value.elapsedMs),
    submittedAt: value.submittedAt,
  }
}

export function createEmptyChallengeProgress(): ChallengeProgressState {
  return {
    version: 1,
    entries: {},
    recentAttempts: [],
  }
}

export function parseChallengeProgress(raw: string | null): ChallengeProgressState {
  if (!raw) return createEmptyChallengeProgress()

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== 1) {
      return createEmptyChallengeProgress()
    }

    const entries: Record<string, ChallengeProgressEntry> = {}
    if (isRecord(parsed.entries)) {
      Object.entries(parsed.entries).forEach(([challengeId, value]) => {
        const entry = sanitizeEntry(value, challengeId)
        if (entry) entries[challengeId] = entry
      })
    }

    const recentAttempts = Array.isArray(parsed.recentAttempts)
      ? parsed.recentAttempts
          .map(sanitizeAttempt)
          .filter((attempt): attempt is ChallengeAttempt => attempt !== null)
          .slice(0, MAX_RECENT_ATTEMPTS)
      : []

    return { version: 1, entries, recentAttempts }
  } catch {
    return createEmptyChallengeProgress()
  }
}

export function loadChallengeProgress(storage: Storage): ChallengeProgressState {
  try {
    return parseChallengeProgress(storage.getItem(CHALLENGE_PROGRESS_STORAGE_KEY))
  } catch {
    return createEmptyChallengeProgress()
  }
}

export function saveChallengeProgress(
  storage: Storage,
  progress: ChallengeProgressState
): boolean {
  try {
    storage.setItem(CHALLENGE_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}

export function addChallengeAttempt(
  progress: ChallengeProgressState,
  attempt: ChallengeAttempt
): ChallengeProgressState {
  if (progress.recentAttempts.some(current => current.id === attempt.id)) {
    return progress
  }

  const current = progress.entries[attempt.challengeId] ?? {
    challengeId: attempt.challengeId,
    completed: false,
    attempts: 0,
    correctAttempts: 0,
    bestScore: 0,
    totalHintsUsed: 0,
    totalTimeMs: 0,
    bestTimeMs: null,
    lastAttemptAt: null,
  }

  const bestTimeMs = attempt.correct
    ? current.bestTimeMs === null
      ? attempt.elapsedMs
      : Math.min(current.bestTimeMs, attempt.elapsedMs)
    : current.bestTimeMs

  const nextEntry: ChallengeProgressEntry = {
    ...current,
    completed: current.completed || attempt.correct,
    attempts: current.attempts + 1,
    correctAttempts: current.correctAttempts + (attempt.correct ? 1 : 0),
    bestScore: Math.max(current.bestScore, attempt.score),
    totalHintsUsed: current.totalHintsUsed + attempt.hintsUsed,
    totalTimeMs: current.totalTimeMs + attempt.elapsedMs,
    bestTimeMs,
    lastAttemptAt: attempt.submittedAt,
  }

  return {
    version: 1,
    entries: {
      ...progress.entries,
      [attempt.challengeId]: nextEntry,
    },
    recentAttempts: [attempt, ...progress.recentAttempts].slice(
      0,
      MAX_RECENT_ATTEMPTS
    ),
  }
}
