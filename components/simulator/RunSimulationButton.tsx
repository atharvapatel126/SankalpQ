import { Play } from 'lucide-react'

interface RunSimulationButtonProps {
  isRunning: boolean
  onRun: () => void
}

export default function RunSimulationButton({
  isRunning,
  onRun,
}: RunSimulationButtonProps) {
  return (
    <button
      type="button"
      className="btn-primary simulator-run-button"
      onClick={onRun}
      disabled={isRunning}
    >
      {isRunning ? (
        <span className="spinner" aria-hidden="true" />
      ) : (
        <Play size={16} aria-hidden="true" />
      )}
      {isRunning ? 'Running simulation...' : 'Run Simulation'}
    </button>
  )
}
