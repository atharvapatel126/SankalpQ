'use client'

import { Bell, Globe, BookOpen, Trash2, Send } from 'lucide-react'
import type { Announcement } from '@/lib/instructor/types'
import StatusBadge from './StatusBadge'

const TARGET_ICON: Record<string, typeof Globe> = {
  all:      Globe,
  course:   BookOpen,
  specific: Bell,
}

const TARGET_LABEL: Record<string, string> = {
  all:      'All Students',
  course:   'Course Students',
  specific: 'Specific Students',
}

interface AnnouncementCardProps {
  announcement: Announcement
  onPublish?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function AnnouncementCard({ announcement, onPublish, onDelete }: AnnouncementCardProps) {
  const Icon = TARGET_ICON[announcement.targetType] ?? Bell
  const dateStr = new Date(announcement.publishDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="instructor-card card-shadow">
      <div className="instructor-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 12 }}>
          <Icon size={13} strokeWidth={1.5} />
          {TARGET_LABEL[announcement.targetType]}
        </div>
        <StatusBadge status={announcement.status as 'published' | 'draft' | 'archived'} />
      </div>

      <div className="instructor-card-title" style={{ marginTop: 10 }}>{announcement.title}</div>
      <p className="instructor-card-desc">{announcement.message}</p>

      <div className="instructor-card-footer">
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-geist-mono), monospace' }}>
          {dateStr}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {announcement.status === 'draft' && onPublish && (
            <button
              type="button"
              className="btn-primary"
              style={{ height: 32, fontSize: 12, padding: '0 12px' }}
              onClick={() => onPublish(announcement.id)}
            >
              <Send size={12} />
              Publish
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="toolbar-icon-btn toolbar-icon-btn-danger"
              style={{ height: 32, width: 32, padding: 0, justifyContent: 'center' }}
              onClick={() => onDelete(announcement.id)}
              aria-label="Delete announcement"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
