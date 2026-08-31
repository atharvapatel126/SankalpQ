// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Gate Metadata Registry
// All display info for every supported gate
// ─────────────────────────────────────────────────────────────────────────────

import type { GateId, GateMeta } from './types'

export const GATE_META: Record<GateId, GateMeta> = {
  H: {
    id: 'H',
    label: 'Hadamard',
    symbol: 'H',
    description: 'Creates superposition: |0⟩ → (|0⟩+|1⟩)/√2, |1⟩ → (|0⟩−|1⟩)/√2',
    color: 'var(--bg-circuit)',
    textColor: 'var(--text-circuit)',
  },
  X: {
    id: 'X',
    label: 'Pauli-X',
    symbol: 'X',
    description: 'Bit flip: |0⟩ → |1⟩, |1⟩ → |0⟩. Also called NOT gate.',
    color: 'var(--bg-course)',
    textColor: 'var(--text-course)',
  },
  Y: {
    id: 'Y',
    label: 'Pauli-Y',
    symbol: 'Y',
    description: 'Applies iX followed by Z. Combines bit and phase flip.',
    color: 'var(--bg-course)',
    textColor: 'var(--text-course)',
  },
  Z: {
    id: 'Z',
    label: 'Pauli-Z',
    symbol: 'Z',
    description: 'Phase flip: |0⟩ → |0⟩, |1⟩ → −|1⟩.',
    color: 'var(--bg-course)',
    textColor: 'var(--text-course)',
  },
  S: {
    id: 'S',
    label: 'S Gate (Phase)',
    symbol: 'S',
    description: 'Phase gate: applies a π/2 phase shift. S = √Z.',
    color: 'var(--bg-simulator)',
    textColor: 'var(--text-simulator)',
  },
  T: {
    id: 'T',
    label: 'T Gate (π/8)',
    symbol: 'T',
    description: 'T gate: applies a π/4 phase shift. T = Z^(1/4). Used in many quantum algorithms.',
    color: 'var(--bg-simulator)',
    textColor: 'var(--text-simulator)',
  },
  RX: {
    id: 'RX',
    label: 'Rotation X',
    symbol: 'Rₓ',
    description: 'Rotates the qubit state around the X-axis of the Bloch sphere by angle θ.',
    color: 'var(--bg-challenge)',
    textColor: 'var(--text-challenge)',
    isParameterized: true,
    paramName: 'θ',
    defaultParam: Math.PI / 2,
  },
  RY: {
    id: 'RY',
    label: 'Rotation Y',
    symbol: 'Rᵧ',
    description: 'Rotates the qubit state around the Y-axis of the Bloch sphere by angle θ.',
    color: 'var(--bg-challenge)',
    textColor: 'var(--text-challenge)',
    isParameterized: true,
    paramName: 'θ',
    defaultParam: Math.PI / 2,
  },
  RZ: {
    id: 'RZ',
    label: 'Rotation Z',
    symbol: 'R_z',
    description: 'Rotates the qubit state around the Z-axis of the Bloch sphere by angle θ.',
    color: 'var(--bg-challenge)',
    textColor: 'var(--text-challenge)',
    isParameterized: true,
    paramName: 'θ',
    defaultParam: Math.PI / 2,
  },
  CNOT: {
    id: 'CNOT',
    label: 'CNOT',
    symbol: '⊕',
    description: 'Controlled-NOT: flips the target qubit if the control qubit is |1⟩. Creates entanglement.',
    color: 'var(--bg-tutor)',
    textColor: 'var(--text-tutor)',
    isMultiQubit: true,
  },
  CZ: {
    id: 'CZ',
    label: 'CZ Gate',
    symbol: 'CZ',
    description: 'Controlled-Z: applies Z to the target qubit if the control qubit is |1⟩.',
    color: 'var(--bg-tutor)',
    textColor: 'var(--text-tutor)',
    isMultiQubit: true,
  },
  SWAP: {
    id: 'SWAP',
    label: 'SWAP',
    symbol: '×',
    description: 'Swaps the quantum states of two qubits.',
    color: 'var(--bg-tutor)',
    textColor: 'var(--text-tutor)',
    isMultiQubit: true,
  },
  MEASURE: {
    id: 'MEASURE',
    label: 'Measure',
    symbol: 'M',
    description: 'Measures the qubit in the computational basis, collapsing superposition.',
    color: '#1a1a1f',
    textColor: 'var(--text-secondary)',
    isMeasure: true,
  },
}

export const SINGLE_QUBIT_GATES: GateId[] = ['H', 'X', 'Y', 'Z', 'S', 'T']
export const PARAMETERIZED_GATES: GateId[] = ['RX', 'RY', 'RZ']
export const MULTI_QUBIT_GATES: GateId[] = ['CNOT', 'CZ', 'SWAP']
export const MEASURE_GATES: GateId[] = ['MEASURE']

export function getGateMeta(id: GateId): GateMeta {
  return GATE_META[id]
}
