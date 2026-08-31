import { Gauge } from 'lucide-react'
import { SHOT_OPTIONS } from '@/lib/quantum/simulation-service'

interface SimulationSettingsProps {
  shots: number
  onChange: (shots: number) => void
  disabled?: boolean
}

export default function SimulationSettings({
  shots,
  onChange,
  disabled = false,
}: SimulationSettingsProps) {
  return (
    <div className="simulator-settings">
      <div className="simulator-settings-heading">
        <Gauge size={16} aria-hidden="true" />
        <span>Execution settings</span>
      </div>
      <div className="simulator-field">
        <label htmlFor="simulator-shots">Shots</label>
        <select
          id="simulator-shots"
          className="simulator-select"
          value={shots}
          onChange={event => onChange(Number(event.target.value))}
          disabled={disabled}
        >
          {SHOT_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option.toLocaleString()}
            </option>
          ))}
        </select>
        <span className="simulator-field-help">Number of repeated measurements.</span>
      </div>
    </div>
  )
}
