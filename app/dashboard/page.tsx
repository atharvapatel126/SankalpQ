'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'

export default function DashboardStubPage() {
  return (
    <AuthLayout showLanguageSwitcher={false}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '480px',
          margin: 'auto 0',
          padding: '24px 16px',
        }}
      >
        {/* CheckCircle2 inside 64px circle with 1px border */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '999px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
          className="card-shadow"
        >
          <CheckCircle2
            size={32}
            strokeWidth={1.5}
            style={{ color: 'var(--accent)' }}
          />
        </div>

        {/* H1 "You're in." */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}
        >
          You&apos;re in.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '440px',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          Your personalized quantum learning dashboard — courses, the circuit
          builder, AI Tutor, and progress tracking — is coming in the next
          phase of this build.
        </p>

        {/* Text link */}
        <Link
          href="/"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--accent)',
            textDecoration: 'none',
            transition: 'opacity 150ms ease-out',
          }}
          className="hover:opacity-80"
        >
          ← Back to home
        </Link>
      </div>
    </AuthLayout>
  )
}
