import type { Metadata } from 'next'
import InstructorShell from '@/components/instructor/InstructorShell'

export const metadata: Metadata = {
  title: 'Instructor Portal — SankalpQ',
  description: 'Manage students, courses, challenges, analytics and more from the SankalpQ Instructor Portal.',
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return <InstructorShell>{children}</InstructorShell>
}
