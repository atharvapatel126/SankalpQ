import { validateCircuit } from '@/lib/quantum/circuit-utils'
import {
  C,
  probabilities,
  simulateStepwise,
  type StateVector,
} from '@/lib/quantum/state-engine'
import type { QuantumCircuit } from '@/lib/quantum/types'
import type {
  ChallengeDefinition,
  ChallengeSubmission,
  ChallengeValidationResult,
  CircuitChallenge,
} from './types'

const EPSILON = 1e-9
const SUPPORTED_GATE_IDS = new Set([
  'H',
  'X',
  'Y',
  'Z',
  'S',
  'T',
  'RX',
  'RY',
  'RZ',
  'CNOT',
  'CZ',
  'SWAP',
  'MEASURE',
])

function probabilityRecord(circuit: QuantumCircuit): Record<string, number> {
  const simulation = simulateStepwise(circuit)
  return Object.fromEntries(
    probabilities(simulation.finalState, simulation.n)
      .filter(entry => entry.prob > EPSILON)
      .map(entry => [entry.label, entry.prob])
  )
}

export function stateFidelity(actual: StateVector, expected: StateVector): number {
  if (actual.length !== expected.length || actual.length === 0) return 0

  let innerReal = 0
  let innerImaginary = 0
  for (let index = 0; index < actual.length; index += 1) {
    const actualAmplitude = actual[index]
    const expectedAmplitude = expected[index]
    innerReal +=
      expectedAmplitude.re * actualAmplitude.re +
      expectedAmplitude.im * actualAmplitude.im
    innerImaginary +=
      expectedAmplitude.re * actualAmplitude.im -
      expectedAmplitude.im * actualAmplitude.re
  }

  return Math.min(1, Math.max(0, innerReal ** 2 + innerImaginary ** 2))
}

function maximumProbabilityDelta(
  actual: Record<string, number>,
  expected: Record<string, number>
): number {
  const labels = new Set([...Object.keys(actual), ...Object.keys(expected)])
  let maximum = 0
  labels.forEach(label => {
    maximum = Math.max(maximum, Math.abs((actual[label] ?? 0) - (expected[label] ?? 0)))
  })
  return maximum
}

function circuitSemanticError(circuit: QuantumCircuit): string | null {
  if (circuit.operations.length === 0) return null

  const occupiedCells = new Set<string>()
  let earliestMeasurementMoment: number | null = null

  for (const operation of circuit.operations) {
    if (!SUPPORTED_GATE_IDS.has(operation.gate)) {
      return `The circuit contains an unsupported gate: ${String(operation.gate)}.`
    }

    if (!Number.isInteger(operation.moment) || operation.moment < 0) {
      return 'A gate has an invalid circuit position. Remove it and place it again.'
    }

    if (operation.targets.length === 0) {
      return 'A gate has no target qubit. Remove it and place it again.'
    }

    if (
      (operation.gate === 'CNOT' || operation.gate === 'CZ' || operation.gate === 'SWAP') &&
      operation.controls?.length !== 1
    ) {
      return `${operation.gate} needs one control qubit and one target qubit.`
    }

    if (
      operation.params?.angle !== undefined &&
      !Number.isFinite(operation.params.angle)
    ) {
      return 'A rotation gate has an invalid angle. Choose a finite angle and try again.'
    }

    const involvedQubits = [...operation.targets, ...(operation.controls ?? [])]
    for (const qubit of involvedQubits) {
      const cellKey = `${operation.moment}:${qubit}`
      if (occupiedCells.has(cellKey)) {
        return `Two operations overlap on q${qubit} at moment ${operation.moment}. Remove one before submitting.`
      }
      occupiedCells.add(cellKey)
    }

    if (operation.gate === 'MEASURE') {
      earliestMeasurementMoment =
        earliestMeasurementMoment === null
          ? operation.moment
          : Math.min(earliestMeasurementMoment, operation.moment)

      if (
        operation.classicalBit !== undefined &&
        (operation.classicalBit < 0 || operation.classicalBit >= circuit.classicalBits)
      ) {
        return 'A measurement points to an unavailable classical bit.'
      }
    }
  }

  if (
    earliestMeasurementMoment !== null &&
    circuit.operations.some(
      operation => operation.gate !== 'MEASURE' && operation.moment > earliestMeasurementMoment!
    )
  ) {
    return 'Place measurements after all quantum gates. Gates after measurement cannot be judged as a unitary solution.'
  }

  return null
}

