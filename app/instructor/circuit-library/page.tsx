'use client'

import { CircuitBoard, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CircuitTemplate } from '@/lib/instructor/types'
import { MOCK_CIRCUIT_TEMPLATES } from '@/lib/instructor/mock-data'
import CircuitTemplateCard from '@/components/instructor/CircuitTemplateCard'

const CATEGORY_OPTS = ['All', 'superposition', 'entanglement', 'gates', 'measurement', 'algorithms', 'error-correction']

export default function CircuitLibraryPage() {
  const [templates, setTemplates] = useState<CircuitTemplate[]>([])
  const [category, setCategory] = useState('All')

  useEffect(() => {
    setTemplates([...MOCK_CIRCUIT_TEMPLATES])
  }, [])

  const filtered = category === 'All' ? templates : templates.filter(t => t.category === category)

  return (
    <div>
      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Content Management</div>
            <h1>Circuit Library</h1>
            <p>Manage reusable quantum circuit templates for courses and challenges.</p>
          </div>
          <button type="button" className="btn-primary" style={{ height: 40, fontSize: 14, gap: 6 }}>
            <Plus size={14} /> New Template
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="instructor-filter-bar">
        <div className="instructor-filter-tabs" role="group" aria-label="Filter by category">
          {CATEGORY_OPTS.map(cat => (
            <button
              key={cat}
              type="button"
              className={`instructor-filter-tab${category === cat ? ' is-active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'All' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-tertiary)' }}>
          {filtered.length} template{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="instructor-empty">
          <div className="instructor-empty-icon"><CircuitBoard size={22} /></div>
          <h3>No templates</h3>
          <p>No circuit templates found for this category.</p>
        </div>
      ) : (
        <div className="instructor-grid-3">
          {filtered.map(t => (
            <CircuitTemplateCard
              key={t.id}
              template={t}
              onPreview={() => {}}
              onEdit={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
