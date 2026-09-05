'use client'

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
import { useLanguage } from '@/components/LanguageProvider'
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

function CardContent({ challenge, progress }: ChallengeCardProps) {
  const { translations } = useLanguage()
  const t = translations.student.challenges
  const common = translations.student.common
  const Icon = TYPE_ICONS[challenge.type]
  const isUpcoming = challenge.kind === 'upcoming'
  const completed = progress?.completed === true
  const status = isUpcoming
    ? t.status.upcoming
    : completed
      ? t.status.completed
      : progress?.attempts
        ? t.status.inProgress
        : t.status.notStarted

  const localized = t.content[challenge.id]
  const title = localized?.title ?? challenge.title
  const shortDescription = localized?.shortDescription ?? challenge.shortDescription
  const typeLabel = t.typeShort[challenge.type] ?? challenge.type

  return (
    <article className={`challenge-card${isUpcoming ? ' is-upcoming' : ''}`}>
      <div className="challenge-card-topline">
        <span className="challenge-card-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>
      <span className="challenge-card-type">{typeLabel}</span>
      <h3>{title}</h3>
      <p>{shortDescription}</p>
      <div className="challenge-card-meta">
        <span>{challenge.estimatedMinutes} {common.min}</span>
        {!isUpcoming && <span>{challenge.baseXp} {common.xp}</span>}
        {progress && progress.bestScore > 0 && (
          <span>{t.best(progress.bestScore)}</span>
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
