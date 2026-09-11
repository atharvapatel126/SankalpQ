'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import LessonWorkspace from '@/components/courses/LessonWorkspace'
import { fetchPublishedCourseBySlug } from '@/lib/courses/courses-supabase'
import { getMyEnrollment } from '@/lib/courses/enrollments-supabase'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Course, Lesson } from '@/lib/courses/types'

interface EnrollmentGateProps {
  course: Course
  lesson: Lesson
}

export default function EnrollmentGate({ course, lesson }: EnrollmentGateProps) {
  const [state, setState] = useState<'loading' | 'allowed' | 'blocked' | 'error'>('loading')

  useEffect(() => {
    let active = true

    async function checkAccess() {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error

        if (!data.user) {
          if (active) setState('blocked')
          return
        }

        const { data: profileRole, error: roleError } = await supabase.rpc(
          'current_profile_role'
        )
        if (roleError) throw roleError

        const role = typeof profileRole === 'string' ? profileRole : null
        if (role === 'instructor' || role === 'admin') {
          if (active) setState('allowed')
          return
        }

        const catalogueCourse = course.databaseId
          ? course
          : await fetchPublishedCourseBySlug(course.slug)
        const enrollment = catalogueCourse?.databaseId
          ? await getMyEnrollment(catalogueCourse.databaseId)
          : null
        if (active) setState(enrollment?.status === 'active' || enrollment?.status === 'completed' ? 'allowed' : 'blocked')
      } catch (error) {
        console.error('Failed to verify lesson enrollment:', error)
        if (active) setState('error')
      }
    }

    void checkAccess()
    return () => {
      active = false
    }
  }, [course])

  if (state === 'allowed') {
    return <LessonWorkspace course={course} lesson={lesson} />
  }

  return (
    <AppShell>
      <div className="courses-page">
        <div className="courses-breadcrumbs">
          <Link href={`/courses/${course.slug}`}>Course details</Link>
          <span>/</span>
          <span>{lesson.title}</span>
        </div>
        <section className="courses-lesson-finish" aria-live="polite">
          <div>
            <h2>
              {state === 'loading'
                ? 'Checking course access…'
                : state === 'error'
                  ? 'We couldn’t verify your course access.'
                  : 'Enroll to access this lesson'}
            </h2>
            <p>
              {state === 'error'
                ? 'Please return to the course details page and try again.'
                : 'Enroll in this published course before opening its interactive lesson workspace.'}
            </p>
          </div>
          <Link href={`/courses/${course.slug}`} className="btn-primary courses-finish-action">
            Course Details
          </Link>
        </section>
      </div>
    </AppShell>
  )
}
