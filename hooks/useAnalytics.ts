'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PlatformAnalytics } from '@/lib/instructor/types'
import { getPlatformAnalytics } from '@/lib/instructor/services/analytics'

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPlatformAnalytics()
      setAnalytics(data)
    } catch {
      setError('Failed to load analytics.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  return { analytics, loading, error, refresh: load }
}
