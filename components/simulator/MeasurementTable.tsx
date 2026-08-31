import type { NormalizedSimulationResult } from '@/lib/quantum/simulation-service'

interface MeasurementTableProps {
  result: NormalizedSimulationResult
}

export default function MeasurementTable({ result }: MeasurementTableProps) {
  const rows = Object.entries(result.counts)
    .sort(([, left], [, right]) => right - left)

  return (
    <section className="simulator-result-section" aria-labelledby="measurement-table-title">
      <div className="simulator-section-heading">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Counts</span>
          <h3 id="measurement-table-title">Measurement results</h3>
        </div>
      </div>
      <div className="simulator-table-scroll">
        <table className="simulator-measurement-table">
          <thead>
            <tr>
              <th scope="col">Outcome</th>
              <th scope="col">Counts</th>
              <th scope="col">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([state, count]) => (
              <tr key={state}>
                <td><code>|{state}⟩</code></td>
                <td>{count.toLocaleString()}</td>
                <td>{((count / result.shots) * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
