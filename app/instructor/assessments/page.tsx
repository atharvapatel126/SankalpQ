'use client'

import { ClipboardList, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { InstructorAssessment } from '@/lib/instructor/types'
import { getAllAssessments, createAssessment } from '@/lib/instructor/services/assessments'
import StatusBadge from '@/components/instructor/StatusBadge'

export default function AssessmentsPage() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<InstructorAssessment[]>([])
  const [loading, setLoading] = useState(true)

  // Create form
  const [showForm, setShowForm]     = useState(false)
  const [newTitle, setNewTitle]     = useState('')
  const [newConcept, setNewConcept] = useState('')
  const [creating, setCreating]     = useState(false)

  const reload = async () => {
    const data = await getAllAssessments()
    setAssessments(data)
    setLoading(false)
  }

  useEffect(() => { void reload() }, [])

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const created = await createAssessment({ title: newTitle.trim(), relatedConcept: newConcept.trim() })
    setCreating(false)
    setShowForm(false)
    setNewTitle('')
    setNewConcept('')
    router.push(`/instructor/assessments/${created.id}`)
  }

  if (loading) return <div style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>Loading…</div>

  return (
    <div>
      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Content Management</div>
            <h1>Assessments</h1>
            <p>Create and manage quizzes and assessments for your quantum courses.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ height: 40, fontSize: 14, gap: 6 }}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Assessment</>}
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="instructor-create-form">
          <div className="instructor-form-section-title" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>New Assessment</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="instructor-form-row">
              <div>
                <label className="form-label" htmlFor="na-title">Title *</label>
                <input id="na-title" className="form-input" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Superposition Quiz" />
              </div>
              <div>
                <label className="form-label" htmlFor="na-concept">Related Concept</label>
                <input id="na-concept" className="form-input" value={newConcept} onChange={e => setNewConcept(e.target.value)} placeholder="e.g. Superposition" />
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

      {assessments.length === 0 && !showForm ? (
        <div className="instructor-empty">
          <div className="instructor-empty-icon"><ClipboardList size={22} /></div>
          <h3>No assessments yet</h3>
          <p>Create your first quiz or assessment.</p>
          <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>Create Assessment</button>
        </div>
      ) : assessments.length > 0 ? (
        <div className="instructor-form-section" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: 'var(--surface-raised)', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 160px 80px 80px 80px 80px 80px', gap: 12, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)' }}>
            <span>Title</span><span>Concept</span><span>Questions</span><span>Attempts</span><span>Avg Score</span><span>Success</span><span>Status</span>
          </div>
          {assessments.map((a, i) => (
            <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 80px 80px 80px 80px 80px', gap: 12, padding: '14px 16px', borderBottom: i < assessments.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
              <div>
                <Link href={`/instructor/assessments/${a.id}`} style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', textDecoration: 'none' }}>{a.title}</Link>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.relatedConcept || '—'}</div>
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{a.questions.length || '—'}</div>
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{a.totalAttempts}</div>
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{a.averageScore > 0 ? `${a.averageScore}%` : '—'}</div>
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{a.successRate > 0 ? `${a.successRate}%` : '—'}</div>
              <div><StatusBadge status={a.status} /></div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
