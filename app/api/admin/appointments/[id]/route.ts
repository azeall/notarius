import { NextResponse } from 'next/server'
import { adminAuthenticated } from '@/lib/auth'
import { apiError, checkOrigin, readBody, unauthorized } from '@/lib/auth-http'
import { deleteBooking, updateBooking } from '@/lib/booking'
import { BookingError } from '@/lib/booking-validation'
export const dynamic = 'force-dynamic'
type Params = { params: Promise<{ id: string }> }
function validId(id: string) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) throw new BookingError(400, 'Некорректный идентификатор')
  return id
}
export async function DELETE(req: Request, { params }: Params) {
  if (!await adminAuthenticated()) return unauthorized()
  try {
    checkOrigin(req)
    await deleteBooking(validId((await params).id))
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
export async function PATCH(req: Request, { params }: Params) {
  if (!await adminAuthenticated()) return unauthorized()
  try {
    const appointment = await updateBooking(validId((await params).id), await readBody(req))
    return NextResponse.json({ ok: true, appointment })
  } catch (error) { return apiError(error) }
}
