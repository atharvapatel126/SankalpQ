interface CourseProgressProps {
  value: number
  label: string
  compact?: boolean
}

export default function CourseProgress({
  value,
  label,
  compact = false,
}: CourseProgressProps) {
  const boundedValue = Math.max(0, Math.min(100, value))

  return (
    <div className={compact ? 'courses-progress is-compact' : 'courses-progress'}>
      <div className="courses-progress-copy">
        <span>{label}</span>
        <strong>{boundedValue}%</strong>
      </div>
      <div
        className="courses-progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={boundedValue}
      >
        <span
          className="courses-progress-fill"
          style={{ width: boundedValue + '%' }}
        />
      </div>
    </div>
  )
}
