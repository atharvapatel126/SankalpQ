'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Target, Bell, CircuitBoard, ClipboardList, ArrowRight } from 'lucide-react'
import InstructorStats from '@/components/instructor/InstructorStats'
import AIInsightsPanel from '@/components/instructor/AIInsightsPanel'
import ConceptProgressBar from '@/components/instructor/ConceptProgressBar'
import type { PlatformAnalytics, AIInsight } from '@/lib/instructor/types'
import { getPlatformAnalytics } from '@/lib/instructor/services/analytics'
import { getInstructorInsights } from '@/lib/instructor/services/ai-insights'
import { MOCK_STUDENTS } from '@/lib/instructor/mock-data'

const QUICK_ACTIONS = [
  { label: 'New Course',        href: '/instructor/courses',        icon: BookOpen },
  { label: 'New Challenge',     href: '/instructor/challenges',     icon: Target },
  { label: 'New Announcement',  href: '/instructor/announcements',  icon: Bell },
  { label: 'New Assessment',    href: '/instructor/assessments',    icon: ClipboardList },
]

export default function InstructorDashboard() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])

  useEffect(() => {
    void getPlatformAnalytics().then(setAnalytics)
    void getInstructorInsights().then(setInsights)
  }, [])

  const needsAttention = MOCK_STUDENTS.filter(s => s.status === 'needs-attention')
  const recent = MOCK_STUDENTS.filter(s => s.status === 'active').slice(0, 4)

  return (
    <div>
      {/* Header */}
      <div className="instructor-page-header">
        <div className="instructor-page-header-row">
          <div>
            <div className="dashboard-eyebrow-mono">Instructor Portal</div>
            <h1>Dashboard</h1>
            <p>Platform overview, AI insights, and student activity at a glance.</p>
          </div>
          <div className="instructor-quick-actions">
            {QUICK_ACTIONS.map(a => {
              const Icon = a.icon
              return (
                <Link key={a.href} href={a.href} className="btn-outline" style={{ height: 38, fontSize: 13, gap: 6 }}>
                  <Icon size={14} strokeWidth={1.5} />
                  {a.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {analytics && (
        <InstructorStats stats={[
          { label: 'Total Students',    value: analytics.totalStudents,    sub: `${analytics.activeStudents} active` },
          { label: 'Total Courses',     value: analytics.totalCourses,     sub: `All published` },
          { label: 'Active Challenges', value: analytics.activeChallenges, sub: `Live on platform` },
          { label: 'Avg Completion',    value: `${analytics.averageCourseCompletion}%`, sub: `Course progress` },
          { label: 'Avg Quiz Score',    value: `${analytics.averageQuizScore}%`,  sub: `Platform-wide` },
          { label: 'Needs Attention',   value: needsAttention.length,      sub: `Students inactive 7d+` },
        ]} />
      )}

      {/* Main grid */}
      <div className="instructor-dashboard-grid">
        {/* Left: AI Insights */}
        <div>
          <div className="instructor-section">
            <div className="instructor-section-header">
              <h2 className="instructor-section-title" style={{ marginBottom: 0 }}>AI-Powered Insights</h2>
              <Link href="/instructor/analytics" className="btn-outline" style={{ height: 32, fontSize: 12 }}>
                View Analytics <ArrowRight size={13} />
              </Link>
            </div>
            <AIInsightsPanel insights={insights} maxVisible={4} />
          </div>

          {/* Concept struggle */}
          {analytics && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Top Struggling Concepts</h2>
              <div className="instructor-form-section" style={{ padding: 16 }}>
                {analytics.conceptDifficulty.slice(0, 6).map(c => (
                  <ConceptProgressBar
                    key={c.concept}
                    concept={c.concept}
                    percentage={c.strugglingPercentage}
                    count={c.totalStudents}
                    variant="struggle"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Students + Recent */}
        <div>
          {/* Needs attention */}
          {needsAttention.length > 0 && (
            <div className="instructor-section">
              <div className="instructor-section-header">
                <h2 className="instructor-section-title" style={{ marginBottom: 0, color: 'var(--danger)' }}>
                  ⚠ Needs Attention ({needsAttention.length})
                </h2>
                <Link href="/instructor/students?filter=needs-attention" className="btn-outline" style={{ height: 32, fontSize: 12 }}>
                  View All
                </Link>
              </div>
              <div className="instructor-form-section" style={{ padding: 0, overflow: 'hidden' }}>
                {needsAttention.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div className="app-avatar" style={{ flexShrink: 0 }}>{s.avatarInitials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                        {s.overallProgress}% progress · {s.averageQuizScore}% avg quiz
                      </div>
                    </div>
                    <Link href={`/instructor/students/${s.id}`} className="btn-outline" style={{ height: 30, fontSize: 12 }}>
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent active students */}
          <div className="instructor-section">
            <div className="instructor-section-header">
              <h2 className="instructor-section-title" style={{ marginBottom: 0 }}>Recent Student Activity</h2>
              <Link href="/instructor/students" className="btn-outline" style={{ height: 32, fontSize: 12 }}>
                All Students
              </Link>
            </div>
            <div className="instructor-form-section" style={{ padding: 0, overflow: 'hidden' }}>
              {recent.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="app-avatar" style={{ flexShrink: 0 }}>{s.avatarInitials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {s.overallProgress}% progress · Streak: {s.learningStreak}d
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12 }}>
                    <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {s.averageQuizScore}%
                    </div>
                    <div style={{ color: 'var(--text-tertiary)' }}>Avg Quiz</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick navigation */}
          <div className="instructor-section">
            <h2 className="instructor-section-title">Quick Navigate</h2>
            <div className="instructor-grid-2">
              {[
                { href: '/instructor/courses',       icon: BookOpen,     label: 'Courses',        sub: '5 courses' },
                { href: '/instructor/challenges',    icon: Target,       label: 'Challenges',     sub: '5 active' },
                { href: '/instructor/circuit-library',icon: CircuitBoard, label: 'Circuit Library',sub: '5 templates' },
                { href: '/instructor/announcements', icon: Bell,         label: 'Announcements',  sub: '3 published' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} className="instructor-card" style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.sub}</div>
                      </div>
                      <ArrowRight size={14} strokeWidth={1.5} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
