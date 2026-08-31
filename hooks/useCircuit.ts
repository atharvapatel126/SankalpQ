'use client'

// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — useCircuit Hook
// All circuit builder state management in one place
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import type {
  QuantumCircuit,
  CircuitOperation,
  GateId,
  PlacementMode,
  SimulationResult,
  SimulationConfig,
} from '@/lib/quantum/types'
import {
  createEmptyCircuit,
  addQubit,
  removeQubit,
  placeGate,
  placeTwoQubitGate,
  removeOperation,
  clearCircuit,
  getCircuitWidth,
} from '@/lib/quantum/circuit-utils'
import { runMockSimulation } from '@/lib/quantum/mock-simulator'
import { STARTER_CIRCUITS } from '@/lib/quantum/starter-circuits'
import { getGateMeta } from '@/lib/quantum/gate-meta'


const MAX_HISTORY = 30

interface UseCircuitReturn {
  // State
  circuit: QuantumCircuit
  selectedOp: CircuitOperation | null
  placementMode: PlacementMode
  circuitWidth: number
  isRunning: boolean
  simulationResult: SimulationResult | null
  simulationConfig: SimulationConfig
  canUndo: boolean
  canRedo: boolean

  // Circuit mutations
  setCircuitName: (name: string) => void
  onAddQubit: () => void
  onRemoveQubit: () => void
  onClearCircuit: () => void
  onLoadStarterCircuit: (id: string) => void

  // Gate placement
  setActiveTool: (gate: GateId | null) => void
  onCellClick: (qubit: number, moment: number) => void
  onSelectOp: (op: CircuitOperation | null) => void
  onDeleteOp: (opId: string) => void
  onUpdateOpParam: (opId: string, angle: number) => void

  // History
  onUndo: () => void
  onRedo: () => void

  // Simulation
  setSimulationConfig: (cfg: Partial<SimulationConfig>) => void
  onRunSimulation: () => void
  onClearResult: () => void
}

export function useCircuit(): UseCircuitReturn {
  const [circuit, setCircuit] = useState<QuantumCircuit>(() => createEmptyCircuit())
  const [past, setPast] = useState<QuantumCircuit[]>([])
  const [future, setFuture] = useState<QuantumCircuit[]>([])
  const [selectedOp, setSelectedOp] = useState<CircuitOperation | null>(null)
  const [placementMode, setPlacementMode] = useState<PlacementMode>({ type: 'idle' })
  const [isRunning, setIsRunning] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [simulationConfig, setSimConfig] = useState<SimulationConfig>({
    shots: 1024,
    backend: 'mock',
  })

  // ── History helpers ────────────────────────────────────────────────────────
  const pushHistory = useCallback((prev: QuantumCircuit) => {
    setPast(p => [...p.slice(-MAX_HISTORY), prev])
    setFuture([])
  }, [])

  const mutate = useCallback(
    (fn: (c: QuantumCircuit) => QuantumCircuit) => {
      setCircuit(current => {
        pushHistory(current)
        return fn(current)
      })
      setSelectedOp(null)
      setSimulationResult(null)
    },
    [pushHistory]
  )

  // ── Circuit identity ───────────────────────────────────────────────────────
  const setCircuitName = useCallback(
    (name: string) => mutate(c => ({ ...c, name })),
    [mutate]
  )

  // ── Qubit management ───────────────────────────────────────────────────────
  const onAddQubit = useCallback(() => mutate(addQubit), [mutate])
  const onRemoveQubit = useCallback(() => mutate(removeQubit), [mutate])
  const onClearCircuit = useCallback(() => mutate(clearCircuit), [mutate])

  const onLoadStarterCircuit = useCallback(
    (id: string) => {
      const starter = STARTER_CIRCUITS.find(c => c.id === id)
      if (!starter) return
      mutate(() => ({
        ...starter,
        id: `circuit-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      setPlacementMode({ type: 'idle' })
    },
    [mutate]
  )

  // ── Placement mode ─────────────────────────────────────────────────────────
  const setActiveTool = useCallback((gate: GateId | null) => {
    setPlacementMode(gate ? { type: 'single', gateId: gate } : { type: 'idle' })
    setSelectedOp(null)
  }, [])

  const onCellClick = useCallback(
    (qubit: number, moment: number) => {
      if (placementMode.type === 'idle') return

      if (placementMode.type === 'single') {
        const { gateId } = placementMode
        const meta = getGateMeta(gateId)

        if (meta.isMultiQubit) {
          // First click = set control qubit
          setPlacementMode({
            type: 'multi-control',
            gateId,
            controlQubit: qubit,
            controlMoment: moment,
          })
          return
        }

        // Single qubit gate — place immediately
        mutate(c => placeGate(c, gateId, qubit, moment))
        return
      }

      if (placementMode.type === 'multi-control') {
        const { gateId, controlQubit, controlMoment } = placementMode
        // Second click = target qubit
        const useMoment = Math.max(controlMoment, moment)
        mutate(c => placeTwoQubitGate(c, gateId, controlQubit, qubit, useMoment))
        setPlacementMode({ type: 'single', gateId }) // ready for next placement
      }
    },
    [placementMode, mutate]
  )

  const onSelectOp = useCallback((op: CircuitOperation | null) => {
    setSelectedOp(op)
    setPlacementMode({ type: 'idle' })
  }, [])

  const onDeleteOp = useCallback(
    (opId: string) => {
      mutate(c => removeOperation(c, opId))
      setSelectedOp(null)
    },
    [mutate]
  )

  const onUpdateOpParam = useCallback(
    (opId: string, angle: number) => {
      mutate(c => ({
        ...c,
        operations: c.operations.map(op =>
          op.id === opId ? { ...op, params: { ...op.params, angle } } : op
        ),
      }))
    },
    [mutate]
  )

  // ── History ────────────────────────────────────────────────────────────────
  const onUndo = useCallback(() => {
    setPast(p => {
      if (p.length === 0) return p
      const prev = p[p.length - 1]
      const newPast = p.slice(0, -1)
      setFuture(f => [circuit, ...f])
      setCircuit(prev)
      setSelectedOp(null)
      return newPast
    })
  }, [circuit])

  const onRedo = useCallback(() => {
    setFuture(f => {
      if (f.length === 0) return f
      const next = f[0]
      const newFuture = f.slice(1)
      setPast(p => [...p, circuit])
      setCircuit(next)
      setSelectedOp(null)
      return newFuture
    })
  }, [circuit])

  // ── Simulation ─────────────────────────────────────────────────────────────
  const setSimulationConfig = useCallback(
    (cfg: Partial<SimulationConfig>) =>
      setSimConfig(prev => ({ ...prev, ...cfg })),
    []
  )

  const onRunSimulation = useCallback(async () => {
    setIsRunning(true)
    setSimulationResult(null)
    try {
      const result = await runMockSimulation(circuit, simulationConfig)
      setSimulationResult(result)
    } finally {
      setIsRunning(false)
    }
  }, [circuit, simulationConfig])

  const onClearResult = useCallback(() => setSimulationResult(null), [])

  return {
    circuit,
    selectedOp,
    placementMode,
    circuitWidth: getCircuitWidth(circuit),
    isRunning,
    simulationResult,
    simulationConfig,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    setCircuitName,
    onAddQubit,
    onRemoveQubit,
    onClearCircuit,
    onLoadStarterCircuit,
    setActiveTool,
    onCellClick,
    onSelectOp,
    onDeleteOp,
    onUpdateOpParam,
    onUndo,
    onRedo,
    setSimulationConfig,
    onRunSimulation,
    onClearResult,
  }
}
