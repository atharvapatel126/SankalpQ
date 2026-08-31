import type { QuantumCircuit, SimulationConfig, SimulationResult } from './types'
import {
  amplitudeTable,
  C,
  probabilities as stateProbabilities,
  qubitBlochAngles,
  simulateStepwise,
} from './state-engine'

export interface LocalBlochVector {
  theta: number
  phi: number
  x: number
  y: number
  z: number
}

export interface LocalSimulationResult extends SimulationResult {
  measuredQubits: number[]
  blochVector?: LocalBlochVector
}

const LOCAL_SIMULATION_DELAY_MS = 320

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface MeasurementTarget {
  qubit: number
  classicalBit: number
}

function getMeasurementTargets(circuit: QuantumCircuit): MeasurementTarget[] {
  const measured = new Map<number, MeasurementTarget>()

  const ordered = [...circuit.operations].sort(
    (left, right) => left.moment - right.moment
  )
  ordered.forEach(operation => {
    if (operation.gate === 'MEASURE') {
      const qubit = operation.targets[0]
      if (qubit !== undefined && operation.classicalBit !== undefined) {
        measured.set(operation.classicalBit, {
          qubit,
          classicalBit: operation.classicalBit,
        })
      }
    }
  })

  if (measured.size === 0) {
    return Array.from({ length: circuit.qubits }, (_, index) => ({
      qubit: index,
      classicalBit: index,
    }))
  }

  return Array.from(measured.values()).sort(
    (left, right) => left.classicalBit - right.classicalBit
  )
}

function marginalizeProbabilities(
  fullProbabilities: Array<{ label: string; prob: number }>,
  measurementTargets: MeasurementTarget[]
): Record<string, number> {
  const distribution: Record<string, number> = {}

  fullProbabilities.forEach(({ label, prob }) => {
    if (prob < 1e-12) return
    const outcome = measurementTargets.map(target => label[target.qubit]).join('')
    distribution[outcome] = (distribution[outcome] ?? 0) + prob
  })

  return Object.fromEntries(
    Object.entries(distribution)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([state, probability]) => [state, Number(probability.toFixed(12))])
  )
}

/**
 * Converts ideal probabilities into deterministic educational shot counts.
 * Largest-remainder allocation keeps the total exact without adding fake noise.
 */
function allocateShotCounts(
  probabilities: Record<string, number>,
  shots: number
): Record<string, number> {
  const entries = Object.entries(probabilities).map(([state, probability]) => {
    const exact = probability * shots
    const base = Math.floor(exact)
    return { state, base, remainder: exact - base }
  })

  let remaining = shots - entries.reduce((total, entry) => total + entry.base, 0)
  const ranked = [...entries].sort((left, right) => {
    if (right.remainder !== left.remainder) return right.remainder - left.remainder
    return left.state.localeCompare(right.state)
  })

  for (let index = 0; index < ranked.length && remaining > 0; index += 1) {
    ranked[index].base += 1
    remaining -= 1
  }

  return Object.fromEntries(
    entries
      .filter(entry => entry.base > 0)
      .map(entry => [entry.state, entry.base])
  )
}

export async function runMockSimulation(
  circuit: QuantumCircuit,
  config: SimulationConfig
): Promise<LocalSimulationResult> {
  // Keep the asynchronous boundary visible to both the builder and Simulator UI.
  await delay(LOCAL_SIMULATION_DELAY_MS)
  const startedAt = performance.now()
  const shots = Math.max(1, Math.floor(config.shots))
  const stepwise = simulateStepwise(circuit)
  const measurementTargets = getMeasurementTargets(circuit)
  const idealProbabilities = marginalizeProbabilities(
    stateProbabilities(stepwise.finalState, circuit.qubits),
    measurementTargets
  )
  const counts = allocateShotCounts(idealProbabilities, shots)
  const probabilities = Object.fromEntries(
    Object.entries(counts).map(([state, count]) => [state, count / shots])
  )
  const stateVector = amplitudeTable(stepwise.finalState, circuit.qubits).map(entry => ({
    label: entry.label,
    amplitude: C.format(entry.amplitude),
    probability: entry.probability,
  }))

  const blochVector = circuit.qubits === 1
    ? qubitBlochAngles(stepwise.finalState[0], stepwise.finalState[1])
    : undefined

  return {
    counts,
    probabilities,
    shots,
    backend: 'mock',
    isMock: true,
    executionTimeMs: Math.max(1, Math.round(performance.now() - startedAt)),
    stateVector,
    measuredQubits: measurementTargets.map(target => target.qubit),
    blochVector,
  }
}
