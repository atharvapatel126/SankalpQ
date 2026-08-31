'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  CircuitBoard,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Sparkles,
  Target,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import LogoMark from '@/components/LogoMark'
import ThemeToggle from '@/components/ThemeToggle'

const NAV_ITEMS: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/courses', icon: BookOpen },
  { label: 'Circuit Builder', href: '/circuit-builder', icon: CircuitBoard },
  { label: 'Simulator', href: '/simulator', icon: FlaskConical },
  { label: 'AI Tutor', href: '/ai-tutor', icon: Sparkles },
  { label: 'Challenges', href: '/challenges', icon: Target },
]

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="app-shell">
      <div className="app-mobile-topbar">
        <Link href="/dashboard" className="app-brand" aria-label="SankalpQ dashboard">
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

      <aside className={`app-sidebar${mobileOpen ? ' is-open' : ''}`}>
        <div className="app-sidebar-inner">
          <Link href="/dashboard" className="app-brand" aria-label="SankalpQ dashboard">
            <LogoMark size={28} />
            <span>SankalpQ</span>
          </Link>

          <nav className="app-nav" aria-label="Dashboard navigation">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
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

          <div className="app-sidebar-footer">
            <div className="app-sidebar-tools">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="app-user-row">
              <div className="app-avatar" aria-hidden="true">AS</div>
              <div className="app-user-details">
                <span>Ananya Sharma</span>
                <Link href="/" onClick={() => setMobileOpen(false)}>Log out</Link>
              </div>
              <ArrowRight size={14} strokeWidth={1.5} className="app-user-arrow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
    </div>
  )
}
