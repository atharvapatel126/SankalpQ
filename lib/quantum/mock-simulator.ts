// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Mock Quantum Simulator
// Rule-based simulation for frontend-only demonstration.
// CLEARLY LABELED as mock — never passed off as real backend results.
// Architecture mirrors the real QuantumBackendAdapter interface.
// ─────────────────────────────────────────────────────────────────────────────

import type { QuantumCircuit, SimulationResult, SimulationConfig } from './types'

// ── Pattern detection helpers ────────────────────────────────────────────────

function hasGate(circuit: QuantumCircuit, gateId: string): boolean {
  return circuit.operations.some(op => op.gate === gateId)
}

function countGate(circuit: QuantumCircuit, gateId: string): number {
  return circuit.operations.filter(op => op.gate === gateId).length
}

function hasCNOT(circuit: QuantumCircuit): boolean {
  return hasGate(circuit, 'CNOT')
}

function hasHadamard(circuit: QuantumCircuit): boolean {
  return hasGate(circuit, 'H')
}

/** Detects Bell State: H on q0 + CNOT(q0→q1) */
function isBellState(circuit: QuantumCircuit): boolean {
  if (circuit.qubits < 2) return false
  const h = circuit.operations.find(op => op.gate === 'H' && op.targets[0] === 0)
  const cnot = circuit.operations.find(
    op => op.gate === 'CNOT' && op.controls?.[0] === 0 && op.targets[0] === 1
  )
  return !!(h && cnot)
}

/** Detects GHZ State: H q0, CNOT(0→1), CNOT(1→2) */
function isGHZState(circuit: QuantumCircuit): boolean {
  if (circuit.qubits < 3) return false
  const h0 = circuit.operations.find(op => op.gate === 'H' && op.targets[0] === 0)
  const cx01 = circuit.operations.find(
    op => op.gate === 'CNOT' && op.controls?.[0] === 0 && op.targets[0] === 1
  )
  const cx12 = circuit.operations.find(
    op => op.gate === 'CNOT' && op.controls?.[0] === 1 && op.targets[0] === 2
  )
  return !!(h0 && cx01 && cx12)
}

// ── Noise-free probability sampling ─────────────────────────────────────────

function sampleCounts(
  probabilities: Record<string, number>,
  shots: number
): Record<string, number> {
  const counts: Record<string, number> = {}
  let remaining = shots

  const entries = Object.entries(probabilities)
  for (let i = 0; i < entries.length - 1; i++) {
    const [key, prob] = entries[i]
    // Add small realistic noise (±2%)
    const noise = (Math.random() - 0.5) * 0.04
    const count = Math.max(0, Math.round((prob + noise) * shots))
    counts[key] = Math.min(count, remaining)
    remaining -= counts[key]
  }
  // Last state gets remainder
  const lastKey = entries[entries.length - 1][0]
  counts[lastKey] = Math.max(0, remaining)
  return counts
}

// ── Main simulation function ─────────────────────────────────────────────────

export async function runMockSimulation(
  circuit: QuantumCircuit,
  config: SimulationConfig
): Promise<SimulationResult> {
  const start = Date.now()

  // Artificial delay for realism
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600))

  const { shots } = config
  const qubits = circuit.qubits

  let idealProbabilities: Record<string, number> = {}
  let stateVector: SimulationResult['stateVector']

  // ── Pattern matching ───────────────────────────────────────────────────────

  if (circuit.operations.length === 0) {
    // Empty circuit — everything stays in |0...0⟩
    const label = '0'.repeat(qubits)
    idealProbabilities = { [label]: 1.0 }

  } else if (isGHZState(circuit)) {
    // GHZ: |000⟩ + |111⟩ equally
    idealProbabilities = { '000': 0.5, '111': 0.5 }
    stateVector = [
      { label: '|000⟩', amplitude: '1/√2', probability: 0.5 },
      { label: '|111⟩', amplitude: '1/√2', probability: 0.5 },
    ]

  } else if (isBellState(circuit)) {
    // Bell state Φ+: (|00⟩ + |11⟩)/√2
    idealProbabilities = { '00': 0.5, '11': 0.5 }
    stateVector = [
      { label: '|00⟩', amplitude: '1/√2', probability: 0.5 },
      { label: '|11⟩', amplitude: '1/√2', probability: 0.5 },
    ]

  } else if (hasHadamard(circuit) && !hasCNOT(circuit)) {
    // Pure superposition on H-gates
    const hCount = countGate(circuit, 'H')
    const states = Math.pow(2, Math.min(hCount, qubits))
    const prob = 1 / states
    for (let i = 0; i < states; i++) {
      const label = i.toString(2).padStart(qubits, '0')
      idealProbabilities[label] = prob
    }

  } else if (hasGate(circuit, 'X') && !hasHadamard(circuit) && !hasCNOT(circuit)) {
    // X gates flip qubits deterministically
    const state = new Array(qubits).fill(0)
    circuit.operations.forEach(op => {
      if (op.gate === 'X') {
        op.targets.forEach(t => { state[t] = 1 - state[t] })
      }
    })
    const label = state.join('')
    idealProbabilities = { [label]: 1.0 }

  } else if (hasCNOT(circuit) && !hasHadamard(circuit)) {
    // CNOT without superposition — classical behavior
    const label = '0'.repeat(qubits)
    idealProbabilities = { [label]: 1.0 }

  } else {
    // Generic: uniform distribution over all 2^n states
    const numStates = Math.pow(2, qubits)
    const prob = 1 / numStates
    for (let i = 0; i < numStates; i++) {
      const label = i.toString(2).padStart(qubits, '0')
      idealProbabilities[label] = prob
    }
  }

  // ── Sample with noise ──────────────────────────────────────────────────────
  const counts = sampleCounts(idealProbabilities, shots)

  // ── Compute actual probabilities from counts ───────────────────────────────
  const probabilities: Record<string, number> = {}
  for (const [state, count] of Object.entries(counts)) {
    if (count > 0) probabilities[state] = parseFloat((count / shots).toFixed(4))
  }

  return {
    counts,
    probabilities,
    shots,
    backend: 'mock',
    isMock: true,
    executionTimeMs: Date.now() - start,
    stateVector,
  }
}
