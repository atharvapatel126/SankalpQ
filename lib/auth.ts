import type { UserRole } from '@/lib/instructor/types'

export const DEFAULT_AUTH_REDIRECT = '/dashboard'

export function getSafeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return DEFAULT_AUTH_REDIRECT
  }

  return value
}

export function getUserRole(
  metadata: Record<string, unknown> | undefined,
  _email?: string | null,
): UserRole {
  void _email
  const role = metadata?.role

  if (typeof role !== 'string') return 'student'

  const normalizedRole = role.trim().toLowerCase()
  if (normalizedRole === 'instructor') return 'instructor'
  if (normalizedRole === 'admin') return 'admin'

  return 'student'
}
