'use client'

import { Lightbulb } from 'lucide-react'

interface HintPanelProps {
  totalHints: number
  visibleHints: string[]
  disabled: boolean
  onReveal: () => void
}

export default function HintPanel({
  totalHints,
  visibleHints,
  disabled,
  onReveal,
}: HintPanelProps) {
  const allRevealed = visibleHints.length >= totalHints

  return (
    <aside className="challenge-hint-panel" aria-labelledby="challenge-hints-title">
      <div className="challenge-panel-heading">
        <Lightbulb size={16} aria-hidden="true" />
        <div>
          <h2 id="challenge-hints-title">Progressive hints</h2>
          <p>{visibleHints.length} of {totalHints} revealed</p>
        </div>
      </div>

      {visibleHints.length > 0 ? (
        <ol className="challenge-hint-list">
          {visibleHints.map((hint, index) => (
            <li key={`${index}-${hint}`}>{hint}</li>
          ))}
        </ol>
      ) : (
        <p className="challenge-hint-empty">
          Reveal one clue at a time when you need it.
        </p>
      )}

      <button
        type="button"
        className="btn-outline challenge-hint-button"
        onClick={onReveal}
        disabled={disabled || allRevealed || totalHints === 0}
      >
        <Lightbulb size={14} aria-hidden="true" />
        {allRevealed
          ? 'All hints revealed'
          : `Reveal hint ${visibleHints.length + 1}`}
      </button>
    </aside>
  )
}
