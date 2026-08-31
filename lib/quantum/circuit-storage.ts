import { GATE_META } from './gate-meta'
import type { CircuitOperation, GateId, QuantumCircuit } from './types'

const CURRENT_CIRCUIT_KEY = 'sankalpq-current-circuit-v1'
const SAVED_CIRCUITS_KEY = 'sankalpq-saved-circuits-v1'
const STORAGE_VERSION = 1
const MAX_SAVED_CIRCUITS = 12

interface StorageEnvelope<T> {
  version: number
  data: T
}

function canUseStorage(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return Number.isInteger(value) && Number(value) >= min && Number(value) <= max
}

function isGateId(value: unknown): value is GateId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(GATE_META, value)
}

function isOperation(value: unknown, qubits: number, classicalBits: number): value is CircuitOperation {
  if (!isRecord(value) || typeof value.id !== 'string' || !isGateId(value.gate)) return false
  if (!isIntegerInRange(value.moment, 0, 999)) return false
  if (!Array.isArray(value.targets) || value.targets.length === 0) return false
  if (!value.targets.every(target => isIntegerInRange(target, 0, qubits - 1))) return false

  if (value.controls !== undefined) {
    if (!Array.isArray(value.controls)) return false
    if (!value.controls.every(control => isIntegerInRange(control, 0, qubits - 1))) return false
  }

  if (value.classicalBit !== undefined && !isIntegerInRange(value.classicalBit, 0, classicalBits - 1)) {
    return false
  }

  if (value.params !== undefined) {
    if (!isRecord(value.params)) return false
    if (value.params.angle !== undefined && (typeof value.params.angle !== 'number' || !Number.isFinite(value.params.angle))) {
      return false
    }
  }

  return true
}

export function isQuantumCircuit(value: unknown): value is QuantumCircuit {
  if (!isRecord(value)) return false
  if (typeof value.id !== 'string' || typeof value.name !== 'string') return false
  if (!isIntegerInRange(value.qubits, 1, 8)) return false
  if (!isIntegerInRange(value.classicalBits, 1, 8)) return false
  if (!Array.isArray(value.operations) || value.operations.length > 512) return false

  return value.operations.every(operation =>
    isOperation(operation, value.qubits as number, value.classicalBits as number)
  )
}

export function cloneCircuit(circuit: QuantumCircuit): QuantumCircuit {
  return {
    ...circuit,
    operations: circuit.operations.map(operation => ({
      ...operation,
      targets: [...operation.targets],
      controls: operation.controls ? [...operation.controls] : undefined,
      params: operation.params ? { ...operation.params } : undefined,
    })),
  }
}

function readEnvelope<T>(key: string, guard: (value: unknown) => value is T): T | null {
  if (!canUseStorage()) return null

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION || !guard(parsed.data)) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeEnvelope<T>(key: string, data: T): void {
  if (!canUseStorage()) return

  try {
    const envelope: StorageEnvelope<T> = { version: STORAGE_VERSION, data }
    window.localStorage.setItem(key, JSON.stringify(envelope))
  } catch {
    // Storage can be unavailable in private browsing or when the quota is full.
  }
}

function isCircuitList(value: unknown): value is QuantumCircuit[] {
  return Array.isArray(value) && value.every(isQuantumCircuit)
}

export function getCurrentCircuit(): QuantumCircuit | null {
  const circuit = readEnvelope(CURRENT_CIRCUIT_KEY, isQuantumCircuit)
  return circuit ? cloneCircuit(circuit) : null
}

export function setCurrentCircuit(circuit: QuantumCircuit): void {
  writeEnvelope(CURRENT_CIRCUIT_KEY, cloneCircuit(circuit))
}

export function getSavedCircuits(): QuantumCircuit[] {
  return (readEnvelope(SAVED_CIRCUITS_KEY, isCircuitList) ?? []).map(cloneCircuit)
}

export function saveCircuit(circuit: QuantumCircuit): QuantumCircuit[] {
  const snapshot = cloneCircuit({
    ...circuit,
    updatedAt: new Date().toISOString(),
  })
  const saved = getSavedCircuits().filter(item => item.id !== snapshot.id)
  const next = [snapshot, ...saved].slice(0, MAX_SAVED_CIRCUITS)
  writeEnvelope(SAVED_CIRCUITS_KEY, next)
  setCurrentCircuit(snapshot)
  return next.map(cloneCircuit)
}

export function removeSavedCircuit(circuitId: string): QuantumCircuit[] {
  const next = getSavedCircuits().filter(circuit => circuit.id !== circuitId)
  writeEnvelope(SAVED_CIRCUITS_KEY, next)
  return next
}
