'use client'

import {
  CHALLENGES,
  CHALLENGE_DIFFICULTIES,
} from '@/lib/challenges/challenge-data'
import type {
  ChallengeProgressState,
} from '@/lib/challenges/types'
import { useLanguage } from '@/components/LanguageProvider'
import ChallengeCard from './ChallengeCard'

interface ChallengeGridProps {
  progress: ChallengeProgressState
}

export default function ChallengeGrid({ progress }: ChallengeGridProps) {
  const { translations } = useLanguage()
  const t = translations.student.challenges

  return (
    <div className="challenge-level-list">
      {CHALLENGE_DIFFICULTIES.map(difficulty => {
        const challenges = CHALLENGES.filter(
          challenge => challenge.difficulty === difficulty
        )
        const difficultyInfo = t.difficulty[difficulty]

        return (
          <section className="challenge-level" key={difficulty}>
            <div className="challenge-level-heading">
              <div>
                <h2>{difficultyInfo?.title ?? difficulty}</h2>
                <p>{difficultyInfo?.description}</p>
              </div>
              <span>{t.challengeCount(challenges.length)}</span>
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
