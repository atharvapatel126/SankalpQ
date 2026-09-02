'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { StudentOverview, StudentFilter, StudentSortConfig } from '@/lib/instructor/types'
import {
  getAllStudents,
  filterStudents,
  sortStudents,
} from '@/lib/instructor/services/students'

export interface UseStudentsResult {
  students: StudentOverview[]
  filtered: StudentOverview[]
  loading: boolean
  error: string | null
  search: string
  setSearch: (v: string) => void
  filter: StudentFilter
  setFilter: (f: StudentFilter) => void
  sort: StudentSortConfig
  setSort: (s: StudentSortConfig) => void
  refresh: () => void
}

export function useStudents(): UseStudentsResult {
  const [students, setStudents] = useState<StudentOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StudentFilter>('all')
  const [sort, setSort] = useState<StudentSortConfig>({ field: 'name', direction: 'asc' })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllStudents()
      setStudents(data)
    } catch {
      setError('Failed to load students.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const filtered = useMemo(() => {
    const f = filterStudents(students, filter, search)
    return sortStudents(f, sort)
  }, [students, filter, search, sort])

  return { students, filtered, loading, error, search, setSearch, filter, setFilter, sort, setSort, refresh: load }
}
