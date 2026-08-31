'use client'

import Link from 'next/link'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import QuantumCircuitDiagram from './QuantumCircuitDiagram'

// Avatar initials for the trust row
const AVATARS = ['AS', 'KP', 'MR']

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-headline"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '96px 24px 96px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '55fr 45fr',
          gap: '64px',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* ── Left column ───────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0',
          }}
        >
          {/* Eyebrow badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginBottom: '28px',
            }}
          >
            <Sparkles
              size={14}
              strokeWidth={1.5}
              style={{ color: 'var(--accent)', flexShrink: 0 }}
            />
            <span>Quantum Learning. Reinvented.</span>
          </div>

          {/* H1 Headline */}
          <h1
            id="hero-headline"
            style={{
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '20px',
            }}
          >
            Learn. Build. Simulate.
            <br />
            Master{' '}
            <span
              style={{
                color: 'var(--accent)',
              }}
            >
              Quantum Computing.
            </span>
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              marginBottom: '32px',
            }}
          >
            SankalpQ is an all-in-one platform to learn quantum concepts, build
            circuits, run simulations, and get AI-powered assistance every step
            of the way.
          </p>

          {/* CTA row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '40px',
            }}
          >
            <Link href="/register" className="btn-primary">
              Start Learning
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link href="/#features" className="btn-outline">
              <Play size={16} strokeWidth={2} />
              Explore Platform
            </Link>
          </div>

          {/* Trust row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Overlapping avatars */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {AVATARS.map((initials, i) => (
                <div
                  key={initials}
                  aria-label={`Learner ${initials}`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '999px',
                    backgroundColor: 'var(--surface-raised)',
                    border: '2px solid var(--bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontFamily: 'var(--font-geist-mono), JetBrains Mono, monospace',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginLeft: i === 0 ? 0 : '-10px',
                    zIndex: AVATARS.length - i,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-tertiary)',
                lineHeight: 1.4,
              }}
            >
              Trusted by{' '}
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                10,000+
              </span>{' '}
              learners and educators worldwide
            </p>
          </div>
        </div>

        {/* ── Right column — circuit diagram ────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            position: 'relative',
          }}
          className="circuit-panel card-shadow"
        >
          {/* Corner decorations — pure geometry, no glow */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '8px',
              height: '8px',
              border: '1px solid var(--border-strong)',
              borderRadius: '2px',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '8px',
              height: '8px',
              border: '1px solid var(--border-strong)',
              borderRadius: '2px',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              width: '8px',
              height: '8px',
              border: '1px solid var(--border-strong)',
              borderRadius: '2px',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              width: '8px',
              height: '8px',
              border: '1px solid var(--border-strong)',
              borderRadius: '2px',
            }}
          />

          {/* Label chip */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '11px',
              fontFamily: 'var(--font-geist-mono), JetBrains Mono, monospace',
              color: 'var(--text-tertiary)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '2px 10px',
              letterSpacing: '0.04em',
            }}
          >
            circuit.qasm
          </span>

          <QuantumCircuitDiagram />
        </div>
      </div>

      {/* ── Responsive overrides ───────────────────────────── */}
    </section>
  )
}
