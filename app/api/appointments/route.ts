import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const appts = await prisma.appointment.findMany({
    where: { date, status: 'active' },
    select: { time: true },
  })
  return NextResponse.json({ bookedTimes: appts.map(a => a.time) })
}

export async function POST(req: NextRequest) {
  const { name, phone, service, date, time } = await req.json()

  if (!name || !phone || !service || !date || !time)
    return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 })

  const conflict = await prisma.appointment.findFirst({
    where: { date, time, status: 'active' },
  })
  if (conflict)
    return NextResponse.json({ error: 'Это время уже занято' }, { status: 409 })

  const appt = await prisma.appointment.create({
    data: { name, phone, service, date, time },
  })
  return NextResponse.json({ success: true, id: appt.id })
}
