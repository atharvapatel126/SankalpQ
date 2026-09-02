'use client'

import { Plus, Bell } from 'lucide-react'
import { useState } from 'react'
import AnnouncementCard from '@/components/instructor/AnnouncementCard'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import type { AnnouncementStatus } from '@/lib/instructor/types'

export default function AnnouncementsPage() {
  const { announcements, loading, changeStatus, remove, create } = useAnnouncements()
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [creating, setCreating] = useState(false)

  const published = announcements.filter(a => a.status === 'published')
  const drafts = announcements.filter(a => a.status === 'draft')

  const handleCreate = async (asDraft = false) => {
    if (!newTitle.trim() || !newMessage.trim()) return
    setCreating(true)
    try {
      await create({
        title: newTitle.trim(),
        message: newMessage.trim(),
        targetType: 'all',
        targetCourseId: null,
        targetStudentIds: [],
        status: asDraft ? 'draft' : 'published',
        publishDate: new Date().toISOString(),
      })
    } finally {
      setShowForm(false)
      setNewTitle('')
      setNewMessage('')
      setCreating(false)
    }
  }

  return (
    <div>
      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Communications</div>
            <h1>Announcements</h1>
            <p>Communicate with all students or specific cohorts directly through the platform.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ height: 40, fontSize: 14, gap: 6 }}
            onClick={() => setShowForm(s => !s)}
          >
            <Plus size={14} /> {showForm ? 'Cancel' : 'New Announcement'}
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="instructor-form-section" style={{ marginBottom: 32 }}>
          <div className="instructor-form-section-title">New Announcement</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label" htmlFor="ann-title">Title</label>
              <input id="ann-title" className="form-input" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Announcement title" />
            </div>
            <div>
              <label className="form-label" htmlFor="ann-message">Message</label>
              <textarea id="ann-message" className="form-input" value={newMessage} onChange={e => setNewMessage(e.target.value)} rows={4} style={{ height: 'auto', resize: 'vertical' }} placeholder="Write your announcement here…" />
            </div>
            <div className="instructor-form-row">
              <div>
                <label className="form-label" htmlFor="ann-target">Target</label>
                <select id="ann-target" className="form-input">
                  <option value="all">All Students</option>
                  <option value="course">Course Students</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="ann-publish-date">Publish Date</label>
                <input id="ann-publish-date" type="datetime-local" className="form-input" defaultValue={new Date().toISOString().slice(0, 16)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline" style={{ height: 38, fontSize: 13 }} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="button" className="btn-outline" style={{ height: 38, fontSize: 13 }} onClick={() => void handleCreate(true)} disabled={creating}>Save Draft</button>
              <button type="button" className="btn-primary" style={{ height: 38, fontSize: 13 }} onClick={() => void handleCreate()} disabled={creating}>
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading…</div>
      ) : (
        <>
          {/* Published */}
          {published.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Published ({published.length})</h2>
              <div className="instructor-grid-2">
                {published.map(a => (
                  <AnnouncementCard
                    key={a.id}
                    announcement={a}
                    onDelete={id => void remove(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Drafts */}
          {drafts.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Drafts ({drafts.length})</h2>
              <div className="instructor-grid-2">
                {drafts.map(a => (
                  <AnnouncementCard
                    key={a.id}
                    announcement={a}
                    onPublish={id => void changeStatus(id, 'published' as AnnouncementStatus)}
                    onDelete={id => void remove(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {announcements.length === 0 && !showForm && (
            <div className="instructor-empty">
              <div className="instructor-empty-icon"><Bell size={22} /></div>
              <h3>No announcements yet</h3>
              <p>Create your first announcement to communicate with students.</p>
              <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>Create Announcement</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
