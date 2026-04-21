import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  MAX_DURATION,
  SLOT_MINUTES,
  buildBookedSet,
  expandSlots,
  isRangeFree,
  toMinutes,
} from '@/lib/slots'

export const dynamic = 'force-dynamic'

function getIP(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function todayYMD(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** GET /api/appointments?date=YYYY-MM-DD → { booked: string[] } — ВСЕ занятые 30-мин. слоты. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ booked: [] })

  const rows = await prisma.appointment.findMany({
    where: { date, status: 'active' },
    select: { time: true, duration: true },
  })

  const booked = new Set<string>()
  for (const r of rows) {
    for (const s of expandSlots(r.time, r.duration)) booked.add(s)
  }

  return NextResponse.json({ booked: Array.from(booked).sort() })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { name, phone, service, date, time } = body ?? {}
  const rawDuration = Number(body?.duration ?? SLOT_MINUTES)

  if (!name || !phone || !service || !date || !time) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }

  // Валидация duration
  if (!Number.isFinite(rawDuration) || rawDuration <= 0 || rawDuration % SLOT_MINUTES !== 0 || rawDuration > MAX_DURATION) {
    return NextResponse.json({ error: 'Некорректная длительность записи' }, { status: 400 })
  }
  const duration = rawDuration

  // Слоты записи должны помещаться в рабочий блок
  const slotsNeeded = expandSlots(time, duration)
  if (slotsNeeded.length === 0) {
    return NextResponse.json(
      { error: 'Выбранное время выходит за рабочие часы (10:00–13:00 и 14:00–19:00)' },
      { status: 400 },
    )
  }

  const ip = getIP(req)

  // 1. Лимит по IP: не более 2 записей за последние 24 часа
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const ipCount = await prisma.appointment.count({
    where: { ip, status: 'active', createdAt: { gte: since } },
  })
  if (ipCount >= 2) {
    return NextResponse.json(
      { error: 'Превышен лимит записей. Попробуйте завтра или позвоните нам.' },
      { status: 429 },
    )
  }

  // 2. Лимит по телефону: не более 2 БУДУЩИХ активных записей.
  //    Прошедшие записи НЕ считаются — можно записываться снова.
  //    В БД телефон хранится с форматированием, поэтому сравниваем нормализованные
  //    последние 10 цифр (работает для +7/8/без кода страны).
  const phoneDigits = phone.replace(/\D/g, '')
  const phoneTail = phoneDigits.slice(-10)
  const today = todayYMD()
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()

  if (phoneTail.length >= 10) {
    const futureRows = await prisma.appointment.findMany({
      where: { status: 'active', date: { gte: today } },
      select: { phone: true, date: true, time: true, duration: true },
    })
    const stillFuture = futureRows.filter(r => {
      const rTail = r.phone.replace(/\D/g, '').slice(-10)
      if (rTail !== phoneTail) return false
      if (r.date > today) return true
      // r.date === today — считаем только если запись ещё не закончилась
      return toMinutes(r.time) + r.duration > nowMin
    })
    if (stillFuture.length >= 2) {
      return NextResponse.json(
        { error: 'На этот номер уже есть 2 активные записи. Дождитесь их завершения.' },
        { status: 409 },
      )
    }
  }

  // 3. Слоты в выбранном дне
  const dayRows = await prisma.appointment.findMany({
    where: { date, status: 'active' },
    select: { id: true, time: true, duration: true },
  })
  const booked = buildBookedSet(dayRows)

  const check = isRangeFree(time, duration, booked)
  if (!check.ok) {
    return NextResponse.json({ error: check.reason }, { status: 409 })
  }

  const appointment = await prisma.appointment.create({
    data: { name, phone, service, date, time, duration, ip },
  })

  return NextResponse.json({ ok: true, id: appointment.id })
}
