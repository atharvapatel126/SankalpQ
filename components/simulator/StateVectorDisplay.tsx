import type { NormalizedSimulationResult } from '@/lib/quantum/simulation-service'

interface StateVectorDisplayProps {
  result: NormalizedSimulationResult
}

function amplitudeParts(amplitude: string, index: number): { separator: string; value: string } {
  if (index === 0) return { separator: '', value: amplitude }
  if (amplitude.startsWith('-')) return { separator: ' − ', value: amplitude.slice(1) }
  return { separator: ' + ', value: amplitude }
}

export default function StateVectorDisplay({ result }: StateVectorDisplayProps) {
  if (!result.stateVector || result.stateVector.length === 0) return null

  return (
    <section className="simulator-result-section" aria-labelledby="state-vector-title">
      <div className="simulator-section-heading">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Before measurement</span>
          <h3 id="state-vector-title">State vector</h3>
        </div>
      </div>
      <div className="simulator-state-vector" aria-label="Final quantum state before measurement">
        <span className="simulator-state-symbol">|ψ⟩ =</span>
        <span className="simulator-state-expression">
          {result.stateVector.map((entry, index) => {
            const parts = amplitudeParts(entry.amplitude, index)
            return (
              <span key={entry.label} title={`${(entry.probability * 100).toFixed(3)}% probability`}>
                <span className="simulator-state-separator">{parts.separator}</span>
                <span className="simulator-state-amplitude">{parts.value}</span>
                <strong>{entry.label}</strong>
              </span>
            )
          })}
        </span>
      </div>
      <p className="simulator-section-note">
        The state vector stores probability amplitudes. Squaring each amplitude&apos;s magnitude gives its basis-state probability.
      </p>
    </section>
  )
}
