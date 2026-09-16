import { NextResponse } from 'next/server'
import { bookedSlots, createBooking } from '@/lib/booking'
import { apiError, readBody } from '@/lib/auth-http'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  try { return NextResponse.json({ booked: await bookedSlots(new URL(req.url).searchParams.get('date'), null) }) }
  catch (error) { return apiError(error) }
}
export async function POST(req: Request) {
  try {
    const appointment = await createBooking(await readBody(req), 'public', req)
    return NextResponse.json({ ok: true, id: appointment.id })
  } catch (error) { return apiError(error) }
}
