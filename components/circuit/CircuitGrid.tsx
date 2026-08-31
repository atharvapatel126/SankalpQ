'use client'

// ─────────────────────────────────────────────────────────────────────────────
// CircuitGrid — The main circuit canvas
// Renders qubit wires, gate columns, and handles click-to-place
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react'
import type {
  QuantumCircuit,
  CircuitOperation,
  PlacementMode,
} from '@/lib/quantum/types'
import { getOperationAt, getQubitRole } from '@/lib/quantum/circuit-utils'
import { getGateMeta } from '@/lib/quantum/gate-meta'

interface CircuitGridProps {
  circuit: QuantumCircuit
  circuitWidth: number
  placementMode: PlacementMode
  selectedOpId: string | null
  onCellClick: (qubit: number, moment: number) => void
  onSelectOp: (op: CircuitOperation | null) => void
}

// ── Gate chip rendered inside a cell ─────────────────────────────────────────

interface GateCellProps {
  op: CircuitOperation
  qubit: number
  isSelected: boolean
  onSelect: (op: CircuitOperation) => void
}

function GateCell({ op, qubit, isSelected, onSelect }: GateCellProps) {
  const meta = getGateMeta(op.gate)
  const role = getQubitRole(op, qubit)

  // CNOT/CZ: control dot vs. target X symbol
  if ((op.gate === 'CNOT' || op.gate === 'CZ') && role === 'control') {
    return (
      <button
        type="button"
        className={`gate-cell gate-cell-control${isSelected ? ' is-selected' : ''}`}
        onClick={() => onSelect(op)}
        aria-label={`${op.gate} control on qubit ${qubit}`}
        title={`${op.gate} — Control qubit`}
      >
        <span className="cnot-control-dot" />
      </button>
    )
  }

  if (op.gate === 'CNOT' && role === 'target') {
    return (
      <button
        type="button"
        className={`gate-cell gate-cell-target${isSelected ? ' is-selected' : ''}`}
        onClick={() => onSelect(op)}
        aria-label={`CNOT target on qubit ${qubit}`}
        title="CNOT — Target qubit"
      >
        <span className="cnot-target-symbol">⊕</span>
      </button>
    )
  }

  if (op.gate === 'SWAP' && role === 'target') {
    return (
      <button
        type="button"
        className={`gate-cell gate-cell-swap${isSelected ? ' is-selected' : ''}`}
        onClick={() => onSelect(op)}
        aria-label={`SWAP on qubit ${qubit}`}
      >
        <span>×</span>
      </button>
    )
  }

  if (op.gate === 'MEASURE') {
    return (
      <button
        type="button"
        className={`gate-cell gate-cell-measure${isSelected ? ' is-selected' : ''}`}
        onClick={() => onSelect(op)}
        aria-label={`Measure qubit ${qubit}`}
        title="Measure"
      >
        <MeasureSymbol />
      </button>
    )
  }

  // Standard single-qubit gate
  return (
    <button
      type="button"
      className={`gate-cell${isSelected ? ' is-selected' : ''}`}
      style={{ background: meta.color, color: meta.textColor }}
      onClick={() => onSelect(op)}
      aria-label={`${meta.label} on qubit ${qubit}`}
      title={meta.description}
    >
      <span className="gate-cell-symbol">
        {op.params?.angle !== undefined
          ? `${meta.symbol}(${(op.params.angle / Math.PI).toFixed(2)}π)`
          : meta.symbol}
      </span>
    </button>
  )
}

// Simple measurement meter SVG
function MeasureSymbol() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
      <path
        d="M2 14 Q11 2 20 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="11" y1="14" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="14" r="1.5" fill="currentColor" />
    </svg>
  )
}

// ── Vertical connector line between control and target ──────────────────────

interface ConnectorProps {
  fromQubit: number
  toQubit: number
  colIndex: number
}

