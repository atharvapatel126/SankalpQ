'use client'

import type { ContentStatus } from '@/lib/instructor/types'

interface StatusBadgeProps {
  status: ContentStatus | 'active' | 'inactive' | 'needs-attention' | 'draft' | 'published' | 'archived'
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  published: { label: 'Published',  className: 'instructor-badge-published' },
  active:    { label: 'Active',      className: 'instructor-badge-published' },
  draft:     { label: 'Draft',       className: 'instructor-badge-draft' },
  inactive:  { label: 'Inactive',    className: 'instructor-badge-inactive' },
  archived:  { label: 'Archived',    className: 'instructor-badge-inactive' },
  'needs-attention': { label: 'Needs Attention', className: 'instructor-badge-danger' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'instructor-badge-draft' }
  return (
    <span className={`instructor-badge ${config.className}`}>
      {config.label}
    </span>
  )
}
