import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export type EnrollmentStatus = 'active' | 'completed' | 'withdrawn'

export interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  status: EnrollmentStatus
  enrolledAt: string
  updatedAt: string
}

interface EnrollmentRow {
  id: string
  user_id: string
  course_id: string
  status: EnrollmentStatus
  enrolled_at: string
  updated_at: string
}

function mapEnrollment(row: EnrollmentRow): CourseEnrollment {
  return {
    id: row.id,
    userId: row.user_id,
    courseId: row.course_id,
    status: row.status,
    enrolledAt: row.enrolled_at,
    updatedAt: row.updated_at,
  }
}

async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await getSupabaseBrowserClient().auth.getUser()
  if (error) throw error
  return data.user?.id ?? null
}

export async function getMyEnrollments(): Promise<CourseEnrollment[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await getSupabaseBrowserClient()
    .from('enrollments')
    .select('id, user_id, course_id, status, enrolled_at, updated_at')
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as EnrollmentRow[]).map(mapEnrollment)
}

export async function getMyEnrollment(
  courseId: string
): Promise<CourseEnrollment | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const { data, error } = await getSupabaseBrowserClient()
    .from('enrollments')
    .select('id, user_id, course_id, status, enrolled_at, updated_at')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (error) throw error
  return data ? mapEnrollment(data as unknown as EnrollmentRow) : null
}

export async function enrollInCourse(
  courseId: string
): Promise<CourseEnrollment> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('You must be signed in to enroll in a course.')

  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, course_id: courseId, status: 'active' })
    .select('id, user_id, course_id, status, enrolled_at, updated_at')
    .single()

  if (!error && data) return mapEnrollment(data as unknown as EnrollmentRow)

  if (error?.code === '23505') {
    const existing = await getMyEnrollment(courseId)
    if (existing) return existing
  }

  throw error ?? new Error('The enrollment could not be created.')
}
