import { NextResponse } from ''next/server''

export async function POST(req: Request) {
  const { password } = await req.json()
  const correct = process.env.ADMIN_PASSWORD ?? ''notary2024''
  if (password === correct) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set(''admin_auth'', ''1'', {
      httpOnly: true,
      path: ''/'',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: ''lax'',
    })
    return res
  }
  return NextResponse.json({ error: ''Unauthorized'' }, { status: 401 })
}