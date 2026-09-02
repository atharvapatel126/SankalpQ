// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Course Management Service (Instructor Portal)
// ─────────────────────────────────────────────────────────────────────────────

import type { InstructorCourse, InstructorLesson, ContentStatus } from '../types'
import { MOCK_COURSES } from '../mock-data'

// In-memory store (replaced by Supabase in production)
const _coursesInit: InstructorCourse[] = JSON.parse(JSON.stringify(MOCK_COURSES))
const _store = { courses: _coursesInit }
// Alias for local use
const getCourses = () => _store.courses
const setCourses = (c: InstructorCourse[]) => { _store.courses = c }

export async function getAllCourses(): Promise<InstructorCourse[]> {
  return Promise.resolve([...getCourses()])
}

export async function getCourseById(id: string): Promise<InstructorCourse | null> {
  return Promise.resolve(getCourses().find(c => c.id === id) ?? null)
}

export async function updateCourse(
  id: string,
  updates: Partial<Omit<InstructorCourse, 'id' | 'lessons'>>,
): Promise<InstructorCourse | null> {
  const courses = getCourses()
  const idx = courses.findIndex(c => c.id === id)
  if (idx === -1) return Promise.resolve(null)
  courses[idx] = { ...courses[idx], ...updates, updatedAt: new Date().toISOString() }
  return Promise.resolve(courses[idx])
}

export async function updateCourseStatus(id: string, status: ContentStatus): Promise<boolean> {
  const courses = getCourses()
  const idx = courses.findIndex(c => c.id === id)
  if (idx === -1) return Promise.resolve(false)
  courses[idx].status = status
  courses[idx].updatedAt = new Date().toISOString()
  return Promise.resolve(true)
}

export async function addLesson(courseId: string, lesson: InstructorLesson): Promise<boolean> {
  const courses = getCourses()
  const idx = courses.findIndex(c => c.id === courseId)
  if (idx === -1) return Promise.resolve(false)
  courses[idx].lessons.push(lesson)
  courses[idx].updatedAt = new Date().toISOString()
  return Promise.resolve(true)
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  updates: Partial<InstructorLesson>,
): Promise<boolean> {
  const courses = getCourses()
  const courseIdx = courses.findIndex(c => c.id === courseId)
  if (courseIdx === -1) return Promise.resolve(false)
  const lessonIdx = courses[courseIdx].lessons.findIndex(l => l.id === lessonId)
  if (lessonIdx === -1) return Promise.resolve(false)
  courses[courseIdx].lessons[lessonIdx] = {
    ...courses[courseIdx].lessons[lessonIdx],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return Promise.resolve(true)
}

export async function deleteLessonFromCourse(courseId: string, lessonId: string): Promise<boolean> {
  const courses = getCourses()
  const courseIdx = courses.findIndex(c => c.id === courseId)
  if (courseIdx === -1) return Promise.resolve(false)
  courses[courseIdx].lessons = courses[courseIdx].lessons.filter(l => l.id !== lessonId)
  return Promise.resolve(true)
}

export async function createCourse(
  partial: Pick<InstructorCourse, 'title' | 'description' | 'level'>,
): Promise<InstructorCourse> {
  const now = new Date().toISOString()
  const newCourse: InstructorCourse = {
    id: `course-${Date.now()}`,
    title: partial.title,
    description: partial.description,
    level: partial.level,
    thumbnailUrl: null,
    lessons: [],
    studentsEnrolled: 0,
    completionRate: 0,
    averageQuizScore: 0,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }
  const courses = getCourses()
  setCourses([newCourse, ...courses])
  return Promise.resolve(newCourse)
}
