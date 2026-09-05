'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'
import AuthCard from '@/components/AuthCard'
import FormField from '@/components/FormField'
import SocialButtons from '@/components/SocialButtons'
import LogoMark from '@/components/LogoMark'
import { useLanguage } from '@/components/LanguageProvider'
import { getAuthRedirectForUser } from '@/lib/auth'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface LoginErrors {
  email?: string
  password?: string
  form?: string
}

export default function LoginPage() {
  const router = useRouter()
  const { auth } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const errorParam = new URLSearchParams(window.location.search).get('error')
    if (errorParam === 'auth_unconfigured') {
      setErrors({ form: auth.authUnavailable })
    } else if (errorParam === 'callback_failed') {
      setErrors({ form: auth.callbackFailed })
    }
  }, [auth.authUnavailable, auth.callbackFailed])

  const validate = () => {
    const newErrors: LoginErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) newErrors.email = auth.emailRequired
    else if (!emailRegex.test(email.trim())) newErrors.email = auth.emailInvalid
    if (!password) newErrors.password = auth.passwordRequired
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})
    try {
      const { data, error } = await getSupabaseBrowserClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        const msg = (error.message || '').toLowerCase()
        const status = error.status
        const code = (error as { code?: string }).code

        if (
          code === 'email_not_confirmed' ||
          msg.includes('email not confirmed') ||
          msg.includes('not confirmed')
        ) {
          setErrors({ form: auth.emailNotConfirmed })
        } else if (
          status === 429 ||
          code === 'over_request_rate_limit' ||
          msg.includes('rate limit') ||
          msg.includes('too many requests')
        ) {
          setErrors({ form: auth.rateLimited })
        } else if (
          code === 'invalid_credentials' ||
          code === 'invalid_grant' ||
          msg.includes('invalid login credentials') ||
          msg.includes('invalid credentials')
        ) {
          setErrors({ form: auth.invalidCredentials })
        } else {
          setErrors({ form: error.message || auth.signInFailed })
        }
        return
      }

      if (data?.session && data?.user) {
        const next = getAuthRedirectForUser(
          data.user,
          new URLSearchParams(window.location.search).get('next'),
        )
        router.replace(next)
        router.refresh()
      } else {
        setErrors({ form: auth.signInFailed })
      }
    } catch (error) {
      setErrors({ form: error instanceof Error && error.message.includes('environment') ? auth.authUnavailable : auth.signInFailed })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-primary)' }}><LogoMark size={28} /></div>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '8px' }}>{auth.loginTitle}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{auth.loginDescription}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormField id="login-email" label={auth.email} type="email" placeholder={auth.emailPlaceholder} value={email} onChange={e => { setEmail(e.target.value); if (errors.email || errors.form) setErrors(prev => ({ ...prev, email: undefined, form: undefined })) }} error={errors.email} autoComplete="email" required />
          <FormField id="login-password" label={auth.password} type="password" placeholder={auth.passwordPlaceholder} value={password} onChange={e => { setPassword(e.target.value); if (errors.password || errors.form) setErrors(prev => ({ ...prev, password: undefined, form: undefined })) }} error={errors.password} autoComplete="current-password" required showPasswordLabel={auth.showPassword} hidePasswordLabel={auth.hidePassword} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', marginTop: '-4px' }}>
            <label className="auth-checkbox"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /><span>{auth.rememberMe}</span></label>
            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 150ms ease-out' }}>{auth.forgotPassword}</a>
          </div>
          {errors.form && <div className="form-error auth-form-error" role="alert">{errors.form}</div>}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '42px', opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            <span>{auth.signIn}</span>{loading ? <span className="spinner" aria-hidden="true" /> : <ArrowRight size={16} strokeWidth={2} />}
          </button>
        </form>
        <div className="auth-divider"><span>{auth.or}</span></div>
        <SocialButtons />
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>{auth.newTo}{' '}<Link href="/register" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>{auth.createAccount}</Link></div>
      </AuthCard>
    </AuthLayout>
  )
}
