// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Quantum Types
// Universal Circuit JSON model — NOT tied to any backend (Qiskit / Cirq / etc.)
// ─────────────────────────────────────────────────────────────────────────────

// ── Gate identifiers ──────────────────────────────────────────────────────────
export type SingleQubitGateId =
  | 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T'
  | 'RX' | 'RY' | 'RZ'
  | 'MEASURE'

export type MultiQubitGateId = 'CNOT' | 'CZ' | 'SWAP'

export type GateId = SingleQubitGateId | MultiQubitGateId

// ── Gate metadata (for the palette) ──────────────────────────────────────────
export interface GateMeta {
  id: GateId
  label: string
  symbol: string
  description: string
  color: string       // CSS var or hex — used for gate chip color
  textColor: string
  isParameterized?: boolean
  paramName?: string  // e.g. 'θ' for rotation gates
  defaultParam?: number
  isMultiQubit?: boolean
  isMeasure?: boolean
}

// ── A single operation placed in the circuit ──────────────────────────────────
export interface CircuitOperation {
  id: string
  gate: GateId
  targets: number[]          // qubit indices (zero-based)
  controls?: number[]        // for CNOT, CZ
  moment: number             // column index in the circuit grid
  params?: { angle?: number } // for RX/RY/RZ
  classicalBit?: number      // for MEASURE — which classical bit to write
}

// ── The full circuit ──────────────────────────────────────────────────────────
export interface QuantumCircuit {
  id: string
  name: string
  qubits: number
  classicalBits: number
  operations: CircuitOperation[]
  createdAt?: string
  updatedAt?: string
}

// ── Simulation inputs/outputs ─────────────────────────────────────────────────
export interface SimulationConfig {
  shots: number
  backend: SimulationBackend
}

export type SimulationBackend = 'mock' | 'qiskit-aer' | 'pennylane' | 'cirq'

export interface SimulationResult {
  counts: Record<string, number>
  probabilities: Record<string, number>
  shots: number
  backend: SimulationBackend
  isMock: boolean
  executionTimeMs: number
  stateVector?: Array<{ label: string; amplitude: string; probability: number }>
}

// ── Circuit Builder UI state ───────────────────────────────────────────────────
export type PlacementMode =
  | { type: 'idle' }
  | { type: 'single'; gateId: GateId }
  | { type: 'multi-control'; gateId: GateId; controlQubit: number; controlMoment: number }

export interface CircuitHistory {
  past: QuantumCircuit[]
  future: QuantumCircuit[]
}

// ── Challenge / validation types (used later) ─────────────────────────────────
export interface CircuitValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}
