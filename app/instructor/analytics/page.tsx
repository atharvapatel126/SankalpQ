'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import InstructorStats from '@/components/instructor/InstructorStats'
import AnalyticsChart from '@/components/instructor/AnalyticsChart'
import ConceptProgressBar from '@/components/instructor/ConceptProgressBar'

export default function AnalyticsPage() {
  const { analytics, loading } = useAnalytics()

  if (loading) return <div style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>Loading analytics…</div>
  if (!analytics) return null

  const growthData = analytics.studentGrowth.map(g => ({ label: g.month, value: g.students }))
  const courseData = analytics.courseAnalytics.slice(0, 5).map(c => ({ label: c.courseTitle.split(' ').slice(0, 2).join(' '), value: c.completionRate }))
  const challengeData = analytics.challengeAnalytics.slice(0, 5).map(c => ({ label: c.challengeTitle.split(' ').slice(0, 3).join(' '), value: c.completionRate }))

  return (
    <div>
      <div className="instructor-page-header">
        <div>
          <div className="dashboard-eyebrow-mono">Platform Insights</div>
          <h1>Analytics</h1>
          <p>Comprehensive platform analytics — student growth, course performance, and concept difficulty.</p>
        </div>
      </div>

      {/* Top stats */}
      <InstructorStats stats={[
        { label: 'Total Students',    value: analytics.totalStudents },
        { label: 'Active Students',   value: analytics.activeStudents },
        { label: 'Total Courses',     value: analytics.totalCourses },
        { label: 'Active Challenges', value: analytics.activeChallenges },
        { label: 'Avg Completion',    value: `${analytics.averageCourseCompletion}%` },
        { label: 'Avg Quiz Score',    value: `${analytics.averageQuizScore}%` },
      ]} />

      {/* Main two-column grid */}
      <div className="instructor-dashboard-grid">
        {/* Left column */}
        <div>
          {/* Student growth */}
          <div className="instructor-section">
            <h2 className="instructor-section-title">Student Growth (Monthly)</h2>
            <div className="instructor-form-section" style={{ padding: 20 }}>
              <AnalyticsChart data={growthData} unit="" barColor="var(--accent)" />
            </div>
          </div>

          {/* Course completion */}
          <div className="instructor-section">
            <h2 className="instructor-section-title">Course Completion Rates</h2>
            <div className="instructor-form-section" style={{ padding: 20 }}>
              <AnalyticsChart data={courseData} maxValue={100} unit="%" barColor="var(--text-circuit)" />
            </div>
          </div>

          {/* Challenge completion */}
          <div className="instructor-section">
            <h2 className="instructor-section-title">Challenge Completion Rates</h2>
            <div className="instructor-form-section" style={{ padding: 20 }}>
              <AnalyticsChart data={challengeData} maxValue={100} unit="%" barColor="var(--text-challenge)" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Concept difficulty */}
          <div className="instructor-section">
            <h2 className="instructor-section-title">Concept Difficulty Map</h2>
            <div className="instructor-form-section" style={{ padding: 20 }}>
              {analytics.conceptDifficulty.map(c => (
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

          {/* Course detail table */}
          <div className="instructor-section">
            <h2 className="instructor-section-title">Course Performance</h2>
            <div className="instructor-table-wrap">
              <table className="instructor-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Enrolled</th>
                    <th>Completion</th>
                    <th>Avg Quiz</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.courseAnalytics.map(c => (
                    <tr key={c.courseId}>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.courseTitle}</td>
                      <td style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}>{c.enrolled}</td>
                      <td style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}>{c.completionRate > 0 ? `${c.completionRate}%` : '—'}</td>
                      <td style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}>{c.averageQuizScore > 0 ? `${c.averageQuizScore}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
