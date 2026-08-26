'use client'

import { GraduationCap, CircuitBoard, FlaskConical, Cpu } from 'lucide-react'
import { useEffect, useRef } from 'react'

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Interactive Learning',
    description:
      'Learn quantum concepts with interactive lessons, animations, and real-world examples.',
  },
  {
    icon: CircuitBoard,
    title: 'Build & Visualize',
    description:
      'Drag-and-drop circuit builder with code support and beautiful visualizations.',
  },
  {
    icon: FlaskConical,
    title: 'Simulate & Experiment',
    description:
      'Run simulations, explore quantum algorithms, and experiment in virtual labs.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Assistance',
    description:
      'AI Tutor, Debugger, and personalized learning paths to accelerate your quantum journey.',
  },
]

export default function FeatureStrip() {
  const ref = useRef<HTMLDivElement>(null)

  // Scroll reveal
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
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="features"
      aria-label="Platform features"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px 96px',
      }}
    >
      <div
        ref={ref}
        className="reveal card-shadow"
        style={{
          border: '1px solid var(--border)',
          borderRadius: '10px',
          backgroundColor: 'var(--surface)',
          padding: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          overflow: 'hidden',
        }}
      >
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="feature-card"
              style={{
                padding: '28px 24px',
                borderRight: i < FEATURES.length - 1
                  ? '1px solid var(--border)'
                  : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
              }}
            >
              {/* Icon container — no color fill, flat bordered box */}
              <div
                className="feature-icon-wrap"
                style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  flexShrink: 0,
                  marginBottom: '14px',
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  lineHeight: 1.3,
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 767px) {
          #features > div {
            grid-template-columns: 1fr !important;
          }
          #features > div > div {
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
          #features > div > div:last-child {
            border-bottom: none !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          #features > div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          #features > div > div:nth-child(2) {
            border-right: none !important;
          }
          #features > div > div:nth-child(1),
          #features > div > div:nth-child(2) {
            border-bottom: 1px solid var(--border) !important;
          }
          #features > div > div:nth-child(4) {
            border-right: none !important;
          }
        }
        @media (max-width: 639px) {
          #features {
            padding: 0 16px 48px !important;
          }
        }
      `}</style>
    </section>
  )
}
