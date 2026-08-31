import { CircuitBoard, Gauge, Radio, Rows3 } from 'lucide-react'
import type { QuantumCircuit } from '@/lib/quantum/types'

interface CircuitSummaryProps {
  circuit: QuantumCircuit
}

export default function CircuitSummary({ circuit }: CircuitSummaryProps) {
  const gates = circuit.operations.filter(operation => operation.gate !== 'MEASURE')
  const measurements = circuit.operations.length - gates.length
  const depth = circuit.operations.length > 0
    ? Math.max(...circuit.operations.map(operation => operation.moment)) + 1
    : 0
  const metrics = [
    { label: 'Qubits', value: circuit.qubits, icon: CircuitBoard },
    { label: 'Gate operations', value: gates.length, icon: Rows3 },
    { label: 'Measurements', value: measurements, icon: Radio },
    { label: 'Circuit depth', value: depth, icon: Gauge },
  ]

  return (
    <section className="simulator-result-section" aria-labelledby="circuit-summary-title">
      <div className="simulator-section-heading">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Circuit</span>
          <h3 id="circuit-summary-title">Circuit summary</h3>
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
