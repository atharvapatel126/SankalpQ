'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  COURSE_PROGRESS_STORAGE_KEY,
  EMPTY_COURSE_PROGRESS,
  parseCourseProgress,
} from '@/lib/courses/progress'
import type { CourseProgressState } from '@/lib/courses/types'

interface UseCourseProgressReturn {
  progress: CourseProgressState
  hydrated: boolean
  setCurrentLesson: (lessonId: string) => void
  recordQuizAnswer: (
    lessonId: string,
    answerId: string,
    isCorrect: boolean
  ) => void
  completeLesson: (lessonId: string, nextLessonId?: string) => void
}

function persistProgress(progress: CourseProgressState) {
  try {
    window.localStorage.setItem(
      COURSE_PROGRESS_STORAGE_KEY,
      JSON.stringify(progress)
    )
  } catch {
    // Progress remains usable in memory when storage is unavailable or full.
  }
}

export function useCourseProgress(): UseCourseProgressReturn {
  const [progress, setProgress] = useState<CourseProgressState>(
    EMPTY_COURSE_PROGRESS
  )
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let raw: string | null = null

    try {
      raw = window.localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY)
    } catch {
      // Privacy settings can make localStorage inaccessible.
    }

    setProgress(parseCourseProgress(raw))
    setHydrated(true)

    const handleStorage = (event: StorageEvent) => {
      if (event.key === COURSE_PROGRESS_STORAGE_KEY) {
        setProgress(parseCourseProgress(event.newValue))
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const updateProgress = useCallback(
    (update: (current: CourseProgressState) => CourseProgressState) => {
      setProgress(current => {
        const next = update(current)
        if (next === current) return current
        persistProgress(next)
        return next
      })
    },
    []
  )

  const setCurrentLesson = useCallback(
    (lessonId: string) => {
      updateProgress(current => {
        if (current.currentLessonId === lessonId) return current
        return {
          ...current,
          currentLessonId: lessonId,
          updatedAt: new Date().toISOString(),
        }
      })
    },
    [updateProgress]
  )

  const recordQuizAnswer = useCallback(
    (lessonId: string, answerId: string, isCorrect: boolean) => {
      updateProgress(current => ({
        ...current,
        quizAnswers: {
          ...current.quizAnswers,
          [lessonId]: answerId,
        },
        quizScores: {
          ...current.quizScores,
          [lessonId]: isCorrect ? 100 : 0,
        },
        updatedAt: new Date().toISOString(),
      }))
    },
    [updateProgress]
  )

  const completeLesson = useCallback(
    (lessonId: string, nextLessonId?: string) => {
      updateProgress(current => {
        const completedLessonIds = current.completedLessonIds.includes(lessonId)
          ? current.completedLessonIds
          : [...current.completedLessonIds, lessonId]

        return {
          ...current,
          completedLessonIds,
          currentLessonId: nextLessonId ?? lessonId,
          updatedAt: new Date().toISOString(),
        }
      })
    },
    [updateProgress]
  )

  return {
    progress,
    hydrated,
    setCurrentLesson,
    recordQuizAnswer,
    completeLesson,
  }
}
