import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  CheckCircle2,
  CircuitBoard,
  Eye,
  HelpCircle,
  LockKeyhole,
  Wrench,
} from 'lucide-react'
import type {
  ChallengeDefinition,
  ChallengeProgressEntry,
  ChallengeType,
} from '@/lib/challenges/types'
import DifficultyBadge from './DifficultyBadge'

interface ChallengeCardProps {
  challenge: ChallengeDefinition
  progress?: ChallengeProgressEntry
}

const TYPE_ICONS: Record<ChallengeType, LucideIcon> = {
  'build-circuit': CircuitBoard,
  'predict-output': Eye,
  'fix-circuit': Wrench,
  'identify-gate': HelpCircle,
  algorithm: LockKeyhole,
}

const TYPE_LABELS: Record<ChallengeType, string> = {
  'build-circuit': 'Build',
  'predict-output': 'Predict',
  'fix-circuit': 'Repair',
  'identify-gate': 'Identify',
  algorithm: 'Algorithm',
}

function CardContent({ challenge, progress }: ChallengeCardProps) {
  const Icon = TYPE_ICONS[challenge.type]
  const isUpcoming = challenge.kind === 'upcoming'
  const completed = progress?.completed === true
  const status = isUpcoming
    ? 'Upcoming'
    : completed
      ? 'Completed'
      : progress?.attempts
        ? 'In progress'
        : 'Not started'

  return (
    <article className={`challenge-card${isUpcoming ? ' is-upcoming' : ''}`}>
      <div className="challenge-card-topline">
        <span className="challenge-card-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>
      <span className="challenge-card-type">{TYPE_LABELS[challenge.type]}</span>
      <h3>{challenge.title}</h3>
      <p>{challenge.shortDescription}</p>
      <div className="challenge-card-meta">
        <span>{challenge.estimatedMinutes} min</span>
        {!isUpcoming && <span>{challenge.baseXp} XP</span>}
        {progress && progress.bestScore > 0 && (
          <span>Best {progress.bestScore}</span>
        )}
      </div>
      <div className="challenge-card-footer">
        <span className={completed ? 'is-complete' : ''}>
          {completed && <CheckCircle2 size={14} aria-hidden="true" />}
          {status}
        </span>
        {!isUpcoming && <ArrowRight size={16} aria-hidden="true" />}
      </div>
    </article>
  )
}

export default function ChallengeCard(props: ChallengeCardProps) {
  if (props.challenge.kind === 'upcoming') {
    return <CardContent {...props} />
  }

  return (
    <Link className="challenge-card-link" href={`/challenges/${props.challenge.id}`}>
      <CardContent {...props} />
    </Link>
  )
}
