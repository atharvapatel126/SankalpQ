import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  COURSES,
  getCourseBySlug,
  getLessonById,
} from './course-data'
import type { Course, Lesson } from './types'

interface CourseMetadataViewRow {
  course_id: string
  course_legacy_id: string
  course_slug: string
  course_title: string
  course_description: string | null
  course_outcome: string | null
  course_level: number | null
  module_id: string
  module_legacy_id: string
  module_title: string
  module_description: string | null
  module_position: number
  lesson_id: string
  lesson_legacy_id: string
  lesson_slug: string
  lesson_title: string
  lesson_description: string | null
  lesson_summary: string | null
  lesson_position: number
  lesson_status: 'draft' | 'published' | 'archived'
}

const COURSE_CATALOGUE_SELECT = `
  course_id,
  course_legacy_id,
  course_slug,
  course_title,
  course_description,
  course_outcome,
  course_level,
  module_id,
  module_legacy_id,
  module_title,
  module_description,
  module_position,
  lesson_id,
  lesson_legacy_id,
  lesson_slug,
  lesson_title,
  lesson_description,
  lesson_summary,
  lesson_position,
  lesson_status
`

function mergeLessonMetadata(row: CourseMetadataViewRow): Lesson | null {
  const staticLesson = getLessonById(row.lesson_legacy_id)?.lesson
  if (!staticLesson) return null

  return {
    ...staticLesson,
    id: row.lesson_legacy_id,
    slug: row.lesson_slug,
    title: row.lesson_title,
    summary:
      row.lesson_summary ?? row.lesson_description ?? staticLesson.summary,
    order: row.lesson_position,
  }
}

function mergeCourseMetadata(rows: CourseMetadataViewRow[]): Course[] {
  const rowsByCourse = new Map<string, CourseMetadataViewRow[]>()

  for (const row of rows) {
    const courseRows = rowsByCourse.get(row.course_id) ?? []
    courseRows.push(row)
    rowsByCourse.set(row.course_id, courseRows)
  }

  return Array.from(rowsByCourse.values())
    .sort((left, right) => {
      const leftLevel = left[0].course_level ?? Number.MAX_SAFE_INTEGER
      const rightLevel = right[0].course_level ?? Number.MAX_SAFE_INTEGER
      return leftLevel - rightLevel
    })
    .map(courseRows => {
      const row = courseRows[0]
      const staticCourse = getCourseBySlug(row.course_slug)
      if (!staticCourse) return null

      const lessons = courseRows
        .slice()
        .sort(
          (left, right) =>
            left.module_position - right.module_position ||
            left.lesson_position - right.lesson_position
        )
        .filter(courseRow => courseRow.lesson_status === 'published')
        .map(mergeLessonMetadata)
        .filter((lesson): lesson is Lesson => lesson !== null)

      return {
        ...staticCourse,
        id: row.course_legacy_id,
        slug: row.course_slug,
        title: row.course_title,
        description: row.course_description ?? staticCourse.description,
        outcome: row.course_outcome ?? staticCourse.outcome,
        level: row.course_level ?? staticCourse.level,
        lessons,
      }
    })
    .filter((course): course is Course => course !== null)
}

export async function fetchPublishedCourseCatalog(): Promise<Course[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from('published_course_catalogue')
    .select(COURSE_CATALOGUE_SELECT)
    .order('course_level', { ascending: true })
    .order('module_position', { ascending: true })
    .order('lesson_position', { ascending: true })

  if (error) throw error

  return mergeCourseMetadata(
    (data ?? []) as unknown as CourseMetadataViewRow[]
  )
}

export async function fetchPublishedCourseBySlug(
  slug: string
): Promise<Course | null> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from('published_course_catalogue')
    .select(COURSE_CATALOGUE_SELECT)
    .eq('course_slug', slug)
    .order('module_position', { ascending: true })
    .order('lesson_position', { ascending: true })

  if (error) throw error

  return (
    mergeCourseMetadata(
      (data ?? []) as unknown as CourseMetadataViewRow[]
    )[0] ?? null
  )
}

export function getStaticCourseFallback(): Course[] {
  return COURSES
}
