// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Challenge Management Service (Instructor Portal)
// ─────────────────────────────────────────────────────────────────────────────

import type { InstructorChallenge, ContentStatus } from '../types'
import { MOCK_CHALLENGES } from '../mock-data'

const _challengesInit: InstructorChallenge[] = JSON.parse(JSON.stringify(MOCK_CHALLENGES))
let _challenges: InstructorChallenge[] = _challengesInit

export async function getAllChallenges(): Promise<InstructorChallenge[]> {
  return Promise.resolve([..._challenges])
}

export async function getChallengeById(id: string): Promise<InstructorChallenge | null> {
  return Promise.resolve(_challenges.find(c => c.id === id) ?? null)
}

export async function updateChallenge(
  id: string,
  updates: Partial<InstructorChallenge>,
): Promise<InstructorChallenge | null> {
  const idx = _challenges.findIndex(c => c.id === id)
  if (idx === -1) return Promise.resolve(null)
  _challenges[idx] = { ..._challenges[idx], ...updates, updatedAt: new Date().toISOString() }
  return Promise.resolve(_challenges[idx])
}

export async function updateChallengeStatus(id: string, status: ContentStatus): Promise<boolean> {
  const idx = _challenges.findIndex(c => c.id === id)
  if (idx === -1) return Promise.resolve(false)
  _challenges[idx].status = status
  _challenges[idx].updatedAt = new Date().toISOString()
  return Promise.resolve(true)
}

export async function createChallenge(
  partial: Pick<InstructorChallenge, 'title' | 'description' | 'type' | 'difficulty'>,
): Promise<InstructorChallenge> {
  const now = new Date().toISOString()
  const newChallenge: InstructorChallenge = {
    id: `chl-${Date.now()}`,
    title: partial.title,
    description: partial.description,
    objective: '',
    type: partial.type,
    difficulty: partial.difficulty,
    starterCircuitId: null,
    validationConfig: {
      expectedProbabilities: {},
      probabilityTolerance: 0.05,
      requiredGates: [],
      explanation: '',
    },
    hints: [],
    totalAttempts: 0,
    completionRate: 0,
    averageAttempts: 0,
    hintsUsedRate: 0,
    status: 'draft',
    estimatedMinutes: 30,
    createdAt: now,
    updatedAt: now,
  }
  _challenges = [newChallenge, ..._challenges]
  return Promise.resolve(newChallenge)
}
