import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function getIP(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ booked: [] })
  const rows = await prisma.appointment.findMany({
    where: { date, status: 'active' },
    select: { time: true },
  })
  return NextResponse.json({ booked: rows.map(r => r.time) })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, phone, service, date, time } = body

  if (!name || !phone || !service || !date || !time) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
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
      { status: 429 }
    )
  }

  // 2. Лимит по телефону: 1 активная запись на номер
  const phoneNorm = phone.replace(/\D/g, '')
  const existingPhone = await prisma.appointment.findFirst({
    where: { phone: { contains: phoneNorm.slice(-7) }, status: 'active' },
  })
  if (existingPhone) {
    return NextResponse.json(
      { error: 'На этот номер уже есть активная запись.' },
      { status: 409 }
    )
  }

  // 3. Слот уже занят?
  const existing = await prisma.appointment.findFirst({
    where: { date, time, status: 'active' },
  })
  if (existing) {
    return NextResponse.json({ error: 'Это время уже занято' }, { status: 409 })
  }

  const appointment = await prisma.appointment.create({
    data: { name, phone, service, date, time, ip },
  })

  return NextResponse.json({ ok: true, id: appointment.id })
}
