import CourseCard from './CourseCard'
import { getCourseProgressSummary } from '@/lib/courses/progress'
import type { Course, CourseProgressState } from '@/lib/courses/types'
import type { CourseEnrollment } from '@/lib/courses/enrollments-supabase'

interface CourseGridProps {
  courses: Course[]
  progress: CourseProgressState
  enrollments: Record<string, CourseEnrollment>
}

export default function CourseGrid({ courses, progress, enrollments }: CourseGridProps) {
  return (
    <div className="courses-grid">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          summary={getCourseProgressSummary(course, progress)}
          enrollment={course.databaseId ? enrollments[course.databaseId] ?? null : null}
        />
      ))}
    </div>
  )
}
