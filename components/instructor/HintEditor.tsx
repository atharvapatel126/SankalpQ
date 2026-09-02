'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { ChallengeHint } from '@/lib/instructor/types'

interface HintEditorProps {
  hints: ChallengeHint[]
  onChange: (hints: ChallengeHint[]) => void
}

export default function HintEditor({ hints, onChange }: HintEditorProps) {
  const addHint = () => {
    onChange([...hints, { order: hints.length + 1, text: '' }])
  }

  const updateHint = (idx: number, text: string) => {
    const updated = [...hints]
    updated[idx] = { ...updated[idx], text }
    onChange(updated)
  }

  const removeHint = (idx: number) => {
    const updated = hints
      .filter((_, i) => i !== idx)
      .map((h, i) => ({ ...h, order: i + 1 }))
    onChange(updated)
  }

  return (
    <div className="hint-editor">
      <div className="hint-editor-label">
        Progressive Hints
        <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: 8, fontSize: 12 }}>
          Reveal hints one at a time — keep them progressive
        </span>
      </div>

      <div className="hint-list">
        {hints.map((hint, idx) => (
          <div key={idx} className="hint-item">
            <div className="hint-item-index">Hint {hint.order}</div>
            <textarea
              className="form-input hint-item-input"
              value={hint.text}
              onChange={e => updateHint(idx, e.target.value)}
              placeholder={`e.g. ${idx === 0 ? 'Start by placing a gate on the first qubit.' : idx === 1 ? 'Which gate creates superposition?' : 'Apply the Hadamard gate to qubit 0.'}`}
              rows={2}
              style={{ resize: 'vertical', height: 'auto', minHeight: 60, paddingTop: 8, paddingBottom: 8 }}
            />
            <button
              type="button"
              className="toolbar-icon-btn toolbar-icon-btn-danger"
              onClick={() => removeHint(idx)}
              aria-label={`Remove hint ${hint.order}`}
              title="Remove hint"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {hints.length < 5 && (
        <button type="button" className="btn-outline" style={{ height: 36, fontSize: 13, marginTop: 8 }} onClick={addHint}>
          <Plus size={14} />
          Add Hint
        </button>
      )}
    </div>
  )
}
