import AppShell from '@/components/AppShell'
import ChallengesOverview from '@/components/challenges/ChallengesOverview'
import '@/styles/challenges.css'

export default function ChallengesPage() {
  return (
    <AppShell>
      <ChallengesOverview />
    </AppShell>
  )
}
