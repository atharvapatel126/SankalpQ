import Link from 'next/link'
import { CheckCircle2, Circle } from 'lucide-react'
import CourseProgress from './CourseProgress'
import type { Course } from '@/lib/courses/types'
import { useLanguage } from '@/components/LanguageProvider'

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
  const { translations } = useLanguage()
  const t = translations.student.courses
  const common = translations.student.common
  const localizedCourse = t.content[course.id]?.title ?? course.title
  const completed = new Set(completedLessonIds)

  return (
    <aside className="courses-lesson-sidebar" aria-label={`${localizedCourse} ${common.lessons.toLowerCase()}`}>
      <div className="courses-sidebar-header">
        <span className="courses-level-badge">{common.level} {course.level}</span>
        <h2>{localizedCourse}</h2>
        <CourseProgress
          value={percentage}
          label={t.completionLabel(localizedCourse)}
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
                <small>{common.lesson} {lesson.order}</small>
                {t.lessons[lesson.id]?.title ?? lesson.title}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
