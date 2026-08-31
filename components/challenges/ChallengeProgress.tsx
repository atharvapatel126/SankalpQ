import type { ChallengeProgressSummary } from '@/lib/challenges/types'

interface ChallengeProgressProps {
  summary: ChallengeProgressSummary
  isReady: boolean
}

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const

export default function ChallengeProgress({
  summary,
  isReady,
}: ChallengeProgressProps) {
  const displayValue = (value: string | number) => (isReady ? value : '--')

  return (
    <section className="challenge-progress" aria-labelledby="challenge-progress-title">
      <div className="challenge-progress-heading">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Your practice</span>
          <h2 id="challenge-progress-title">Challenge progress</h2>
        </div>
        <strong>{displayValue(`${summary.totalXp} XP`)}</strong>
      </div>

      <div className="challenge-progress-stats">
        <div>
          <span>Completed</span>
          <strong>
            {displayValue(
              `${summary.completedChallenges}/${summary.totalChallenges}`
            )}
          </strong>
        </div>
        <div>
          <span>Current level</span>
          <strong className="challenge-capitalize">
            {displayValue(summary.currentLevel)}
          </strong>
        </div>
        <div>
          <span>Accuracy</span>
          <strong>{displayValue(`${summary.accuracy}%`)}</strong>
        </div>
        <div>
          <span>Best score</span>
          <strong>{displayValue(summary.bestScore)}</strong>
        </div>
      </div>

      <div className="challenge-level-progress">
        {LEVELS.map(level => {
          const levelProgress = summary.byDifficulty[level]
          const isUpcoming = levelProgress.total === 0
          return (
            <div className="challenge-level-progress-row" key={level}>
              <span className="challenge-capitalize">{level}</span>
              <div
                className="challenge-progress-track"
                role="progressbar"
                aria-label={`${level} challenges completed`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={levelProgress.percentage}
              >
                <span style={{ width: `${levelProgress.percentage}%` }} />
              </div>
              <strong>
                {isUpcoming
                  ? 'Upcoming'
                  : displayValue(`${levelProgress.percentage}%`)}
              </strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}
