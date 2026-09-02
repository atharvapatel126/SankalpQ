'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Plus, Trash2 } from 'lucide-react'
import type { InstructorLesson, ContentStatus, InstructorQuizQuestion, InstructorQuizOption } from '@/lib/instructor/types'
import { getCourseById, updateLesson } from '@/lib/instructor/services/courses'

// ── Toast helper ──────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  const show = useCallback((m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2500)
  }, [])
  return { msg, show }
}

export default function LessonEditorPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const { msg: toast, show: showToast } = useToast()

  const [original, setOriginal] = useState<InstructorLesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Controlled fields
  const [title,                setTitle]               = useState('')
  const [description,          setDescription]         = useState('')
  const [estimatedMinutes,     setEstimatedMinutes]    = useState(30)
  const [theoryContent,        setTheoryContent]       = useState('')
  const [formula,              setFormula]             = useState('')
  const [interactiveExplanation, setInteractiveExplanation] = useState('')
  const [circuitTemplateId,    setCircuitTemplateId]   = useState('')
  const [status,               setStatus]             = useState<ContentStatus>('draft')
  const [objectives,           setObjectives]          = useState<string[]>([])
  const [quizQuestions,        setQuizQuestions]       = useState<InstructorQuizQuestion[]>([])

  const applyLesson = (l: InstructorLesson) => {
    setTitle(l.title)
    setDescription(l.description)
    setEstimatedMinutes(l.estimatedMinutes)
    setTheoryContent(l.theoryContent)
    setFormula(l.formula ?? '')
    setInteractiveExplanation(l.interactiveExplanation)
    setCircuitTemplateId(l.circuitTemplateId ?? '')
    setStatus(l.status)
    setObjectives([...l.learningObjectives])
    setQuizQuestions(JSON.parse(JSON.stringify(l.quizQuestions)) as InstructorQuizQuestion[])
  }

  useEffect(() => {
    void getCourseById(id).then(course => {
      if (!course) { setLoading(false); return }
      const l = course.lessons.find(x => x.id === lessonId)
      if (l) { setOriginal(l); applyLesson(l) }
      setLoading(false)
    })
  }, [id, lessonId])

  const handleSave = async () => {
    setSaving(true)
    await updateLesson(id, lessonId, {
      title,
      description,
      estimatedMinutes,
      theoryContent,
      formula,
      interactiveExplanation,
      circuitTemplateId: circuitTemplateId.trim() || null,
      status,
      learningObjectives: objectives,
      quizQuestions,
    })
    setSaving(false)
    showToast('Lesson saved ✓')
    // refresh original
    const updated = await getCourseById(id)
    if (updated) {
      const l = updated.lessons.find(x => x.id === lessonId)
      if (l) setOriginal(l)
    }
  }

  const handleDiscard = () => {
    if (original) applyLesson(original)
  }

  // Objectives helpers
  const addObjective = () => setObjectives(prev => [...prev, ''])
  const updateObjective = (i: number, v: string) =>
    setObjectives(prev => prev.map((o, idx) => (idx === i ? v : o)))
  const removeObjective = (i: number) =>
    setObjectives(prev => prev.filter((_, idx) => idx !== i))

  // Quiz question helpers
  const addQuestion = () => {
    const blank: InstructorQuizQuestion = {
      id: `q-${Date.now()}`,
      assessmentId: lessonId,
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
    setQuizQuestions(prev => [...prev, blank])
  }
  const removeQuestion = (qIdx: number) =>
    setQuizQuestions(prev => prev.filter((_, i) => i !== qIdx))
  const updateQuestion = (qIdx: number, patch: Partial<InstructorQuizQuestion>) =>
    setQuizQuestions(prev => prev.map((q, i) => (i === qIdx ? { ...q, ...patch } : q)))
  const updateOption = (qIdx: number, oIdx: number, label: string) =>
    setQuizQuestions(prev =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, j) => (j === oIdx ? { ...o, label } : o)) }
          : q
      )
    )

  if (loading) return <div style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>Loading…</div>
  if (!original) return (
    <div>
      <Link href={`/instructor/courses/${id}/lessons`} className="btn-outline" style={{ height: 34, fontSize: 13, gap: 6, display: 'inline-flex', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back
      </Link>
      <div className="instructor-empty"><h3>Lesson not found</h3></div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <Link href={`/instructor/courses/${id}/lessons`} className="btn-outline" style={{ height: 34, fontSize: 13, gap: 6 }}>
          <ArrowLeft size={14} /> Back to Lessons
        </Link>
      </div>

      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Lesson Editor</div>
            <h1>{original.title}</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-outline" style={{ height: 40, fontSize: 13 }} onClick={handleDiscard} disabled={saving}>Discard</button>
            <button type="button" className="btn-primary" style={{ height: 40, fontSize: 13 }} onClick={() => void handleSave()} disabled={saving}>
              {saving ? 'Saving…' : 'Save Lesson'}
            </button>
          </div>
        </div>
      </div>

      {/* Basic details */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Basic Details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="instructor-form-row">
            <div>
              <label className="form-label" htmlFor="lesson-title">Title</label>
              <input id="lesson-title" className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="form-label" htmlFor="lesson-minutes">Estimated Minutes</label>
              <input
                id="lesson-minutes"
                type="number"
                className="form-input"
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Number(e.target.value))}
                min={5}
                max={120}
              />
            </div>
          </div>
          <div>
            <label className="form-label" htmlFor="lesson-description">Description</label>
            <textarea
              id="lesson-description"
              className="form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              style={{ height: 'auto', resize: 'vertical' }}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="lesson-status">Status</label>
            <select
              id="lesson-status"
              className="form-input"
              value={status}
              onChange={e => setStatus(e.target.value as ContentStatus)}
              style={{ maxWidth: 200 }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theory content */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Theory Content</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label" htmlFor="lesson-theory">Main Theory (Markdown supported)</label>
            <textarea
              id="lesson-theory"
              className="form-input"
              value={theoryContent}
              onChange={e => setTheoryContent(e.target.value)}
              rows={6}
              style={{ height: 'auto', resize: 'vertical', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="lesson-formula">Formula / Key Equation</label>
            <input
              id="lesson-formula"
              className="form-input"
              value={formula}
              onChange={e => setFormula(e.target.value)}
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              placeholder="e.g. |ψ⟩ = α|0⟩ + β|1⟩"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="lesson-interactive">Interactive Explanation Caption</label>
            <input
              id="lesson-interactive"
              className="form-input"
              value={interactiveExplanation}
              onChange={e => setInteractiveExplanation(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Circuit attachment */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Circuit Template</div>
        <div>
          <label className="form-label" htmlFor="lesson-circuit">Attached Circuit Template ID</label>
          <input
            id="lesson-circuit"
            className="form-input"
            value={circuitTemplateId}
            onChange={e => setCircuitTemplateId(e.target.value)}
            placeholder="e.g. tpl-001 (leave blank for none)"
            style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
          />
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
            Circuit templates can be managed in the{' '}
            <Link href="/instructor/circuit-library" style={{ color: 'var(--accent)' }}>Circuit Library</Link>.
          </div>
        </div>
      </div>

      {/* Learning objectives */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Learning Objectives</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {objectives.map((obj, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-geist-mono), monospace', minWidth: 20 }}>{i + 1}.</span>
              <input
                className="form-input"
                value={obj}
                onChange={e => updateObjective(i, e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="toolbar-icon-btn toolbar-icon-btn-danger"
                style={{ height: 34, width: 34, padding: 0, justifyContent: 'center', flexShrink: 0 }}
                onClick={() => removeObjective(i)}
                aria-label={`Remove objective ${i + 1}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button type="button" className="btn-outline" style={{ height: 34, fontSize: 13, alignSelf: 'flex-start', marginTop: 4, gap: 6 }} onClick={addObjective}>
            <Plus size={13} /> Add Objective
          </button>
        </div>
      </div>

      {/* Quiz Questions */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">
          Quiz Questions ({quizQuestions.length})
          <button type="button" className="btn-outline" style={{ height: 30, fontSize: 12, marginLeft: 12, gap: 5 }} onClick={addQuestion}>
            <Plus size={12} /> Add Question
          </button>
        </div>

        {quizQuestions.length === 0 && (
          <div style={{ color: 'var(--text-tertiary)', fontSize: 14, padding: '12px 0' }}>
            No quiz questions yet. Add a question to test student understanding.
          </div>
        )}

        {quizQuestions.map((q, qIdx) => (
          <div key={q.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>Q{qIdx + 1}</div>
              <span style={{ fontSize: 11, background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px', color: 'var(--text-tertiary)' }}>MCQ</span>
              <button
                type="button"
                className="toolbar-icon-btn toolbar-icon-btn-danger"
                style={{ height: 28, width: 28, padding: 0, justifyContent: 'center', marginLeft: 'auto' }}
                onClick={() => removeQuestion(qIdx)}
              >
                <Trash2 size={12} />
              </button>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label className="form-label" htmlFor={`lq-${qIdx}-prompt`}>Question Prompt</label>
              <textarea
                id={`lq-${qIdx}-prompt`}
                className="form-input"
                value={q.prompt}
                onChange={e => updateQuestion(qIdx, { prompt: e.target.value })}
                rows={2}
                style={{ height: 'auto', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {q.options.map((opt: InstructorQuizOption, oIdx: number) => (
                <div key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: '2px solid',
                      borderColor: opt.id === q.correctOptionId ? 'var(--accent)' : 'var(--border)',
                      background: opt.id === q.correctOptionId ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'transparent',
                      cursor: 'pointer', flexShrink: 0, padding: 0,
                    }}
                    title="Mark as correct answer"
                    onClick={() => updateQuestion(qIdx, { correctOptionId: opt.id })}
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
              <label className="form-label" htmlFor={`lq-${qIdx}-exp`}>Explanation</label>
              <textarea
                id={`lq-${qIdx}-exp`}
                className="form-input"
                value={q.explanation}
                onChange={e => updateQuestion(qIdx, { explanation: e.target.value })}
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
