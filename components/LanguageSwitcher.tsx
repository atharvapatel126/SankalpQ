'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { LANGUAGES, Language } from '@/lib/languages'

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Language>(LANGUAGES[0])
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          height: '36px',
          padding: '0 12px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontFamily: 'var(--font-geist-mono), JetBrains Mono, monospace',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'border-color 150ms ease-out, color 150ms ease-out',
          whiteSpace: 'nowrap',
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
        <Globe size={14} strokeWidth={1.5} />
        <span>{selected.code}</span>
      </button>

      {open && (
        <div
          className="lang-dropdown"
          role="listbox"
          aria-label="Language options"
        >
          {LANGUAGES.map(lang => (
            <div
              key={lang.code}
              role="option"
              aria-selected={selected.code === lang.code}
              className={`lang-option${selected.code === lang.code ? ' selected' : ''}`}
              onClick={() => {
                setSelected(lang)
                setOpen(false)
              }}
              // Arabic: apply RTL direction to this row only
              dir={lang.dir ?? 'ltr'}
            >
              <span>
                <span style={{ marginRight: '8px', fontSize: '13px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                  {lang.code}
                </span>
                {lang.native}
              </span>
              {selected.code === lang.code && (
                <Check size={14} strokeWidth={2} style={{ color: 'var(--accent)', flexShrink: 0, marginLeft: '8px' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