function validateCircuitSubmission(
  challenge: CircuitChallenge,
  circuit: QuantumCircuit
): ChallengeValidationResult {
  const structural = validateCircuit(circuit)
  if (!structural.valid) {
    return {
      correct: false,
      feedback: structural.errors[0] ?? 'The circuit is not valid yet.',
      explanation: 'Resolve the circuit error before checking its quantum state.',
    }
  }

  const semanticError = circuitSemanticError(circuit)
  if (semanticError) {
    return {
      correct: false,
      feedback: semanticError,
      explanation: 'Each operation must have valid qubits and a well-defined execution order.',
    }
  }

  const quantumOperations = circuit.operations.filter(operation => operation.gate !== 'MEASURE')
  if (quantumOperations.length === 0) {
    return {
      correct: false,
      feedback: challenge.feedback.emptyCircuit,
      explanation: challenge.explanation,
      actualProbabilities: probabilityRecord(circuit),
    }
  }

  if (challenge.expectation.targetCircuit?.qubits !== undefined &&
      circuit.qubits !== challenge.expectation.targetCircuit.qubits) {
    return {
      correct: false,
      feedback: `This goal requires ${challenge.expectation.targetCircuit.qubits} qubit${challenge.expectation.targetCircuit.qubits === 1 ? '' : 's'}.`,
      explanation: challenge.explanation,
    }
  }

  try {
    const actualSimulation = simulateStepwise(circuit)
    const actualProbabilities = Object.fromEntries(
      probabilities(actualSimulation.finalState, actualSimulation.n)
        .filter(entry => entry.prob > EPSILON)
        .map(entry => [entry.label, entry.prob])
    )
    const probabilityDelta = maximumProbabilityDelta(
      actualProbabilities,
      challenge.expectation.expectedProbabilities
    )
    const probabilitiesMatch =
      probabilityDelta <= challenge.expectation.probabilityTolerance

    let fidelity: number | undefined
    let stateMatches = true
    if (challenge.expectation.targetCircuit && challenge.expectation.minimumFidelity !== undefined) {
      const targetSimulation = simulateStepwise(challenge.expectation.targetCircuit)
      fidelity = stateFidelity(actualSimulation.finalState, targetSimulation.finalState)
      stateMatches = fidelity >= challenge.expectation.minimumFidelity
    }

    if (probabilitiesMatch && stateMatches) {
      return {
        correct: true,
        feedback: challenge.feedback.success,
        explanation: challenge.explanation,
        actualProbabilities,
        fidelity,
      }
    }

    return {
      correct: false,
      feedback: probabilitiesMatch
        ? challenge.feedback.stateMismatch
        : challenge.feedback.probabilityMismatch,
      explanation: challenge.explanation,
      actualProbabilities,
      fidelity,
    }
  } catch {
    return {
      correct: false,
      feedback: 'The circuit could not be evaluated. Check every gate and try again.',
      explanation: 'Only valid gates on available qubits can be simulated.',
    }
  }
}

export function validateChallengeSubmission(
  challenge: ChallengeDefinition,
  submission: ChallengeSubmission
): ChallengeValidationResult {
  if (challenge.kind === 'upcoming') {
    return {
      correct: false,
      feedback: challenge.availabilityNote,
      explanation: challenge.explanation,
    }
  }

  if (challenge.kind === 'circuit') {
    if (submission.kind !== 'circuit') {
      return {
        correct: false,
        feedback: 'Build a circuit before submitting this challenge.',
        explanation: challenge.explanation,
      }
    }
    return validateCircuitSubmission(challenge, submission.circuit)
  }

  if (submission.kind !== 'choice') {
    return {
      correct: false,
      feedback: 'Select an answer before submitting.',
      explanation: challenge.explanation,
    }
  }

  const correct = submission.optionId === challenge.correctOptionId
  return {
    correct,
    feedback: correct
      ? 'Correct. You identified the circuit behavior.'
      : challenge.incorrectFeedback,
    explanation: challenge.explanation,
  }
}

export function formatProbabilityDistribution(
  distribution: Record<string, number>
): string {
  return Object.entries(distribution)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([state, probability]) => `|${state}> ${(probability * 100).toFixed(1)}%`)
    .join(' / ')
}

export function isNormalizedState(state: StateVector): boolean {
  const norm = state.reduce((sum, amplitude) => sum + C.abs2(amplitude), 0)
  return Math.abs(norm - 1) < 1e-8
}
