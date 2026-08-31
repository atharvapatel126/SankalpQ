import Link from 'next/link'
import { CheckCircle2, Circle } from 'lucide-react'
import CourseProgress from './CourseProgress'
import type { Course } from '@/lib/courses/types'

interface LessonSidebarProps {
  course: Course
  activeLessonId: string
  completedLessonIds: string[]
  percentage: number
}

export default function LessonSidebar({
  course,
  activeLessonId,
  completedLessonIds,
  percentage,
}: LessonSidebarProps) {
  const completed = new Set(completedLessonIds)

  return (
    <aside className="courses-lesson-sidebar" aria-label={course.title + ' lessons'}>
      <div className="courses-sidebar-header">
        <span className="courses-level-badge">Level {course.level}</span>
        <h2>{course.title}</h2>
        <CourseProgress
          value={percentage}
          label={course.title + ' completion'}
          compact
        />
      </div>

      <nav className="courses-lesson-nav">
        {course.lessons.map(lesson => {
          const isActive = lesson.id === activeLessonId
          const isComplete = completed.has(lesson.id)

          return (
            <Link
              key={lesson.id}
              href={'/courses/' + course.slug + '/' + lesson.slug}
              className={[
                'courses-lesson-link',
                isActive ? 'is-active' : '',
                isComplete ? 'is-complete' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              {isComplete ? (
                <CheckCircle2 size={16} aria-hidden="true" />
              ) : (
                <Circle size={16} aria-hidden="true" />
              )}
              <span>
                <small>Lesson {lesson.order}</small>
                {lesson.title}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
