'use client'

import { AlertTriangle, ArrowRight, TrendingUp, Users, Lightbulb, BookOpen } from 'lucide-react'
import type { AIInsight, InsightType } from '@/lib/instructor/types'

const ICON_MAP: Record<InsightType, typeof TrendingUp> = {
  'concept-struggle':        AlertTriangle,
  'course-improvement':      BookOpen,
  'challenge-recommendation': Lightbulb,
  'student-at-risk':         Users,
  'positive-trend':          TrendingUp,
}

const PRIORITY_STYLE: Record<string, string> = {
  high:   'ai-insight-card--high',
  medium: 'ai-insight-card--medium',
  low:    'ai-insight-card--low',
}

interface AIInsightsPanelProps {
  insights: AIInsight[]
  maxVisible?: number
}

export default function AIInsightsPanel({ insights, maxVisible = 3 }: AIInsightsPanelProps) {
  const visible = insights.slice(0, maxVisible)

  if (visible.length === 0) {
    return (
      <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', padding: '16px 0' }}>
        No insights available right now.
      </div>
    )
  }

  return (
    <div className="ai-insights-list">
      {visible.map(insight => {
        const Icon = ICON_MAP[insight.type] ?? Lightbulb
        return (
          <div key={insight.id} className={`ai-insight-card ${PRIORITY_STYLE[insight.priority] ?? ''}`}>
            <div className="ai-insight-header">
              <div className="ai-insight-icon-wrap">
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <div className="ai-insight-meta">
                <span className="ai-insight-title">{insight.title}</span>
                <span className={`ai-insight-priority ai-insight-priority--${insight.priority}`}>
                  {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
                </span>
              </div>
            </div>
            <p className="ai-insight-message">{insight.message}</p>
            <div className="ai-insight-recommendation">
              <ArrowRight size={13} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{insight.recommendation}</span>
            </div>
            <div className="ai-insight-footer">
              <span>{insight.affectedStudentCount} students affected</span>
              <span className="ai-insight-concept">{insight.relatedConceptOrCourse}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
