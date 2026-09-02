'use client'

import { CircuitBoard } from 'lucide-react'
import type { CircuitTemplate } from '@/lib/instructor/types'
import StatusBadge from './StatusBadge'

const CATEGORY_LABEL: Record<string, string> = {
  superposition:      'Superposition',
  entanglement:       'Entanglement',
  measurement:        'Measurement',
  gates:              'Gates',
  algorithms:         'Algorithms',
  'error-correction': 'Error Correction',
}

interface CircuitTemplateCardProps {
  template: CircuitTemplate
  onPreview?: (template: CircuitTemplate) => void
  onEdit?: (template: CircuitTemplate) => void
  onDelete?: (id: string) => void
}

export default function CircuitTemplateCard({ template, onPreview, onEdit, onDelete }: CircuitTemplateCardProps) {
  return (
    <div className="instructor-card card-shadow">
      <div className="instructor-card-header">
        <div className="module-badge" style={{ background: 'var(--bg-circuit)', color: 'var(--text-circuit)', width: 36, height: 36, borderRadius: 8 }}>
          <CircuitBoard size={16} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="instructor-card-title" style={{ marginBottom: 2 }}>{template.name}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px', color: 'var(--text-tertiary)' }}>
              {CATEGORY_LABEL[template.category]}
            </span>
            <StatusBadge status={template.difficulty as 'draft'} />
          </div>
        </div>
      </div>

      <p className="instructor-card-desc">{template.description}</p>

      <div className="instructor-card-stats">
        <div className="instructor-card-stat">
          <span>Qubits: </span>
          <strong style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>{template.circuit.qubits}</strong>
        </div>
        <div className="instructor-card-stat">
          <span>Gates: </span>
          <strong style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>{template.circuit.operations.length}</strong>
        </div>
      </div>

      <div className="instructor-card-stat" style={{ marginTop: 8, padding: '8px 10px', background: 'var(--surface-raised)', borderRadius: 6, fontSize: 13 }}>
        <span style={{ color: 'var(--text-tertiary)' }}>Expected: </span>
        <code style={{ fontFamily: 'var(--font-geist-mono), monospace', color: 'var(--accent)', fontSize: 12 }}>{template.expectedResult}</code>
      </div>

      <div className="instructor-card-actions" style={{ marginTop: 12 }}>
        {onPreview && (
          <button type="button" className="btn-outline" style={{ height: 34, fontSize: 13 }} onClick={() => onPreview(template)}>
            Preview
          </button>
        )}
        {onEdit && (
          <button type="button" className="btn-outline" style={{ height: 34, fontSize: 13 }} onClick={() => onEdit(template)}>
            Edit
          </button>
        )}
        {onDelete && (
          <button type="button" className="toolbar-icon-btn toolbar-icon-btn-danger" style={{ height: 34, width: 34, padding: 0, justifyContent: 'center' }} onClick={() => onDelete(template.id)}>
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
