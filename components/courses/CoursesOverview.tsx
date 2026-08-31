'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Layers } from 'lucide-react'
import AppShell from '@/components/AppShell'
import CourseGrid from './CourseGrid'
import CourseProgress from './CourseProgress'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { ALL_LESSONS, COURSES } from '@/lib/courses/course-data'
import {
  getOverallCompletion,
  getResumeLesson,
} from '@/lib/courses/progress'

export default function CoursesOverview() {
  const { progress, hydrated } = useCourseProgress()
  const resume = getResumeLesson(progress)
  const overallCompletion = getOverallCompletion(progress)
  const completedCount = progress.completedLessonIds.length
  const resumeHref =
    '/courses/' + resume.course.slug + '/' + resume.lesson.slug

  return (
    <AppShell>
      <div
        className="courses-page"
        aria-busy={!hydrated}
        data-hydrated={hydrated}
      >
        <header className="courses-page-header">
          <div>
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">
              Learning paths
            </span>
            <h1>Courses</h1>
            <p>
              Learn quantum computing in four guided levels, from qubits to
              practical algorithms.
            </p>
          </div>
          <div className="courses-header-stat" aria-label="Overall course progress">
            <strong>{overallCompletion}%</strong>
            <span>overall</span>
          </div>
        </header>

        <section className="courses-resume-panel" aria-labelledby="continue-learning">
          <div className="courses-resume-icon" aria-hidden="true">
            <BookOpen size={22} strokeWidth={1.5} />
          </div>
          <div className="courses-resume-copy">
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">
              Continue learning
            </span>
            <h2 id="continue-learning">{resume.lesson.title}</h2>
            <p>
              Level {resume.course.level} · {resume.course.title} · Lesson{' '}
              {resume.lesson.order} of {resume.course.lessons.length}
            </p>
          </div>
          <Link href={resumeHref} className="btn-primary courses-resume-action">
            Continue
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </section>

        <section className="courses-summary-band" aria-label="Learning progress summary">
          <div className="courses-summary-stat">
            <Layers size={17} aria-hidden="true" />
            <span>
              <strong>{COURSES.length}</strong>
              Levels
            </span>
          </div>
          <div className="courses-summary-stat">
            <BookOpen size={17} aria-hidden="true" />
            <span>
              <strong>{ALL_LESSONS.length}</strong>
              Lessons
            </span>
          </div>
          <div className="courses-summary-stat">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>
              <strong>{completedCount}</strong>
              Completed
            </span>
          </div>
          <CourseProgress value={overallCompletion} label="Overall completion" />
        </section>

        <section className="courses-catalogue" aria-labelledby="course-levels">
          <div className="courses-section-heading">
            <div>
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">
                Curriculum
              </span>
              <h2 id="course-levels">Course levels</h2>
            </div>
            <span>{ALL_LESSONS.length} lessons</span>
          </div>
          <CourseGrid courses={COURSES} progress={progress} />
        </section>
      </div>
    </AppShell>
  )
}
