'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  cloneCircuit,
  getCurrentCircuit,
  getSavedCircuits,
} from '@/lib/quantum/circuit-storage'
import { STARTER_CIRCUITS } from '@/lib/quantum/starter-circuits'
import {
  getPhaseMessage,
  SIMULATOR_BACKENDS,
  simulationService,
  type BackendDefinition,
  type NormalizedSimulationResult,
  type SimulationPhase,
  type SimulatorBackendId,
} from '@/lib/quantum/simulation-service'
import type { QuantumCircuit } from '@/lib/quantum/types'

export type CircuitSourceKind = 'current' | 'saved' | 'example'

export interface CircuitSourceOption {
  key: string
  kind: CircuitSourceKind
  label: string
  detail: string
  circuit: QuantumCircuit
}

interface UseSimulationReturn {
  circuit: QuantumCircuit
  circuitSources: CircuitSourceOption[]
  selectedSourceKey: string
  shots: number
  backendId: SimulatorBackendId
  activeBackend: BackendDefinition
  phase: SimulationPhase
  phaseMessage: string
  isBusy: boolean
  result: NormalizedSimulationResult | null
  errors: string[]
  warnings: string[]
  selectCircuitSource: (key: string) => void
  setShots: (shots: number) => void
  setBackendId: (backendId: SimulatorBackendId) => void
  runSimulation: () => Promise<void>
}

const DEFAULT_BACKEND_ID: SimulatorBackendId = 'local-educational'
const DEFAULT_SHOTS = 1024
const PHASE_PAUSE_MS = 180

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function exampleSources(): CircuitSourceOption[] {
  return STARTER_CIRCUITS.map(circuit => ({
    key: `example:${circuit.id}`,
    kind: 'example',
    label: circuit.name,
    detail: `${circuit.qubits} qubit${circuit.qubits === 1 ? '' : 's'} · ${circuit.operations.length} operations`,
    circuit: cloneCircuit(circuit),
  }))
}

export function useSimulation(): UseSimulationReturn {
  const initialSources = useMemo(exampleSources, [])
  const [circuitSources, setCircuitSources] = useState<CircuitSourceOption[]>(initialSources)
  const [selectedSourceKey, setSelectedSourceKey] = useState(initialSources[0].key)
  const [circuit, setCircuit] = useState<QuantumCircuit>(() => cloneCircuit(initialSources[0].circuit))
  const [shots, setShotCount] = useState(DEFAULT_SHOTS)
  const [backendId, setSelectedBackendId] = useState<SimulatorBackendId>(DEFAULT_BACKEND_ID)
  const [phase, setPhase] = useState<SimulationPhase>('idle')
  const [result, setResult] = useState<NormalizedSimulationResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const runVersion = useRef(0)

  useEffect(() => {
    const current = getCurrentCircuit()
    const saved = getSavedCircuits()
    const persistedSources: CircuitSourceOption[] = []

    if (current) {
      persistedSources.push({
        key: 'current',
        kind: 'current',
        label: current.name,
        detail: `${current.qubits} qubit${current.qubits === 1 ? '' : 's'} · latest from Circuit Builder`,
        circuit: current,
      })
    }

    saved.forEach(savedCircuit => {
      persistedSources.push({
        key: `saved:${savedCircuit.id}`,
        kind: 'saved',
        label: savedCircuit.name,
        detail: `${savedCircuit.qubits} qubit${savedCircuit.qubits === 1 ? '' : 's'} · saved circuit`,
        circuit: savedCircuit,
      })
    })

    const nextSources = [...persistedSources, ...exampleSources()]
    setCircuitSources(nextSources)

    if (current) {
      setSelectedSourceKey('current')
      setCircuit(cloneCircuit(current))
    }

    return () => {
      runVersion.current += 1
    }
  }, [])

  const activeBackend = useMemo(
    () => SIMULATOR_BACKENDS.find(backend => backend.id === backendId) ?? SIMULATOR_BACKENDS[0],
    [backendId]
  )

  const resetExecution = useCallback(() => {
    runVersion.current += 1
    setPhase('idle')
    setResult(null)
    setErrors([])
    setWarnings([])
  }, [])

  const selectCircuitSource = useCallback((key: string) => {
    const source = circuitSources.find(option => option.key === key)
    if (!source) return
    setSelectedSourceKey(key)
    setCircuit(cloneCircuit(source.circuit))
    resetExecution()
  }, [circuitSources, resetExecution])

  const setShots = useCallback((nextShots: number) => {
    setShotCount(nextShots)
    resetExecution()
  }, [resetExecution])

  const setBackendId = useCallback((nextBackendId: SimulatorBackendId) => {
    const backend = SIMULATOR_BACKENDS.find(candidate => candidate.id === nextBackendId)
    if (!backend?.available) return
    setSelectedBackendId(nextBackendId)
    resetExecution()
  }, [resetExecution])

  const runSimulation = useCallback(async () => {
    const version = runVersion.current + 1
    runVersion.current = version
    setResult(null)
    setErrors([])
    setWarnings([])
    setPhase('validating')

    const request = { circuit, shots, backendId }

    try {
      await delay(PHASE_PAUSE_MS)
      if (version !== runVersion.current) return

      const validation = simulationService.validate(request)
      setWarnings(validation.warnings)
      if (!validation.valid) {
        setErrors(validation.errors)
        setPhase('failed')
        return
      }

      setPhase('running')
      const nextResult = await simulationService.run(request)
      if (version !== runVersion.current) return

      setPhase('processing')
      await delay(PHASE_PAUSE_MS)
      if (version !== runVersion.current) return

      setResult(nextResult)
      setPhase('completed')
    } catch (error) {
      if (version !== runVersion.current) return
      setErrors([
        error instanceof Error
          ? error.message
          : 'An unexpected error interrupted the simulation.',
      ])
      setPhase('failed')
    }
  }, [backendId, circuit, shots])

  return {
    circuit,
    circuitSources,
    selectedSourceKey,
    shots,
    backendId,
    activeBackend,
    phase,
    phaseMessage: getPhaseMessage(phase, activeBackend.label),
    isBusy: phase === 'validating' || phase === 'running' || phase === 'processing',
    result,
    errors,
    warnings,
    selectCircuitSource,
    setShots,
    setBackendId,
    runSimulation,
  }
}
