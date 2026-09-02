'use client'

import { Search } from 'lucide-react'
import StudentTable from '@/components/instructor/StudentTable'
import { useStudents } from '@/hooks/useStudents'
import type { StudentFilter } from '@/lib/instructor/types'

const FILTERS: { label: string; value: StudentFilter }[] = [
  { label: 'All',              value: 'all' },
  { label: 'Active',           value: 'active' },
  { label: 'Inactive',         value: 'inactive' },
  { label: 'Needs Attention',  value: 'needs-attention' },
  { label: 'High Performing',  value: 'high-performing' },
]

export default function StudentsPage() {
  const { filtered, loading, search, setSearch, filter, setFilter } = useStudents()

  return (
    <div>
      <div className="instructor-page-header">
        <div className="dashboard-eyebrow-mono">Student Management</div>
        <h1>Students</h1>
        <p>Track individual student progress, identify struggles, and manage your cohort.</p>
      </div>

      {/* Filter bar */}
      <div className="instructor-filter-bar">
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
          <input
            type="search"
            className="form-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, maxWidth: 280 }}
            aria-label="Search students"
          />
        </div>
        <div className="instructor-filter-tabs" role="group" aria-label="Filter students">
          {FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              className={`instructor-filter-tab${filter === f.value ? ' is-active' : ''}`}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-tertiary)' }}>
          {filtered.length} student{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <StudentTable students={filtered} loading={loading} />
    </div>
  )
}
