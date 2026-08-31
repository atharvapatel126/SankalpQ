'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from 'lucide-react'
import { formatProbabilityDistribution } from '@/lib/challenges/challenge-validator'
import type { ChallengeSessionResult } from '@/lib/challenges/types'

interface ChallengeResultsProps {
  result: ChallengeSessionResult
  nextChallengeId: string | null
  onRetry: () => void
}

function formatElapsedTime(milliseconds: number): string {
  const totalSeconds = Math.max(1, Math.round(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

export default function ChallengeResults({
  result,
  nextChallengeId,
  onRetry,
}: ChallengeResultsProps) {
  const StatusIcon = result.correct ? CheckCircle2 : XCircle

  return (
    <section
      className={`challenge-results ${result.correct ? 'is-correct' : 'is-incorrect'}`}
      aria-live="polite"
      aria-labelledby="challenge-result-title"
    >
      <div className="challenge-results-heading">
        <StatusIcon size={22} aria-hidden="true" />
        <div>
          <h2 id="challenge-result-title">
            {result.correct ? 'Challenge complete' : 'Not there yet'}
          </h2>
          <p>{result.feedback}</p>
        </div>
      </div>

      {result.actualProbabilities && (
        <div className="challenge-result-distribution">
          <span>Computed distribution</span>
          <code>{formatProbabilityDistribution(result.actualProbabilities)}</code>
        </div>
      )}

      <p className="challenge-result-explanation">{result.explanation}</p>

      <dl className="challenge-result-metrics">
        <div>
          <dt>Attempt</dt>
          <dd>{result.attemptNumber}</dd>
        </div>
        <div>
          <dt>Hints used</dt>
          <dd>{result.hintsUsed}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{formatElapsedTime(result.elapsedMs)}</dd>
        </div>
        <div>
          <dt>XP earned</dt>
          <dd>{result.score}</dd>
        </div>
      </dl>

      <div className="challenge-result-actions">
        {result.correct ? (
          <>
            {nextChallengeId && (
              <Link
                className="btn-primary"
                href={`/challenges/${nextChallengeId}`}
              >
                Next challenge
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            )}
            <Link className="btn-outline" href="/challenges">
              All challenges
            </Link>
          </>
        ) : (
          <button type="button" className="btn-primary" onClick={onRetry}>
            <RotateCcw size={15} aria-hidden="true" />
            Retry
          </button>
        )}
      </div>
    </section>
  )
}
