'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Layers } from 'lucide-react'
import AppShell from '@/components/AppShell'
import CourseGrid from './CourseGrid'
import CourseProgress from './CourseProgress'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { useLanguage } from '@/components/LanguageProvider'
import { fetchPublishedCourseCatalog } from '@/lib/courses/courses-supabase'
import { getMyEnrollments } from '@/lib/courses/enrollments-supabase'
import type { CourseEnrollment } from '@/lib/courses/enrollments-supabase'
import type { Course, CourseProgressState } from '@/lib/courses/types'
import {
  getOverallCompletion,
} from '@/lib/courses/progress'
import { getLessonById } from '@/lib/courses/course-data'

type CatalogState =
  | { status: 'loading' }
  | { status: 'success'; courses: Course[] }
  | { status: 'error'; error: unknown }

type EnrollmentState =
  | { status: 'loading' }
  | { status: 'success'; enrollments: Record<string, CourseEnrollment> }
  | { status: 'error'; error: unknown }

function getEnrolledResumeLesson(
  progress: CourseProgressState,
  enrolledCourses: Course[]
): { course: Course; lesson: Course['lessons'][number] } | null {
  const enrolledCourseIds = new Set(enrolledCourses.map(course => course.id))
  const completedLessonIds = new Set(progress.completedLessonIds)
  const current = getLessonById(progress.currentLessonId)
  const currentCourse = current && enrolledCourseIds.has(current.course.id)
    ? enrolledCourses.find(course => course.id === current.course.id)
    : undefined
  const courseWithProgress = currentCourse ?? enrolledCourses.find(course =>
    course.lessons.some(lesson => completedLessonIds.has(lesson.id))
  )

  if (!courseWithProgress) return null

  const lesson = courseWithProgress.lessons.find(
    item => !completedLessonIds.has(item.id)
  ) ?? courseWithProgress.lessons[courseWithProgress.lessons.length - 1]

  return lesson ? { course: courseWithProgress, lesson } : null
}

