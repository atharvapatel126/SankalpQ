import { Clock3, Layers3, Server, TestTubes } from 'lucide-react'
import type { NormalizedSimulationResult } from '@/lib/quantum/simulation-service'

interface ExecutionSummaryProps {
  result: NormalizedSimulationResult
}

export default function ExecutionSummary({ result }: ExecutionSummaryProps) {
  const metrics = [
    { label: 'Backend', value: result.backendLabel, icon: Server },
    { label: 'Shots', value: result.shots.toLocaleString(), icon: TestTubes },
    { label: 'Local compute', value: `${result.executionTimeMs} ms`, icon: Clock3 },
    { label: 'Outcomes', value: Object.keys(result.counts).length.toString(), icon: Layers3 },
  ]

  return (
    <section className="simulator-result-section" aria-labelledby="execution-summary-title">
      <div className="simulator-section-heading">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Execution</span>
          <h3 id="execution-summary-title">Execution summary</h3>
        </div>
      </div>
      <dl className="simulator-metric-grid">
        {metrics.map(metric => {
          const Icon = metric.icon
          return (
            <div key={metric.label}>
              <dt><Icon size={14} aria-hidden="true" />{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
