'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Check, CircuitBoard, RotateCcw, RotateCw, Undo2 } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import CircuitGrid from '@/components/circuit/CircuitGrid'
import GatePalette from '@/components/circuit/GatePalette'
import GatePropertiesPanel from '@/components/circuit/GatePropertiesPanel'
import { useCircuit } from '@/hooks/useCircuit'
import type { UseChallengeSessionReturn } from '@/hooks/useChallengeSession'
import { cloneChallengeCircuit } from '@/lib/challenges/challenge-data'
import type { CircuitChallenge } from '@/lib/challenges/types'
import { setCurrentCircuit } from '@/lib/quantum/circuit-storage'

interface CircuitChallengeWorkspaceProps {
  challenge: CircuitChallenge
  session: UseChallengeSessionReturn
}

export default function CircuitChallengeWorkspace({
  challenge,
  session,
}: CircuitChallengeWorkspaceProps) {
  const router = useRouter()
  const { translations } = useLanguage()
  const t = translations.student.challenges
  const common = translations.student.common
  const initialCircuit = useMemo(
    () => cloneChallengeCircuit(challenge.initialCircuit),
    [challenge.initialCircuit]
  )
  const editor = useCircuit({ initialCircuit, persist: false })
  const submissionLocked = session.result !== null

  const resetCircuit = () => {
    editor.loadCircuit(cloneChallengeCircuit(challenge.initialCircuit))
    session.restart()
  }

  const openInCircuitBuilder = () => {
    setCurrentCircuit(editor.circuit)
    router.push(`/circuit-builder?source=challenge&challenge=${challenge.id}`)
  }

  return (
    <section className="challenge-task" aria-labelledby="challenge-workspace-title">
      <div className="challenge-task-toolbar">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">{t.workspace}</span>
          <h2 id="challenge-workspace-title">
            {challenge.type === 'fix-circuit' ? t.repairCircuit : t.buildCircuit}
          </h2>
        </div>
        <div className="challenge-circuit-summary">
          {editor.circuit.qubits}q / {editor.circuit.operations.length} ops
        </div>
        <div className="challenge-editor-actions" role="toolbar" aria-label={t.circuitControls}>
          <button
            type="button"
            className="challenge-icon-button"
            onClick={editor.onUndo}
            disabled={!editor.canUndo || submissionLocked}
            aria-label={common.undo}
            title={common.undo}
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            className="challenge-icon-button"
            onClick={editor.onRedo}
            disabled={!editor.canRedo || submissionLocked}
            aria-label={common.redo}
            title={common.redo}
          >
            <RotateCw size={15} />
          </button>
          <button
            type="button"
            className="btn-outline challenge-reset-button"
            onClick={resetCircuit}
          >
            <RotateCcw size={14} aria-hidden="true" />
            {common.reset}
          </button>
          <button
            type="button"
            className="btn-outline challenge-builder-button"
            onClick={openInCircuitBuilder}
          >
            <CircuitBoard size={14} aria-hidden="true" />
            {t.openInCircuitBuilder}
          </button>
          <button
            type="button"
            className="btn-primary challenge-submit-button"
            onClick={() => session.submitCircuit(editor.circuit)}
            disabled={submissionLocked}
          >
            <Check size={15} aria-hidden="true" />
            {t.submitCircuit}
          </button>
        </div>
      </div>

      <div className={`challenge-circuit-layout${submissionLocked ? ' is-locked' : ''}`}>
        <GatePalette
          placementMode={editor.placementMode}
          onSelectGate={editor.setActiveTool}
        />
        <div className="challenge-circuit-center">
          <div className="circuit-grid-scroll">
            <CircuitGrid
              circuit={editor.circuit}
              circuitWidth={editor.circuitWidth}
              placementMode={editor.placementMode}
              selectedOpId={editor.selectedOp?.id ?? null}
              onCellClick={editor.onCellClick}
              onSelectOp={editor.onSelectOp}
            />
          </div>
        </div>
        <GatePropertiesPanel
          op={editor.selectedOp}
          onClose={() => editor.onSelectOp(null)}
          onDelete={editor.onDeleteOp}
          onUpdateParam={editor.onUpdateOpParam}
        />
      </div>
    </section>
  )
}
