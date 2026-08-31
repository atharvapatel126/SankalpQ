export const DEFAULT_AUTH_REDIRECT = '/dashboard'

export function getSafeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return DEFAULT_AUTH_REDIRECT
  }

  return value
}
