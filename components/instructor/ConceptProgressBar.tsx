'use client'

interface ConceptProgressBarProps {
  concept: string
  percentage: number
  count?: number
  variant?: 'progress' | 'struggle'
}

export default function ConceptProgressBar({
  concept,
  percentage,
  count,
  variant = 'progress',
}: ConceptProgressBarProps) {
  const fillColor =
    variant === 'struggle'
      ? percentage > 40
        ? 'var(--danger)'
        : 'var(--text-challenge)'
      : 'var(--accent)'

  return (
    <div className="instructor-concept-bar">
      <div className="instructor-concept-bar-header">
        <span className="instructor-concept-bar-label">{concept}</span>
        <span className="instructor-concept-bar-pct" style={{ color: fillColor }}>
          {percentage}%
          {count !== undefined && (
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: 4 }}>
              ({count} students)
            </span>
          )}
        </span>
      </div>
      <div className="instructor-concept-bar-track">
        <div
          className="instructor-concept-bar-fill"
          style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: fillColor }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${concept}: ${percentage}%`}
        />
      </div>
    </div>
  )
}
