'use client'

import Link from 'next/link'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { useChallengeSession } from '@/hooks/useChallengeSession'
import type { ChallengeDefinition } from '@/lib/challenges/types'
import ChallengeInstructions from './ChallengeInstructions'
import ChallengeResults from './ChallengeResults'
import ChoiceChallengeWorkspace from './ChoiceChallengeWorkspace'
import CircuitChallengeWorkspace from './CircuitChallengeWorkspace'
import HintPanel from './HintPanel'

interface ChallengeWorkspaceProps {
  challenge: ChallengeDefinition
}

export default function ChallengeWorkspace({ challenge }: ChallengeWorkspaceProps) {
  const session = useChallengeSession(challenge)

  if (challenge.kind === 'upcoming') {
    return (
      <div className="challenge-page">
        <Link className="challenge-back-link" href="/challenges">
          <ArrowLeft size={15} aria-hidden="true" />
          All challenges
        </Link>
        <section className="challenge-upcoming-workspace">
          <LockKeyhole size={26} aria-hidden="true" />
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Advanced</span>
          <h1>{challenge.title}</h1>
          <p>{challenge.availabilityNote}</p>
          <Link className="btn-outline" href="/challenges">
            Back to challenges
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="challenge-page">
      <Link className="challenge-back-link" href="/challenges">
        <ArrowLeft size={15} aria-hidden="true" />
        All challenges
      </Link>

      <div className="challenge-brief-layout">
        <ChallengeInstructions challenge={challenge} />
        <HintPanel
          totalHints={challenge.hints.length}
          visibleHints={session.visibleHints}
          disabled={session.result !== null}
          onReveal={session.revealHint}
        />
      </div>

      {challenge.kind === 'circuit' ? (
        <CircuitChallengeWorkspace
          key={challenge.id}
          challenge={challenge}
          session={session}
        />
      ) : (
        <ChoiceChallengeWorkspace
          key={challenge.id}
          challenge={challenge}
          session={session}
        />
      )}

      {session.result && (
        <ChallengeResults
          result={session.result}
          nextChallengeId={session.nextChallengeId}
          onRetry={session.retry}
        />
      )}
    </div>
  )
}
