'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CircuitBoard,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Target,
  Users,
  X,
  ClipboardList,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import LogoMark from '@/components/LogoMark'
import ThemeToggle from '@/components/ThemeToggle'
import { useInstructor } from '@/hooks/useInstructor'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

// ── Instructor navigation items ───────────────────────────────────────────────
const INSTRUCTOR_NAV: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: 'Dashboard',       href: '/instructor',              icon: LayoutDashboard },
  { label: 'Students',        href: '/instructor/students',     icon: Users },
  { label: 'Courses',         href: '/instructor/courses',      icon: BookOpen },
  { label: 'Challenges',      href: '/instructor/challenges',   icon: Target },
  { label: 'Assessments',     href: '/instructor/assessments',  icon: ClipboardList },
  { label: 'Circuit Library', href: '/instructor/circuit-library', icon: CircuitBoard },
  { label: 'Analytics',       href: '/instructor/analytics',    icon: BarChart3 },
  { label: 'Announcements',   href: '/instructor/announcements', icon: Bell },
]

interface InstructorShellProps {
  children: React.ReactNode
}

export default function InstructorShell({ children }: InstructorShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isInstructor, userName, loading } = useInstructor()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const userInitials = userName === 'Instructor'
    ? 'IN'
    : userName.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()

  const handleSignOut = async () => {
    try {
      await getSupabaseBrowserClient().auth.signOut()
    } finally {
      window.location.assign('/')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary, #0a0e17)' }}>
        <div className="spinner" style={{ width: '28px', height: '28px', borderColor: 'var(--border-color, rgba(255,255,255,0.2))', borderTopColor: 'var(--accent, #6366f1)' }} />
      </div>
    )
  }

  if (!isInstructor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg-primary, #0a0e17)', color: 'var(--text-primary, #e6edf3)' }}>
        <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '32px', background: 'var(--bg-secondary, #121824)', borderRadius: '12px', border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--accent, #6366f1)' }}>
            <LogoMark size={32} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Instructor Access Only</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary, #8b949e)', lineHeight: 1.5, marginBottom: '24px' }}>
            Your account does not have instructor privileges. Please return to the student dashboard.
          </p>
          <Link href="/dashboard" className="btn-primary" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
            Go to Student Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <div className="app-mobile-topbar">
        <Link href="/instructor" className="app-brand" aria-label="Instructor Dashboard">
          <LogoMark size={28} />
          <span>SankalpQ</span>
        </Link>
        <button
          type="button"
          className="app-menu-button"
          onClick={() => setMobileOpen(open => !open)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="app-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside className={`app-sidebar${mobileOpen ? ' is-open' : ''}`}>
        <div className="app-sidebar-inner">
          <Link href="/instructor" className="app-brand" aria-label="Instructor Dashboard">
            <LogoMark size={28} />
            <span>SankalpQ</span>
          </Link>

          {/* Role badge */}
          <div className="instructor-role-badge" aria-label="Current role: Instructor">
            <GraduationCap size={12} strokeWidth={2} />
            <span>Instructor</span>
          </div>

          <nav className="app-nav" aria-label="Instructor navigation">
            {INSTRUCTOR_NAV.map(item => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href !== '/instructor' && pathname.startsWith(`${item.href}/`))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`app-nav-link${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="app-nav-indicator" aria-hidden="true" />
                  <Icon size={20} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="app-sidebar-footer">
            <div className="app-sidebar-tools">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="app-user-row">
              <div className="app-avatar" aria-hidden="true">{userInitials}</div>
              <div className="app-user-details">
                <span>{userName}</span>
                <button type="button" onClick={handleSignOut}>Log out</button>
              </div>
              <ArrowRight size={14} strokeWidth={1.5} className="app-user-arrow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
    </div>
  )
}
