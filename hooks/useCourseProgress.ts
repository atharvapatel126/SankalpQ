'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  EMPTY_COURSE_PROGRESS,
} from '@/lib/courses/progress'
import type { CourseProgressState } from '@/lib/courses/types'
import {
  loadLessonProgress,
  upsertLessonProgress,
  markLessonCompleted,
} from '@/lib/courses/progress-supabase'

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

export function useCourseProgress(): UseCourseProgressReturn {
  const [progress, setProgress] = useState<CourseProgressState>(
    EMPTY_COURSE_PROGRESS
  )
  const [hydrated, setHydrated] = useState(false)

  /*
   * Load lesson progress from Supabase.
   *
   * Quiz data is intentionally not migrated yet.
   * That will be handled by quiz_attempts separately.
   */
  useEffect(() => {
    let cancelled = false

    async function loadProgress() {
      try {
        const rows = await loadLessonProgress()

        if (cancelled) return

        const completedLessonIds = rows
          .filter(row => row.status === 'completed')
          .map(row => row.lessonId)

        const currentLesson = rows.find(
          row => row.status === 'in-progress'
        )

        setProgress(current => ({
          ...current,
          completedLessonIds,
          currentLessonId: currentLesson?.lessonId ?? null,
          updatedAt: rows.length
            ? rows.reduce(
                (latest, row) =>
                  row.updatedAt > latest ? row.updatedAt : latest,
                rows[0].updatedAt
              )
            : null,
        }))

        setHydrated(true)
      } catch (error) {
        console.error('Failed to load course progress:', error)

        if (!cancelled) {
          setProgress(EMPTY_COURSE_PROGRESS)
          setHydrated(true)
        }
      }
    }

    void loadProgress()

    return () => {
      cancelled = true
    }
  }, [])

  const setCurrentLesson = useCallback((lessonId: string) => {
    const now = new Date().toISOString()

    setProgress(current => ({
      ...current,
      currentLessonId: lessonId,
      updatedAt: now,
    }))

    void upsertLessonProgress(lessonId, 'in-progress').catch(error => {
      console.error('Failed to save current lesson:', error)
    })
  }, [])

  const recordQuizAnswer = useCallback(
    (lessonId: string, answerId: string, isCorrect: boolean) => {
      /*
       * Quiz persistence stays in the existing local React state
       * for this step.
       *
       * The dedicated quiz_attempts migration comes next.
       */
      setProgress(current => ({
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
    []
  )

  const completeLesson = useCallback(
    (lessonId: string, nextLessonId?: string) => {
      const now = new Date().toISOString()

      setProgress(current => {
        const completedLessonIds =
          current.completedLessonIds.includes(lessonId)
            ? current.completedLessonIds
            : [...current.completedLessonIds, lessonId]

        return {
          ...current,
          completedLessonIds,
          currentLessonId: nextLessonId ?? lessonId,
          updatedAt: now,
        }
      })

      void markLessonCompleted(
        lessonId,
        nextLessonId
      ).catch(error => {
        console.error('Failed to save completed lesson:', error)
      })
    },
    []
  )

  return {
    progress,
    hydrated,
    setCurrentLesson,
    recordQuizAnswer,
    completeLesson,
  }
}