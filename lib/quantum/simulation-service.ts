import { validateCircuit } from './circuit-utils'
import { runMockSimulation, type LocalBlochVector } from './mock-simulator'
import type {
  CircuitValidationResult,
  QuantumCircuit,
  SimulationConfig,
  SimulationResult,
} from './types'

export const SHOT_OPTIONS = [128, 256, 512, 1024, 2048, 4096] as const

export type SimulatorBackendId =
  | 'local-educational'
  | 'qiskit-aer'
  | 'pennylane'
  | 'cirq'
  | 'ibm-quantum'

export type SimulationPhase =
  | 'idle'
  | 'validating'
  | 'running'
  | 'processing'
  | 'completed'
  | 'failed'

export interface BackendDefinition {
  id: SimulatorBackendId
  label: string
  description: string
  available: boolean
  resultSource: 'local-educational' | 'remote'
}

export interface NormalizedSimulationResult extends SimulationResult {
  backendId: SimulatorBackendId
  backendLabel: string
  sourceLabel: string
  measuredQubits: number[]
  blochVector?: LocalBlochVector
}

export interface SimulationRequest {
  circuit: QuantumCircuit
  shots: number
  backendId: SimulatorBackendId
}

export interface QuantumBackendAdapter {
  readonly definition: BackendDefinition
  simulate(circuit: QuantumCircuit, config: SimulationConfig): Promise<NormalizedSimulationResult>
}

export const SIMULATOR_BACKENDS: BackendDefinition[] = [
  {
    id: 'local-educational',
    label: 'Local Educational Simulator',
    description: 'Exact state-vector math in your browser, with deterministic educational shot counts.',
    available: true,
    resultSource: 'local-educational',
  },
  {
    id: 'qiskit-aer',
    label: 'Qiskit Aer',
    description: 'Server-backed simulation adapter.',
    available: false,
    resultSource: 'remote',
  },
  {
    id: 'pennylane',
    label: 'PennyLane',
    description: 'Differentiable quantum workflows.',
    available: false,
    resultSource: 'remote',
  },
  {
    id: 'cirq',
    label: 'Cirq',
    description: 'Google quantum circuit simulation.',
    available: false,
    resultSource: 'remote',
  },
  {
    id: 'ibm-quantum',
    label: 'IBM Quantum',
    description: 'Cloud simulator and hardware execution.',
    available: false,
    resultSource: 'remote',
  },
]

class LocalEducationalAdapter implements QuantumBackendAdapter {
  readonly definition = SIMULATOR_BACKENDS[0]

  async simulate(
    circuit: QuantumCircuit,
    config: SimulationConfig
  ): Promise<NormalizedSimulationResult> {
    const result = await runMockSimulation(circuit, config)

    return {
      ...result,
      backendId: this.definition.id,
      backendLabel: this.definition.label,
      sourceLabel: 'Local educational result',
    }
  }
}

const adapters: Partial<Record<SimulatorBackendId, QuantumBackendAdapter>> = {
  'local-educational': new LocalEducationalAdapter(),
}

function getBackend(backendId: SimulatorBackendId): BackendDefinition | undefined {
  return SIMULATOR_BACKENDS.find(backend => backend.id === backendId)
}

