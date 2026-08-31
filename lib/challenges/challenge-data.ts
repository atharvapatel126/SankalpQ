import type { QuantumCircuit } from '@/lib/quantum/types'
import type {
  ChallengeDefinition,
  ChallengeDifficulty,
  CircuitChallenge,
} from './types'

const emptySuperpositionCircuit: QuantumCircuit = {
  id: 'challenge-superposition-start',
  name: 'Equal Superposition',
  qubits: 1,
  classicalBits: 1,
  operations: [],
}

const targetSuperpositionCircuit: QuantumCircuit = {
  id: 'challenge-superposition-target',
  name: 'Target Equal Superposition',
  qubits: 1,
  classicalBits: 1,
  operations: [
    { id: 'target-superposition-h', gate: 'H', targets: [0], moment: 0 },
  ],
}

const emptyBellCircuit: QuantumCircuit = {
  id: 'challenge-bell-start',
  name: 'Bell State',
  qubits: 2,
  classicalBits: 2,
  operations: [],
}

const targetBellCircuit: QuantumCircuit = {
  id: 'challenge-bell-target',
  name: 'Target Bell State',
  qubits: 2,
  classicalBits: 2,
  operations: [
    { id: 'target-bell-h', gate: 'H', targets: [0], moment: 0 },
    {
      id: 'target-bell-cnot',
      gate: 'CNOT',
      controls: [0],
      targets: [1],
      moment: 1,
    },
  ],
}

const incorrectBellCircuit: QuantumCircuit = {
  id: 'challenge-fix-bell-start',
  name: 'Repair the Bell Circuit',
  qubits: 2,
  classicalBits: 2,
  operations: [
    { id: 'fix-bell-h', gate: 'H', targets: [0], moment: 0 },
    {
      id: 'fix-bell-wrong-cnot',
      gate: 'CNOT',
      controls: [1],
      targets: [0],
      moment: 1,
    },
  ],
}

const hadamardPredictionCircuit: QuantumCircuit = {
  id: 'challenge-predict-hadamard-preview',
  name: 'Hadamard Measurement',
  qubits: 1,
  classicalBits: 1,
  operations: [
    { id: 'predict-h', gate: 'H', targets: [0], moment: 0 },
    {
      id: 'predict-measure',
      gate: 'MEASURE',
      targets: [0],
      classicalBit: 0,
      moment: 1,
    },
  ],
}

const sharedSuperpositionFeedback: CircuitChallenge['feedback'] = {
  success: 'Your circuit prepares the |+> state with equal measurement probabilities.',
  emptyCircuit: 'The qubit is still in |0>. Add an operation that creates equal amplitudes.',
  probabilityMismatch:
    'The outcomes are not balanced yet. Look for a gate that maps |0> to equal |0> and |1> amplitudes.',
  stateMismatch:
    'The measurement probabilities are balanced, but the relative phase is not the requested |+> state. Check for an extra phase operation.',
}

const sharedBellFeedback: CircuitChallenge['feedback'] = {
  success: 'Your circuit prepares the Bell state (|00> + |11>)/sqrt(2).',
  emptyCircuit:
    'Both qubits remain in |00>. First create a superposition, then correlate the second qubit.',
  probabilityMismatch:
    'The qubits are not correlated yet. After creating superposition on the first qubit, use a controlled two-qubit operation.',
  stateMismatch:
    'The output probabilities look Bell-like, but the relative phase does not match the requested Phi-plus state. Remove any extra phase operation.',
}

