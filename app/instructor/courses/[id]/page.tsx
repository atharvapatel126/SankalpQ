'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle, Users } from 'lucide-react'
import type { InstructorCourse, CourseLevel, ContentStatus } from '@/lib/instructor/types'
import { getCourseById, updateCourse } from '@/lib/instructor/services/courses'
import StatusBadge from '@/components/instructor/StatusBadge'

// ── tiny toast hook ───────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  const show = useCallback((m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2500)
  }, [])
  return { msg, show }
}

export default function CourseEditorPage() {
  const { id } = useParams<{ id: string }>()
  const { msg: toast, show: showToast } = useToast()

  const [course, setCourse] = useState<InstructorCourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // controlled fields
  const [title, setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel]       = useState<CourseLevel>('beginner')
  const [status, setStatus]     = useState<ContentStatus>('draft')

  useEffect(() => {
    void getCourseById(id).then(c => {
      if (c) {
        setCourse(c)
        setTitle(c.title)
        setDescription(c.description)
        setLevel(c.level)
        setStatus(c.status)
      }
      setLoading(false)
    })
  }, [id])

  const handleSave = async () => {
    if (!course) return
    setSaving(true)
    await updateCourse(id, { title, description, level, status })
    setSaving(false)
    showToast('Course saved ✓')
    // refresh local copy
    const updated = await getCourseById(id)
    if (updated) setCourse(updated)
  }

  const handleDiscard = () => {
    if (!course) return
    setTitle(course.title)
    setDescription(course.description)
    setLevel(course.level)
    setStatus(course.status)
  }

  if (loading) return <div style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>Loading…</div>
  if (!course) return (
    <div>
      <Link href="/instructor/courses" className="btn-outline" style={{ height: 34, fontSize: 13, marginBottom: 24, display: 'inline-flex', gap: 6 }}>
        <ArrowLeft size={14} /> Back
      </Link>
      <div className="instructor-empty"><div className="instructor-empty-icon"><BookOpen size={22} /></div><h3>Course not found</h3></div>
    </div>
  )

  const LEVEL_OPTS: CourseLevel[] = ['beginner', 'intermediate', 'advanced']

  return (
    <div>
      <Link href="/instructor/courses" className="btn-outline" style={{ height: 34, fontSize: 13, marginBottom: 24, display: 'inline-flex', gap: 6 }}>
        <ArrowLeft size={14} /> Back to Courses
      </Link>

      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Course Editor</div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {course.title}
              <StatusBadge status={status} />
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href={`/instructor/courses/${id}/lessons`} className="btn-outline" style={{ height: 40, fontSize: 13, gap: 6 }}>
              <BookOpen size={14} /> Manage Lessons ({course.lessons.length})
            </Link>
            <button type="button" className="btn-outline" style={{ height: 40, fontSize: 13 }} onClick={handleDiscard} disabled={saving}>
              Discard
            </button>
            <button type="button" className="btn-primary" style={{ height: 40, fontSize: 13 }} onClick={() => void handleSave()} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        {[
          { label: 'Enrolled',        value: course.studentsEnrolled, icon: Users },
          { label: 'Completion Rate', value: `${course.completionRate}%`, icon: BookOpen },
          { label: 'Avg Quiz Score',  value: course.averageQuizScore > 0 ? `${course.averageQuizScore}%` : '—', icon: BookOpen },
          { label: 'Lessons',         value: course.lessons.length, icon: BookOpen },
        ].map((s, i) => (
          <div key={i} className="dashboard-stat-card" style={{ flex: 1, minWidth: 120 }}>
            <span className="dashboard-stat-label">{s.label}</span>
            <span className="dashboard-stat-number">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Course Details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label" htmlFor="course-title">Title</label>
            <input
              id="course-title"
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="course-description">Description</label>
            <textarea
              id="course-description"
              className="form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ height: 'auto', resize: 'vertical' }}
            />
          </div>
          <div className="instructor-form-row">
            <div>
              <label className="form-label" htmlFor="course-level">Level</label>
              <select
                id="course-level"
                className="form-input"
                value={level}
                onChange={e => setLevel(e.target.value as CourseLevel)}
              >
                {LEVEL_OPTS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="course-status">Status</label>
              <select
                id="course-status"
                className="form-input"
                value={status}
                onChange={e => setStatus(e.target.value as ContentStatus)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson preview */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">
          Lessons ({course.lessons.length})
          <Link href={`/instructor/courses/${id}/lessons`} className="btn-outline" style={{ height: 30, fontSize: 12, marginLeft: 12 }}>Manage All</Link>
        </div>
        {course.lessons.slice(0, 5).map((l, i) => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{l.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{l.estimatedMinutes} min</div>
            </div>
            <StatusBadge status={l.status} />
          </div>
        ))}
        {course.lessons.length === 0 && (
          <div style={{ color: 'var(--text-tertiary)', fontSize: 14, padding: '16px 0' }}>No lessons yet.</div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="instructor-toast instructor-toast--success">
          <CheckCircle size={16} /> {toast}
        </div>
      )}
    </div>
  )
}
