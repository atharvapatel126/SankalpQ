import AppShell from '@/components/AppShell'
import SimulatorWorkspace from '@/components/simulator/SimulatorWorkspace'
import '@/styles/simulator.css'

export default function SimulatorPage() {
  return (
    <AppShell>
      <SimulatorWorkspace />
    </AppShell>
  )
}
