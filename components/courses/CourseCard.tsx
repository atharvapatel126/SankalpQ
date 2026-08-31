import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import CourseProgress from './CourseProgress'
import type { Course, CourseProgressSummary } from '@/lib/courses/types'

interface CourseCardProps {
  course: Course
  summary: CourseProgressSummary
}

const STATUS_LABELS = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
} as const

export default function CourseCard({ course, summary }: CourseCardProps) {
  const href =
    '/courses/' + course.slug + '/' + summary.continueLesson.slug
  const action =
    summary.status === 'completed'
      ? 'Review course'
      : summary.status === 'in-progress'
        ? 'Continue learning'
        : 'Start course'

  return (
    <article className="courses-card card-shadow">
      <div className="courses-card-topline">
        <span className="courses-level-badge">Level {course.level}</span>
        <span className={'courses-status is-' + summary.status}>
          {summary.status === 'completed' ? (
            <CheckCircle2 size={13} aria-hidden="true" />
          ) : (
            <Clock size={13} aria-hidden="true" />
          )}
          {STATUS_LABELS[summary.status]}
        </span>
      </div>

      <div className="courses-card-copy">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
      </div>

      <div className="courses-card-meta">
        <span>
          <BookOpen size={14} aria-hidden="true" />
          {course.lessons.length} lessons
        </span>
        <span>
          {summary.completedLessons} of {summary.totalLessons} complete
        </span>
      </div>

      <CourseProgress
        value={summary.percentage}
        label={course.title + ' progress'}
        compact
      />

      <Link href={href} className="courses-card-action">
        {action}
        <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </Link>
    </article>
  )
}
