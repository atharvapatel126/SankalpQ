import type { UserRole } from '@/lib/instructor/types'

export const DEFAULT_AUTH_REDIRECT = '/dashboard'

export function getSafeNextPath(value: string | null | undefined, defaultPath: string = DEFAULT_AUTH_REDIRECT) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return defaultPath
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

export function getRoleDefaultRedirect(role: UserRole): string {
  if (role === 'instructor' || role === 'admin') {
    return '/instructor'
  }
  return '/dashboard'
}

export function getAuthRedirectForUser(
  user: { user_metadata?: Record<string, unknown> | null; email?: string | null } | null | undefined,
  explicitNext?: string | null,
): string {
  if (explicitNext && explicitNext.startsWith('/') && !explicitNext.startsWith('//') && !explicitNext.includes('\\')) {
    return explicitNext
  }
  const role = getUserRole(user?.user_metadata ?? undefined, user?.email)
  return getRoleDefaultRedirect(role)
}