export default function CoursesOverview() {
  const { progress, hydrated, progressStatus } = useCourseProgress()
  const { translations } = useLanguage()
  const t = translations.student.courses
  const common = translations.student.common
  const [catalogState, setCatalogState] = useState<CatalogState>({
    status: 'loading',
  })
  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>({
    status: 'loading',
  })

  useEffect(() => {
    let active = true

    void fetchPublishedCourseCatalog()
      .then(courses => {
        if (active) setCatalogState({ status: 'success', courses })
      })
      .catch(error => {
        console.error('Failed to load course catalogue:', error)
        if (active) setCatalogState({ status: 'error', error })
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    void getMyEnrollments()
      .then(enrollments => {
        if (!active) return
        const byCourseId = Object.fromEntries(
          enrollments.map(enrollment => [enrollment.courseId, enrollment])
        )
        setEnrollmentState({ status: 'success', enrollments: byCourseId })
      })
      .catch(error => {
        console.error('Failed to load course enrollments:', error)
        if (active) setEnrollmentState({ status: 'error', error })
      })

    return () => {
      active = false
    }
  }, [])

  const progressReady = progressStatus === 'success'
  const overallCompletion = progressReady ? getOverallCompletion(progress) : 0
  const completedCount = progressReady ? progress.completedLessonIds.length : 0
  const catalogCourses =
    catalogState.status === 'success' ? catalogState.courses : []
  const catalogLessonCount = catalogCourses.reduce(
    (total, course) => total + course.lessons.length,
    0
  )
  const enrolledCourses = enrollmentState.status === 'success'
    ? catalogCourses.filter(course => {
        const enrollment = course.databaseId
          ? enrollmentState.enrollments[course.databaseId]
          : undefined
        return enrollment?.status === 'active' || enrollment?.status === 'completed'
      })
    : []
  const resume = progressReady
    ? getEnrolledResumeLesson(progress, enrolledCourses)
    : null
  const resumeHref = resume
    ? '/courses/' + resume.course.slug + '/' + resume.lesson.slug
    : '/courses'

  return (
    <AppShell>
      <div
        className="courses-page"
        aria-busy={!hydrated || catalogState.status === 'loading'}
        data-hydrated={hydrated}
      >
        <header className="courses-page-header">
          <div>
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">
              {t.eyebrow}
            </span>
            <h1>{t.title}</h1>
            <p>
              {t.description}
            </p>
          </div>
          <div className="courses-header-stat" aria-label={t.overallCompletion}>
            <strong>{overallCompletion}%</strong>
            <span>{t.overall}</span>
          </div>
        </header>

        <section className="courses-resume-panel" aria-labelledby="continue-learning">
          <div className="courses-resume-icon" aria-hidden="true">
            <BookOpen size={22} strokeWidth={1.5} />
          </div>
          <div className="courses-resume-copy">
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">
              {t.continueLearning}
            </span>
            <h2 id="continue-learning">
              {resume
                ? t.lessons[resume.lesson.id]?.title ?? resume.lesson.title
                : t.title}
            </h2>
            <p>
              {resume
                ? `${common.level} ${resume.course.level} · ${t.content[resume.course.id]?.title ?? resume.course.title} · ${common.lesson} ${resume.lesson.order} of ${resume.course.lessons.length}`
                : 'Choose an enrolled course to continue learning.'}
            </p>
          </div>
          <Link href={resumeHref} className="btn-primary courses-resume-action">
            {resume ? t.continue : t.courseLevels}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </section>

        <section className="courses-summary-band" aria-label="Learning progress summary">
          <div className="courses-summary-stat">
            <Layers size={17} aria-hidden="true" />
            <span>
              <strong>{catalogCourses.length}</strong>
              {t.levels}
            </span>
          </div>
          <div className="courses-summary-stat">
            <BookOpen size={17} aria-hidden="true" />
            <span>
              <strong>{catalogLessonCount}</strong>
              {common.lessons}
            </span>
          </div>
          <div className="courses-summary-stat">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>
              <strong>{completedCount}</strong>
              {common.completed}
            </span>
          </div>
          <CourseProgress value={overallCompletion} label={t.overallCompletion} />
        </section>

        <section className="courses-catalogue" aria-labelledby="course-levels">
          <div className="courses-section-heading">
            <div>
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">
                {t.curriculum}
              </span>
              <h2 id="course-levels">{t.courseLevels}</h2>
            </div>
            <span>{catalogLessonCount} {common.lessons.toLowerCase()}</span>
          </div>
          {catalogState.status === 'loading' && (
            <p className="courses-section-intro" role="status">
              Loading courses…
            </p>
          )}
          {catalogState.status === 'error' && (
            <p className="courses-section-intro" role="alert">
              We couldn’t load the course catalogue right now.
            </p>
          )}
          {catalogState.status === 'success' && catalogCourses.length === 0 && (
            <p className="courses-section-intro">
              No published courses are available yet.
            </p>
          )}
          {catalogState.status === 'success' && catalogCourses.length > 0 && (
            progressStatus === 'loading' ? (
              <p className="courses-section-intro" role="status">
                Loading your progress…
              </p>
            ) : progressStatus === 'error' ? (
              <p className="courses-section-intro" role="alert">
                We couldn’t load your progress right now. Please refresh and try again.
              </p>
            ) : enrollmentState.status === 'loading' ? (
              <p className="courses-section-intro" role="status">
                Checking your enrollment status…
              </p>
            ) : enrollmentState.status === 'error' ? (
              <p className="courses-section-intro" role="alert">
                We couldn’t load your enrollment status right now. Please try again.
              </p>
            ) : (
              <CourseGrid
                courses={catalogCourses}
                progress={progress}
                enrollments={enrollmentState.enrollments}
              />
            )
          )}
        </section>
      </div>
    </AppShell>
  )
}