export const CHALLENGES: ChallengeDefinition[] = [
  {
    id: 'build-superposition',
    kind: 'circuit',
    type: 'build-circuit',
    title: 'Build Equal Superposition',
    shortDescription: 'Prepare |+> from a qubit initialized in |0>.',
    description:
      'Place gates on the wire so the final quantum state is (|0> + |1>)/sqrt(2). Equivalent circuits are accepted.',
    goal: 'Prepare |+>, giving 50% probability for both |0> and |1>.',
    difficulty: 'beginner',
    estimatedMinutes: 4,
    baseXp: 80,
    hints: [
      'A bit flip changes |0> to |1>, but it does not create two amplitudes.',
      'Look for a gate whose description mentions superposition.',
      'Apply a Hadamard gate to q0. Measurement is optional for validation.',
    ],
    explanation:
      'The Hadamard operation maps |0> to |+> = (|0> + |1>)/sqrt(2). Squaring either amplitude gives a 1/2 measurement probability.',
    initialCircuit: emptySuperpositionCircuit,
    expectation: {
      expectedProbabilities: { '0': 0.5, '1': 0.5 },
      probabilityTolerance: 0.02,
      targetCircuit: targetSuperpositionCircuit,
      minimumFidelity: 0.999,
    },
    feedback: sharedSuperpositionFeedback,
  },
  {
    id: 'predict-hadamard-output',
    kind: 'choice',
    type: 'predict-output',
    title: 'Predict a Hadamard Measurement',
    shortDescription: 'Predict the output distribution of a one-qubit circuit.',
    description:
      'The qubit begins in |0>, passes through the shown circuit, and is measured in the computational basis.',
    goal: 'Choose the measurement distribution produced by the circuit.',
    difficulty: 'beginner',
    estimatedMinutes: 3,
    baseXp: 60,
    hints: [
      'Read the gate before the measurement from left to right.',
      'Hadamard changes basis states into equal-magnitude superpositions.',
      'The two amplitudes have magnitude 1/sqrt(2), so both probabilities are 1/2.',
    ],
    explanation:
      'H|0> = (|0> + |1>)/sqrt(2). Measurement therefore returns 0 or 1 with equal probability over many shots.',
    options: [
      { id: 'always-zero', label: 'Always |0>' },
      { id: 'always-one', label: 'Always |1>' },
      { id: 'equal', label: '50% |0> and 50% |1>' },
      { id: 'no-measurement', label: 'No outcome is produced' },
    ],
    correctOptionId: 'equal',
    incorrectFeedback:
      'Trace the state immediately before measurement. Probability is the squared magnitude of each amplitude.',
    previewCircuit: hadamardPredictionCircuit,
  },
  {
    id: 'identify-x-gate',
    kind: 'choice',
    type: 'identify-gate',
    title: 'Identify the Bit-Flip Gate',
    shortDescription: 'Find the operation that maps |0> to |1>.',
    description:
      'A single qubit starts in |0> and must finish in |1> with certainty. Identify the gate that performs this transformation.',
    goal: 'Select the gate that deterministically flips the computational basis value.',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    baseXp: 50,
    hints: [
      'The required operation is the quantum analogue of classical NOT.',
      'A phase-only gate cannot change the probability of measuring 0 or 1.',
      'The Pauli-X matrix swaps the |0> and |1> amplitudes.',
    ],
    explanation:
      'The Pauli-X gate is a bit flip: X|0> = |1> and X|1> = |0>. Hadamard creates superposition, while Z and S change phase.',
    options: [
      { id: 'h', label: 'Hadamard (H)' },
      { id: 'x', label: 'Pauli-X (X)' },
      { id: 'z', label: 'Pauli-Z (Z)' },
      { id: 's', label: 'Phase (S)' },
    ],
    correctOptionId: 'x',
    incorrectFeedback:
      'The requested transformation changes the basis value, not only its phase. Look for the quantum NOT operation.',
    stateTransition: { input: '|0>', output: '|1>' },
  },
  {
    id: 'build-bell-state',
    kind: 'circuit',
    type: 'build-circuit',
    title: 'Create a Bell State',
    shortDescription: 'Entangle two qubits into the Phi-plus Bell state.',
    description:
      'Starting from |00>, build any equivalent circuit whose final state is (|00> + |11>)/sqrt(2).',
    goal: 'Prepare correlated outcomes: 50% |00>, 50% |11>, with the correct relative phase.',
    difficulty: 'intermediate',
    estimatedMinutes: 7,
    baseXp: 120,
    hints: [
      'Start by changing the state of the first qubit.',
      'Create a superposition on q0 before trying to correlate q1.',
      'Apply H to q0, then use q0 as the control of a CNOT targeting q1.',
    ],
    explanation:
      'H creates (|00> + |10>)/sqrt(2). CNOT then flips q1 only in the |10> branch, producing (|00> + |11>)/sqrt(2).',
    initialCircuit: emptyBellCircuit,
    expectation: {
      expectedProbabilities: { '00': 0.5, '11': 0.5 },
      probabilityTolerance: 0.02,
      targetCircuit: targetBellCircuit,
      minimumFidelity: 0.999,
    },
    feedback: sharedBellFeedback,
  },
  {
    id: 'fix-bell-state',
    kind: 'circuit',
    type: 'fix-circuit',
    title: 'Repair the Bell Circuit',
    shortDescription: 'Correct a controlled gate that points the wrong way.',
    description:
      'This circuit creates superposition but fails to entangle its qubits. Inspect the controlled operation and repair the circuit.',
    goal: 'Finish with the Phi-plus Bell state (|00> + |11>)/sqrt(2).',
    difficulty: 'intermediate',
    estimatedMinutes: 6,
    baseXp: 110,
    hints: [
      'The Hadamard is already acting on the intended qubit.',
      'A controlled gate only acts when its control qubit is |1>. Which qubit has superposition?',
      'Remove the current CNOT, then use q0 as control and q1 as target.',
    ],
    explanation:
      "The original CNOT used q1 as its control, but q1 remained |0>, so it never fired. Controlling on q0 transfers q0's branch information to q1 and creates entanglement.",
    initialCircuit: incorrectBellCircuit,
    expectation: {
      expectedProbabilities: { '00': 0.5, '11': 0.5 },
      probabilityTolerance: 0.02,
      targetCircuit: targetBellCircuit,
      minimumFidelity: 0.999,
    },
    feedback: {
      ...sharedBellFeedback,
      emptyCircuit:
        'The supplied circuit has been removed. Restore a superposition step and a controlled operation that correlates q1.',
      probabilityMismatch:
        'The first qubit may be in superposition, but the second is not correlated with it. Check the CNOT control and target.',
    },
  },
  {
    id: 'grover-amplitude-amplification',
    kind: 'upcoming',
    type: 'algorithm',
    title: 'Grover Amplitude Amplification',
    shortDescription: 'Build an oracle and amplify a marked two-qubit state.',
    description:
      'An advanced construction challenge covering phase oracles, diffusion, and amplitude amplification.',
    goal: 'Amplify a marked basis state using one Grover iteration.',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    baseXp: 0,
    hints: [],
    explanation:
      'This challenge will become available with the advanced algorithms learning path.',
    availabilityNote: 'Upcoming with the Quantum Algorithms course level.',
  },
]

