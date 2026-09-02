// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Student Service (Instructor Portal)
// Currently backed by mock data. Replace with Supabase/FastAPI calls.
// ─────────────────────────────────────────────────────────────────────────────

import type { StudentOverview, StudentDetail, StudentFilter, StudentSortConfig } from '../types'
import { MOCK_STUDENTS, MOCK_STUDENT_DETAIL } from '../mock-data'

export async function getAllStudents(): Promise<StudentOverview[]> {
  // TODO: Replace with Supabase query when backend ready
  return Promise.resolve([...MOCK_STUDENTS])
}

export async function getStudentById(id: string): Promise<StudentDetail | null> {
  const detail = MOCK_STUDENT_DETAIL[id]
  if (detail) return Promise.resolve(detail)

  // Fall back to overview data if no detail exists
  const overview = MOCK_STUDENTS.find(s => s.id === id)
  if (!overview) return Promise.resolve(null)

  return Promise.resolve({
    ...overview,
    courseProgress: [],
    challengeProgress: [],
    recentActivity: [],
  })
}

export function filterStudents(
  students: StudentOverview[],
  filter: StudentFilter,
  search: string,
): StudentOverview[] {
  let result = [...students]

  // Apply status filter
  switch (filter) {
    case 'active':
      result = result.filter(s => s.status === 'active')
      break
    case 'inactive':
      result = result.filter(s => s.status === 'inactive')
      break
    case 'needs-attention':
      result = result.filter(s => s.status === 'needs-attention')
      break
    case 'high-performing':
      result = result.filter(s => s.averageQuizScore >= 85 && s.overallProgress >= 70)
      break
    case 'all':
    default:
      break
  }

  // Apply search
  if (search.trim()) {
    const query = search.toLowerCase().trim()
    result = result.filter(
      s => s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query)
    )
  }

  return result
}

export function sortStudents(
  students: StudentOverview[],
  sort: StudentSortConfig,
): StudentOverview[] {
  return [...students].sort((a, b) => {
    const aVal = a[sort.field]
    const bVal = b[sort.field]

    if (aVal === null || aVal === undefined) return sort.direction === 'asc' ? 1 : -1
    if (bVal === null || bVal === undefined) return sort.direction === 'asc' ? -1 : 1

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sort.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sort.direction === 'asc' ? aVal - bVal : bVal - aVal
    }

    return 0
  })
}
