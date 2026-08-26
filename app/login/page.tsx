'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'
import AuthCard from '@/components/AuthCard'
import FormField from '@/components/FormField'
import SocialButtons from '@/components/SocialButtons'
import LogoMark from '@/components/LogoMark'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    // Simulate 600ms authentication delay, then route to dashboard
    setTimeout(() => {
      setLoading(false)
      router.push('/dashboard')
    }, 600)
  }

  return (
    <AuthLayout>
      <AuthCard>
        {/* ── 1. Top Logo ─────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--text-primary)',
          }}
        >
          <LogoMark size={28} />
        </div>

        {/* ── 2. H1 & 3. Subtext ─────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginBottom: '8px',
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            Sign in to continue your quantum learning journey.
          </p>
        </div>

        {/* ── 4. Form ─────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="login-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
            }}
            error={errors.email}
            autoComplete="email"
            required
          />

          <FormField
            id="login-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
            }}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          {/* Remember me + Forgot password */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              marginTop: '-4px',
            }}
          >
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            {/* Non-functional stub for prototype */}
            <a
              href="#"
              onClick={e => e.preventDefault()}
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 150ms ease-out',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
            >
              Forgot password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              height: '42px',
              opacity: loading ? 0.8 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <span>Sign In</span>
            {loading ? (
              <span className="spinner" aria-hidden="true" />
            ) : (
              <ArrowRight size={16} strokeWidth={2} />
            )}
          </button>
        </form>

        {/* ── 5. Divider ───────────────────────────────────── */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* ── 6. Social buttons ───────────────────────────── */}
        <SocialButtons />

        {/* ── 7. Footer link ──────────────────────────────── */}
        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          New to SankalpQ?{' '}
          <Link
            href="/register"
            style={{
              color: 'var(--accent)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Create an account
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
