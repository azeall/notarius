import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { MAX_DURATION, SLOT_MINUTES, buildBookedSet, expandSlots, isRangeFree } from '@/lib/slots'

export const dynamic = 'force-dynamic'

function requireAdmin() {
  return cookies().get('admin_auth')?.value === '1'
}

type Params = { params: { id: string } }

export async function DELETE(_req: Request, { params }: Params) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.appointment.delete({ where: { id: params.id } })
  } catch {
    return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: Params) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const current = await prisma.appointment.findUnique({ where: { id: params.id } })
  if (!current) {
    return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 })
  }

  // staffId reassign: explicitly passed (null = notary, string = staff_id)
  const hasStaffId = 'staffId' in body
  const newStaffId = hasStaffId
    ? (body.staffId === null || body.staffId === '' ? null : String(body.staffId))
    : current.staffId

  // If only reassigning (no date/time change needed), handle early
  if (hasStaffId && !body.date && !body.time && body.duration == null) {
    const updated = await prisma.appointment.update({
      where: { id: current.id },
      data: { staffId: newStaffId },
    })
    return NextResponse.json({ ok: true, appointment: updated })
  }

  const newDate: string = typeof body.date === 'string' && body.date ? body.date : current.date
  const newTime: string = typeof body.time === 'string' && body.time ? body.time : current.time
  const rawDuration = body.duration == null ? current.duration : Number(body.duration)

  if (!Number.isFinite(rawDuration) || rawDuration <= 0 || rawDuration % SLOT_MINUTES !== 0 || rawDuration > MAX_DURATION) {
    return NextResponse.json({ error: 'Некорректная длительность' }, { status: 400 })
  }
  const newDuration = rawDuration

  const slotsNeeded = expandSlots(newTime, newDuration)
  if (slotsNeeded.length === 0) {
    return NextResponse.json(
      { error: 'Время выходит за рабочие часы (10:00–13:00 и 14:00–19:00)' },
      { status: 400 },
    )
  }

  // Занятость: берём все записи на целевой день, ИСКЛЮЧАЯ текущую
  const dayRows = await prisma.appointment.findMany({
    where: { date: newDate, status: 'active' },
    select: { id: true, time: true, duration: true },
  })
  const booked = buildBookedSet(dayRows, current.id)
  const check = isRangeFree(newTime, newDuration, booked)
  if (!check.ok) {
    return NextResponse.json({ error: check.reason }, { status: 409 })
  }

  const updated = await prisma.appointment.update({
    where: { id: current.id },
    data: { date: newDate, time: newTime, duration: newDuration, staffId: newStaffId },
  })

  return NextResponse.json({ ok: true, appointment: updated })
}
