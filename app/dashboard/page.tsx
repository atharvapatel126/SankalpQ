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

const displayFont = Fredoka({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600'],
})

const COMPLETION = 68
const DIAL_RADIUS = 52
const DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL_RADIUS

const MODULES = [
  {
    icon: BookOpen,
    category: 'course',
    title: 'Courses',
    description: 'Qubits to algorithms',
    href: '/courses',
  },
  {
    icon: CircuitBoard,
    category: 'circuit',
    title: 'Circuit builder',
    description: 'Drag, drop, build',
    href: '/circuit-builder',
  },
  {
    icon: FlaskConical,
    category: 'simulator',
    title: 'Simulator',
    description: 'Run and explore',
    href: '/simulator',
  },
  {
    icon: Sparkles,
    category: 'tutor',
    title: 'AI tutor',
    description: 'Ask, anytime',
    href: '/ai-tutor',
  },
  {
    icon: Target,
    category: 'challenge',
    title: 'Challenges',
    description: 'Test your understanding',
    href: '/challenges',
  },
]

const RECOMMENDATIONS = [
  'Revise: Entanglement',
  'Try: Bell-State Challenge',
  'Continue to: Deutsch–Jozsa Algorithm',
]

const ACTIVITY = [
  { lead: 'Completed Quantum Gates', time: '2d' },
  { lead: 'Built a Bell State circuit', time: '3d' },
  { lead: 'Scored 90% on Superposition', time: '5d' },
  { lead: 'Started Quantum Entanglement', time: '6d' },
]

function ProgressDial() {
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

  const progressOffset = DIAL_CIRCUMFERENCE * (1 - COMPLETION / 100)

  return (
    <div className="progress-dial" role="img" aria-label={`${COMPLETION}% complete`}>
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
        <strong>{COMPLETION}%</strong>
        <small>Complete</small>
      </span>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className={`dashboard-page ${displayFont.variable}`}>
        <header className="dashboard-header">
          <h1>Welcome back, Ananya</h1>
          <p>Here&apos;s where you left off.</p>
        </header>

        <section className="progress-hero-panel" aria-label="Current learning progress">
          <div className="progress-hero-main">
            <ProgressDial />
            <div className="progress-hero-copy">
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">Resuming</span>
              <h2>Quantum Entanglement</h2>
              <p>Lesson 4 of 8</p>
              <Link href="/courses" className="btn-primary progress-resume-button">
                Resume
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <div className="progress-stat-list" aria-label="Learning statistics">
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">Modules</span>
            <div className="progress-stat-row">
              <span>Streak</span>
              <strong>12 days</strong>
            </div>
            <div className="progress-stat-row">
              <span>Circuits built</span>
              <strong>24</strong>
            </div>
            <div className="progress-stat-row">
              <span>Badges</span>
              <strong>7</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-command-grid" aria-label="Dashboard activity and modules">
          <div className="module-launcher">
            <span className="dashboard-eyebrow dashboard-eyebrow-mono">Modules</span>
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
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="dashboard-side-feeds">
            <div className="dashboard-feed">
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">Recommended next</span>
              <div className="recommendation-list">
                {RECOMMENDATIONS.map(label => (
                  <Link href="/courses" className="recommendation-row" key={label}>
                    <span>{label}</span>
                    <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="dashboard-feed">
              <span className="dashboard-eyebrow dashboard-eyebrow-mono">Recent activity</span>
              <div className="activity-feed">
                {ACTIVITY.map(item => (
                  <div className="activity-feed-row" key={item.lead}>
                    <strong>{item.lead}</strong>
                    <span>{item.time}</span>
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
