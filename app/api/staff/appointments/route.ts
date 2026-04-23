import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { findStaffById } from '@/lib/staff'
import { MAX_DURATION, SLOT_MINUTES, buildBookedSet, expandSlots, isRangeFree } from '@/lib/slots'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const staffId = cookies().get('staff_auth')?.value
  if (!staffId || !findStaffById(staffId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { name, phone, service, date, time } = body ?? {}
  const rawDuration = Number(body?.duration ?? SLOT_MINUTES)

  if (!name || !phone || !service || !date || !time) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }

  if (
    !Number.isFinite(rawDuration) ||
    rawDuration <= 0 ||
    rawDuration % SLOT_MINUTES !== 0 ||
    rawDuration > MAX_DURATION
  ) {
    return NextResponse.json({ error: 'Некорректная длительность' }, { status: 400 })
  }

  const slotsNeeded = expandSlots(time, rawDuration)
  if (slotsNeeded.length === 0) {
    return NextResponse.json(
      { error: 'Время выходит за рабочие часы (10:00–13:00 и 14:00–19:00)' },
      { status: 400 },
    )
  }

  // Check conflicts only within this staff member's calendar
  const dayRows = await prisma.appointment.findMany({
    where: { date, status: 'active', staffId },
    select: { id: true, time: true, duration: true },
  })
  const check = isRangeFree(time, rawDuration, buildBookedSet(dayRows))
  if (!check.ok) {
    return NextResponse.json({ error: check.reason }, { status: 409 })
  }

  const appointment = await prisma.appointment.create({
    data: { name, phone, service, date, time, duration: rawDuration, ip: 'staff', staffId },
  })

  return NextResponse.json({ ok: true, id: appointment.id })
}
