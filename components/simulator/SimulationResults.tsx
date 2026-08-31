import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { buildEducationalExplanation, type NormalizedSimulationResult } from '@/lib/quantum/simulation-service'
import type { QuantumCircuit } from '@/lib/quantum/types'
import BlochSphere from './BlochSphere'
import CircuitSummary from './CircuitSummary'
import ExecutionSummary from './ExecutionSummary'
import MeasurementTable from './MeasurementTable'
import ProbabilityChart from './ProbabilityChart'
import SimulationExplanation from './SimulationExplanation'
import StateVectorDisplay from './StateVectorDisplay'

interface SimulationResultsProps {
  circuit: QuantumCircuit
  result: NormalizedSimulationResult
}

export default function SimulationResults({ circuit, result }: SimulationResultsProps) {
  const explanation = buildEducationalExplanation(circuit, result)

  return (
    <section className="simulator-results" aria-labelledby="simulation-results-title">
      <div className="simulator-results-header">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Completed</span>
          <h2 id="simulation-results-title">Simulation results</h2>
        </div>
        <span className="simulator-result-source">
          <CheckCircle2 size={14} aria-hidden="true" />
          {result.sourceLabel}
        </span>
      </div>

      <div className="simulator-local-notice" role="note">
        <AlertTriangle size={15} aria-hidden="true" />
        <span>
          These results were computed locally for learning. They are not Qiskit Aer or quantum hardware results.
        </span>
      </div>

      <div className="simulator-results-primary">
        <ProbabilityChart result={result} />
        <MeasurementTable result={result} />
      </div>

      <div className="simulator-results-summary">
        <ExecutionSummary result={result} />
        <CircuitSummary circuit={circuit} />
      </div>

      <div className={`simulator-results-state${result.blochVector ? ' has-bloch' : ''}`}>
        <StateVectorDisplay result={result} />
        {result.blochVector && <BlochSphere vector={result.blochVector} />}
      </div>

      <SimulationExplanation explanation={explanation} />
    </section>
  )
}
