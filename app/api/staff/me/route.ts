import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findStaffById } from '@/lib/staff'

export const dynamic = 'force-dynamic'

export async function GET() {
  const staffId = cookies().get('staff_auth')?.value
  if (!staffId) return NextResponse.json(null, { status: 401 })

  const staff = findStaffById(staffId)
  if (!staff) return NextResponse.json(null, { status: 401 })

  return NextResponse.json({ id: staff.id, name: staff.name })
}
