import { CheckCircle2 } from 'lucide-react'
import CourseProgress from './CourseProgress'
import type { Course, Lesson } from '@/lib/courses/types'

interface LessonHeaderProps {
  course: Course
  lesson: Lesson
  coursePercentage: number
  completed: boolean
}

export default function LessonHeader({
  course,
  lesson,
  coursePercentage,
  completed,
}: LessonHeaderProps) {
  return (
    <header className="courses-lesson-header">
      <div className="courses-lesson-kicker">
        <span className="courses-level-badge">Level {course.level}</span>
        <span>
          Lesson {lesson.order} of {course.lessons.length}
        </span>
        {completed && (
          <span className="courses-lesson-complete">
            <CheckCircle2 size={14} aria-hidden="true" />
            Completed
          </span>
        )}
      </div>
      <h1>{lesson.title}</h1>
      <p>{lesson.summary}</p>
      <CourseProgress
        value={coursePercentage}
        label={course.title + ' completion'}
      />
    </header>
  )
}
