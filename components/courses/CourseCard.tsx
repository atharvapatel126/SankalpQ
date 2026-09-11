import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import CourseProgress from './CourseProgress'
import type { Course, CourseProgressSummary } from '@/lib/courses/types'
import type { CourseEnrollment } from '@/lib/courses/enrollments-supabase'
import { useLanguage } from '@/components/LanguageProvider'

interface CourseCardProps {
  course: Course
  summary: CourseProgressSummary
  enrollment: CourseEnrollment | null
}

export default function CourseCard({ course, summary, enrollment }: CourseCardProps) {
  const { translations } = useLanguage()
  const t = translations.student.courses
  const common = translations.student.common
  const content = t.content[course.id]
  const isEnrolled = enrollment?.status === 'active' || enrollment?.status === 'completed'
  const displayedSummary = isEnrolled
    ? summary
    : { ...summary, completedLessons: 0, percentage: 0, status: 'not-started' as const }
  const href = isEnrolled
    ? '/courses/' + course.slug + '/' + summary.continueLesson.slug
    : '/courses/' + course.slug
  const action = !isEnrolled
    ? 'Enroll in course'
    : summary.status === 'completed'
      ? t.reviewCourse
      : summary.status === 'in-progress'
        ? t.continueCourse
        : t.startCourse

  return (
    <article className="courses-card card-shadow">
      <div className="courses-card-topline">
        <span className="courses-level-badge">{common.level} {course.level}</span>
        <span className={'courses-status is-' + displayedSummary.status}>
          {displayedSummary.status === 'completed' ? (
            <CheckCircle2 size={13} aria-hidden="true" />
          ) : (
            <Clock size={13} aria-hidden="true" />
          )}
          {displayedSummary.status === 'completed' ? common.completed : displayedSummary.status === 'in-progress' ? common.inProgress : common.notStarted}
        </span>
      </div>

      <div className="courses-card-copy">
        <h2>{content?.title ?? course.title}</h2>
        <p>{content?.description ?? course.description}</p>
      </div>

      <div className="courses-card-meta">
        <span>
          <BookOpen size={14} aria-hidden="true" />
          {course.lessons.length} {common.lessons.toLowerCase()}
        </span>
        <span>
          {t.lessonProgress(displayedSummary.completedLessons, displayedSummary.totalLessons)}
        </span>
      </div>

      <CourseProgress
        value={displayedSummary.percentage}
        label={t.completionLabel(content?.title ?? course.title)}
        compact
      />

      <Link href={href} className="courses-card-action">
        {action}
        <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </Link>
    </article>
  )
}
