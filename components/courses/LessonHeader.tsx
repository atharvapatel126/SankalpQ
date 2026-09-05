import { CheckCircle2 } from 'lucide-react'
import CourseProgress from './CourseProgress'
import type { Course, Lesson } from '@/lib/courses/types'
import { useLanguage } from '@/components/LanguageProvider'

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
  const { translations } = useLanguage()
  const t = translations.student.courses
  const common = translations.student.common
  const localizedCourse = t.content[course.id]?.title ?? course.title
  const localizedLesson = t.lessons[lesson.id]?.title ?? lesson.title
  return (
    <header className="courses-lesson-header">
      <div className="courses-lesson-kicker">
        <span className="courses-level-badge">{common.level} {course.level}</span>
        <span>
          {common.lesson} {lesson.order} of {course.lessons.length}
        </span>
        {completed && (
          <span className="courses-lesson-complete">
            <CheckCircle2 size={14} aria-hidden="true" />
            {common.completed}
          </span>
        )}
      </div>
      <h1>{localizedLesson}</h1>
      <p>{lesson.summary}</p>
      <CourseProgress
        value={coursePercentage}
        label={t.completionLabel(localizedCourse)}
      />
    </header>
  )
}
