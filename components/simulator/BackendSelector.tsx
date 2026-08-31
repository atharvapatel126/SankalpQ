import { CheckCircle2, Clock3, Cpu } from 'lucide-react'
import {
  SIMULATOR_BACKENDS,
  type SimulatorBackendId,
} from '@/lib/quantum/simulation-service'

interface BackendSelectorProps {
  selectedId: SimulatorBackendId
  onChange: (backendId: SimulatorBackendId) => void
  disabled?: boolean
}

export default function BackendSelector({
  selectedId,
  onChange,
  disabled = false,
}: BackendSelectorProps) {
  return (
    <fieldset className="simulator-backends" disabled={disabled}>
      <legend>Simulation backend</legend>
      <div className="simulator-backend-list">
        {SIMULATOR_BACKENDS.map(backend => (
          <label
            key={backend.id}
            className={`simulator-backend-option${selectedId === backend.id ? ' is-selected' : ''}${backend.available ? '' : ' is-unavailable'}`}
          >
            <input
              type="radio"
              name="simulator-backend"
              value={backend.id}
              checked={selectedId === backend.id}
              disabled={!backend.available}
              onChange={() => onChange(backend.id)}
            />
            <span className="simulator-backend-icon" aria-hidden="true">
              <Cpu size={16} />
            </span>
            <span className="simulator-backend-copy">
              <strong>{backend.label}</strong>
              <small>{backend.description}</small>
            </span>
            <span className={`simulator-backend-status${backend.available ? ' is-available' : ''}`}>
              {backend.available ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
              {backend.available ? 'Available' : 'Coming soon'}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
