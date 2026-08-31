import type { Metadata } from 'next'
import CoursesOverview from '@/components/courses/CoursesOverview'
import '@/styles/courses.css'

export const metadata: Metadata = {
  title: 'Courses | SankalpQ',
  description:
    'Learn quantum fundamentals, gates, circuits, and algorithms through interactive lessons.',
}

export default function CoursesPage() {
  return <CoursesOverview />
}
