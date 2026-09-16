import { NextResponse } from 'next/server'
import { authenticatedStaff } from '@/lib/auth'
import { apiError, readBody, unauthorized } from '@/lib/auth-http'
import { bookedSlots, createBooking } from '@/lib/booking'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  const staff = await authenticatedStaff()
  if (!staff) return unauthorized()
  try { return NextResponse.json({ booked: await bookedSlots(new URL(req.url).searchParams.get('date'), staff.id) }) }
  catch (error) { return apiError(error) }
}
export async function POST(req: Request) {
  const staff = await authenticatedStaff()
  if (!staff) return unauthorized()
  try {
    const appointment = await createBooking(await readBody(req), 'staff', req, staff.id)
    return NextResponse.json({ ok: true, id: appointment.id })
  } catch (error) { return apiError(error) }
}
