'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Plus, Pencil, X } from 'lucide-react'
import type { InstructorCourse } from '@/lib/instructor/types'
import { getCourseById, addLesson } from '@/lib/instructor/services/courses'
import StatusBadge from '@/components/instructor/StatusBadge'

export default function LessonsPage() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<InstructorCourse | null>(null)
  const [loading, setLoading] = useState(true)

  // Add-lesson form state
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newMinutes, setNewMinutes] = useState(30)
  const [creating, setCreating] = useState(false)

  const reload = async () => {
    const c = await getCourseById(id)
    setCourse(c)
    setLoading(false)
  }

  useEffect(() => { void reload() }, [id])

  const handleAddLesson = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const now = new Date().toISOString()
    await addLesson(id, {
      id: `lesson-${Date.now()}`,
      courseId: id,
      order: (course?.lessons.length ?? 0) + 1,
      title: newTitle.trim(),
      description: newDescription.trim(),
      learningObjectives: [],
      theoryContent: '',
      formula: '',
      interactiveExplanation: '',
      circuitTemplateId: null,
      quizQuestions: [],
      status: 'draft',
      estimatedMinutes: newMinutes,
      createdAt: now,
      updatedAt: now,
    })
    setCreating(false)
    setShowForm(false)
    setNewTitle('')
    setNewDescription('')
    setNewMinutes(30)
    await reload()
  }

  if (loading) return <div style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>Loading…</div>
  if (!course) return <div className="instructor-empty"><h3>Course not found</h3></div>

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <Link href={`/instructor/courses/${id}`} className="btn-outline" style={{ height: 34, fontSize: 13, gap: 6 }}>
          <ArrowLeft size={14} /> Back to Course
        </Link>
      </div>

      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">{course.title}</div>
            <h1>Lesson Manager</h1>
            <p>{course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''} in this course.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ height: 40, fontSize: 13, gap: 6 }}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Lesson</>}
          </button>
        </div>
      </div>

      {/* Inline add-lesson form */}
      {showForm && (
        <div className="instructor-create-form">
          <div className="instructor-form-section-title" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>New Lesson</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label" htmlFor="new-lesson-title">Title *</label>
              <input
                id="new-lesson-title"
                className="form-input"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Introduction to Superposition"
              />
            </div>
            <div className="instructor-form-row">
              <div>
                <label className="form-label" htmlFor="new-lesson-desc">Description</label>
                <input
                  id="new-lesson-desc"
                  className="form-input"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Brief overview of this lesson"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="new-lesson-minutes">Estimated Minutes</label>
                <input
                  id="new-lesson-minutes"
                  type="number"
                  className="form-input"
                  value={newMinutes}
                  onChange={e => setNewMinutes(Number(e.target.value))}
                  min={5}
                  max={120}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline" style={{ height: 38, fontSize: 13 }} onClick={() => setShowForm(false)}>Cancel</button>
              <button
                type="button"
                className="btn-primary"
                style={{ height: 38, fontSize: 13 }}
                onClick={() => void handleAddLesson()}
                disabled={creating || !newTitle.trim()}
              >
                {creating ? 'Adding…' : 'Add Lesson'}
              </button>
            </div>
          </div>
        </div>
      )}

      {course.lessons.length === 0 && !showForm ? (
        <div className="instructor-empty">
          <div className="instructor-empty-icon"><BookOpen size={22} /></div>
          <h3>No lessons yet</h3>
          <p>Add your first lesson to start building this course.</p>
          <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>Add Lesson</button>
        </div>
      ) : (
        <div className="instructor-form-section" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--surface-raised)', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 80px 80px', gap: 12, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)' }}>
            <span>#</span><span>Title</span><span>Status</span><span>Minutes</span><span>Quiz</span><span></span>
          </div>
          {course.lessons.map((l, i) => (
            <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 80px 80px', gap: 12, padding: '14px 16px', borderBottom: i < course.lessons.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{l.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{l.description.slice(0, 60)}{l.description.length > 60 ? '…' : ''}</div>
              </div>
              <div><StatusBadge status={l.status} /></div>
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{l.estimatedMinutes}m</div>
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: 'var(--text-secondary)' }}>
                {l.quizQuestions.length > 0 ? `${l.quizQuestions.length}Q` : '—'}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href={`/instructor/courses/${id}/lessons/${l.id}`} className="toolbar-icon-btn" style={{ height: 30, width: 30, padding: 0, justifyContent: 'center' }} title="Edit lesson">
                  <Pencil size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
