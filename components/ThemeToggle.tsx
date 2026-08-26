'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '6px',
          border: '1px solid var(--border)',
        }}
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '6px',
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'border-color 150ms ease-out, color 150ms ease-out',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          transition: 'opacity 150ms ease-out, transform 150ms ease-out',
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
          position: isDark ? 'static' : 'absolute',
        }}
      >
        <Sun size={16} strokeWidth={1.5} />
      </span>
      <span
        style={{
          display: 'inline-flex',
          transition: 'opacity 150ms ease-out, transform 150ms ease-out',
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
          position: isDark ? 'absolute' : 'static',
        }}
      >
        <Moon size={16} strokeWidth={1.5} />
      </span>
    </button>
  )
}
