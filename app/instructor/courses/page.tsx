'use client'

import { Plus, BookOpen, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CourseCard from '@/components/instructor/CourseCard'
import { useCourseManagement } from '@/hooks/useCourseManagement'
import type { ContentStatus, CourseLevel } from '@/lib/instructor/types'
import { createCourse } from '@/lib/instructor/services/courses'

const LEVEL_OPTS: { value: CourseLevel; label: string }[] = [
  { value: 'beginner',     label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced' },
]

export default function CoursesPage() {
  const { courses, loading, changeStatus, refresh } = useCourseManagement()
  const router = useRouter()

  const [showForm, setShowForm]   = useState(false)
  const [newTitle, setNewTitle]   = useState('')
  const [newDesc,  setNewDesc]    = useState('')
  const [newLevel, setNewLevel]   = useState<CourseLevel>('beginner')
  const [creating, setCreating]   = useState(false)

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const created = await createCourse({ title: newTitle.trim(), description: newDesc.trim(), level: newLevel })
    await refresh()
    setCreating(false)
    setShowForm(false)
    setNewTitle('')
    setNewDesc('')
    router.push(`/instructor/courses/${created.id}`)
  }

  const published = courses.filter(c => c.status === 'published')
  const drafts    = courses.filter(c => c.status === 'draft')
  const archived  = courses.filter(c => c.status === 'archived')

  return (
    <div>
      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Content Management</div>
            <h1>Courses</h1>
            <p>Manage your quantum learning courses, lessons, and content structure.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ height: 40, fontSize: 14, gap: 6 }}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Course</>}
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="instructor-create-form">
          <div className="instructor-form-section-title" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>New Course</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label" htmlFor="nc-title">Title *</label>
              <input id="nc-title" className="form-input" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Quantum Gates Fundamentals" />
            </div>
            <div className="instructor-form-row">
              <div>
                <label className="form-label" htmlFor="nc-desc">Description</label>
                <input id="nc-desc" className="form-input" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Brief course overview" />
              </div>
              <div>
                <label className="form-label" htmlFor="nc-level">Level</label>
                <select id="nc-level" className="form-input" value={newLevel} onChange={e => setNewLevel(e.target.value as CourseLevel)}>
                  {LEVEL_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline" style={{ height: 38, fontSize: 13 }} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="button" className="btn-primary" style={{ height: 38, fontSize: 13 }} onClick={() => void handleCreate()} disabled={creating || !newTitle.trim()}>
                {creating ? 'Creating…' : 'Create & Edit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading courses…</div>
      ) : (
        <>
          {published.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Published ({published.length})</h2>
              <div className="instructor-grid-3">
                {published.map(c => (
                  <CourseCard key={c.id} course={c} onStatusChange={(cid, s) => void changeStatus(cid, s as ContentStatus)} />
                ))}
              </div>
            </div>
          )}

          {drafts.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Drafts ({drafts.length})</h2>
              <div className="instructor-grid-3">
                {drafts.map(c => (
                  <CourseCard key={c.id} course={c} onStatusChange={(cid, s) => void changeStatus(cid, s as ContentStatus)} />
                ))}
              </div>
            </div>
          )}

          {archived.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title" style={{ color: 'var(--text-tertiary)' }}>Archived ({archived.length})</h2>
              <div className="instructor-grid-3">
                {archived.map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>
          )}

          {courses.length === 0 && !showForm && (
            <div className="instructor-empty">
              <div className="instructor-empty-icon"><BookOpen size={22} /></div>
              <h3>No courses yet</h3>
              <p>Create your first quantum learning course to get started.</p>
              <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>Create Course</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
