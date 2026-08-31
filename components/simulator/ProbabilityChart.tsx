import type { NormalizedSimulationResult } from '@/lib/quantum/simulation-service'

interface ProbabilityChartProps {
  result: NormalizedSimulationResult
}

export default function ProbabilityChart({ result }: ProbabilityChartProps) {
  const outcomes = Object.entries(result.probabilities)
    .sort(([, left], [, right]) => right - left)

  return (
    <section className="simulator-result-section" aria-labelledby="probability-chart-title">
      <div className="simulator-section-heading">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Distribution</span>
          <h3 id="probability-chart-title">Measurement probabilities</h3>
        </div>
        <span className="simulator-measured-label">
          q{result.measuredQubits.join(', q')}
        </span>
      </div>

      <div className="simulator-probability-chart">
        {outcomes.map(([state, probability]) => {
          const percentage = probability * 100
          return (
            <div className="simulator-probability-row" key={state}>
              <code>|{state}⟩</code>
              <div
                className="simulator-probability-track"
                role="progressbar"
                aria-label={`Outcome ${state}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(percentage.toFixed(2))}
              >
                <span style={{ width: `${percentage}%` }} />
              </div>
              <strong>{percentage.toFixed(2)}%</strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}
