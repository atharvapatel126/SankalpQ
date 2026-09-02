'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Announcement, AnnouncementStatus } from '@/lib/instructor/types'
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncementStatus,
  deleteAnnouncement,
} from '@/lib/instructor/services/announcements'

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllAnnouncements()
      setAnnouncements(data)
    } catch {
      setError('Failed to load announcements.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const create = useCallback(async (data: Parameters<typeof createAnnouncement>[0]) => {
    await createAnnouncement(data)
    await load()
  }, [load])

  const changeStatus = useCallback(async (id: string, status: AnnouncementStatus) => {
    await updateAnnouncementStatus(id, status)
    await load()
  }, [load])

  const remove = useCallback(async (id: string) => {
    await deleteAnnouncement(id)
    await load()
  }, [load])

  return { announcements, loading, error, refresh: load, create, changeStatus, remove }
}
