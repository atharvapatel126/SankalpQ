'use client'

import React from 'react'
import { useLanguage } from '@/components/LanguageProvider'

// Simple monochrome Google icon
function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.24 10.285V13.4h6.887C18.2 15.6 15.64 18 12.24 18c-3.32 0-6-2.69-6-6s2.68-6 6-6c1.5 0 2.87.55 3.93 1.47l2.36-2.36C16.99 3.65 14.77 3 12.24 3 7.15 3 3 7.15 3 12.24s4.15 9.24 9.24 9.24c5.38 0 8.94-3.78 8.94-9.09 0-.61-.06-1.12-.17-1.61H12.24z" />
    </svg>
  )
}

// Simple monochrome GitHub icon
function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export default function SocialButtons() {
  const { auth } = useLanguage()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {/* 
        OAuth Placeholder Buttons — visual-only stubs for prototype.
        Real authentication provider integration will be added in production.
      */}
      <button
        type="button"
        className="btn-social"
        onClick={e => e.preventDefault()}
        aria-label={auth.continueGoogle}
      >
        <GoogleIcon />
        <span>{auth.continueGoogle}</span>
      </button>

      <button
        type="button"
        className="btn-social"
        onClick={e => e.preventDefault()}
        aria-label={auth.continueGithub}
      >
        <GitHubIcon />
        <span>{auth.continueGithub}</span>
      </button>
    </div>
  )
}
