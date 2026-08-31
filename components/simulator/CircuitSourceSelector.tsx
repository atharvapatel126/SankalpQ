import type { CircuitSourceOption } from '@/hooks/useSimulation'

interface CircuitSourceSelectorProps {
  sources: CircuitSourceOption[]
  selectedKey: string
  onChange: (key: string) => void
  disabled?: boolean
}

const GROUP_LABELS: Record<CircuitSourceOption['kind'], string> = {
  current: 'Circuit Builder',
  saved: 'Saved circuits',
  example: 'Example circuits',
}

export default function CircuitSourceSelector({
  sources,
  selectedKey,
  onChange,
  disabled = false,
}: CircuitSourceSelectorProps) {
  const selected = sources.find(source => source.key === selectedKey)
  const groups: CircuitSourceOption['kind'][] = ['current', 'saved', 'example']

  return (
    <div className="simulator-field">
      <label htmlFor="simulator-circuit-source">Circuit source</label>
      <select
        id="simulator-circuit-source"
        className="simulator-select"
        value={selectedKey}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
      >
        {groups.map(group => {
          const options = sources.filter(source => source.kind === group)
          if (options.length === 0) return null

          return (
            <optgroup key={group} label={GROUP_LABELS[group]}>
              {options.map(source => (
                <option key={source.key} value={source.key}>
                  {source.label}
                </option>
              ))}
            </optgroup>
          )
        })}
      </select>
      <span className="simulator-field-help">{selected?.detail}</span>
    </div>
  )
}
