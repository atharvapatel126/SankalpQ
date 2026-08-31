// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Starter / Example Circuits
// Pre-built Universal Circuit JSON models for common quantum circuits
// ─────────────────────────────────────────────────────────────────────────────

import type { QuantumCircuit } from './types'

export const STARTER_CIRCUITS: QuantumCircuit[] = [
  // ── 1. Bell State ─────────────────────────────────────────────────────────
  {
    id: 'starter-bell-state',
    name: 'Bell State',
    qubits: 2,
    classicalBits: 2,
    operations: [
      { id: 'bs-h0', gate: 'H', targets: [0], moment: 0 },
      { id: 'bs-cnot', gate: 'CNOT', controls: [0], targets: [1], moment: 1 },
      { id: 'bs-m0', gate: 'MEASURE', targets: [0], classicalBit: 0, moment: 2 },
      { id: 'bs-m1', gate: 'MEASURE', targets: [1], classicalBit: 1, moment: 2 },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // ── 2. Single Qubit Superposition ─────────────────────────────────────────
  {
    id: 'starter-superposition',
    name: 'Superposition',
    qubits: 1,
    classicalBits: 1,
    operations: [
      { id: 'sp-h0', gate: 'H', targets: [0], moment: 0 },
      { id: 'sp-m0', gate: 'MEASURE', targets: [0], classicalBit: 0, moment: 1 },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // ── 3. Quantum NOT (X gate) ───────────────────────────────────────────────
  {
    id: 'starter-not',
    name: 'Quantum NOT',
    qubits: 1,
    classicalBits: 1,
    operations: [
      { id: 'not-x0', gate: 'X', targets: [0], moment: 0 },
      { id: 'not-m0', gate: 'MEASURE', targets: [0], classicalBit: 0, moment: 1 },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // ── 4. GHZ State (3-qubit entanglement) ───────────────────────────────────
  {
    id: 'starter-ghz',
    name: 'GHZ State',
    qubits: 3,
    classicalBits: 3,
    operations: [
      { id: 'ghz-h0', gate: 'H', targets: [0], moment: 0 },
      { id: 'ghz-cx01', gate: 'CNOT', controls: [0], targets: [1], moment: 1 },
      { id: 'ghz-cx12', gate: 'CNOT', controls: [1], targets: [2], moment: 2 },
      { id: 'ghz-m0', gate: 'MEASURE', targets: [0], classicalBit: 0, moment: 3 },
      { id: 'ghz-m1', gate: 'MEASURE', targets: [1], classicalBit: 1, moment: 3 },
      { id: 'ghz-m2', gate: 'MEASURE', targets: [2], classicalBit: 2, moment: 3 },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // ── 5. Phase Kickback ─────────────────────────────────────────────────────
  {
    id: 'starter-phase-kickback',
    name: 'Phase Kickback',
    qubits: 2,
    classicalBits: 2,
    operations: [
      { id: 'pk-h0', gate: 'H', targets: [0], moment: 0 },
      { id: 'pk-x1', gate: 'X', targets: [1], moment: 0 },
      { id: 'pk-h1', gate: 'H', targets: [1], moment: 1 },
      { id: 'pk-cx', gate: 'CNOT', controls: [0], targets: [1], moment: 2 },
      { id: 'pk-h0b', gate: 'H', targets: [0], moment: 3 },
      { id: 'pk-m0', gate: 'MEASURE', targets: [0], classicalBit: 0, moment: 4 },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

export const STARTER_CIRCUIT_MAP: Record<string, QuantumCircuit> = Object.fromEntries(
  STARTER_CIRCUITS.map(c => [c.id, c])
)
