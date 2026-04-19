import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // Проверяем admin-куку
  const cookieStore = cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, phone, service, date, time } = body

  if (!name || !phone || !service || !date || !time) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }

  // Только проверяем что слот не занят — без лимитов
  const existing = await prisma.appointment.findFirst({
    where: { date, time, status: 'active' },
  })
  if (existing) {
    return NextResponse.json({ error: 'Это время уже занято' }, { status: 409 })
  }

  const appointment = await prisma.appointment.create({
    data: { name, phone, service, date, time, ip: 'admin' },
  })

  return NextResponse.json({ ok: true, id: appointment.id })
}
