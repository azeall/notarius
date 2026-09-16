import { NextResponse } from 'next/server'
import { authenticatedStaff } from '@/lib/auth'
import { unauthorized } from '@/lib/auth-http'
export const dynamic = 'force-dynamic'
export async function GET() {
  const staff = await authenticatedStaff()
  if (!staff) return unauthorized()
  return NextResponse.json({ id: staff.id, name: staff.name })
}
