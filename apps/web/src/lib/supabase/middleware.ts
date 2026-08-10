import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

const AUTH_ROUTE = '/auth'
const AUTH_CALLBACK_ROUTE = '/auth/callback'
const ONBOARDING_ROUTE = '/onboarding'
const HOME_ROUTE = '/dashboard'

// Routes reachable without a session. "/" itself always redirects onward
// (to /auth when logged out, dashboard/onboarding when logged in) — it has
// no page of its own.
const PUBLIC_ROUTES = new Set(['/', '/auth'])

export async function updateSession(request: NextRequest) {
  // The OAuth callback has to reach its route handler untouched. At this
  // point the session does not exist yet — creating it by exchanging the
  // `code` is precisely what that handler does — so gating it here would
  // bounce the user back to /auth and silently break Google sign-in.
  if (request.nextUrl.pathname === AUTH_CALLBACK_ROUTE) {
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    }
  )

  // IMPORTANT: this call revalidates the auth token and must not be removed —
  // it's what keeps the session alive across server/client boundaries.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublicRoute = PUBLIC_ROUTES.has(pathname)
  const isOnboardingRoute = pathname === ONBOARDING_ROUTE

  if (!user) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL(AUTH_ROUTE, request.url))
    }
    if (isPublicRoute) return response
    const redirectUrl = new URL(AUTH_ROUTE, request.url)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Logged in past this point.
  if (pathname === AUTH_ROUTE) {
    return NextResponse.redirect(new URL(HOME_ROUTE, request.url))
  }

  // Every remaining route needs to know whether a character already exists:
  // "/" and onboarding decide where to send the user, everything else
  // requires one to render at all.
  const { data: character } = await supabase
    .from('characters')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (pathname === '/') {
    return NextResponse.redirect(new URL(character ? HOME_ROUTE : ONBOARDING_ROUTE, request.url))
  }
  if (isOnboardingRoute) {
    return character ? NextResponse.redirect(new URL(HOME_ROUTE, request.url)) : response
  }
  if (!character) {
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url))
  }

  return response
}
