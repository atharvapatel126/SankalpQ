'use client'

import Link from 'next/link'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { useChallengeSession } from '@/hooks/useChallengeSession'
import type { ChallengeDefinition } from '@/lib/challenges/types'
import { useLanguage } from '@/components/LanguageProvider'
import ChallengeInstructions from './ChallengeInstructions'
import ChallengeResults from './ChallengeResults'
import ChoiceChallengeWorkspace from './ChoiceChallengeWorkspace'
import CircuitChallengeWorkspace from './CircuitChallengeWorkspace'
import HintPanel from './HintPanel'

interface ChallengeWorkspaceProps {
  challenge: ChallengeDefinition
}

export default function ChallengeWorkspace({ challenge }: ChallengeWorkspaceProps) {
  const { translations } = useLanguage()
  const t = translations.student.challenges
  const session = useChallengeSession(challenge)
  const localized = t.content[challenge.id]
  const title = localized?.title ?? challenge.title
  const availabilityNote = localized?.availabilityNote ?? (challenge.kind === 'upcoming' ? challenge.availabilityNote : '')

  const localizedHints = localized?.hints ?? challenge.hints
  const visibleHints = localizedHints.slice(0, session.hintsRevealed)

  if (challenge.kind === 'upcoming') {
    return (
      <div className="challenge-page">
        <Link className="challenge-back-link" href="/challenges">
          <ArrowLeft size={15} aria-hidden="true" />
          {t.allChallenges}
        </Link>
        <section className="challenge-upcoming-workspace">
          <LockKeyhole size={26} aria-hidden="true" />
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">{t.difficulty.advanced.title}</span>
          <h1>{title}</h1>
          <p>{availabilityNote}</p>
          <Link className="btn-outline" href="/challenges">
            {t.backToChallenges}
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="challenge-page">
      <Link className="challenge-back-link" href="/challenges">
        <ArrowLeft size={15} aria-hidden="true" />
        {t.allChallenges}
      </Link>

      <div className="challenge-brief-layout">
        <ChallengeInstructions challenge={challenge} />
        <HintPanel
          totalHints={challenge.hints.length}
          visibleHints={visibleHints}
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
          challengeId={challenge.id}
        />
      )}
    </div>
  )
}
