import CourseCard from './CourseCard'
import { getCourseProgressSummary } from '@/lib/courses/progress'
import type { Course, CourseProgressState } from '@/lib/courses/types'

interface CourseGridProps {
  courses: Course[]
  progress: CourseProgressState
}

export default function CourseGrid({ courses, progress }: CourseGridProps) {
  return (
    <div className="courses-grid">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          summary={getCourseProgressSummary(course, progress)}
        />
      ))}
    </div>
  )
}
