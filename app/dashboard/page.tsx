'use client'

import { Fredoka } from 'next/font/google'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CircuitBoard,
  FlaskConical,
  Sparkles,
  Target,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { useLanguage } from '@/components/LanguageProvider'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import {
  getOverallCompletion,
  getResumeLesson,
} from '@/lib/courses/progress'
import { ALL_LESSONS } from '@/lib/courses/course-data'

const displayFont = Fredoka({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600'],
})

const DIAL_RADIUS = 52
const DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL_RADIUS

const MODULES = [
  {
    icon: BookOpen,
    category: 'course',
    titleKey: 'courses',
    descriptionKey: 'qubitsToAlgorithms',
    href: '/courses',
  },
  {
    icon: CircuitBoard,
    category: 'circuit',
    titleKey: 'circuitBuilder',
    descriptionKey: 'dragDropBuild',
    href: '/circuit-builder',
  },
  {
    icon: FlaskConical,
    category: 'simulator',
    titleKey: 'simulator',
    descriptionKey: 'runAndExplore',
    href: '/simulator',
  },
  {
    icon: Sparkles,
    category: 'tutor',
    titleKey: 'aiTutor',
    descriptionKey: 'askAnytime',
    href: '/ai-tutor',
  },
  {
    icon: Target,
    category: 'challenge',
    titleKey: 'challenges',
    descriptionKey: 'testYourUnderstanding',
    href: '/challenges',
  },
] as const

const RECOMMENDATIONS = [
  {
    labelKey: 'reviseEntanglement',
    href: '/courses/quantum-circuits/entanglement',
  },
  {
    labelKey: 'tryBellState',
    href: '/challenges/build-bell-state',
  },
  {
    labelKey: 'continueDeutschJozsa',
    href: '/courses/quantum-algorithms/deutsch-jozsa-algorithm',
  },
] as const

const ACTIVITY = [
  { leadKey: 'completedQuantumGates', days: 2 },
  { leadKey: 'builtBellState', days: 3 },
  { leadKey: 'scoredSuperposition', days: 5 },
  { leadKey: 'startedQuantumEntanglement', days: 6 },
] as const

function ProgressDial({
  completion,
  completeLabel,
  ariaLabel,
}: {
  completion: number
  completeLabel: string
  ariaLabel: string
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setReady(true)
      return
    }

    const frame = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const progressOffset = DIAL_CIRCUMFERENCE * (1 - completion / 100)

  return (
    <div className="progress-dial" role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle
          className="progress-dial-track"
          cx="60"
          cy="60"
          r={DIAL_RADIUS}
          fill="none"
          strokeWidth="8"
        />
        <circle
          className={`progress-dial-arc${ready ? ' is-ready' : ''}`}
          cx="60"
          cy="60"
          r={DIAL_RADIUS}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={DIAL_CIRCUMFERENCE}
          strokeDashoffset={ready ? progressOffset : DIAL_CIRCUMFERENCE}
        />
      </svg>
      <span className="progress-dial-label">
        <strong>{completion}%</strong>
        <small>{completeLabel}</small>
      </span>
    </div>
  )
}

export default function DashboardPage() {
  const { progress } = useCourseProgress()
  const { translations } = useLanguage()
  const { dashboard } = translations
  const completion = getOverallCompletion(progress)
  const courseComplete = completion === 100
  const resume = getResumeLesson(progress)
  const resumeLessonNumber = resume.course.lessons.findIndex(
    lesson => lesson.id === resume.lesson.id
  ) + 1
  const resumeHref = `/courses/${resume.course.slug}/${resume.lesson.slug}`

  return (
    <AppShell>
      <div className={`dashboard-page ${displayFont.variable}`}>
        <header className="dashboard-header">
          <h1>{dashboard.welcomeBack('Ananya')}</h1>
          <p>{dashboard.leftOff}</p>
        </header>

        <section className="progress-hero-panel" aria-label={dashboard.currentLearningProgress}>
          <div className="progress-hero-main">
            <ProgressDial
              completion={completion}
              completeLabel={dashboard.complete}
              ariaLabel={dashboard.progressDialAriaLabel(completion)}
            />
            <div className="progress-hero-copy">
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">
                {courseComplete ? dashboard.learningPathComplete : dashboard.resuming}
              </span>
              <h2>
                {courseComplete ? dashboard.allCourseLevelsCompleted : resume.lesson.title}
              </h2>
              <p>
                {courseComplete
                  ? dashboard.lessonsComplete(progress.completedLessonIds.length, ALL_LESSONS.length)
                  : dashboard.lessonProgress(resumeLessonNumber, resume.course.lessons.length)}
              </p>
              <Link
                href={courseComplete ? '/courses' : resumeHref}
                className="btn-primary progress-resume-button"
              >
                {courseComplete ? dashboard.reviewCourses : dashboard.resume}
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <div className="progress-stat-list" aria-label={dashboard.learningStatistics}>
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">{dashboard.modules}</span>
            <div className="progress-stat-row">
              <span>{dashboard.streak}</span>
              <strong>{dashboard.streakDays(12)}</strong>
            </div>
            <div className="progress-stat-row">
              <span>{dashboard.circuitsBuilt}</span>
              <strong>24</strong>
            </div>
            <div className="progress-stat-row">
              <span>{dashboard.badges}</span>
              <strong>7</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-command-grid" aria-label={dashboard.dashboardActivityAndModules}>
          <div className="module-launcher">
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">{dashboard.modules}</span>
            <div className="module-grid">
              {MODULES.map(module => {
                const Icon = module.icon
                return (
                  <Link
                    href={module.href}
                    className={`module-card module-card-${module.category} card-shadow`}
                    key={module.href}
                  >
                    <div className="module-badge" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <h3>{dashboard[module.titleKey]}</h3>
                    <p>{dashboard[module.descriptionKey]}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="dashboard-side-feeds">
            <div className="dashboard-feed">
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">{dashboard.recommendedNext}</span>
              <div className="recommendation-list">
                {RECOMMENDATIONS.map(recommendation => (
                  <Link
                    href={recommendation.href}
                    className="recommendation-row"
                    key={recommendation.href}
                  >
                    <span>{dashboard.recommendations[recommendation.labelKey]}</span>
                    <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="dashboard-feed">
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">{dashboard.recentActivity}</span>
              <div className="activity-feed">
                {ACTIVITY.map(item => (
                  <div className="activity-feed-row" key={item.leadKey}>
                    <strong>{dashboard.activity[item.leadKey]}</strong>
                    <span>{dashboard.activity.relativeDays(item.days)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
