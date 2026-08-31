'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import AppShell from '@/components/AppShell'
import ConceptSection from './ConceptSection'
import FormulaBlock from './FormulaBlock'
import InteractiveDemo from './InteractiveDemo'
import LessonHeader from './LessonHeader'
import LessonSidebar from './LessonSidebar'
import MiniQuiz from './MiniQuiz'
import TryInCircuitBuilder from './TryInCircuitBuilder'
import VisualExplanation from './VisualExplanation'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { getAdjacentLessons } from '@/lib/courses/course-data'
import { getCourseProgressSummary } from '@/lib/courses/progress'
import type { Course, Lesson } from '@/lib/courses/types'

interface LessonWorkspaceProps {
  course: Course
  lesson: Lesson
}

export default function LessonWorkspace({
  course,
  lesson,
}: LessonWorkspaceProps) {
  const router = useRouter()
  const {
    progress,
    hydrated,
    setCurrentLesson,
    recordQuizAnswer,
    completeLesson,
  } = useCourseProgress()
  const summary = getCourseProgressSummary(course, progress)
  const adjacent = getAdjacentLessons(lesson.id)
  const completed = progress.completedLessonIds.includes(lesson.id)
  const hasQuizAttempt =
    typeof progress.quizAnswers[lesson.id] === 'string'

  useEffect(() => {
    if (hydrated) setCurrentLesson(lesson.id)
  }, [hydrated, lesson.id, setCurrentLesson])

  function finishLesson() {
    if (!hasQuizAttempt) return

    completeLesson(lesson.id, adjacent.next?.lesson.id)
    if (adjacent.next) {
      router.push(
        '/courses/' +
          adjacent.next.course.slug +
          '/' +
          adjacent.next.lesson.slug
      )
    } else {
      router.push('/courses')
    }
  }

  return (
    <AppShell>
      <div
        className="courses-lesson-page"
        aria-busy={!hydrated}
        data-hydrated={hydrated}
      >
        <div className="courses-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/courses">Courses</Link>
          <span aria-hidden="true">/</span>
          <span>{course.title}</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{lesson.title}</span>
        </div>

        <div className="courses-lesson-layout">
          <LessonSidebar
            course={course}
            activeLessonId={lesson.id}
            completedLessonIds={progress.completedLessonIds}
            percentage={summary.percentage}
          />

          <main className="courses-lesson-main">
            <LessonHeader
              course={course}
              lesson={lesson}
              coursePercentage={summary.percentage}
              completed={completed}
            />

            <ConceptSection
              introduction={lesson.introduction}
              paragraphs={lesson.coreExplanation}
              keyPoints={lesson.keyPoints}
            />

            {lesson.formula && <FormulaBlock formula={lesson.formula} />}

            <VisualExplanation visual={lesson.visual} />
            <InteractiveDemo key={lesson.id} example={lesson.interactive} />
            <TryInCircuitBuilder exercise={lesson.builderExercise} />
            <MiniQuiz
              key={lesson.quiz.id}
              question={lesson.quiz}
              savedAnswerId={progress.quizAnswers[lesson.id]}
              onSubmit={(answerId, isCorrect) =>
                recordQuizAnswer(lesson.id, answerId, isCorrect)
              }
            />

            <section className="courses-lesson-finish" aria-labelledby="lesson-finish">
              <div>
                <span className="dashboard-eyebrow dashboard-eyebrow-mono">
                  {completed ? 'Lesson completed' : 'Ready to continue'}
                </span>
                <h2 id="lesson-finish">
                  {adjacent.next
                    ? adjacent.next.lesson.title
                    : 'Course path complete'}
                </h2>
                <p>
                  {hasQuizAttempt
                    ? 'Your quiz result is saved locally with your lesson progress.'
                    : 'Answer the knowledge check to unlock lesson completion.'}
                </p>
              </div>
              <button
                type="button"
                className="btn-primary courses-finish-action"
                onClick={finishLesson}
                disabled={!hydrated || !hasQuizAttempt}
              >
                {completed ? (
                  <CheckCircle2 size={16} aria-hidden="true" />
                ) : null}
                {adjacent.next
                  ? completed
                    ? 'Next lesson'
                    : 'Complete and continue'
                  : 'Finish learning path'}
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </section>

            <nav className="courses-lesson-footer-nav" aria-label="Lesson navigation">
              {adjacent.previous ? (
                <Link
                  href={
                    '/courses/' +
                    adjacent.previous.course.slug +
                    '/' +
                    adjacent.previous.lesson.slug
                  }
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  <span>
                    <small>Previous</small>
                    {adjacent.previous.lesson.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {adjacent.next && (
                <Link
                  href={
                    '/courses/' +
                    adjacent.next.course.slug +
                    '/' +
                    adjacent.next.lesson.slug
                  }
                  className="is-next"
                >
                  <span>
                    <small>Next</small>
                    {adjacent.next.lesson.title}
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
            </nav>
          </main>
        </div>
      </div>
    </AppShell>
  )
}
