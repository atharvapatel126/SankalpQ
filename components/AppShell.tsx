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
import { useLanguage } from '@/components/LanguageProvider'

const NAV_ITEMS: Array<{ key: 'dashboard' | 'courses' | 'circuitBuilder' | 'simulator' | 'aiTutor' | 'challenges'; href: string; icon: LucideIcon }> = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'courses', href: '/courses', icon: BookOpen },
  { key: 'circuitBuilder', href: '/circuit-builder', icon: CircuitBoard },
  { key: 'simulator', href: '/simulator', icon: FlaskConical },
  { key: 'aiTutor', href: '/ai-tutor', icon: Sparkles },
  { key: 'challenges', href: '/challenges', icon: Target },
]

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { translations } = useLanguage()

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
        <Link href="/dashboard" className="app-brand" aria-label={translations.app.dashboardHome}>
          <LogoMark size={28} />
          <span>SankalpQ</span>
        </Link>
        <button
          type="button"
          className="app-menu-button"
          onClick={() => setMobileOpen(open => !open)}
          aria-label={mobileOpen ? translations.app.closeNavigation : translations.app.openNavigation}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="app-sidebar-overlay"
          aria-label={translations.app.closeNavigation}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`app-sidebar${mobileOpen ? ' is-open' : ''}`}>
        <div className="app-sidebar-inner">
          <Link href="/dashboard" className="app-brand" aria-label={translations.app.dashboardHome}>
            <LogoMark size={28} />
            <span>SankalpQ</span>
          </Link>

          <nav className="app-nav" aria-label={translations.app.dashboardNavigation}>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))
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
                  <span>{translations.app[item.key]}</span>
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
                <Link href="/" onClick={() => setMobileOpen(false)}>{translations.app.logOut}</Link>
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
