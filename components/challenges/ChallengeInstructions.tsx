'use client'

import { Clock3, Target, Trophy } from 'lucide-react'
import type { ChallengeDefinition } from '@/lib/challenges/types'
import { useLanguage } from '@/components/LanguageProvider'
import DifficultyBadge from './DifficultyBadge'

interface ChallengeInstructionsProps {
  challenge: ChallengeDefinition
}

export default function ChallengeInstructions({
  challenge,
}: ChallengeInstructionsProps) {
  const { translations } = useLanguage()
  const t = translations.student.challenges
  const common = translations.student.common
  const localized = t.content[challenge.id]
  const title = localized?.title ?? challenge.title
  const description = localized?.description ?? challenge.description
  const goal = localized?.goal ?? challenge.goal
  const typeLabel = t.type[challenge.type] ?? challenge.type

  return (
    <section className="challenge-instructions" aria-labelledby="challenge-title">
      <div className="challenge-instructions-meta">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <span>{typeLabel}</span>
      </div>
      <h1 id="challenge-title">{title}</h1>
      <p className="challenge-description">{description}</p>

      <div className="challenge-goal">
        <Target size={17} aria-hidden="true" />
        <div>
          <span>{t.goal}</span>
          <p>{goal}</p>
        </div>
      </div>

      <div className="challenge-facts" aria-label={t.details}>
        <span>
          <Clock3 size={14} aria-hidden="true" />
          {challenge.estimatedMinutes} {common.min}
        </span>
        <span>
          <Trophy size={14} aria-hidden="true" />
          {t.upTo} {challenge.baseXp} {common.xp}
        </span>
      </div>
    </section>
  )
}
