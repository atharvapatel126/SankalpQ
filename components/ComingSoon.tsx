import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AppShell from '@/components/AppShell'

interface ComingSoonProps {
  title: string
  description: string
  icon: LucideIcon
}

export default function ComingSoon({ title, description, icon: Icon }: ComingSoonProps) {
  return (
    <AppShell>
      <div className="coming-soon">
        <div className="coming-soon-icon" aria-hidden="true">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link href="/dashboard" className="coming-soon-link">
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Dashboard
        </Link>
      </div>
    </AppShell>
  )
}
