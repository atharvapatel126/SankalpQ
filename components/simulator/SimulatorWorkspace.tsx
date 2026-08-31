'use client'

import { FlaskConical, ShieldCheck } from 'lucide-react'
import { useSimulation } from '@/hooks/useSimulation'
import BackendSelector from './BackendSelector'
import CircuitPreview from './CircuitPreview'
import CircuitSourceSelector from './CircuitSourceSelector'
import ExecutionStatus from './ExecutionStatus'
import RunSimulationButton from './RunSimulationButton'
import SimulationResults from './SimulationResults'
import SimulationSettings from './SimulationSettings'

export default function SimulatorWorkspace() {
  const simulation = useSimulation()

  return (
    <div className="simulator-page">
      <header className="simulator-page-header">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Quantum execution</span>
          <h1>Quantum Simulator</h1>
          <p>Run a circuit, inspect its measurement distribution, and connect the result to the underlying quantum state.</p>
        </div>
        <div className="simulator-backend-badge" title="Runs entirely in this browser">
          <ShieldCheck size={15} aria-hidden="true" />
          <span>
            <strong>Local backend ready</strong>
            Educational mock
          </span>
        </div>
      </header>

      <div className="simulator-workspace">
        <CircuitPreview circuit={simulation.circuit} />

        <aside className="simulator-panel simulator-config-panel" aria-labelledby="simulation-config-title">
          <div className="simulator-panel-header">
            <div>
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">Configure</span>
              <h2 id="simulation-config-title">Simulation setup</h2>
            </div>
            <FlaskConical size={18} aria-hidden="true" />
          </div>

          <CircuitSourceSelector
            sources={simulation.circuitSources}
            selectedKey={simulation.selectedSourceKey}
            onChange={simulation.selectCircuitSource}
            disabled={simulation.isBusy}
          />
          <BackendSelector
            selectedId={simulation.backendId}
            onChange={simulation.setBackendId}
            disabled={simulation.isBusy}
          />
          <SimulationSettings
            shots={simulation.shots}
            onChange={simulation.setShots}
            disabled={simulation.isBusy}
          />
          <RunSimulationButton
            isRunning={simulation.isBusy}
            onRun={() => void simulation.runSimulation()}
          />
        </aside>
      </div>

      <ExecutionStatus
        phase={simulation.phase}
        message={simulation.phaseMessage}
        errors={simulation.errors}
        warnings={simulation.warnings}
      />

      {simulation.result && (
        <SimulationResults circuit={simulation.circuit} result={simulation.result} />
      )}
    </div>
  )
}
