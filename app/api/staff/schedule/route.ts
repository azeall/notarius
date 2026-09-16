import { NextResponse } from 'next/server'
import { authenticatedStaff } from '@/lib/auth'
import { apiError, unauthorized } from '@/lib/auth-http'
import { BookingError, moscowNow, validDate } from '@/lib/booking-validation'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  const staff = await authenticatedStaff()
  if (!staff) return unauthorized()
  try {
    const date = new URL(req.url).searchParams.get('date')
    if (date !== null && !validDate(date)) throw new BookingError(400, 'Некорректная дата')
    const today = moscowNow().date
    const appointments = await prisma.appointment.findMany({
      where: date ? { date, staffId: staff.id } : { status: 'active', staffId: staff.id, date: { gte: today } },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    })
    return NextResponse.json({ appointments, today })
  } catch (error) { return apiError(error) }
}
