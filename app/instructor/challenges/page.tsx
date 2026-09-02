'use client'

import { Plus, Target, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ChallengeCard from '@/components/instructor/ChallengeCard'
import { useChallengeManagement } from '@/hooks/useChallengeManagement'
import type { ContentStatus } from '@/lib/instructor/types'
import type { ChallengeType, ChallengeDifficulty } from '@/lib/challenges/types'
import { createChallenge } from '@/lib/instructor/services/challenges'

const TYPE_OPTS: { value: ChallengeType; label: string }[] = [
  { value: 'build-circuit',  label: 'Build Circuit' },
  { value: 'predict-output', label: 'Predict Output' },
  { value: 'fix-circuit',    label: 'Fix Circuit' },
  { value: 'identify-gate',  label: 'Identify Gate' },
  { value: 'algorithm',      label: 'Algorithm' },
]
const DIFF_OPTS: { value: ChallengeDifficulty; label: string }[] = [
  { value: 'beginner',     label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced' },
]

export default function ChallengesPage() {
  const { challenges, loading, changeStatus, refresh } = useChallengeManagement()
  const router = useRouter()

  const [showForm, setShowForm]     = useState(false)
  const [newTitle, setNewTitle]     = useState('')
  const [newDesc,  setNewDesc]      = useState('')
  const [newType,  setNewType]      = useState<ChallengeType>('build-circuit')
  const [newDiff,  setNewDiff]      = useState<ChallengeDifficulty>('beginner')
  const [creating, setCreating]     = useState(false)

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const created = await createChallenge({ title: newTitle.trim(), description: newDesc.trim(), type: newType, difficulty: newDiff })
    await refresh()
    setCreating(false)
    setShowForm(false)
    setNewTitle('')
    setNewDesc('')
    router.push(`/instructor/challenges/${created.id}`)
  }

  const published = challenges.filter(c => c.status === 'published')
  const drafts    = challenges.filter(c => c.status === 'draft')

  return (
    <div>
      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Content Management</div>
            <h1>Challenges</h1>
            <p>Design, manage, and analyze interactive quantum circuit challenges.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ height: 40, fontSize: 14, gap: 6 }}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Challenge</>}
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="instructor-create-form">
          <div className="instructor-form-section-title" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>New Challenge</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label" htmlFor="nc-title">Title *</label>
              <input id="nc-title" className="form-input" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Build a Bell State" />
            </div>
            <div>
              <label className="form-label" htmlFor="nc-desc">Description</label>
              <input id="nc-desc" className="form-input" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Brief challenge overview" />
            </div>
            <div className="instructor-form-row">
              <div>
                <label className="form-label" htmlFor="nc-type">Type</label>
                <select id="nc-type" className="form-input" value={newType} onChange={e => setNewType(e.target.value as ChallengeType)}>
                  {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="nc-diff">Difficulty</label>
                <select id="nc-diff" className="form-input" value={newDiff} onChange={e => setNewDiff(e.target.value as ChallengeDifficulty)}>
                  {DIFF_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
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
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading…</div>
      ) : (
        <>
          {published.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Published ({published.length})</h2>
              <div className="instructor-grid-3">
                {published.map(c => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    onStatusChange={(cid, s) => void changeStatus(cid, s as ContentStatus)}
                  />
                ))}
              </div>
            </div>
          )}

          {drafts.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Drafts ({drafts.length})</h2>
              <div className="instructor-grid-3">
                {drafts.map(c => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    onStatusChange={(cid, s) => void changeStatus(cid, s as ContentStatus)}
                  />
                ))}
              </div>
            </div>
          )}

          {challenges.length === 0 && !showForm && (
            <div className="instructor-empty">
              <div className="instructor-empty-icon"><Target size={22} /></div>
              <h3>No challenges yet</h3>
              <p>Create your first quantum circuit challenge.</p>
              <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>Create Challenge</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
