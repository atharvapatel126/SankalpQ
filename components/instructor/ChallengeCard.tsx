'use client'

import Link from 'next/link'
import { ArrowRight, Target } from 'lucide-react'
import type { InstructorChallenge } from '@/lib/instructor/types'
import StatusBadge from './StatusBadge'

const DIFFICULTY_STYLE: Record<string, { color: string; bg: string }> = {
  beginner:     { color: 'var(--text-circuit)',   bg: 'var(--bg-circuit)' },
  intermediate: { color: 'var(--text-challenge)', bg: 'var(--bg-challenge)' },
  advanced:     { color: 'var(--danger)',          bg: 'color-mix(in srgb, var(--danger) 10%, transparent)' },
}

const TYPE_LABEL: Record<string, string> = {
  'build-circuit':  'Build Circuit',
  'predict-output': 'Predict Output',
  'fix-circuit':    'Fix Circuit',
  'identify-gate':  'Identify Gate',
  'algorithm':      'Algorithm',
}

interface ChallengeCardProps {
  challenge: InstructorChallenge
  onStatusChange?: (id: string, status: 'published' | 'draft' | 'archived') => void
}

export default function ChallengeCard({ challenge, onStatusChange }: ChallengeCardProps) {
  const diff = DIFFICULTY_STYLE[challenge.difficulty]
  return (
    <div className="instructor-card card-shadow">
      <div className="instructor-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: diff.color, background: diff.bg, borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
          <Target size={13} strokeWidth={2} />
          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--surface-raised)', borderRadius: 5, padding: '3px 8px' }}>
          {TYPE_LABEL[challenge.type]}
        </span>
        <StatusBadge status={challenge.status} />
      </div>

      <div className="instructor-card-title" style={{ marginTop: 12 }}>{challenge.title}</div>
      <p className="instructor-card-desc">{challenge.description}</p>

      <div className="instructor-card-stats">
        <div className="instructor-card-stat"><span>Attempts: </span><strong>{challenge.totalAttempts}</strong></div>
        <div className="instructor-card-stat"><span>Completion: </span><strong>{challenge.completionRate}%</strong></div>
        <div className="instructor-card-stat"><span>Avg Attempts: </span><strong>{challenge.averageAttempts}</strong></div>
        <div className="instructor-card-stat"><span>Hints Used: </span><strong>{challenge.hintsUsedRate}%</strong></div>
      </div>

      <div className="instructor-card-actions">
        <Link href={`/instructor/challenges/${challenge.id}`} className="btn-outline" style={{ height: 34, fontSize: 13 }}>
          Edit
        </Link>
        {onStatusChange && challenge.status !== 'archived' && (
          <button
            type="button"
            className="btn-outline"
            style={{ height: 34, fontSize: 13 }}
            onClick={() => onStatusChange(challenge.id, challenge.status === 'published' ? 'draft' : 'published')}
          >
            {challenge.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        )}
        <Link href={`/instructor/challenges/${challenge.id}`} className="instructor-card-arrow" aria-hidden="true">
          <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  )
}
