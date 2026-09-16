import { NextResponse } from 'next/server'
import { adminAuthenticated, sessionCookieOptions } from '@/lib/auth'
import { apiError, checkOrigin, unauthorized } from '@/lib/auth-http'
export async function POST(req: Request) {
  if (!await adminAuthenticated()) return unauthorized()
  try {
    checkOrigin(req)
    const response = NextResponse.json({ ok: true })
    response.cookies.set('admin_auth', '', { ...sessionCookieOptions, maxAge: 0 })
    return response
  } catch (error) { return apiError(error) }
}
