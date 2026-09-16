import { NextResponse } from 'next/server'
import { adminAuthenticated } from '@/lib/auth'
import { apiError, readBody, unauthorized } from '@/lib/auth-http'
import { bookedSlots, createBooking } from '@/lib/booking'
import { validateAssignee } from '@/lib/booking-validation'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  if (!await adminAuthenticated()) return unauthorized()
  try {
    const query = new URL(req.url).searchParams
    return NextResponse.json({ booked: await bookedSlots(query.get('date'), validateAssignee(query.get('staffId'))) })
  } catch (error) { return apiError(error) }
}
export async function POST(req: Request) {
  if (!await adminAuthenticated()) return unauthorized()
  try {
    const appointment = await createBooking(await readBody(req), 'admin', req)
    return NextResponse.json({ ok: true, id: appointment.id })
  } catch (error) { return apiError(error) }
}
