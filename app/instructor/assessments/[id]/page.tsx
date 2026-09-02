'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Plus, Trash2 } from 'lucide-react'
import type { InstructorAssessment, InstructorQuizQuestion, InstructorQuizOption, ContentStatus } from '@/lib/instructor/types'
import { getAssessmentById, updateAssessment } from '@/lib/instructor/services/assessments'
import StatusBadge from '@/components/instructor/StatusBadge'

// ── Toast helper ──────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  const show = useCallback((m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2500)
  }, [])
  return { msg, show }
}

const TYPE_LABEL: Record<string, string> = {
  'multiple-choice': 'MCQ',
  'true-false': 'T/F',
  'output-prediction': 'Output Prediction',
}

export default function AssessmentEditorPage() {
  const { id } = useParams<{ id: string }>()
  const { msg: toast, show: showToast } = useToast()

  const [original, setOriginal] = useState<InstructorAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Controlled fields
  const [title,          setTitle]         = useState('')
  const [relatedConcept, setRelatedConcept] = useState('')
  const [status,         setStatus]        = useState<ContentStatus>('draft')
  const [questions,      setQuestions]     = useState<InstructorQuizQuestion[]>([])

  const applyAssessment = (a: InstructorAssessment) => {
    setTitle(a.title)
    setRelatedConcept(a.relatedConcept)
    setStatus(a.status)
    setQuestions(JSON.parse(JSON.stringify(a.questions)) as InstructorQuizQuestion[])
  }

  useEffect(() => {
    void getAssessmentById(id).then(a => {
      if (a) { setOriginal(a); applyAssessment(a) }
      setLoading(false)
    })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    await updateAssessment(id, { title, relatedConcept, status, questions })
    setSaving(false)
    showToast('Assessment saved ✓')
    const updated = await getAssessmentById(id)
    if (updated) setOriginal(updated)
  }

  const handleDiscard = () => {
    if (original) applyAssessment(original)
  }

  // Question helpers
  const addQuestion = () => {
    const blank: InstructorQuizQuestion = {
      id: `q-${Date.now()}`,
      assessmentId: id,
      type: 'multiple-choice',
      prompt: '',
      options: [
        { id: 'opt-a', label: '' },
        { id: 'opt-b', label: '' },
        { id: 'opt-c', label: '' },
        { id: 'opt-d', label: '' },
      ],
      correctOptionId: 'opt-a',
      explanation: '',
      relatedConcept: '',
      averageScore: 0,
      attemptCount: 0,
    }
    setQuestions(prev => [...prev, blank])
  }

  const removeQuestion = (qIdx: number) =>
    setQuestions(prev => prev.filter((_, i) => i !== qIdx))

  const updateQ = (qIdx: number, patch: Partial<InstructorQuizQuestion>) =>
    setQuestions(prev => prev.map((q, i) => (i === qIdx ? { ...q, ...patch } : q)))

  const updateOption = (qIdx: number, oIdx: number, label: string) =>
    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o: InstructorQuizOption, j: number) => (j === oIdx ? { ...o, label } : o)) }
          : q
      )
    )

  if (loading) return <div style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>Loading…</div>
  if (!original) return (
    <div>
      <Link href="/instructor/assessments" className="btn-outline" style={{ height: 34, fontSize: 13, gap: 6, display: 'inline-flex', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back
      </Link>
      <div className="instructor-empty"><h3>Assessment not found</h3></div>
    </div>
  )

  return (
    <div>
      <Link href="/instructor/assessments" className="btn-outline" style={{ height: 34, fontSize: 13, gap: 6, display: 'inline-flex', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to Assessments
      </Link>

      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Assessment Editor</div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {original.title}
              <StatusBadge status={status} />
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-outline" style={{ height: 40, fontSize: 13 }} onClick={handleDiscard} disabled={saving}>Discard</button>
            <button type="button" className="btn-primary" style={{ height: 40, fontSize: 13 }} onClick={() => void handleSave()} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Questions',    value: questions.length || '—' },
          { label: 'Attempts',     value: original.totalAttempts },
          { label: 'Avg Score',    value: original.averageScore > 0 ? `${original.averageScore}%` : '—' },
          { label: 'Success Rate', value: original.successRate > 0 ? `${original.successRate}%` : '—' },
        ].map((s, i) => (
          <div key={i} className="dashboard-stat-card" style={{ flex: 1, minWidth: 100 }}>
            <span className="dashboard-stat-label">{s.label}</span>
            <span className="dashboard-stat-number">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Assessment Details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label" htmlFor="asmnt-title">Title</label>
            <input id="asmnt-title" className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="instructor-form-row">
            <div>
              <label className="form-label" htmlFor="asmnt-concept">Related Concept</label>
              <input id="asmnt-concept" className="form-input" value={relatedConcept} onChange={e => setRelatedConcept(e.target.value)} />
            </div>
            <div>
              <label className="form-label" htmlFor="asmnt-status">Status</label>
              <select id="asmnt-status" className="form-input" value={status} onChange={e => setStatus(e.target.value as ContentStatus)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">
          Questions ({questions.length})
          <button type="button" className="btn-outline" style={{ height: 30, fontSize: 12, marginLeft: 12, gap: 5 }} onClick={addQuestion}>
            <Plus size={12} /> Add Question
          </button>
        </div>

        {questions.length === 0 && (
          <div style={{ color: 'var(--text-tertiary)', fontSize: 14, padding: '16px 0' }}>
            No questions yet. Add a question to get started.
          </div>
        )}

        {questions.map((q, qIdx) => (
          <div key={q.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>Q{qIdx + 1}</div>
              <span style={{ fontSize: 11, background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px', color: 'var(--text-tertiary)' }}>
                {TYPE_LABEL[q.type] ?? q.type}
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {q.attemptCount > 0 && (
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-geist-mono), monospace' }}>Avg: {q.averageScore}%</span>
                )}
                <button
                  type="button"
                  className="toolbar-icon-btn toolbar-icon-btn-danger"
                  style={{ height: 28, width: 28, padding: 0, justifyContent: 'center' }}
                  onClick={() => removeQuestion(qIdx)}
                  aria-label={`Remove question ${qIdx + 1}`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label className="form-label" htmlFor={`q-${qIdx}-prompt`}>Question Prompt</label>
              <textarea
                id={`q-${qIdx}-prompt`}
                className="form-input"
                value={q.prompt}
                onChange={e => updateQ(qIdx, { prompt: e.target.value })}
                rows={2}
                style={{ height: 'auto', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {q.options.map((opt: InstructorQuizOption, oIdx: number) => (
                <div key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    title="Mark as correct answer"
                    style={{
                      width: 20, height: 20, borderRadius: '50%', border: '2px solid',
                      borderColor: opt.id === q.correctOptionId ? 'var(--accent)' : 'var(--border)',
                      background: opt.id === q.correctOptionId ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'transparent',
                      cursor: 'pointer', flexShrink: 0, padding: 0,
                    }}
                    onClick={() => updateQ(qIdx, { correctOptionId: opt.id })}
                  />
                  <input
                    className="form-input"
                    value={opt.label}
                    onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                    style={{ flex: 1 }}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="form-label" htmlFor={`q-${qIdx}-exp`}>Explanation</label>
              <textarea
                id={`q-${qIdx}-exp`}
                className="form-input"
                value={q.explanation}
                onChange={e => updateQ(qIdx, { explanation: e.target.value })}
                rows={2}
                style={{ height: 'auto', resize: 'vertical' }}
              />
            </div>
          </div>
        ))}
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
