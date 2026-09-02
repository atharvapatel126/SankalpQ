import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getLessonById } from './course-data'

export interface SupabaseLessonProgress {
  lessonId: string
  courseId: string
  status: 'not-started' | 'in-progress' | 'completed'
  startedAt: string | null
  completedAt: string | null
  updatedAt: string
}

export async function loadLessonProgress(): Promise<
  SupabaseLessonProgress[]
> {
  const supabase = getSupabaseBrowserClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) return []

  const { data, error } = await supabase
    .from('lesson_progress')
    .select(
      'lesson_id, course_id, status, started_at, completed_at, updated_at'
    )
    .eq('user_id', user.id)

  if (error) throw error

  return (data ?? []).map(row => ({
    lessonId: row.lesson_id,
    courseId: row.course_id,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
  }))
}

export async function upsertLessonProgress(
  lessonId: string,
  status: 'in-progress' | 'completed'
) {
  const supabase = getSupabaseBrowserClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('User is not authenticated')

  const match = getLessonById(lessonId)

  if (!match) {
    throw new Error(`Unknown lesson: ${lessonId}`)
  }

  const now = new Date().toISOString()

  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: user.id,
        course_id: match.course.id,
        lesson_id: lessonId,
        status,
        started_at: status === 'in-progress' ? now : undefined,
        completed_at: status === 'completed' ? now : null,
        updated_at: now,
      },
      {
        onConflict: 'user_id,course_id,lesson_id',
      }
    )

  if (error) throw error
}

export async function markLessonCompleted(
  lessonId: string,
  nextLessonId?: string
) {
  await upsertLessonProgress(lessonId, 'completed')

  if (nextLessonId) {
    await upsertLessonProgress(nextLessonId, 'in-progress')
  }
}