function validateSimulatorRequest(request: SimulationRequest): CircuitValidationResult {
  const circuitValidation = validateCircuit(request.circuit)
  const errors = [...circuitValidation.errors]
  const warnings = [...circuitValidation.warnings]
  const backend = getBackend(request.backendId)

  if (!backend) {
    errors.push('The selected simulation backend is not recognized.')
  } else if (!backend.available) {
    errors.push(`${backend.label} is not connected yet. Choose the Local Educational Simulator.`)
  }

  if (!SHOT_OPTIONS.includes(request.shots as (typeof SHOT_OPTIONS)[number])) {
    errors.push('Choose a supported shot count between 128 and 4,096.')
  }

  if (request.circuit.qubits > 8) {
    errors.push('The local educational simulator supports up to 8 qubits.')
  }

  const firstMeasurementMoment = request.circuit.operations
    .filter(operation => operation.gate === 'MEASURE')
    .reduce<number | null>((earliest, operation) => (
      earliest === null ? operation.moment : Math.min(earliest, operation.moment)
    ), null)

  if (
    firstMeasurementMoment !== null &&
    request.circuit.operations.some(operation => (
      operation.gate !== 'MEASURE' && operation.moment > firstMeasurementMoment
    ))
  ) {
    errors.push('Mid-circuit measurement is not supported by the local educational simulator yet.')
  }

  const measuredQubits = new Set(
    request.circuit.operations
      .filter(operation => operation.gate === 'MEASURE')
      .flatMap(operation => operation.targets)
  )

  if (measuredQubits.size === 0) {
    warnings.push('No measurement gates were found. Results will sample the full final state.')
  } else if (measuredQubits.size < request.circuit.qubits) {
    warnings.push('Only explicitly measured qubits will appear in the measurement outcomes.')
  }

  return { valid: errors.length === 0, errors, warnings }
}

export class SimulationService {
  validate(request: SimulationRequest): CircuitValidationResult {
    return validateSimulatorRequest(request)
  }

  async run(request: SimulationRequest): Promise<NormalizedSimulationResult> {
    const validation = this.validate(request)
    if (!validation.valid) {
      throw new Error(validation.errors[0] ?? 'The circuit could not be simulated.')
    }

    const adapter = adapters[request.backendId]
    if (!adapter) {
      throw new Error('The selected backend does not have an active adapter.')
    }

    return adapter.simulate(request.circuit, {
      shots: request.shots,
      backend: 'mock',
    })
  }
}

export const simulationService = new SimulationService()

export function getPhaseMessage(
  phase: SimulationPhase,
  backendLabel = 'Local Educational Simulator'
): string {
  switch (phase) {
    case 'validating':
      return 'Validating your quantum circuit...'
    case 'running':
      return `Running with ${backendLabel}...`
    case 'processing':
      return 'Processing measurement results...'
    case 'completed':
      return 'Simulation completed successfully.'
    case 'failed':
      return 'Simulation could not be completed.'
    default:
      return 'Ready to simulate.'
  }
}

export function buildEducationalExplanation(
  circuit: QuantumCircuit,
  result: NormalizedSimulationResult
): string {
  const ordered = [...circuit.operations].sort((left, right) => left.moment - right.moment)
  const hadamard = ordered.find(operation => operation.gate === 'H')
  const cnot = ordered.find(operation => operation.gate === 'CNOT')
  const activeOutcomes = Object.entries(result.probabilities)
    .filter(([, probability]) => probability > 1e-6)
    .sort(([, left], [, right]) => right - left)

  if (
    hadamard &&
    cnot &&
    hadamard.targets[0] === cnot.controls?.[0] &&
    hadamard.moment < cnot.moment &&
    activeOutcomes.length === 2
  ) {
    return 'The Hadamard gate first creates a superposition on the control qubit. CNOT then correlates the target with it, so the measured outcomes move together rather than behaving as independent random bits.'
  }

  if (hadamard && circuit.qubits === 1) {
    return 'Hadamard gates mix the |0âŸ© and |1âŸ© amplitudes. Later gates can recombine those amplitudes, so the measurement probabilities reflect the circuit\'s complete gate sequence.'
  }

  if (ordered.some(operation => operation.gate === 'X')) {
    return 'Pauli-X swaps the amplitudes of |0⟩ and |1⟩ on its target qubit. A qubit starting in |0⟩ therefore becomes |1⟩ unless later gates transform it again.'
  }

  if (ordered.some(operation => ['S', 'T', 'Z', 'RZ'].includes(operation.gate))) {
    return 'Phase gates change relative phase rather than measurement probabilities by themselves. Their effect becomes visible when a later gate converts phase differences into amplitude differences.'
  }

  if (circuit.operations.length === 0) {
    return 'With no gates, every qubit remains in |0⟩. Sampling the register therefore produces the all-zero outcome every time.'
  }

  return 'The simulator applies each gate in moment order, computes the exact final state vector, and converts squared amplitude magnitudes into measurement probabilities.'
}
