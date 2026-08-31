'use client'

// ─────────────────────────────────────────────────────────────────────────────
// CircuitResultsPreview — Bottom panel
// Shows simulation results: probability bars, counts, state vector
// Clearly labeled as Mock results when backend is not connected
// ─────────────────────────────────────────────────────────────────────────────

import { AlertCircle, X, FlaskConical, Clock } from 'lucide-react'
import type { SimulationResult } from '@/lib/quantum/types'

interface CircuitResultsPreviewProps {
  result: SimulationResult
  onClose: () => void
}

function ProbabilityBar({ state, probability, count }: {
  state: string
  probability: number
  count: number
}) {
  const pct = (probability * 100).toFixed(1)
  return (
    <div className="prob-bar-row">
      <span className="prob-bar-state" aria-label={`State ${state.split('').join(' ')}`}>
        |{state}⟩
      </span>
      <div className="prob-bar-track" role="progressbar" aria-valuenow={probability * 100} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="prob-bar-fill"
          style={{ width: `${probability * 100}%` }}
        />
      </div>
      <span className="prob-bar-pct">{pct}%</span>
      <span className="prob-bar-count">{count.toLocaleString()}</span>
    </div>
  )
}

export default function CircuitResultsPreview({
  result,
  onClose,
}: CircuitResultsPreviewProps) {
  const sortedStates = Object.entries(result.probabilities)
    .sort(([, a], [, b]) => b - a)

  return (
    <div className="results-panel" role="region" aria-label="Simulation results">
      {/* Header */}
      <div className="results-panel-header">
        <div className="results-panel-title">
          <FlaskConical size={14} aria-hidden="true" />
          <span>Simulation Results</span>
          {result.isMock && (
            <span className="results-mock-badge" title="Frontend mock results — not a real quantum backend">
              <AlertCircle size={11} aria-hidden="true" />
              Mock
            </span>
          )}
        </div>
        <div className="results-panel-meta">
          <span className="results-meta-item">
            <Clock size={11} aria-hidden="true" />
            {result.executionTimeMs}ms
          </span>
          <span className="results-meta-item">
            {result.shots.toLocaleString()} shots
          </span>
          <span className="results-meta-item results-backend-badge">
            {result.backend}
          </span>
        </div>
        <button
          type="button"
          className="results-close-btn"
          onClick={onClose}
          aria-label="Close results"
        >
          <X size={14} />
        </button>
      </div>

      {/* Results grid */}
      <div className="results-content">
        {/* Probability distribution */}
        <div className="results-section">
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Probability Distribution</span>
          <div className="prob-bars" aria-label="Measurement probability distribution">
            {sortedStates.map(([state, prob]) => (
              <ProbabilityBar
                key={state}
                state={state}
                probability={prob}
                count={result.counts[state] ?? 0}
              />
            ))}
          </div>
        </div>

        {/* State vector (if available) */}
        {result.stateVector && result.stateVector.length > 0 && (
          <div className="results-section">
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">State Vector</span>
            <div className="state-vector-display">
              <span className="state-vector-label">|ψ⟩ =</span>
              <span className="state-vector-expr">
                {result.stateVector.map((sv, i) => (
                  <span key={sv.label}>
                    {i > 0 && <span className="sv-plus"> + </span>}
                    <span className="sv-amplitude">{sv.amplitude}</span>
                    <span className="sv-ket">{sv.label}</span>
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}

        {/* Raw counts table */}
        <div className="results-section">
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Measurement Counts</span>
          <div className="counts-table" role="table" aria-label="Measurement counts">
            <div className="counts-table-header" role="row">
              <span role="columnheader">State</span>
              <span role="columnheader">Counts</span>
              <span role="columnheader">Frequency</span>
            </div>
            {sortedStates.map(([state, prob]) => (
              <div key={state} className="counts-table-row" role="row">
                <code role="cell">|{state}⟩</code>
                <span role="cell">{result.counts[state]?.toLocaleString() ?? 0}</span>
                <span role="cell">{(prob * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result.isMock && (
        <div className="results-mock-disclaimer" role="note">
          <AlertCircle size={12} aria-hidden="true" />
          <span>
            These are <strong>mock results</strong> generated by the frontend simulator.
            Connect to a Qiskit Aer backend via the Quantum API for real results.
          </span>
        </div>
      )}
    </div>
  )
}
