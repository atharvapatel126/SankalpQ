'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Users } from 'lucide-react'
import type { InstructorCourse } from '@/lib/instructor/types'
import StatusBadge from './StatusBadge'

const LEVEL_LABEL: Record<string, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
}

interface CourseCardProps {
  course: InstructorCourse
  onStatusChange?: (id: string, status: 'published' | 'archived' | 'draft') => void
}

export default function CourseCard({ course, onStatusChange }: CourseCardProps) {
  return (
    <div className="instructor-card card-shadow">
      <div className="instructor-card-header">
        <div className="instructor-card-icon module-badge" style={{ background: 'var(--bg-course)', color: 'var(--text-course)', width: 40, height: 40, marginBottom: 0 }}>
          <BookOpen size={18} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="instructor-card-title">{course.title}</div>
          <div className="instructor-card-sub">{LEVEL_LABEL[course.level]} · {course.lessons.length} Lessons</div>
        </div>
        <StatusBadge status={course.status} />
      </div>

      <p className="instructor-card-desc">{course.description}</p>

      <div className="instructor-card-stats">
        <div className="instructor-card-stat">
          <Users size={13} strokeWidth={1.5} />
          <span>{course.studentsEnrolled} enrolled</span>
        </div>
        <div className="instructor-card-stat">
          <span>Completion: </span>
          <strong>{course.completionRate}%</strong>
        </div>
        <div className="instructor-card-stat">
          <span>Avg Quiz: </span>
          <strong>{course.averageQuizScore > 0 ? `${course.averageQuizScore}%` : '—'}</strong>
        </div>
      </div>

      <div className="instructor-card-actions">
        <Link href={`/instructor/courses/${course.id}`} className="btn-outline" style={{ height: 34, fontSize: 13 }}>
          Edit Course
        </Link>
        <Link href={`/instructor/courses/${course.id}/lessons`} className="btn-outline" style={{ height: 34, fontSize: 13 }}>
          Lessons
        </Link>
        {onStatusChange && course.status !== 'archived' && (
          <button
            type="button"
            className="btn-outline"
            style={{ height: 34, fontSize: 13 }}
            onClick={() => onStatusChange(course.id, course.status === 'published' ? 'draft' : 'published')}
          >
            {course.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        )}
        <Link href={`/instructor/courses/${course.id}`} className="instructor-card-arrow" aria-hidden="true">
          <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  )
}
