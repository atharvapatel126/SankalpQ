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
  const [userName, setUserName] = useState('Instructor')

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    let active = true
    getSupabaseBrowserClient().auth.getUser().then(({ data }) => {
      if (!active || !data.user) return
      const metadataName = data.user.user_metadata?.full_name
      setUserName(
        typeof metadataName === 'string' && metadataName.trim()
          ? metadataName
          : data.user.email ?? 'Instructor'
      )
    }).catch(() => {})
    return () => { active = false }
  }, [])

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
