import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSafeNextPath } from '@/lib/auth'

const PROTECTED_PATHS = [
  '/dashboard',
  '/courses',
  '/challenges',
  '/simulator',
  '/circuit-builder',
  '/ai-tutor',
]

const AUTH_PATHS = ['/login', '/register']

function matchesPath(pathname: string, paths: string[]) {
  return paths.some(path => pathname === path || pathname.startsWith(`${path}/`))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = matchesPath(pathname, PROTECTED_PATHS)
  const isAuthPage = matchesPath(pathname, AUTH_PATHS)

  if (!isProtected && !isAuthPage) return NextResponse.next()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    if (!isProtected) return NextResponse.next()

    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    loginUrl.searchParams.set('error', 'auth_unconfigured')
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = getSafeNextPath(request.nextUrl.searchParams.get('next'))
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/courses/:path*', '/challenges/:path*', '/simulator/:path*', '/circuit-builder/:path*', '/ai-tutor/:path*', '/login', '/register'],
}