function MultiQubitConnector({ fromQubit, toQubit }: ConnectorProps) {
  const top = Math.min(fromQubit, toQubit)
  const bottom = Math.max(fromQubit, toQubit)
  const span = bottom - top

  return (
    <div
      className="multi-qubit-connector"
      style={{
        top: `calc(${top} * var(--wire-row-height) + var(--wire-row-height) / 2)`,
        height: `calc(${span} * var(--wire-row-height))`,
      }}
      aria-hidden="true"
    />
  )
}

// ── Main grid ─────────────────────────────────────────────────────────────────

export default function CircuitGrid({
  circuit,
  circuitWidth,
  placementMode,
  selectedOpId,
  onCellClick,
  onSelectOp,
}: CircuitGridProps) {
  const moments = useMemo(
    () => Array.from({ length: circuitWidth }, (_, i) => i),
    [circuitWidth]
  )
  const qubitIndices = useMemo(
    () => Array.from({ length: circuit.qubits }, (_, i) => i),
    [circuit.qubits]
  )

  const isPlacing = placementMode.type !== 'idle'
  const isWaitingForTarget = placementMode.type === 'multi-control'

  return (
    <div
      className={`circuit-grid-wrapper${isPlacing ? ' placing-mode' : ''}`}
      role="grid"
      aria-label="Quantum circuit grid"
    >
      {/* Qubit labels */}
      <div className="circuit-qubit-labels" aria-hidden="true">
        {qubitIndices.map(q => (
          <div key={q} className="circuit-qubit-label">
            q{q}
          </div>
        ))}
      </div>

      {/* Grid area */}
      <div className="circuit-grid-area">
        {/* Horizontal wire lines */}
        {qubitIndices.map(q => (
          <div
            key={`wire-${q}`}
            className="circuit-wire-line"
            style={{ top: `calc(${q} * var(--wire-row-height) + var(--wire-row-height) / 2)` }}
            aria-hidden="true"
          />
        ))}

        {/* Multi-qubit connectors */}
        {circuit.operations
          .filter(op => op.controls && op.controls.length > 0)
          .map(op => {
            const controlQ = op.controls![0]
            const targetQ = op.targets[0]
            return (
              <MultiQubitConnector
                key={`conn-${op.id}`}
                fromQubit={controlQ}
                toQubit={targetQ}
                colIndex={op.moment}
              />
            )
          })}

        {/* Column cells */}
        {moments.map(moment => (
          <div key={moment} className="circuit-moment-col">
            <span className="circuit-moment-label" aria-hidden="true">
              {moment}
            </span>
            {qubitIndices.map(qubit => {
              const op = getOperationAt(circuit, qubit, moment)
              const isControlWaitCell =
                isWaitingForTarget &&
                placementMode.type === 'multi-control' &&
                placementMode.controlQubit === qubit &&
                placementMode.controlMoment === moment

              return (
                <div
                  key={`cell-${qubit}-${moment}`}
                  className={`circuit-cell${isPlacing && !op ? ' placeable' : ''}${isControlWaitCell ? ' control-wait' : ''}`}
                  role="gridcell"
                  aria-label={op ? `${op.gate} at qubit ${qubit}, moment ${moment}` : `Empty cell, qubit ${qubit}, moment ${moment}`}
                  onClick={() => {
                    if (op) {
                      onSelectOp(op)
                    } else {
                      onCellClick(qubit, moment)
                    }
                  }}
                >
                  {op ? (
                    <GateCell
                      op={op}
                      qubit={qubit}
                      isSelected={op.id === selectedOpId}
                      onSelect={onSelectOp}
                    />
                  ) : isControlWaitCell ? (
                    <div className="control-wait-dot" aria-hidden="true" />
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Classical bit lines */}
      <div className="circuit-classical-row" aria-label="Classical bits">
        {qubitIndices.map(q => (
          <div key={q} className="circuit-classical-bit">
            <span aria-hidden="true">c{q}</span>
            <div className="classical-wire" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}
