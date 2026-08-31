import type { ChallengeDifficulty } from '@/lib/challenges/types'

interface DifficultyBadgeProps {
  difficulty: ChallengeDifficulty
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`challenge-difficulty challenge-difficulty-${difficulty}`}>
      {difficulty}
    </span>
  )
}
