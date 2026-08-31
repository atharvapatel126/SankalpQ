import { Clock3, Target, Trophy } from 'lucide-react'
import type { ChallengeDefinition } from '@/lib/challenges/types'
import DifficultyBadge from './DifficultyBadge'

interface ChallengeInstructionsProps {
  challenge: ChallengeDefinition
}

const TYPE_LABELS: Record<ChallengeDefinition['type'], string> = {
  'build-circuit': 'Build the circuit',
  'predict-output': 'Predict the output',
  'fix-circuit': 'Fix the circuit',
  'identify-gate': 'Identify the gate',
  algorithm: 'Algorithm challenge',
}

export default function ChallengeInstructions({
  challenge,
}: ChallengeInstructionsProps) {
  return (
    <section className="challenge-instructions" aria-labelledby="challenge-title">
      <div className="challenge-instructions-meta">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <span>{TYPE_LABELS[challenge.type]}</span>
      </div>
      <h1 id="challenge-title">{challenge.title}</h1>
      <p className="challenge-description">{challenge.description}</p>

      <div className="challenge-goal">
        <Target size={17} aria-hidden="true" />
        <div>
          <span>Goal</span>
          <p>{challenge.goal}</p>
        </div>
      </div>

      <div className="challenge-facts" aria-label="Challenge details">
        <span>
          <Clock3 size={14} aria-hidden="true" />
          {challenge.estimatedMinutes} min
        </span>
        <span>
          <Trophy size={14} aria-hidden="true" />
          Up to {challenge.baseXp} XP
        </span>
      </div>
    </section>
  )
}
