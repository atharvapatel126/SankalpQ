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
  // Remove any target or control occupying this qubit at the same moment.
  const filtered = circuit.operations.filter(op => {
    if (op.moment !== moment) return true
    return ![...op.targets, ...(op.controls ?? [])].includes(qubit)
  })
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

  if (!Number.isInteger(circuit.qubits) || circuit.qubits < 1 || circuit.qubits > 8) {
    errors.push('Circuit must contain between 1 and 8 qubits.')
  }
  if (!Number.isInteger(circuit.classicalBits) || circuit.classicalBits < 1 || circuit.classicalBits > 8) {
    errors.push('Circuit must contain between 1 and 8 classical bits.')
  }
  if (circuit.operations.length === 0) {
    warnings.push('Circuit is empty - add a gate to explore a transformation.')
  }

  const occupiedCells = new Map<string, string>()
  const operationIds = new Set<string>()
  const firstMeasurementByQubit = new Map<number, number>()

  const orderedOperations = [...circuit.operations].sort((a, b) => a.moment - b.moment)
  for (const op of orderedOperations) {
    if (operationIds.has(op.id)) errors.push(`Operation id "${op.id}" is duplicated.`)
    operationIds.add(op.id)

    if (!Number.isInteger(op.moment) || op.moment < 0) {
      errors.push(`Gate "${op.gate}" has an invalid moment.`)
    }
    if (op.targets.length !== 1) {
      errors.push(`Gate "${op.gate}" must have exactly one target in this circuit model.`)
    }

    const allQubits = [...op.targets, ...(op.controls ?? [])]
    for (const q of allQubits) {
      if (!Number.isInteger(q) || q < 0 || q >= circuit.qubits) {
        errors.push(`Gate "${op.gate}" references out-of-bounds qubit ${q}.`)
        continue
      }

      const cellKey = `${op.moment}:${q}`
      const occupyingOperation = occupiedCells.get(cellKey)
      if (occupyingOperation && occupyingOperation !== op.id) {
        errors.push(`Qubit ${q} has overlapping operations at moment ${op.moment}.`)
      } else {
        occupiedCells.set(cellKey, op.id)
      }

      const measuredAt = firstMeasurementByQubit.get(q)
      if (op.gate !== 'MEASURE' && measuredAt !== undefined && op.moment > measuredAt) {
        warnings.push(`Qubit ${q} has a gate after measurement; educational simulation treats measurement as terminal.`)
      }
    }

    if (op.gate === 'MEASURE') {
      const target = op.targets[0]
      if (target !== undefined) {
        const previous = firstMeasurementByQubit.get(target)
        firstMeasurementByQubit.set(target, Math.min(previous ?? op.moment, op.moment))
      }
      if (!Number.isInteger(op.classicalBit) || (op.classicalBit ?? -1) < 0 || (op.classicalBit ?? 0) >= circuit.classicalBits) {
        errors.push('Every measurement must write to an in-range classical bit.')
      }
    }

    if (op.gate === 'CNOT' || op.gate === 'CZ' || op.gate === 'SWAP') {
      if (op.controls?.length !== 1 || op.targets.length !== 1) {
        errors.push(`${op.gate} requires two distinct qubits.`)
      } else if (op.controls[0] === op.targets[0]) {
        errors.push(`${op.gate} gate has the same source and target qubit.`)
      }
    } else if (op.controls && op.controls.length > 0) {
      errors.push(`Gate "${op.gate}" cannot have control qubits.`)
    }

    if (op.params?.angle !== undefined && !Number.isFinite(op.params.angle)) {
      errors.push(`Gate "${op.gate}" has an invalid rotation angle.`)
    }
  }

  return {
    valid: errors.length === 0,
    errors: Array.from(new Set(errors)),
    warnings: Array.from(new Set(warnings)),
  }
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
