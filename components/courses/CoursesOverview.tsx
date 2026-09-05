'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Layers } from 'lucide-react'
import AppShell from '@/components/AppShell'
import CourseGrid from './CourseGrid'
import CourseProgress from './CourseProgress'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { useLanguage } from '@/components/LanguageProvider'
import { ALL_LESSONS, COURSES } from '@/lib/courses/course-data'
import {
  getOverallCompletion,
  getResumeLesson,
} from '@/lib/courses/progress'

export default function CoursesOverview() {
  const { progress, hydrated } = useCourseProgress()
  const { translations } = useLanguage()
  const t = translations.student.courses
  const common = translations.student.common
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
            <h2 id="continue-learning">{t.lessons[resume.lesson.id]?.title ?? resume.lesson.title}</h2>
            <p>
              {common.level} {resume.course.level} · {t.content[resume.course.id]?.title ?? resume.course.title} · {common.lesson}{' '}
              {resume.lesson.order} of {resume.course.lessons.length}
            </p>
          </div>
          <Link href={resumeHref} className="btn-primary courses-resume-action">
            {t.continue}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </section>

        <section className="courses-summary-band" aria-label="Learning progress summary">
          <div className="courses-summary-stat">
            <Layers size={17} aria-hidden="true" />
            <span>
              <strong>{COURSES.length}</strong>
              {t.levels}
            </span>
          </div>
          <div className="courses-summary-stat">
            <BookOpen size={17} aria-hidden="true" />
            <span>
              <strong>{ALL_LESSONS.length}</strong>
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
            <span>{ALL_LESSONS.length} {common.lessons.toLowerCase()}</span>
          </div>
          <CourseGrid courses={COURSES} progress={progress} />
        </section>
      </div>
    </AppShell>
  )
}
