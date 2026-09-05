import { createServerClient } from '@supabase/ssr'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { getAuthRedirectForUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const explicitNext = searchParams.get('next')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.redirect(`${origin}/login?error=auth_unconfigured`)
  }

  // Temporary response to accumulate cookie headers
  const response = NextResponse.redirect(`${origin}/dashboard`)

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // 1. Support token_hash OTP verification (email confirmation, recovery, signup OTP)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error && data?.user) {
      const destination = getAuthRedirectForUser(data.user, explicitNext)
      const finalResponse = NextResponse.redirect(`${origin}${destination}`)
      response.cookies.getAll().forEach(cookie => {
        finalResponse.cookies.set(cookie.name, cookie.value)
      })
      return finalResponse
    }
  }

  // 2. Support PKCE authorization code exchange
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.user) {
      const destination = getAuthRedirectForUser(data.user, explicitNext)
      const finalResponse = NextResponse.redirect(`${origin}${destination}`)
      response.cookies.getAll().forEach(cookie => {
        finalResponse.cookies.set(cookie.name, cookie.value)
      })
      return finalResponse
    }
  }

  // If missing or verification failed
  return NextResponse.redirect(`${origin}/login?error=callback_failed`)
}
