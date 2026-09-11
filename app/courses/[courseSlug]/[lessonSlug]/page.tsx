import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EnrollmentGate from '@/components/courses/EnrollmentGate'
import {
  COURSES,
  getLessonBySlug,
} from '@/lib/courses/course-data'
import '@/styles/courses.css'

interface LessonPageProps {
  params: {
    courseSlug: string
    lessonSlug: string
  }
}

export function generateStaticParams() {
  return COURSES.flatMap(course =>
    course.lessons.map(lesson => ({
      courseSlug: course.slug,
      lessonSlug: lesson.slug,
    }))
  )
}

export function generateMetadata({ params }: LessonPageProps): Metadata {
  const match = getLessonBySlug(params.courseSlug, params.lessonSlug)
  if (!match) return { title: 'Lesson not found | SankalpQ' }

  return {
    title: match.lesson.title + ' | SankalpQ Courses',
    description: match.lesson.summary,
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const match = getLessonBySlug(params.courseSlug, params.lessonSlug)
  if (!match) notFound()

  return <EnrollmentGate course={match.course} lesson={match.lesson} />
}
