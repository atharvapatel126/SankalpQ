// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Assessment Management Service (Instructor Portal)
// Currently backed by mock data. Replace with Supabase/FastAPI calls.
// ─────────────────────────────────────────────────────────────────────────────

import type { InstructorAssessment, InstructorQuizQuestion, ContentStatus } from '../types'
import { MOCK_ASSESSMENTS } from '../mock-data'

// In-memory store
const _init: InstructorAssessment[] = JSON.parse(JSON.stringify(MOCK_ASSESSMENTS))
let _assessments: InstructorAssessment[] = _init

export async function getAllAssessments(): Promise<InstructorAssessment[]> {
  return Promise.resolve([..._assessments])
}

export async function getAssessmentById(id: string): Promise<InstructorAssessment | null> {
  return Promise.resolve(_assessments.find(a => a.id === id) ?? null)
}

export async function createAssessment(
  partial: Pick<InstructorAssessment, 'title' | 'relatedConcept'>,
): Promise<InstructorAssessment> {
  const now = new Date().toISOString()
  const newAssessment: InstructorAssessment = {
    id: `asmnt-${Date.now()}`,
    title: partial.title,
    relatedConcept: partial.relatedConcept,
    relatedCourseId: null,
    questions: [],
    averageScore: 0,
    totalAttempts: 0,
    successRate: 0,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }
  _assessments = [newAssessment, ..._assessments]
  return Promise.resolve(newAssessment)
}

export async function updateAssessment(
  id: string,
  updates: Partial<Omit<InstructorAssessment, 'id'>>,
): Promise<InstructorAssessment | null> {
  const idx = _assessments.findIndex(a => a.id === id)
  if (idx === -1) return Promise.resolve(null)
  _assessments[idx] = { ..._assessments[idx], ...updates, updatedAt: new Date().toISOString() }
  return Promise.resolve(_assessments[idx])
}

export async function updateAssessmentStatus(id: string, status: ContentStatus): Promise<boolean> {
  const idx = _assessments.findIndex(a => a.id === id)
  if (idx === -1) return Promise.resolve(false)
  _assessments[idx].status = status
  _assessments[idx].updatedAt = new Date().toISOString()
  return Promise.resolve(true)
}

export async function addQuestion(
  assessmentId: string,
  question: InstructorQuizQuestion,
): Promise<boolean> {
  const idx = _assessments.findIndex(a => a.id === assessmentId)
  if (idx === -1) return Promise.resolve(false)
  _assessments[idx].questions.push(question)
  return Promise.resolve(true)
}

export async function removeQuestion(assessmentId: string, questionId: string): Promise<boolean> {
  const idx = _assessments.findIndex(a => a.id === assessmentId)
  if (idx === -1) return Promise.resolve(false)
  _assessments[idx].questions = _assessments[idx].questions.filter(q => q.id !== questionId)
  return Promise.resolve(true)
}
