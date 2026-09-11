'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpen, CheckCircle2, Layers } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { fetchPublishedCourseBySlug } from '@/lib/courses/courses-supabase'
import {
  enrollInCourse,
  getMyEnrollment,
} from '@/lib/courses/enrollments-supabase'
import type { Course } from '@/lib/courses/types'
import type { CourseEnrollment } from '@/lib/courses/enrollments-supabase'
import '@/styles/courses.css'

interface CourseDetailsPageProps {
  params: { courseSlug: string }
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadCourse() {
      try {
        const selectedCourse = await fetchPublishedCourseBySlug(params.courseSlug)
        if (!active) return

        if (!selectedCourse?.databaseId) {
          setCourse(null)
          setLoading(false)
          return
        }

        const myEnrollment = await getMyEnrollment(selectedCourse.databaseId)
        if (!active) return

        setCourse(selectedCourse)
        setEnrollment(myEnrollment)
      } catch (loadError) {
        console.error('Failed to load course details:', loadError)
        if (active) setError('We couldn’t load this course right now.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadCourse()
    return () => {
      active = false
    }
  }, [params.courseSlug])

  const handleEnroll = async () => {
    if (!course?.databaseId) return

    setEnrolling(true)
    setError(null)
    try {
      const createdEnrollment = await enrollInCourse(course.databaseId)
      setEnrollment(createdEnrollment)
    } catch (enrollmentError) {
      console.error('Failed to enroll in course:', enrollmentError)
      const message = enrollmentError instanceof Error
        ? enrollmentError.message
        : 'We couldn’t enroll you in this course.'
      if (message.toLowerCase().includes('signed in') || message.toLowerCase().includes('authenticated')) {
        router.push(`/login?next=${encodeURIComponent(`/courses/${params.courseSlug}`)}`)
      } else {
        setError(message)
      }
    } finally {
      setEnrolling(false)
    }
  }

  const firstLesson = course?.lessons[0]
  const isEnrolled = enrollment?.status === 'active' || enrollment?.status === 'completed'
  const learningHref = firstLesson
    ? `/courses/${params.courseSlug}/${firstLesson.slug}`
    : `/courses/${params.courseSlug}`

  return (
    <AppShell>
      <div className="courses-page">
        <div className="courses-breadcrumbs">
          <Link href="/courses">Courses</Link>
          <span>/</span>
          <span>{course?.title ?? params.courseSlug}</span>
        </div>

        {loading && (
          <p className="courses-section-intro" role="status">Loading course…</p>
        )}

        {!loading && error && (
          <p className="courses-section-intro" role="alert">{error}</p>
        )}

        {!loading && !error && !course && (
          <p className="courses-section-intro" role="alert">
            This course is unavailable or no longer published.
          </p>
        )}

        {!loading && !error && course && (
          <>
            <header className="courses-page-header">
              <div>
                <span className="dashboard-eyebrow dashboard-eyebrow-mono">
                  Level {course.level}
                </span>
                <h1>{course.title}</h1>
                <p>{course.description}</p>
              </div>
              <div className="courses-header-stat" aria-label="Lessons">
                <strong>{course.lessons.length}</strong>
                <span>Lessons</span>
              </div>
            </header>

            <section className="courses-summary-band" aria-label="Course overview">
              <div className="courses-summary-stat">
                <Layers size={17} aria-hidden="true" />
                <span><strong>{course.level}</strong>Level</span>
              </div>
              <div className="courses-summary-stat">
                <BookOpen size={17} aria-hidden="true" />
                <span><strong>{course.lessons.length}</strong>Lessons</span>
              </div>
              <div className="courses-summary-stat">
                <CheckCircle2 size={17} aria-hidden="true" />
                <span><strong>{isEnrolled ? 'Enrolled' : 'Open'}</strong>Access</span>
              </div>
              <div>
                {course.outcome && <p className="courses-section-intro">{course.outcome}</p>}
              </div>
            </section>

            <section className="courses-catalogue" aria-labelledby="course-lessons">
              <div className="courses-section-heading">
                <div>
                  <span className="dashboard-eyebrow dashboard-eyebrow-mono">Course outline</span>
                  <h2 id="course-lessons">Lessons</h2>
                </div>
              </div>
              <div className="courses-grid">
                {course.lessons.map(lesson => (
                  <article key={lesson.id} className="courses-card card-shadow">
                    <div className="courses-card-topline">
                      <span className="courses-level-badge">Lesson {lesson.order}</span>
                    </div>
                    <div className="courses-card-copy">
                      <h2>{lesson.title}</h2>
                      <p>{lesson.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="courses-lesson-finish" aria-label="Course enrollment">
              <div>
                <h2>{isEnrolled ? 'You are enrolled' : 'Ready to start learning?'}</h2>
                <p>
                  {isEnrolled
                    ? 'Continue with the interactive lesson workspace.'
                    : 'Enroll to unlock the lesson workspace and track your progress.'}
                </p>
                {error && <p role="alert">{error}</p>}
              </div>
              {isEnrolled ? (
                <Link href={learningHref} className="btn-primary courses-finish-action">
                  {enrollment?.status === 'completed' ? 'Review Course' : 'Start Course'}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn-primary courses-finish-action"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling…' : 'Enroll in Course'}
                  {!enrolling && <ArrowRight size={16} aria-hidden="true" />}
                </button>
              )}
            </section>
          </>
        )}
      </div>
    </AppShell>
  )
}
