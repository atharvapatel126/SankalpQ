'use client'

// ─────────────────────────────────────────────────────────────────────────────
// CircuitToolbar — Top toolbar of the Circuit Builder
// Circuit name, qubit controls, undo/redo, starter circuits, run, save
// ─────────────────────────────────────────────────────────────────────────────

import {
  Play,
  RotateCcw,
  RotateCw,
  Plus,
  Minus,
  Trash2,
  Save,
  ChevronDown,
  FlaskConical,
} from 'lucide-react'
import { useState } from 'react'
import type { QuantumCircuit, SimulationConfig } from '@/lib/quantum/types'
import { STARTER_CIRCUITS } from '@/lib/quantum/starter-circuits'

interface CircuitToolbarProps {
  circuit: QuantumCircuit
  isRunning: boolean
  canUndo: boolean
  canRedo: boolean
  simulationConfig: SimulationConfig
  onSetName: (name: string) => void
  onAddQubit: () => void
  onRemoveQubit: () => void
  onClear: () => void
  onUndo: () => void
  onRedo: () => void
  onRun: () => void
  onSave: () => void
  onOpenSimulator?: () => void
  onLoadStarter: (id: string) => void
  onShotsChange: (shots: number) => void
}

const SHOT_OPTIONS = [128, 256, 512, 1024, 2048, 4096]

export default function CircuitToolbar({
  circuit,
  isRunning,
  canUndo,
  canRedo,
  simulationConfig,
  onSetName,
  onAddQubit,
  onRemoveQubit,
  onClear,
  onUndo,
  onRedo,
  onRun,
  onSave,
  onOpenSimulator,
  onLoadStarter,
  onShotsChange,
}: CircuitToolbarProps) {
  const [nameEditing, setNameEditing] = useState(false)
  const [nameValue, setNameValue] = useState(circuit.name)
  const [showExamples, setShowExamples] = useState(false)

  function submitName() {
    if (nameValue.trim()) onSetName(nameValue.trim())
    setNameEditing(false)
  }

  return (
    <div className="circuit-toolbar" role="toolbar" aria-label="Circuit toolbar">
      {/* Left — circuit name + qubit controls */}
      <div className="toolbar-left">
        {nameEditing ? (
          <input
            autoFocus
            type="text"
            className="circuit-name-input form-input"
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
            onBlur={submitName}
            onKeyDown={e => {
              if (e.key === 'Enter') submitName()
              if (e.key === 'Escape') { setNameEditing(false); setNameValue(circuit.name) }
            }}
            aria-label="Circuit name"
            maxLength={48}
          />
        ) : (
          <button
            type="button"
            className="circuit-name-btn"
            onClick={() => { setNameEditing(true); setNameValue(circuit.name) }}
            title="Click to rename"
            aria-label={`Circuit name: ${circuit.name}. Click to rename.`}
          >
            {circuit.name}
          </button>
        )}

        <div className="toolbar-qubit-controls">
          <button
            type="button"
            className="toolbar-icon-btn"
            onClick={onRemoveQubit}
            disabled={circuit.qubits <= 1}
            title="Remove qubit"
            aria-label="Remove qubit"
          >
            <Minus size={14} />
          </button>
          <span className="toolbar-qubit-count" aria-live="polite">
            {circuit.qubits} qubit{circuit.qubits !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            className="toolbar-icon-btn"
            onClick={onAddQubit}
            disabled={circuit.qubits >= 8}
            title="Add qubit"
            aria-label="Add qubit"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Center — history + clear */}
      <div className="toolbar-center">
        <button
          type="button"
          className="toolbar-icon-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <RotateCcw size={14} />
        </button>
        <button
          type="button"
          className="toolbar-icon-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        >
          <RotateCw size={14} />
        </button>
        <button
          type="button"
          className="toolbar-icon-btn toolbar-icon-btn-danger"
          onClick={onClear}
          title="Clear all gates"
          aria-label="Clear circuit"
        >
          <Trash2 size={14} />
          <span>Clear</span>
        </button>

        {/* Example circuits dropdown */}
        <div className="toolbar-dropdown-wrap">
          <button
            type="button"
            className="toolbar-examples-btn"
            onClick={() => setShowExamples(v => !v)}
            aria-expanded={showExamples}
            aria-haspopup="listbox"
          >
            Examples
            <ChevronDown size={12} />
          </button>
          {showExamples && (
            <div className="toolbar-dropdown" role="listbox" aria-label="Starter circuits">
              {STARTER_CIRCUITS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="toolbar-dropdown-item"
                  onClick={() => {
                    onLoadStarter(c.id)
                    setShowExamples(false)
                  }}
                >
                  <span>{c.name}</span>
                  <span className="toolbar-dropdown-meta">{c.qubits}q</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right — shots + run + save */}
      <div className="toolbar-right">
        {/* Shots selector */}
        <div className="toolbar-shots-wrap">
          <FlaskConical size={12} aria-hidden="true" />
          <select
            className="toolbar-shots-select"
            value={simulationConfig.shots}
            onChange={e => onShotsChange(Number(e.target.value))}
            aria-label="Number of shots"
          >
            {SHOT_OPTIONS.map(s => (
              <option key={s} value={s}>
                {s.toLocaleString()} shots
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn-primary toolbar-run-btn"
          onClick={onRun}
          disabled={isRunning}
          aria-label={isRunning ? 'Running simulation...' : 'Run simulation'}
        >
          {isRunning ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Running…
            </>
          ) : (
            <>
              <Play size={14} aria-hidden="true" />
              Run
            </>
          )}
        </button>

        {onOpenSimulator && (
          <button
            type="button"
            className="btn-outline toolbar-simulator-btn"
            onClick={onOpenSimulator}
            title="Review this circuit in the Simulator"
          >
            <FlaskConical size={14} aria-hidden="true" />
            Simulator
          </button>
        )}

        <button
          type="button"
          className="btn-outline toolbar-save-btn"
          onClick={onSave}
          aria-label="Save circuit"
          title="Save circuit"
        >
          <Save size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
