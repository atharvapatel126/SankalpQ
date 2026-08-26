'use client'

import React from 'react'
import Link from 'next/link'
import LogoMark from './LogoMark'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

interface AuthLayoutProps {
  children: React.ReactNode
  showLanguageSwitcher?: boolean
}

export default function AuthLayout({
  children,
  showLanguageSwitcher = true,
}: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        color: 'var(--text-primary)',
      }}
    >
      {/* ── Minimal Header ───────────────────────────────── */}
      <header
        style={{
          height: '72px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo mark + wordmark */}
          <Link
            href="/"
            aria-label="SankalpQ home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
            }}
          >
            <LogoMark size={28} />
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

          {/* Right utilities: Language switcher + Theme toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {showLanguageSwitcher && <LanguageSwitcher />}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Content Shell ───────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '80px 16px 80px',
          boxSizing: 'border-box',
        }}
        className="auth-main"
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 639px) {
          .auth-main {
            padding: 40px 16px 48px !important;
          }
        }
      `}</style>
    </div>
  )
}
