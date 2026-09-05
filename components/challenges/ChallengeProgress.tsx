'use client'

import type { ChallengeProgressSummary } from '@/lib/challenges/types'
import { useLanguage } from '@/components/LanguageProvider'

interface ChallengeProgressProps {
  summary: ChallengeProgressSummary
  isReady: boolean
}

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const

export default function ChallengeProgress({
  summary,
  isReady,
}: ChallengeProgressProps) {
  const { translations } = useLanguage()
  const t = translations.student.challenges
  const common = translations.student.common
  const displayValue = (value: string | number) => (isReady ? value : '--')

  return (
    <section className="challenge-progress" aria-labelledby="challenge-progress-title">
      <div className="challenge-progress-heading">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">{t.yourPractice}</span>
          <h2 id="challenge-progress-title">{t.progress}</h2>
        </div>
        <strong>{displayValue(`${summary.totalXp} ${common.xp}`)}</strong>
      </div>

      <div className="challenge-progress-stats">
        <div>
          <span>{t.completed}</span>
          <strong>
            {displayValue(
              `${summary.completedChallenges}/${summary.totalChallenges}`
            )}
          </strong>
        </div>
        <div>
          <span>{t.currentLevel}</span>
          <strong className="challenge-capitalize">
            {displayValue(t.difficulty[summary.currentLevel]?.title ?? summary.currentLevel)}
          </strong>
        </div>
        <div>
          <span>{t.accuracy}</span>
          <strong>{displayValue(`${summary.accuracy}%`)}</strong>
        </div>
        <div>
          <span>{t.bestScore}</span>
          <strong>{displayValue(summary.bestScore)}</strong>
        </div>
      </div>

      <div className="challenge-level-progress">
        {LEVELS.map(level => {
          const levelProgress = summary.byDifficulty[level]
          const isUpcoming = levelProgress.total === 0
          const levelTitle = t.difficulty[level]?.title ?? level
          return (
            <div className="challenge-level-progress-row" key={level}>
              <span className="challenge-capitalize">{levelTitle}</span>
              <div
                className="challenge-progress-track"
                role="progressbar"
                aria-label={t.challengesCompletedAria(levelTitle)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={levelProgress.percentage}
              >
                <span style={{ width: `${levelProgress.percentage}%` }} />
              </div>
              <strong>
                {isUpcoming
                  ? t.status.upcoming
                  : displayValue(`${levelProgress.percentage}%`)}
              </strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}
