'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_LINKS = [
  { label: 'Learn',      href: '#' },
  { label: 'Explore',   href: '#features' },
  { label: 'Labs',      href: '#' },
  { label: 'Resources', href: '#' },
  { label: 'About Us',  href: '#' },
]

// Logo mark: three orbital ellipses around a center dot, stroke only
function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Center dot */}
      <circle cx="14" cy="14" r="2" fill="currentColor" />
      {/* Orbital ring 1 — horizontal ellipse */}
      <ellipse cx="14" cy="14" rx="12" ry="4.5" stroke="currentColor" strokeWidth="1.2" />
      {/* Orbital ring 2 — tilted ~60deg */}
      <ellipse
        cx="14" cy="14" rx="12" ry="4.5"
        stroke="currentColor" strokeWidth="1.2"
        transform="rotate(60 14 14)"
      />
      {/* Orbital ring 3 — tilted ~120deg */}
      <ellipse
        cx="14" cy="14" rx="12" ry="4.5"
        stroke="currentColor" strokeWidth="1.2"
        transform="rotate(120 14 14)"
      />
    </svg>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          height: '72px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: scrolled ? 'rgba(10,10,11,0.85)' : 'var(--bg)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background-color 200ms ease-out, backdrop-filter 200ms ease-out',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0',
          }}
        >
          {/* ── Logo zone ─────────────────────────────────── */}
          <Link
            href="/"
            aria-label="SankalpQ home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              flexShrink: 0,
            }}
          >
            <LogoMark />
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--text-primary)',
              }}
            >
              SankalpQ
            </span>
          </Link>

          {/* ── Nav links (desktop) ────────────────────────── */}
          <nav
            aria-label="Main navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              marginLeft: '48px',
              flex: 1,
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Right zone ─────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginLeft: 'auto',
            }}
          >
            {/* Language switcher — hidden on mobile */}
            <span className="hidden-mobile">
              <LanguageSwitcher />
            </span>

            <ThemeToggle />

            {/* Sign In — hidden on mobile */}
            <Link
              href="/login"
              className="btn-outline hidden-mobile"
              style={{ height: '40px' }}
            >
              Sign In
            </Link>

            {/* Get Started */}
            <Link
              href="/register"
              className="btn-primary"
              style={{ height: '40px' }}
            >
              Get Started
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ───────────────────────────── */}
      {mobileOpen && (
        <nav className="mobile-menu show-mobile" aria-label="Mobile navigation">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div style={{ marginTop: '16px' }}>
            <LanguageSwitcher />
          </div>
        </nav>
      )}

      {/* ── Responsive visibility helpers ─────────────────── */}
    </>
  )
}
