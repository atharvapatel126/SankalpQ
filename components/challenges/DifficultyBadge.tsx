'use client'

import type { ChallengeDifficulty } from '@/lib/challenges/types'
import { useLanguage } from '@/components/LanguageProvider'

interface DifficultyBadgeProps {
  difficulty: ChallengeDifficulty
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { translations } = useLanguage()
  const label = translations.student.challenges.difficulty[difficulty]?.title ?? difficulty

  return (
    <span className={`challenge-difficulty challenge-difficulty-${difficulty}`}>
      {label}
    </span>
  )
}
