'use client'

// ─────────────────────────────────────────────────────────────────────────────
// GatePalette — Left panel of the Circuit Builder
// Displays clickable gate buttons grouped by category
// ─────────────────────────────────────────────────────────────────────────────

import type { GateId, PlacementMode } from '@/lib/quantum/types'
import {
  SINGLE_QUBIT_GATES,
  PARAMETERIZED_GATES,
  MULTI_QUBIT_GATES,
  MEASURE_GATES,
  getGateMeta,
} from '@/lib/quantum/gate-meta'

interface GatePaletteProps {
  placementMode: PlacementMode
  onSelectGate: (gate: GateId | null) => void
}

interface GateBtnProps {
  gateId: GateId
  isActive: boolean
  onClick: () => void
}

function GateBtn({ gateId, isActive, onClick }: GateBtnProps) {
  const meta = getGateMeta(gateId)
  return (
    <button
      type="button"
      className={`gate-palette-btn${isActive ? ' is-active' : ''}`}
      onClick={onClick}
      title={meta.description}
      aria-pressed={isActive}
      aria-label={`Place ${meta.label} gate`}
    >
      <span
        className="gate-chip"
        style={{
          background: meta.color,
          color: meta.textColor,
        }}
      >
        {meta.symbol}
      </span>
      <span className="gate-palette-label">{meta.label}</span>
    </button>
  )
}

interface PaletteGroupProps {
  title: string
  gates: GateId[]
  activeGate: GateId | null
  onSelect: (gate: GateId | null) => void
}

function PaletteGroup({ title, gates, activeGate, onSelect }: PaletteGroupProps) {
  return (
    <div className="palette-group">
      <span className="palette-group-title">{title}</span>
      <div className="palette-group-gates">
        {gates.map(gateId => (
          <GateBtn
            key={gateId}
            gateId={gateId}
            isActive={activeGate === gateId}
            onClick={() => onSelect(activeGate === gateId ? null : gateId)}
          />
        ))}
      </div>
    </div>
  )
}

export default function GatePalette({ placementMode, onSelectGate }: GatePaletteProps) {
  const activeGate =
    placementMode.type === 'single'
      ? placementMode.gateId
      : placementMode.type === 'multi-control'
        ? placementMode.gateId
        : null

  return (
    <div className="gate-palette" role="toolbar" aria-label="Gate palette">
      <div className="palette-header">
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">Gate Palette</span>
      </div>

      {activeGate && placementMode.type === 'multi-control' ? (
        <div className="palette-hint palette-hint-multi">
          <span>Click target qubit</span>
          <button
            type="button"
            className="palette-hint-cancel"
            onClick={() => onSelectGate(null)}
          >
            Cancel
          </button>
        </div>
      ) : activeGate ? (
        <div className="palette-hint">
          <span>Click a cell to place</span>
          <button
            type="button"
            className="palette-hint-cancel"
            onClick={() => onSelectGate(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}

      <PaletteGroup
        title="Single Qubit"
        gates={SINGLE_QUBIT_GATES}
        activeGate={activeGate}
        onSelect={onSelectGate}
      />
      <PaletteGroup
        title="Parameterized"
        gates={PARAMETERIZED_GATES}
        activeGate={activeGate}
        onSelect={onSelectGate}
      />
      <PaletteGroup
        title="Multi-Qubit"
        gates={MULTI_QUBIT_GATES}
        activeGate={activeGate}
        onSelect={onSelectGate}
      />
      <PaletteGroup
        title="Measurement"
        gates={MEASURE_GATES}
        activeGate={activeGate}
        onSelect={onSelectGate}
      />

      <div className="palette-tip">
        <span>💡</span>
        <span>
          For multi-qubit gates, click the <strong>control</strong> qubit first, then the{' '}
          <strong>target</strong>.
        </span>
      </div>
    </div>
  )
}
