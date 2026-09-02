'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Flame, Target } from 'lucide-react'
import type { StudentDetail } from '@/lib/instructor/types'
import { getStudentById } from '@/lib/instructor/services/students'
import InstructorStats from '@/components/instructor/InstructorStats'
import StatusBadge from '@/components/instructor/StatusBadge'
import ConceptProgressBar from '@/components/instructor/ConceptProgressBar'

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getStudentById(id).then(s => {
      setStudent(s)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div style={{ padding: '40px 0', color: 'var(--text-tertiary)' }}>Loading…</div>
  if (!student) return (
    <div>
      <Link href="/instructor/students" className="btn-outline" style={{ height: 34, fontSize: 13, marginBottom: 24, display: 'inline-flex', gap: 6 }}>
        <ArrowLeft size={14} /> Back
      </Link>
      <div className="instructor-empty">
        <div className="instructor-empty-icon"><Target size={22} /></div>
        <h3>Student not found</h3>
        <p>This student profile could not be loaded.</p>
      </div>
    </div>
  )

  const lastActive = student.lastActiveAt
    ? new Date(student.lastActiveAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Never'

  return (
    <div>
      {/* Back */}
      <Link href="/instructor/students" className="btn-outline" style={{ height: 34, fontSize: 13, marginBottom: 24, display: 'inline-flex', gap: 6 }}>
        <ArrowLeft size={14} /> Back to Students
      </Link>

      {/* Profile header */}
      <div className="instructor-form-section" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="app-avatar" style={{ width: 56, height: 56, fontSize: 20, borderRadius: '50%' }}>
            {student.avatarInitials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>{student.name}</h1>
              <StatusBadge status={student.status} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>{student.email}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> Last active: {lastActive}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={13} /> {student.learningStreak}-day streak</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Joined {new Date(student.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <InstructorStats stats={[
        { label: 'Overall Progress',  value: `${student.overallProgress}%` },
        { label: 'Courses Completed', value: student.coursesCompleted },
        { label: 'Lessons Done',      value: student.lessonsCompleted },
        { label: 'Challenges Done',   value: student.challengesCompleted },
        { label: 'Avg Quiz Score',    value: `${student.averageQuizScore}%` },
        { label: 'Learning Streak',   value: `${student.learningStreak}d` },
      ]} />

      <div className="instructor-dashboard-grid">
        {/* Left: Concepts + Course Progress */}
        <div>
          {/* Concept groups */}
          <div className="instructor-section">
            <h2 className="instructor-section-title">Concept Strengths & Weaknesses</h2>
            <div className="instructor-form-section" style={{ padding: 20 }}>
              <div className="student-concept-groups">
                <div>
                  <div className="student-concept-group-title" style={{ color: 'var(--text-circuit)' }}>✓ Strong</div>
                  {student.strongConcepts.length === 0
                    ? <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>None yet</span>
                    : student.strongConcepts.map(c => (
                      <span key={c} className="student-concept-pill student-concept-pill-strong">{c}</span>
                    ))
                  }
                </div>
                <div>
                  <div className="student-concept-group-title" style={{ color: 'var(--danger)' }}>⚠ Needs Work</div>
                  {student.weakConcepts.length === 0
                    ? <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>None identified</span>
                    : student.weakConcepts.map(c => (
                      <span key={c} className="student-concept-pill student-concept-pill-weak">{c}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Course progress */}
          {student.courseProgress.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Course Progress</h2>
              <div className="instructor-form-section" style={{ padding: 20 }}>
                {student.courseProgress.map(cp => (
                  <div key={cp.courseId} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{cp.courseTitle}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                        {cp.completedLessons}/{cp.totalLessons} lessons
                      </span>
                    </div>
                    <ConceptProgressBar concept="" percentage={cp.percentage} variant="progress" />
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                      Quiz avg: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-geist-mono), monospace' }}>{cp.averageQuizScore}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Activity + Challenges */}
        <div>
          {/* Recent activity */}
          {student.recentActivity.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Recent Activity</h2>
              <div className="instructor-form-section" style={{ padding: '8px 16px' }}>
                {student.recentActivity.map(a => {
                  const time = new Date(a.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  return (
                    <div key={a.id} className="instructor-activity-row">
                      <div className="instructor-activity-dot" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="instructor-activity-label">{a.label}</div>
                        <div className="instructor-activity-detail">{a.detail}</div>
                      </div>
                      <div className="instructor-activity-time">{time}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Challenge progress */}
          {student.challengeProgress.length > 0 && (
            <div className="instructor-section">
              <h2 className="instructor-section-title">Challenges</h2>
              <div className="instructor-form-section" style={{ padding: 0, overflow: 'hidden' }}>
                {student.challengeProgress.map(cp => (
                  <div key={cp.challengeId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, background: cp.completed ? 'color-mix(in srgb, var(--text-circuit) 12%, transparent)' : 'var(--surface-raised)', border: '1px solid var(--border)', fontSize: 14 }}>
                      {cp.completed ? '✓' : '○'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-primary)' }}>{cp.challengeTitle}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                        {cp.attempts} attempt{cp.attempts !== 1 ? 's' : ''} · Best: {cp.bestScore}% · Hints: {cp.hintsUsed}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
