'use client'

import Link from 'next/link'
import type { StudentOverview } from '@/lib/instructor/types'
import StatusBadge from './StatusBadge'

interface StudentTableProps {
  students: StudentOverview[]
  loading: boolean
}

export default function StudentTable({ students, loading }: StudentTableProps) {
  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        Loading students…
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        No students match your search or filter.
      </div>
    )
  }

  return (
    <div className="instructor-table-wrap">
      <table className="instructor-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Progress</th>
            <th>Courses</th>
            <th>Challenges</th>
            <th>Avg Quiz</th>
            <th>Streak</th>
            <th>Last Active</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const lastActive = student.lastActiveAt
              ? new Date(student.lastActiveAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : 'Never'

            return (
              <tr key={student.id}>
                <td>
                  <div className="student-table-name-cell">
                    <div className="app-avatar" aria-hidden="true" style={{ flexShrink: 0 }}>
                      {student.avatarInitials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 14 }}>{student.name}</div>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>{student.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="student-progress-cell">
                    <div className="instructor-concept-bar-track" style={{ width: 80 }}>
                      <div
                        className="instructor-concept-bar-fill"
                        style={{ width: `${student.overallProgress}%`, backgroundColor: 'var(--accent)' }}
                      />
                    </div>
                    <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>
                      {student.overallProgress}%
                    </span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}>{student.coursesCompleted}</td>
                <td style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}>{student.challengesCompleted}</td>
                <td style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}>{student.averageQuizScore}%</td>
                <td style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}>{student.learningStreak}d</td>
                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{lastActive}</td>
                <td><StatusBadge status={student.status} /></td>
                <td>
                  <Link
                    href={`/instructor/students/${student.id}`}
                    className="btn-outline"
                    style={{ height: 30, fontSize: 12, padding: '0 10px' }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
