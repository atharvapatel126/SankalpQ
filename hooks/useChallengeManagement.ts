'use client'

import { useCallback, useEffect, useState } from 'react'
import type { InstructorChallenge, ContentStatus } from '@/lib/instructor/types'
import { getAllChallenges, updateChallengeStatus } from '@/lib/instructor/services/challenges'

export function useChallengeManagement() {
  const [challenges, setChallenges] = useState<InstructorChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllChallenges()
      setChallenges(data)
    } catch {
      setError('Failed to load challenges.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const changeStatus = useCallback(async (id: string, status: ContentStatus) => {
    await updateChallengeStatus(id, status)
    await load()
  }, [load])

  return { challenges, loading, error, refresh: load, changeStatus }
}
