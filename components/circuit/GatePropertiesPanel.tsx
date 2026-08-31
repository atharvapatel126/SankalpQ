'use client'

// ─────────────────────────────────────────────────────────────────────────────
// GatePropertiesPanel — Right panel
// Shows details of the selected gate + allows editing params + deleting
// ─────────────────────────────────────────────────────────────────────────────

import { Trash2, X } from 'lucide-react'
import type { CircuitOperation } from '@/lib/quantum/types'
import { getGateMeta } from '@/lib/quantum/gate-meta'

interface GatePropertiesPanelProps {
  op: CircuitOperation | null
  onClose: () => void
  onDelete: (opId: string) => void
  onUpdateParam: (opId: string, angle: number) => void
}

export default function GatePropertiesPanel({
  op,
  onClose,
  onDelete,
  onUpdateParam,
}: GatePropertiesPanelProps) {
  if (!op) {
    return (
      <div className="properties-panel properties-panel-empty">
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">Properties</span>
        <p className="properties-empty-hint">Select a gate to inspect it.</p>
      </div>
    )
  }

  const meta = getGateMeta(op.gate)
  const hasParam = meta.isParameterized && op.params?.angle !== undefined

  const angleRad = op.params?.angle ?? meta.defaultParam ?? Math.PI / 2
  const angleDeg = parseFloat(((angleRad / Math.PI) * 180).toFixed(1))

  return (
    <div className="properties-panel" role="complementary" aria-label="Gate properties">
      <div className="properties-panel-header">
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">Properties</span>
        <button
          type="button"
          className="properties-close-btn"
          onClick={onClose}
          aria-label="Close properties panel"
        >
          <X size={14} />
        </button>
      </div>

      {/* Gate identity */}
      <div className="properties-gate-identity">
        <span
          className="gate-chip gate-chip-lg"
          style={{ background: meta.color, color: meta.textColor }}
          aria-hidden="true"
        >
          {meta.symbol}
        </span>
        <div>
          <strong className="properties-gate-name">{meta.label}</strong>
          <span className="properties-gate-id">ID: {op.gate}</span>
        </div>
      </div>

      <p className="properties-description">{meta.description}</p>

      {/* Info rows */}
      <div className="properties-info-list">
        <div className="properties-info-row">
          <span>Moment</span>
          <code>{op.moment}</code>
        </div>
        {op.controls && op.controls.length > 0 && (
          <div className="properties-info-row">
            <span>Control qubit</span>
            <code>q{op.controls[0]}</code>
          </div>
        )}
        <div className="properties-info-row">
          <span>Target qubit{op.targets.length > 1 ? 's' : ''}</span>
          <code>{op.targets.map(t => `q${t}`).join(', ')}</code>
        </div>
        {op.classicalBit !== undefined && (
          <div className="properties-info-row">
            <span>Classical bit</span>
            <code>c{op.classicalBit}</code>
          </div>
        )}
      </div>

      {/* Parameter editor */}
      {hasParam && (
        <div className="properties-param-section">
          <label htmlFor="gate-angle" className="form-label">
            Angle {meta.paramName} ({angleDeg}° = {(angleRad / Math.PI).toFixed(3)}π)
          </label>
          <input
            id="gate-angle"
            type="range"
            min={0}
            max={2 * Math.PI}
            step={0.01}
            value={angleRad}
            onChange={e => onUpdateParam(op.id, parseFloat(e.target.value))}
            className="properties-angle-slider"
            aria-valuemin={0}
            aria-valuemax={6.28}
            aria-valuenow={angleRad}
            aria-valuetext={`${angleDeg} degrees`}
          />
          <div className="properties-angle-presets">
            {[
              { label: 'π/8', value: Math.PI / 8 },
              { label: 'π/4', value: Math.PI / 4 },
              { label: 'π/2', value: Math.PI / 2 },
              { label: 'π', value: Math.PI },
            ].map(preset => (
              <button
                key={preset.label}
                type="button"
                className={`properties-preset-btn${Math.abs(angleRad - preset.value) < 0.01 ? ' is-active' : ''}`}
                onClick={() => onUpdateParam(op.id, preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delete button */}
      <button
        type="button"
        className="properties-delete-btn"
        onClick={() => onDelete(op.id)}
        aria-label={`Delete ${meta.label} gate`}
      >
        <Trash2 size={14} />
        Remove gate
      </button>
    </div>
  )
}
