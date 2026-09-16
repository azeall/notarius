import 'server-only'
import { Prisma } from '@prisma/client'
import { isIP } from 'node:net'
import { prisma } from './prisma'
import { buildBookedSet, expandSlots, isRangeFree, toMinutes } from './slots'
import { BookingError, CONSENT_VERSION, moscowNow, normalizePhone, objectBody, validateAssignee, validateBooking, validateSchedule, validDate } from './booking-validation'

// One office-wide lock covers creation, limits, status and reassignment.
// ReadCommitted sees the preceding writer after waiting for this lock.
export function bookingTransaction<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(723641, 1)`
    return work(tx)
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, maxWait: 10000, timeout: 15000 })
}
export function bookingIP(req: Request): string {
  // Enable only behind a proxy that overwrites this header with a verified IP.
  if (process.env.TRUST_PROXY_IP !== 'true') return 'unknown'
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? ''
  return isIP(ip) ? ip : 'unknown'
}
async function checkConflict(tx: Prisma.TransactionClient, data: { date: string; time: string; duration: number; staffId: string | null }, id?: string) {
  const rows = await tx.appointment.findMany({
    where: { date: data.date, status: 'active', staffId: data.staffId },
    select: { id: true, time: true, duration: true },
  })
  const result = isRangeFree(data.time, data.duration, buildBookedSet(rows, id))
  if (!result.ok) throw new BookingError(409, result.reason)
}
export async function createBooking(value: unknown, actor: 'public' | 'admin' | 'staff', req: Request, staffId?: string) {
  if (actor === 'public' && process.env.BOOKING_ENABLED !== 'true') {
    throw new BookingError(503, 'Онлайн-запись на этом сайте пока не включена. Свяжитесь с нотариальной конторой напрямую.', 'BOOKING_DISABLED')
  }
  const body = objectBody(value)
  const data = { ...validateBooking(body, actor === 'public'), staffId: actor === 'public' ? null : validateAssignee(actor === 'staff' ? staffId : body.staffId) }
  const ip = actor === 'public' ? bookingIP(req) : actor
  return bookingTransaction(async tx => {
    validateSchedule(data.date, data.time, data.duration)
    if (actor === 'public') {
      const now = moscowNow()
      const recent = await tx.appointment.count({ where: { ip, createdAt: { gte: new Date(Date.now() - 86400000) } } })
      if (recent >= 2) throw new BookingError(429, 'Превышен лимит записей. Позвоните в нотариальную контору.')
      const future = await tx.appointment.findMany({ where: { status: 'active', date: { gte: now.date } }, select: { phone: true, date: true, time: true, duration: true } })
      const samePhone = future.filter(row => {
        let phone: string
        try { phone = normalizePhone(row.phone) } catch { return false }
        return phone === data.phone && (row.date > now.date || toMinutes(row.time) + row.duration > now.minutes)
      })
      if (samePhone.length >= 2) throw new BookingError(409, 'На этот номер уже есть 2 активные записи.')
    }
    await checkConflict(tx, data)
    return tx.appointment.create({ data: { ...data, ip,
      ...(actor === 'public' ? { consentVersion: CONSENT_VERSION, consentAt: new Date() } : {}),
    } })
  })
}
export async function updateBooking(id: string, value: unknown) {
  const body = objectBody(value)
  const allowed = ['status', 'date', 'time', 'duration', 'staffId']
  if (!Object.keys(body).length || Object.keys(body).some(key => !allowed.includes(key))) throw new BookingError(400, 'Некорректные поля изменения')
  return bookingTransaction(async tx => {
    const current = await tx.appointment.findUnique({ where: { id } })
    if (!current) throw new BookingError(404, 'Запись не найдена')
    const status = 'status' in body ? body.status : current.status
    if (typeof status !== 'string' || !['active', 'completed', 'no_show', 'cancelled'].includes(status)) throw new BookingError(400, 'Недопустимый статус')
    const schedule = { date: 'date' in body ? body.date : current.date, time: 'time' in body ? body.time : current.time, duration: 'duration' in body ? body.duration : current.duration }
    const changedSchedule = ['date', 'time', 'duration', 'staffId'].some(key => key in body)
    const data = {
      ...(changedSchedule || (status === 'active' && current.status !== 'active') ? validateSchedule(schedule.date, schedule.time, schedule.duration) : { date: current.date, time: current.time, duration: current.duration }),
      staffId: 'staffId' in body ? validateAssignee(body.staffId) : current.staffId, status,
    }
    if (status === 'active') await checkConflict(tx, data, id)
    return tx.appointment.update({ where: { id }, data })
  })
}
export async function deleteBooking(id: string) {
  return bookingTransaction(async tx => {
    if (!await tx.appointment.findUnique({ where: { id } })) throw new BookingError(404, 'Запись не найдена')
    return tx.appointment.delete({ where: { id } })
  })
}
export async function bookedSlots(date: string | null, staffId: string | null) {
  if (!validDate(date)) throw new BookingError(400, 'Некорректная дата')
  const rows = await prisma.appointment.findMany({ where: { date, status: 'active', staffId }, select: { time: true, duration: true } })
  return Array.from(new Set(rows.flatMap(row => expandSlots(row.time, row.duration)))).sort()
}
