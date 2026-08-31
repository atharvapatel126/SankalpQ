import { notFound } from 'next/navigation'
import AppShell from '@/components/AppShell'
import ChallengeWorkspace from '@/components/challenges/ChallengeWorkspace'
import { CHALLENGES, getChallenge } from '@/lib/challenges/challenge-data'
import '@/styles/challenges.css'

interface ChallengePageProps {
  params: {
    challengeId: string
  }
}

export function generateStaticParams() {
  return CHALLENGES.map(challenge => ({ challengeId: challenge.id }))
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const challenge = getChallenge(params.challengeId)
  if (!challenge) notFound()

  return (
    <AppShell>
      <ChallengeWorkspace challenge={challenge} />
    </AppShell>
  )
}
