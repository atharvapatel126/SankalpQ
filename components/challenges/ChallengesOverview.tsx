'use client'

import { CheckCircle2, Target, XCircle } from 'lucide-react'
import { useChallengeProgress } from '@/hooks/useChallengeProgress'
import { getChallenge } from '@/lib/challenges/challenge-data'
import ChallengeGrid from './ChallengeGrid'
import ChallengeProgress from './ChallengeProgress'

function formatRecentTime(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function ChallengesOverview() {
  const { progress, summary, isReady } = useChallengeProgress()

  return (
    <div className="challenges-page">
      <header className="challenge-overview-header">
        <div className="challenge-overview-icon" aria-hidden="true">
          <Target size={22} />
        </div>
        <div>
          <h1>Quantum Challenges</h1>
          <p>Apply each concept by building, repairing, and reasoning about circuits.</p>
        </div>
      </header>

      <ChallengeProgress summary={summary} isReady={isReady} />
      <ChallengeGrid progress={progress} />

      {isReady && progress.recentAttempts.length > 0 && (
        <section className="challenge-recent" aria-labelledby="challenge-recent-title">
          <div className="challenge-recent-heading">
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">History</span>
            <h2 id="challenge-recent-title">Recent challenges</h2>
          </div>
          <div className="challenge-recent-list">
            {progress.recentAttempts.slice(0, 5).map(attempt => {
              const challenge = getChallenge(attempt.challengeId)
              const StatusIcon = attempt.correct ? CheckCircle2 : XCircle
              return (
                <div className="challenge-recent-row" key={attempt.id}>
                  <StatusIcon
                    size={16}
                    className={attempt.correct ? 'is-correct' : 'is-incorrect'}
                    aria-hidden="true"
                  />
                  <strong>{challenge?.title ?? 'Challenge attempt'}</strong>
                  <span>{attempt.correct ? `${attempt.score} XP` : 'Retry needed'}</span>
                  <time dateTime={attempt.submittedAt}>
                    {formatRecentTime(attempt.submittedAt)}
                  </time>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
