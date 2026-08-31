'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import CircuitGrid from '@/components/circuit/CircuitGrid'
import { getCircuitWidth } from '@/lib/quantum/circuit-utils'
import { setCurrentCircuit } from '@/lib/quantum/circuit-storage'
import type { QuantumCircuit } from '@/lib/quantum/types'

interface CircuitPreviewProps {
  circuit: QuantumCircuit
}

export default function CircuitPreview({ circuit }: CircuitPreviewProps) {
  return (
    <section className="simulator-panel simulator-preview-panel" aria-labelledby="circuit-preview-title">
      <div className="simulator-panel-header">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Circuit</span>
          <h2 id="circuit-preview-title">{circuit.name}</h2>
        </div>
        <Link
          href="/circuit-builder"
          className="btn-outline simulator-edit-link"
          onClick={() => setCurrentCircuit(circuit)}
        >
          <ExternalLink size={14} aria-hidden="true" />
          Edit in Builder
        </Link>
      </div>

      <div
        className="simulator-circuit-figure"
        role="img"
        aria-label={`${circuit.name}: ${circuit.qubits} qubits and ${circuit.operations.length} operations`}
      >
        <div className="simulator-circuit-canvas" aria-hidden="true">
          <CircuitGrid
            circuit={circuit}
            circuitWidth={getCircuitWidth(circuit)}
            placementMode={{ type: 'idle' }}
            selectedOpId={null}
            readOnly
          />
        </div>
      </div>

      <div className="simulator-circuit-meta" aria-label="Circuit summary">
        <span>{circuit.qubits} qubits</span>
        <span>{circuit.operations.filter(operation => operation.gate !== 'MEASURE').length} gates</span>
        <span>{circuit.operations.filter(operation => operation.gate === 'MEASURE').length} measurements</span>
      </div>
    </section>
  )
}
