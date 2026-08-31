import {
  CHALLENGES,
  CHALLENGE_DIFFICULTIES,
} from '@/lib/challenges/challenge-data'
import type {
  ChallengeDifficulty,
  ChallengeProgressState,
} from '@/lib/challenges/types'
import ChallengeCard from './ChallengeCard'

interface ChallengeGridProps {
  progress: ChallengeProgressState
}

const DIFFICULTY_COPY: Record<
  ChallengeDifficulty,
  { title: string; description: string }
> = {
  beginner: {
    title: 'Beginner',
    description: 'Single-qubit gates, superposition, and measurement.',
  },
  intermediate: {
    title: 'Intermediate',
    description: 'Controlled gates, correlation, and Bell states.',
  },
  advanced: {
    title: 'Advanced',
    description: 'Quantum algorithm construction and analysis.',
  },
}

export default function ChallengeGrid({ progress }: ChallengeGridProps) {
  return (
    <div className="challenge-level-list">
      {CHALLENGE_DIFFICULTIES.map(difficulty => {
        const challenges = CHALLENGES.filter(
          challenge => challenge.difficulty === difficulty
        )
        const copy = DIFFICULTY_COPY[difficulty]

        return (
          <section className="challenge-level" key={difficulty}>
            <div className="challenge-level-heading">
              <div>
                <h2>{copy.title}</h2>
                <p>{copy.description}</p>
              </div>
              <span>{challenges.length} challenge{challenges.length === 1 ? '' : 's'}</span>
            </div>
            <div className="challenge-grid">
              {challenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  progress={progress.entries[challenge.id]}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
