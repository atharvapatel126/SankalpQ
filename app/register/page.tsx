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
import { useLanguage } from '@/components/LanguageProvider'
import { getSafeNextPath } from '@/lib/auth'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface RegisterErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
  form?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { auth } = useLanguage()
  const [role, setRole] = useState<'Student' | 'Instructor'>('Student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: RegisterErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!fullName.trim()) newErrors.fullName = auth.fullNameRequired
    if (!email.trim()) newErrors.email = auth.emailRequired
    else if (!emailRegex.test(email.trim())) newErrors.email = auth.emailInvalid
    if (!password) newErrors.password = auth.passwordRequired
    else if (password.length < 8) newErrors.password = auth.passwordLength
    if (!confirmPassword) newErrors.confirmPassword = auth.confirmPasswordRequired
    else if (confirmPassword !== password) newErrors.confirmPassword = auth.passwordsDoNotMatch
    if (!agreedToTerms) newErrors.terms = auth.termsRequired
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setSuccess('')
    setErrors({})
    try {
      const { data, error } = await getSupabaseBrowserClient().auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim(), role } },
      })
      if (error) {
        const message = error.message.toLowerCase()
        setErrors({ form: message.includes('already registered') || message.includes('already exists') ? auth.emailAlreadyRegistered : auth.signUpFailed })
        return
      }
      if (data.session) {
        const next = getSafeNextPath(new URLSearchParams(window.location.search).get('next'))
        router.replace(next)
        router.refresh()
      } else {
        setSuccess(auth.checkEmail)
      }
    } catch (error) {
      setErrors({ form: error instanceof Error && error.message.includes('environment') ? auth.authUnavailable : auth.signUpFailed })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-primary)' }}><LogoMark size={28} /></div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '8px' }}>{auth.registerTitle}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{auth.registerDescription}</p>
        </div>

        <div className="role-toggle" role="group" aria-label={auth.selectRole}>
          <button type="button" className={`role-btn ${role === 'Student' ? 'active' : ''}`} onClick={() => setRole('Student')} aria-pressed={role === 'Student'}>{auth.student}</button>
          <button type="button" className={`role-btn ${role === 'Instructor' ? 'active' : ''}`} onClick={() => setRole('Instructor')} aria-pressed={role === 'Instructor'}>{auth.instructor}</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormField id="register-name" label={auth.fullName} type="text" placeholder={auth.fullNamePlaceholder} value={fullName} onChange={e => { setFullName(e.target.value); if (errors.fullName || errors.form) setErrors(prev => ({ ...prev, fullName: undefined, form: undefined })) }} error={errors.fullName} autoComplete="name" required />
          <FormField id="register-email" label={auth.email} type="email" placeholder={auth.emailPlaceholder} value={email} onChange={e => { setEmail(e.target.value); if (errors.email || errors.form) setErrors(prev => ({ ...prev, email: undefined, form: undefined })) }} error={errors.email} autoComplete="email" required />
          <FormField id="register-password" label={auth.password} type="password" placeholder={auth.passwordPlaceholder} value={password} onChange={e => { setPassword(e.target.value); if (errors.password || errors.form) setErrors(prev => ({ ...prev, password: undefined, form: undefined })) }} error={errors.password} helperText={auth.passwordHint} autoComplete="new-password" required showPasswordLabel={auth.showPassword} hidePasswordLabel={auth.hidePassword} />
          <FormField id="register-confirm-password" label={auth.confirmPassword} type="password" placeholder={auth.passwordPlaceholder} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword || errors.form) setErrors(prev => ({ ...prev, confirmPassword: undefined, form: undefined })) }} error={errors.confirmPassword} autoComplete="new-password" required showPasswordLabel={auth.showPassword} hidePasswordLabel={auth.hidePassword} />

          <div style={{ marginBottom: '20px' }}>
            <label className="auth-checkbox">
              <input type="checkbox" checked={agreedToTerms} onChange={e => { setAgreedToTerms(e.target.checked); if (errors.terms || errors.form) setErrors(prev => ({ ...prev, terms: undefined, form: undefined })) }} />
              <span>{auth.agreeTo}{' '}<a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{auth.terms}</a>{' '}{auth.and}{' '}<a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{auth.privacy}</a></span>
            </label>
            {errors.terms && <span className="form-error" style={{ display: 'block' }} role="alert">{errors.terms}</span>}
          </div>
          {errors.form && <div className="form-error auth-form-error" role="alert">{errors.form}</div>}
          {success && <div className="auth-success" role="status">{success}</div>}
          <button type="submit" disabled={loading || Boolean(success)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '42px', opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            <span>{auth.createAccount}</span>{loading ? <span className="spinner" aria-hidden="true" /> : <ArrowRight size={16} strokeWidth={2} />}
          </button>
        </form>
        <div className="auth-divider"><span>{auth.or}</span></div>
        <SocialButtons />
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>{auth.alreadyHaveAccount}{' '}<Link href="/login" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>{auth.signIn}</Link></div>
      </AuthCard>
    </AuthLayout>
  )
}
