'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from './LanguageProvider'

const FEATURES = [
  {
    index: '01',
    kind: 'learning' as const,
  },
  {
    index: '02',
    kind: 'circuit' as const,
  },
  {
    index: '03',
    kind: 'experiment' as const,
  },
  {
    index: '04',
    kind: 'assistance' as const,
  },
]

type FeatureMarkKind = (typeof FEATURES)[number]['kind']

function FeatureMark({ kind }: { kind: FeatureMarkKind }) {
  if (kind === 'learning') {
    return (
      <svg viewBox="0 0 64 56" aria-hidden="true">
        <path d="M8 38h48" />
        <path d="M8 38c8-18 15-18 24 0s15 18 24 0" className="feature-mark-accent" />
        <circle cx="8" cy="38" r="3" />
        <circle cx="32" cy="38" r="3" className="feature-mark-accent" />
        <circle cx="56" cy="38" r="3" />
      </svg>
    )
  }

  if (kind === 'circuit') {
    return (
      <svg viewBox="0 0 64 56" aria-hidden="true">
        <path d="M8 12h48M8 28h48M8 44h48" />
        <rect x="17" y="5" width="14" height="14" rx="3" className="feature-mark-accent" />
        <rect x="36" y="21" width="14" height="14" rx="3" />
        <circle cx="24" cy="44" r="4" className="feature-mark-accent" />
        <circle cx="43" cy="44" r="4" />
        <path d="M24 40V32M24 32h19V35" />
      </svg>
    )
  }

  if (kind === 'experiment') {
    return (
      <svg viewBox="0 0 64 56" aria-hidden="true">
        <path d="M8 43h48" />
        <path d="M8 32c6-18 10-18 16 0s10 18 16 0 10-18 16 0" className="feature-mark-accent" />
        <rect x="13" y="37" width="5" height="6" />
        <rect x="29" y="28" width="5" height="15" className="feature-mark-accent" />
        <rect x="45" y="34" width="5" height="9" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 64 56" aria-hidden="true">
      <rect x="8" y="12" width="38" height="30" rx="5" />
      <path d="M16 22h20M16 29h14M16 36h9" />
      <path d="M52 7l1.8 5.2L59 14l-5.2 1.8L52 21l-1.8-5.2L45 14l5.2-1.8L52 7Z" className="feature-mark-accent" />
      <path d="M46 42h8" className="feature-mark-accent" />
    </svg>
  )
}

export default function FeatureStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const { translations } = useLanguage()

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
          return (
            <div
              key={feature.kind}
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
              <span className="feature-card-index">{feature.index}</span>
              <div className={`feature-mark feature-mark-${feature.kind}`}>
                <FeatureMark kind={feature.kind} />
              </div>

              {/* Title */}
              <h3 className="feature-card-title">
                {translations.features[feature.kind].title}
              </h3>

              {/* Description */}
              <p className="feature-card-description">
                {translations.features[feature.kind].description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Responsive: stack on mobile */}
    </section>
  )
}
