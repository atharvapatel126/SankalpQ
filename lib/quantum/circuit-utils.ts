// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Circuit Utilities
// Pure functions for manipulating the Universal Circuit JSON model
// ─────────────────────────────────────────────────────────────────────────────

import type {
  QuantumCircuit,
  CircuitOperation,
  GateId,
  CircuitValidationResult,
} from './types'

let opCounter = 0
function newOpId(): string {
  return `op-${Date.now()}-${++opCounter}`
}

export function createEmptyCircuit(name = 'Untitled Circuit'): QuantumCircuit {
  return {
    id: `circuit-${Date.now()}`,
    name,
    qubits: 2,
    classicalBits: 2,
    operations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// ── Qubit management ──────────────────────────────────────────────────────────
export function addQubit(circuit: QuantumCircuit): QuantumCircuit {
  if (circuit.qubits >= 8) return circuit // cap at 8 for UI
  return {
    ...circuit,
    qubits: circuit.qubits + 1,
    classicalBits: circuit.classicalBits + 1,
    updatedAt: new Date().toISOString(),
  }
}

export function removeQubit(circuit: QuantumCircuit): QuantumCircuit {
  if (circuit.qubits <= 1) return circuit
  const lastQubit = circuit.qubits - 1
  return {
    ...circuit,
    qubits: circuit.qubits - 1,
    classicalBits: circuit.classicalBits - 1,
    // Remove any operations that referenced the removed qubit
    operations: circuit.operations.filter(
      op =>
        !op.targets.includes(lastQubit) &&
        !(op.controls?.includes(lastQubit))
    ),
    updatedAt: new Date().toISOString(),
  }
}

// ── Gate placement ────────────────────────────────────────────────────────────
export function placeGate(
  circuit: QuantumCircuit,
  gate: GateId,
  qubit: number,
  moment: number,
  params?: { angle?: number }
): QuantumCircuit {
  // Remove any existing gate at this exact cell (same qubit + moment)
  const filtered = circuit.operations.filter(
    op => !(op.targets.includes(qubit) && op.moment === moment)
  )
  const newOp: CircuitOperation = {
    id: newOpId(),
    gate,
    targets: [qubit],
    moment,
    ...(params ? { params } : {}),
    ...(gate === 'MEASURE' ? { classicalBit: qubit } : {}),
  }
  return {
    ...circuit,
    operations: [...filtered, newOp].sort((a, b) => a.moment - b.moment),
    updatedAt: new Date().toISOString(),
  }
}

export function placeTwoQubitGate(
  circuit: QuantumCircuit,
  gate: GateId,
  controlQubit: number,
  targetQubit: number,
  moment: number
): QuantumCircuit {
  if (controlQubit === targetQubit) return circuit

  // Remove any gates at these cells
  const filtered = circuit.operations.filter(op => {
    if (op.moment !== moment) return true
    const involved = [...op.targets, ...(op.controls ?? [])]
    return !involved.includes(controlQubit) && !involved.includes(targetQubit)
  })

  const newOp: CircuitOperation = {
    id: newOpId(),
    gate,
    controls: [controlQubit],
    targets: [targetQubit],
    moment,
  }

  return {
    ...circuit,
    operations: [...filtered, newOp].sort((a, b) => a.moment - b.moment),
    updatedAt: new Date().toISOString(),
  }
}

// ── Gate removal ──────────────────────────────────────────────────────────────
export function removeOperation(circuit: QuantumCircuit, opId: string): QuantumCircuit {
  return {
    ...circuit,
    operations: circuit.operations.filter(op => op.id !== opId),
    updatedAt: new Date().toISOString(),
  }
}

export function clearCircuit(circuit: QuantumCircuit): QuantumCircuit {
  return {
    ...circuit,
    operations: [],
    updatedAt: new Date().toISOString(),
  }
}

// ── Query helpers ─────────────────────────────────────────────────────────────

/** Returns the operation at the given qubit + moment cell, if any */
export function getOperationAt(
  circuit: QuantumCircuit,
  qubit: number,
  moment: number
): CircuitOperation | undefined {
  return circuit.operations.find(op => {
    if (op.moment !== moment) return false
    return op.targets.includes(qubit) || (op.controls?.includes(qubit) ?? false)
  })
}

/** Returns the role of a qubit in a given operation */
export function getQubitRole(
  op: CircuitOperation,
  qubit: number
): 'target' | 'control' | null {
  if (op.controls?.includes(qubit)) return 'control'
  if (op.targets.includes(qubit)) return 'target'
  return null
}

/** Number of columns (moments) needed to display the circuit */
export function getCircuitWidth(circuit: QuantumCircuit): number {
  if (circuit.operations.length === 0) return 6 // default empty columns
  const maxMoment = Math.max(...circuit.operations.map(op => op.moment))
  return Math.max(maxMoment + 3, 6) // always show at least 3 empty columns after last gate
}

// ── Validation ────────────────────────────────────────────────────────────────
export function validateCircuit(circuit: QuantumCircuit): CircuitValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (circuit.qubits === 0) errors.push('Circuit must have at least 1 qubit.')
  if (circuit.operations.length === 0) warnings.push('Circuit is empty — add some gates.')

  // Check qubit indices are in bounds
  for (const op of circuit.operations) {
    const allQubits = [...op.targets, ...(op.controls ?? [])]
    for (const q of allQubits) {
      if (q < 0 || q >= circuit.qubits) {
        errors.push(`Gate "${op.gate}" references out-of-bounds qubit ${q}.`)
      }
    }
    // Check CNOT has distinct control and target
    if ((op.gate === 'CNOT' || op.gate === 'CZ') && op.controls) {
      if (op.controls[0] === op.targets[0]) {
        errors.push(`${op.gate} gate has the same control and target qubit.`)
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}

// ── Circuit summary (for AI Tutor / Simulator context) ───────────────────────
export function describeCircuit(circuit: QuantumCircuit): string {
  const { qubits, operations } = circuit
  if (operations.length === 0) return `Empty circuit with ${qubits} qubit${qubits > 1 ? 's' : ''}.`

  const gateList = operations.map(op => {
    if (op.controls?.length) {
      return `${op.gate}(q${op.controls[0]}→q${op.targets[0]})`
    }
    return `${op.gate}(q${op.targets[0]})`
  })

  return `${qubits}-qubit circuit: ${gateList.join(', ')}.`
}
