import { AlertCircle, AlertTriangle, Check, Circle, LoaderCircle } from 'lucide-react'
import type { SimulationPhase } from '@/lib/quantum/simulation-service'

interface ExecutionStatusProps {
  phase: SimulationPhase
  message: string
  errors: string[]
  warnings: string[]
}

const STEPS: Array<{ phase: SimulationPhase; label: string }> = [
  { phase: 'validating', label: 'Validate' },
  { phase: 'running', label: 'Run' },
  { phase: 'processing', label: 'Process' },
  { phase: 'completed', label: 'Complete' },
]

function stepState(stepIndex: number, phase: SimulationPhase): 'pending' | 'active' | 'complete' {
  if (phase === 'completed') return 'complete'
  if (phase === 'idle' || phase === 'failed') return 'pending'
  const currentIndex = STEPS.findIndex(step => step.phase === phase)
  if (stepIndex < currentIndex) return 'complete'
  if (stepIndex === currentIndex) return 'active'
  return 'pending'
}

export default function ExecutionStatus({
  phase,
  message,
  errors,
  warnings,
}: ExecutionStatusProps) {
  return (
    <section className="simulator-status" aria-labelledby="execution-status-title">
      <div className="simulator-status-heading">
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">Execution status</span>
        <strong id="execution-status-title" role="status" aria-live="polite">
          {phase === 'failed' && <AlertCircle size={15} aria-hidden="true" />}
          {phase !== 'failed' && phase !== 'idle' && phase !== 'completed' && (
            <LoaderCircle className="simulator-status-spinner" size={15} aria-hidden="true" />
          )}
          {phase === 'completed' && <Check size={15} aria-hidden="true" />}
          {message}
        </strong>
      </div>

      <ol className="simulator-status-steps" aria-label="Simulation progress">
        {STEPS.map((step, index) => {
          const state = stepState(index, phase)
          return (
            <li key={step.phase} data-state={state}>
              <span className="simulator-step-marker" aria-hidden="true">
                {state === 'complete' ? <Check size={11} /> : <Circle size={9} />}
              </span>
              <span>{step.label}</span>
            </li>
          )
        })}
      </ol>

      {errors.length > 0 && (
        <div className="simulator-message simulator-message-error" role="alert">
          <AlertCircle size={15} aria-hidden="true" />
          <div>
            {errors.map(error => <p key={error}>{error}</p>)}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="simulator-message simulator-message-warning" role="note">
          <AlertTriangle size={15} aria-hidden="true" />
          <div>
            {warnings.map(warning => <p key={warning}>{warning}</p>)}
          </div>
        </div>
      )}
    </section>
  )
}
