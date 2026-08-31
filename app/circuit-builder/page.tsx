'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Circuit Builder Page — /circuit-builder
// Assembles all circuit builder components using the useCircuit hook
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import GatePalette from '@/components/circuit/GatePalette'
import CircuitGrid from '@/components/circuit/CircuitGrid'
import GatePropertiesPanel from '@/components/circuit/GatePropertiesPanel'
import CircuitToolbar from '@/components/circuit/CircuitToolbar'
import CircuitResultsPreview from '@/components/circuit/CircuitResultsPreview'
import { useCircuit } from '@/hooks/useCircuit'
import type { GateId } from '@/lib/quantum/types'
import { saveCircuit, setCurrentCircuit } from '@/lib/quantum/circuit-storage'
import { STARTER_CIRCUIT_MAP } from '@/lib/quantum/starter-circuits'

export default function CircuitBuilderPage() {
  const router = useRouter()
  const queryHandled = useRef(false)
  const {
    circuit,
    selectedOp,
    placementMode,
    circuitWidth,
    isRunning,
    simulationResult,
    simulationConfig,
    canUndo,
    canRedo,
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
  } = useCircuit()

  useEffect(() => {
    if (queryHandled.current) return
    queryHandled.current = true

    const starterId = new URLSearchParams(window.location.search).get('starter')
    if (starterId && STARTER_CIRCUIT_MAP[starterId]) onLoadStarterCircuit(starterId)
  }, [onLoadStarterCircuit])

  const handleSave = useCallback(() => {
    saveCircuit(circuit)
    const json = JSON.stringify(circuit, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${circuit.name.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [circuit])

  const handleOpenSimulator = useCallback(() => {
    setCurrentCircuit(circuit)
    router.push('/simulator?source=builder')
  }, [circuit, router])

  return (
    <AppShell>
      <div className="circuit-builder-page">
        {/* Page header */}
        <div className="circuit-page-header">
          <div>
            <h1 className="circuit-page-title">Circuit Builder</h1>
            <p className="circuit-page-subtitle">
              Build quantum circuits by placing gates on qubit wires.{' '}
              <span className="circuit-page-hint">
                Select a gate from the palette, then click a cell to place it.
              </span>
            </p>
          </div>
          <div className="circuit-page-meta">
            <span className="circuit-json-badge">
              {circuit.qubits}q / {circuit.operations.length} ops
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <CircuitToolbar
          circuit={circuit}
          isRunning={isRunning}
          canUndo={canUndo}
          canRedo={canRedo}
          simulationConfig={simulationConfig}
          onSetName={setCircuitName}
          onAddQubit={onAddQubit}
          onRemoveQubit={onRemoveQubit}
          onClear={onClearCircuit}
          onUndo={onUndo}
          onRedo={onRedo}
          onRun={onRunSimulation}
          onSave={handleSave}
          onOpenSimulator={handleOpenSimulator}
          onLoadStarter={onLoadStarterCircuit}
          onShotsChange={shots => setSimulationConfig({ shots })}
        />

        {/* Three-column layout */}
        <div className="circuit-workspace">
          {/* Left — Gate Palette */}
          <GatePalette
            placementMode={placementMode}
            onSelectGate={gate => setActiveTool(gate as GateId | null)}
          />

          {/* Center — Circuit Grid */}
          <div className="circuit-center-col">
            <div className="circuit-grid-scroll">
              <CircuitGrid
                circuit={circuit}
                circuitWidth={circuitWidth}
                placementMode={placementMode}
                selectedOpId={selectedOp?.id ?? null}
                onCellClick={onCellClick}
                onSelectOp={onSelectOp}
              />
            </div>

            {/* Results panel below grid */}
            {simulationResult && !isRunning && (
              <CircuitResultsPreview
                result={simulationResult}
                onClose={onClearResult}
              />
            )}

            {isRunning && (
              <div className="circuit-running-indicator" role="status" aria-live="polite">
                <span className="spinner" aria-hidden="true" />
                <span>Running simulation on {simulationConfig.shots.toLocaleString()} shots…</span>
              </div>
            )}
          </div>

          {/* Right — Properties Panel */}
          <GatePropertiesPanel
            op={selectedOp}
            onClose={() => onSelectOp(null)}
            onDelete={onDeleteOp}
            onUpdateParam={onUpdateOpParam}
          />
        </div>

        {/* Circuit JSON inspector (dev aid) */}
        <details className="circuit-json-inspector">
          <summary className="dashboard-eyebrow dashboard-eyebrow-mono">
            Circuit JSON Model
          </summary>
          <pre className="circuit-json-pre" aria-label="Circuit JSON representation">
            {JSON.stringify(circuit, null, 2)}
          </pre>
        </details>
      </div>
    </AppShell>
  )
}
