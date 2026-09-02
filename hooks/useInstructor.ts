'use client'

import { useEffect, useState } from 'react'
import type { UserRole } from '@/lib/instructor/types'
import { getUserRole } from '@/lib/auth'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export interface UseInstructorResult {
  role: UserRole | null
  isInstructor: boolean
  userName: string
  userEmail: string | null
  loading: boolean
}

export function useInstructor(): UseInstructorResult {
  const [role, setRole] = useState<UserRole | null>(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getSupabaseBrowserClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!active) return
        if (!data.user) {
          setLoading(false)
          return
        }
        const detectedRole = getUserRole(
          data.user.user_metadata as Record<string, unknown> | undefined,
          data.user.email,
        )
        const name = data.user.user_metadata?.full_name as string | undefined
        setRole(detectedRole)
        setUserEmail(data.user.email ?? null)
        setUserName(
          typeof name === 'string' && name.trim() ? name : data.user.email ?? 'Instructor'
        )
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  return {
    role,
    isInstructor: role === 'instructor' || role === 'admin',
    userName,
    userEmail,
    loading,
  }
}
