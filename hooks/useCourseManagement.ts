'use client'

import { useCallback, useEffect, useState } from 'react'
import type { InstructorCourse, ContentStatus } from '@/lib/instructor/types'
import { getAllCourses, updateCourseStatus } from '@/lib/instructor/services/courses'

export function useCourseManagement() {
  const [courses, setCourses] = useState<InstructorCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllCourses()
      setCourses(data)
    } catch {
      setError('Failed to load courses.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const changeStatus = useCallback(async (id: string, status: ContentStatus) => {
    await updateCourseStatus(id, status)
    await load()
  }, [load])

  return { courses, loading, error, refresh: load, changeStatus }
}