export const PLAYABLE_CHALLENGES = CHALLENGES.filter(
  (challenge): challenge is CircuitChallenge | Extract<ChallengeDefinition, { kind: 'choice' }> =>
    challenge.kind !== 'upcoming'
)

export const CHALLENGE_DIFFICULTIES: ChallengeDifficulty[] = [
  'beginner',
  'intermediate',
  'advanced',
]

export function getChallenge(challengeId: string): ChallengeDefinition | undefined {
  return CHALLENGES.find(challenge => challenge.id === challengeId)
}

export function getNextPlayableChallengeId(challengeId: string): string | null {
  const currentIndex = PLAYABLE_CHALLENGES.findIndex(challenge => challenge.id === challengeId)
  if (currentIndex < 0 || currentIndex >= PLAYABLE_CHALLENGES.length - 1) return null
  return PLAYABLE_CHALLENGES[currentIndex + 1].id
}

export function cloneChallengeCircuit(circuit: QuantumCircuit): QuantumCircuit {
  return {
    ...circuit,
    operations: circuit.operations.map(operation => ({
      ...operation,
      targets: [...operation.targets],
      ...(operation.controls ? { controls: [...operation.controls] } : {}),
      ...(operation.params ? { params: { ...operation.params } } : {}),
    })),
  }
}
