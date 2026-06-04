import { NextResponse } from 'next/server'

import { buildClearAuthCookieHeaders } from '@/lib/auth-cookies'

/**
 * Force-clear Payload auth cookies when admin "Log out" leaves the session active.
 * Visit: /api/cerrar-sesion
 */
export async function GET(request: Request) {
  const loginUrl = new URL('/admin/login', request.url)

  try {
    await fetch(new URL('/api/users/logout?allSessions=true', request.url), {
      method: 'POST',
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    })
  } catch {
    // Cookie clearing below still runs
  }

  const response = NextResponse.redirect(loginUrl)

  for (const cookie of buildClearAuthCookieHeaders()) {
    response.headers.append('Set-Cookie', cookie)
  }

  return response
}

export async function POST(request: Request) {
  return GET(request)
}
