import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findStaffById } from '@/lib/staff'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const staffId = cookies().get('staff_auth')?.value
  if (!staffId || !findStaffById(staffId)) {
    return NextResponse.json(null, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const today = new Date().toISOString().split('T')[0]

  let appointments
  if (date) {
    appointments = await prisma.appointment.findMany({
      where: { date, staffId },
      orderBy: [{ time: 'asc' }],
    })
  } else {
    appointments = await prisma.appointment.findMany({
      where: { status: 'active', staffId, date: { gte: today } },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    })
  }

  return NextResponse.json({ appointments, today })
}
