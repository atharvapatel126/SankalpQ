'use client'

import { Users, Boxes, FlaskConical, BookOpen, Star } from 'lucide-react'
import { useEffect, useRef } from 'react'

const STATS = [
  { icon: Users,       number: '10,000+', label: 'Active Learners' },
  { icon: Boxes,       number: '2,500+',  label: 'Circuits Built' },
  { icon: FlaskConical,number: '1,200+',  label: 'Experiments Run' },
  { icon: BookOpen,    number: '150+',    label: 'Quantum Concepts' },
  { icon: Star,        number: '4.8/5',   label: 'Learner Rating' },
]

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-label="Platform statistics"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px 120px',
      }}
    >
      <div
        ref={ref}
        className="reveal"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                flex: '1 1 120px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Divider (not on first item) */}
              {i > 0 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '-16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1px',
                    height: '32px',
                    backgroundColor: 'var(--border)',
                  }}
                  className="stat-divider"
                />
              )}

              <Icon
                size={20}
                strokeWidth={1.5}
                style={{ color: 'var(--text-tertiary)' }}
                aria-hidden="true"
              />

              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-geist-mono), JetBrains Mono, monospace',
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                {stat.number}
              </span>

              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                {stat.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Responsive: 2-column grid on mobile */}
    </section>
  )
}
