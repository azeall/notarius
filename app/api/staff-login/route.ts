import { NextResponse } from 'next/server'
import { findStaffByCredentials } from '@/lib/staff'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const username = String(body?.username ?? '').trim()
  const password = String(body?.password ?? '').trim()

  const staff = findStaffByCredentials(username, password)
  if (!staff) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('staff_auth', staff.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return res
}
