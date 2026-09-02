'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Target } from 'lucide-react'
import type { InstructorChallenge, ChallengeHint, ContentStatus } from '@/lib/instructor/types'
import type { ChallengeType, ChallengeDifficulty } from '@/lib/challenges/types'
import { getChallengeById, updateChallenge } from '@/lib/instructor/services/challenges'
import HintEditor from '@/components/instructor/HintEditor'
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

const TYPE_OPTS: ChallengeType[] = ['build-circuit', 'predict-output', 'fix-circuit', 'identify-gate', 'algorithm']
const DIFF_OPTS: ChallengeDifficulty[] = ['beginner', 'intermediate', 'advanced']

export default function ChallengeEditorPage() {
  const { id } = useParams<{ id: string }>()
  const { msg: toast, show: showToast } = useToast()

  const [original, setOriginal] = useState<InstructorChallenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Controlled fields
  const [title,          setTitle]         = useState('')
  const [description,    setDescription]   = useState('')
  const [objective,      setObjective]     = useState('')
  const [type,           setType]          = useState<ChallengeType>('build-circuit')
  const [difficulty,     setDifficulty]    = useState<ChallengeDifficulty>('beginner')
  const [estimatedMinutes, setEstimatedMinutes] = useState(30)
  const [status,         setStatus]        = useState<ContentStatus>('draft')
  const [explanation,    setExplanation]   = useState('')
  const [requiredGates,  setRequiredGates] = useState('')
  const [expectedProbs,  setExpectedProbs] = useState('')
  const [hints,          setHints]         = useState<ChallengeHint[]>([])

  const applyChallenge = (c: InstructorChallenge) => {
    setTitle(c.title)
    setDescription(c.description)
    setObjective(c.objective)
    setType(c.type)
    setDifficulty(c.difficulty)
    setEstimatedMinutes(c.estimatedMinutes)
    setStatus(c.status)
    setExplanation(c.validationConfig.explanation)
    setRequiredGates(c.validationConfig.requiredGates.join(', '))
    setExpectedProbs(JSON.stringify(c.validationConfig.expectedProbabilities, null, 2))
    setHints(JSON.parse(JSON.stringify(c.hints)) as ChallengeHint[])
  }

  useEffect(() => {
    void getChallengeById(id).then(c => {
      if (c) { setOriginal(c); applyChallenge(c) }
      setLoading(false)
    })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    let parsedProbs: Record<string, number> = {}
    try { parsedProbs = JSON.parse(expectedProbs) as Record<string, number> } catch { /* keep empty */ }

    await updateChallenge(id, {
      title,
      description,
      objective,
      type,
      difficulty,
      estimatedMinutes,
      status,
      hints,
      validationConfig: {
        explanation,
        requiredGates: requiredGates.split(',').map(g => g.trim()).filter(Boolean),
        expectedProbabilities: parsedProbs,
        probabilityTolerance: original?.validationConfig.probabilityTolerance ?? 0.05,
      },
    })
    setSaving(false)
    showToast('Challenge saved ✓')
    const updated = await getChallengeById(id)
    if (updated) setOriginal(updated)
  }

  const handleDiscard = () => {
    if (original) applyChallenge(original)
  }

  if (loading) return <div style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>Loading…</div>
  if (!original) return (
    <div>
      <Link href="/instructor/challenges" className="btn-outline" style={{ height: 34, fontSize: 13, gap: 6, display: 'inline-flex', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back
      </Link>
      <div className="instructor-empty"><div className="instructor-empty-icon"><Target size={22} /></div><h3>Challenge not found</h3></div>
    </div>
  )

  return (
    <div>
      <Link href="/instructor/challenges" className="btn-outline" style={{ height: 34, fontSize: 13, gap: 6, display: 'inline-flex', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to Challenges
      </Link>

      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Challenge Editor</div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {original.title}
              <StatusBadge status={status} />
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-outline" style={{ height: 40, fontSize: 13 }} onClick={handleDiscard} disabled={saving}>Discard</button>
            <button type="button" className="btn-primary" style={{ height: 40, fontSize: 13 }} onClick={() => void handleSave()} disabled={saving}>
              {saving ? 'Saving…' : 'Save Challenge'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Attempts',  value: original.totalAttempts },
          { label: 'Completion Rate', value: `${original.completionRate}%` },
          { label: 'Avg Attempts',    value: original.averageAttempts },
          { label: 'Hints Used',      value: `${original.hintsUsedRate}%` },
        ].map((s, i) => (
          <div key={i} className="dashboard-stat-card" style={{ flex: 1, minWidth: 100 }}>
            <span className="dashboard-stat-label">{s.label}</span>
            <span className="dashboard-stat-number">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Basic info */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Challenge Details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label" htmlFor="chl-title">Title</label>
            <input id="chl-title" className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="chl-desc">Description</label>
            <textarea id="chl-desc" className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={2} style={{ height: 'auto', resize: 'vertical' }} />
          </div>
          <div>
            <label className="form-label" htmlFor="chl-obj">Objective</label>
            <textarea id="chl-obj" className="form-input" value={objective} onChange={e => setObjective(e.target.value)} rows={2} style={{ height: 'auto', resize: 'vertical' }} />
          </div>
          <div className="instructor-form-row">
            <div>
              <label className="form-label" htmlFor="chl-type">Challenge Type</label>
              <select id="chl-type" className="form-input" value={type} onChange={e => setType(e.target.value as ChallengeType)}>
                {TYPE_OPTS.map(t => <option key={t} value={t}>{t.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="chl-diff">Difficulty</label>
              <select id="chl-diff" className="form-input" value={difficulty} onChange={e => setDifficulty(e.target.value as ChallengeDifficulty)}>
                {DIFF_OPTS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="instructor-form-row">
            <div>
              <label className="form-label" htmlFor="chl-minutes">Estimated Minutes</label>
              <input id="chl-minutes" type="number" className="form-input" value={estimatedMinutes} onChange={e => setEstimatedMinutes(Number(e.target.value))} min={5} />
            </div>
            <div>
              <label className="form-label" htmlFor="chl-status">Status</label>
              <select id="chl-status" className="form-input" value={status} onChange={e => setStatus(e.target.value as ContentStatus)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Validation config */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Validation Configuration</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label" htmlFor="chl-explanation">Explanation (shown after completion)</label>
            <textarea id="chl-explanation" className="form-input" value={explanation} onChange={e => setExplanation(e.target.value)} rows={3} style={{ height: 'auto', resize: 'vertical' }} />
          </div>
          <div>
            <label className="form-label" htmlFor="chl-gates">Required Gates</label>
            <input id="chl-gates" className="form-input" value={requiredGates} onChange={e => setRequiredGates(e.target.value)} placeholder="H, CNOT, X…" style={{ fontFamily: 'var(--font-geist-mono), monospace' }} />
          </div>
          <div>
            <label className="form-label" htmlFor="chl-probs">Expected Probabilities (JSON)</label>
            <textarea
              id="chl-probs"
              className="form-input"
              value={expectedProbs}
              onChange={e => setExpectedProbs(e.target.value)}
              rows={4}
              style={{ height: 'auto', resize: 'vertical', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12 }}
            />
          </div>
        </div>
      </div>

      {/* Hints */}
      <div className="instructor-form-section">
        <div className="instructor-form-section-title">Progressive Hints</div>
        <HintEditor hints={hints} onChange={setHints} />
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
