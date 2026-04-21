import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { MAX_DURATION, SLOT_MINUTES, buildBookedSet, expandSlots, isRangeFree } from '@/lib/slots'

export const dynamic = 'force-dynamic'

function requireAdmin() {
  const auth = cookies().get('admin_auth')
  return auth?.value === '1'
}

export async function POST(req: Request) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { name, phone, service, date, time } = body ?? {}
  const rawDuration = Number(body?.duration ?? SLOT_MINUTES)

  if (!name || !phone || !service || !date || !time) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }

  if (!Number.isFinite(rawDuration) || rawDuration <= 0 || rawDuration % SLOT_MINUTES !== 0 || rawDuration > MAX_DURATION) {
    return NextResponse.json({ error: 'Некорректная длительность' }, { status: 400 })
  }
  const duration = rawDuration

  const slotsNeeded = expandSlots(time, duration)
  if (slotsNeeded.length === 0) {
    return NextResponse.json(
      { error: 'Время выходит за рабочие часы (10:00–13:00 и 14:00–19:00)' },
      { status: 400 },
    )
  }

  const dayRows = await prisma.appointment.findMany({
    where: { date, status: 'active' },
    select: { id: true, time: true, duration: true },
  })
  const check = isRangeFree(time, duration, buildBookedSet(dayRows))
  if (!check.ok) {
    return NextResponse.json({ error: check.reason }, { status: 409 })
  }

  const appointment = await prisma.appointment.create({
    data: { name, phone, service, date, time, duration, ip: 'admin' },
  })

  return NextResponse.json({ ok: true, id: appointment.id })
}
