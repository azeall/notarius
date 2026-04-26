import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  const correct = (process.env.ADMIN_PASSWORD ?? 'notary2024').trim()
  if (password.trim() === correct) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_auth', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return res
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
