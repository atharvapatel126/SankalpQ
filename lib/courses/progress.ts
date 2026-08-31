import {
  ALL_LESSON_IDS,
  ALL_LESSONS,
  COURSES,
  getLessonById,
} from './course-data'
import type {
  Course,
  CourseProgressState,
  CourseProgressSummary,
  Lesson,
} from './types'

export const COURSE_PROGRESS_STORAGE_KEY = 'sankalpq-course-progress-v1'

export const EMPTY_COURSE_PROGRESS: CourseProgressState = {
  version: 1,
  completedLessonIds: [],
  currentLessonId: null,
  quizScores: {},
  quizAnswers: {},
  updatedAt: null,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeNumberRecord(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {}

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] =>
        ALL_LESSON_IDS.has(entry[0]) &&
        typeof entry[1] === 'number' &&
        Number.isFinite(entry[1]) &&
        entry[1] >= 0 &&
        entry[1] <= 100
    )
  )
}

function sanitizeStringRecord(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => {
        if (typeof entry[1] !== 'string') return false
        const match = getLessonById(entry[0])
        return Boolean(
          match?.lesson.quiz.options.some(option => option.id === entry[1])
        )
      }
    )
  )
}

export function parseCourseProgress(raw: string | null): CourseProgressState {
  if (!raw) return { ...EMPTY_COURSE_PROGRESS }

  try {
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || value.version !== 1) {
      return { ...EMPTY_COURSE_PROGRESS }
    }

    const completedLessonIds = Array.isArray(value.completedLessonIds)
      ? Array.from(
          new Set(
            value.completedLessonIds.filter(
              (id): id is string =>
                typeof id === 'string' && ALL_LESSON_IDS.has(id)
            )
          )
        )
      : []

    const currentLessonId =
      typeof value.currentLessonId === 'string' &&
      ALL_LESSON_IDS.has(value.currentLessonId)
        ? value.currentLessonId
        : null

    return {
      version: 1,
      completedLessonIds,
      currentLessonId,
      quizScores: sanitizeNumberRecord(value.quizScores),
      quizAnswers: sanitizeStringRecord(value.quizAnswers),
      updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
    }
  } catch {
    return { ...EMPTY_COURSE_PROGRESS }
  }
}

export function getCourseProgressSummary(
  course: Course,
  progress: CourseProgressState
): CourseProgressSummary {
  const completed = new Set(progress.completedLessonIds)
  const completedLessons = course.lessons.filter(lesson =>
    completed.has(lesson.id)
  ).length
  const totalLessons = course.lessons.length
  const currentIsInCourse = course.lessons.some(
    lesson => lesson.id === progress.currentLessonId
  )
  const status =
    completedLessons === totalLessons
      ? 'completed'
      : completedLessons > 0 || currentIsInCourse
        ? 'in-progress'
        : 'not-started'
  const continueLesson =
    course.lessons.find(lesson => !completed.has(lesson.id)) ??
    course.lessons[course.lessons.length - 1]

  return {
    completedLessons,
    totalLessons,
    percentage: Math.round((completedLessons / totalLessons) * 100),
    status,
    continueLesson,
  }
}

export function getOverallCompletion(progress: CourseProgressState): number {
  return Math.round(
    (progress.completedLessonIds.length / ALL_LESSONS.length) * 100
  )
}

export function getResumeLesson(
  progress: CourseProgressState
): { course: Course; lesson: Lesson } {
  const completed = new Set(progress.completedLessonIds)
  const current = getLessonById(progress.currentLessonId)

  if (current && !completed.has(current.lesson.id)) return current

  const nextLesson =
    ALL_LESSONS.find(lesson => !completed.has(lesson.id)) ??
    ALL_LESSONS[ALL_LESSONS.length - 1]

  return (
    getLessonById(nextLesson.id) ?? {
      course: COURSES[0],
      lesson: COURSES[0].lessons[0],
    }
  )
}
