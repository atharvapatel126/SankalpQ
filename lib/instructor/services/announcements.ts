// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Announcement Service (Instructor Portal)
// ─────────────────────────────────────────────────────────────────────────────

import type { Announcement, AnnouncementStatus } from '../types'
import { MOCK_ANNOUNCEMENTS } from '../mock-data'

let _announcements: Announcement[] = JSON.parse(JSON.stringify(MOCK_ANNOUNCEMENTS))

export async function getAllAnnouncements(): Promise<Announcement[]> {
  return Promise.resolve([..._announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ))
}

export async function createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
  const now = new Date().toISOString()
  const newAnn: Announcement = {
    ...data,
    id: `ann-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  }
  _announcements = [newAnn, ..._announcements]
  return Promise.resolve(newAnn)
}

export async function updateAnnouncementStatus(id: string, status: AnnouncementStatus): Promise<boolean> {
  const idx = _announcements.findIndex(a => a.id === id)
  if (idx === -1) return Promise.resolve(false)
  _announcements[idx].status = status
  _announcements[idx].updatedAt = new Date().toISOString()
  return Promise.resolve(true)
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const before = _announcements.length
  _announcements = _announcements.filter(a => a.id !== id)
  return Promise.resolve(_announcements.length < before)
}
