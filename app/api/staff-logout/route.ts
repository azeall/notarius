import { NextResponse } from 'next/server'
import { authenticatedStaff, sessionCookieOptions } from '@/lib/auth'
import { apiError, checkOrigin, unauthorized } from '@/lib/auth-http'
export async function POST(req: Request) {
  if (!await authenticatedStaff()) return unauthorized()
  try {
    checkOrigin(req)
    const response = NextResponse.json({ ok: true })
    response.cookies.set('staff_auth', '', { ...sessionCookieOptions, maxAge: 0 })
    return response
  } catch (error) { return apiError(error) }
}
