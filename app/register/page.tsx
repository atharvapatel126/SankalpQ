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

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'Student' | 'Instructor'>('Student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
  }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: {
      fullName?: string
      email?: string
      password?: string
      confirmPassword?: string
      terms?: string
    } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must accept the Terms of Service to continue'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    // Simulate 600ms registration delay, then route to dashboard
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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
            Create your account
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            Join thousands of learners building the future of quantum computing.
          </p>
        </div>

        {/* ── 4. Role Toggle ──────────────────────────────── */}
        <div className="role-toggle" role="group" aria-label="Select role">
          <button
            type="button"
            className={`role-btn ${role === 'Student' ? 'active' : ''}`}
            onClick={() => setRole('Student')}
            aria-pressed={role === 'Student'}
          >
            Student
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'Instructor' ? 'active' : ''}`}
            onClick={() => setRole('Instructor')}
            aria-pressed={role === 'Instructor'}
          >
            Instructor
          </button>
        </div>

        {/* ── 5. Form ─────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="register-name"
            label="Full name"
            type="text"
            placeholder="Ada Lovelace"
            value={fullName}
            onChange={e => {
              setFullName(e.target.value)
              if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }))
            }}
            error={errors.fullName}
            autoComplete="name"
            required
          />

          <FormField
            id="register-email"
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
            id="register-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
            }}
            error={errors.password}
            helperText="At least 8 characters"
            autoComplete="new-password"
            required
          />

          <FormField
            id="register-confirm-password"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword)
                setErrors(prev => ({ ...prev, confirmPassword: undefined }))
            }}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          {/* Terms checkbox */}
          <div style={{ marginBottom: '20px' }}>
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => {
                  setAgreedToTerms(e.target.checked)
                  if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined }))
                }}
              />
              <span>
                I agree to the{' '}
                <a
                  href="#"
                  onClick={e => e.preventDefault()}
                  style={{ color: 'var(--accent)', textDecoration: 'none' }}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  onClick={e => e.preventDefault()}
                  style={{ color: 'var(--accent)', textDecoration: 'none' }}
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <span className="form-error" style={{ display: 'block' }} role="alert">
                {errors.terms}
              </span>
            )}
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
            <span>Create Account</span>
            {loading ? (
              <span className="spinner" aria-hidden="true" />
            ) : (
              <ArrowRight size={16} strokeWidth={2} />
            )}
          </button>
        </form>

        {/* ── 6. Divider & Social Buttons ─────────────────── */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        <SocialButtons />

        {/* ── 7. Footer ───────────────────────────────────── */}
        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              color: 'var(--accent)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
