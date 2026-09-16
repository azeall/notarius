import { SERVICES } from './services'
import { MAX_DURATION, SLOT_MINUTES, expandSlots } from './slots'
import { findStaffById } from './staff'

export const CONSENT_VERSION = '2026-09-16'
export class BookingError extends Error {
  constructor(public status: number, message: string, public code?: string) { super(message) }
}
export function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BookingError(400, 'Некорректный запрос')
  return value as Record<string, unknown>
}
function text(value: unknown, max: number): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new BookingError(400, 'Некорректное значение поля')
  }
  return value.trim()
}
export function normalizePhone(value: unknown): string {
  const phone = text(value, 32)
  if (!/^\+?[\d ()-]+$/.test(phone)) throw new BookingError(400, 'Укажите российский номер телефона')
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 10) digits = `7${digits}`
  if (digits.length === 11 && digits[0] === '8') digits = `7${digits.slice(1)}`
  if (!/^7[3489]\d{9}$/.test(digits)) throw new BookingError(400, 'Укажите российский номер телефона')
  return `+${digits}`
}
export function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}
export function moscowNow(now = new Date()) {
  const local = new Date(now.getTime() + 3 * 60 * 60 * 1000)
  return { date: local.toISOString().slice(0, 10), minutes: local.getUTCHours() * 60 + local.getUTCMinutes() }
}
export function validateSchedule(date: unknown, time: unknown, duration: unknown, now = new Date()) {
  if (!validDate(date) || typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time) ||
    typeof duration !== 'number' || !Number.isInteger(duration) || duration > MAX_DURATION ||
    expandSlots(time, duration).length === 0) throw new BookingError(400, 'Некорректная дата, время или длительность')
  const day = new Date(`${date}T00:00:00Z`).getUTCDay()
  if (day === 0 || day === 6 || new Date(`${date}T${time}:00+03:00`).getTime() <= now.getTime()) {
    throw new BookingError(400, 'Выберите будущее время приёма с понедельника по пятницу (Москва)')
  }
  return { date, time, duration }
}
export function validateAssignee(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || !findStaffById(value)) throw new BookingError(400, 'Неизвестный сотрудник')
  return value
}
export function validateBooking(value: unknown, publicBooking: boolean) {
  const body = objectBody(value)
  const name = text(body.name, 120)
  const phone = normalizePhone(body.phone)
  const service = text(body.service, 120)
  if (!(SERVICES as readonly string[]).includes(service)) throw new BookingError(400, 'Неизвестная услуга')
  if (publicBooking && (body.consent !== true || body.consentVersion !== CONSENT_VERSION)) {
    throw new BookingError(400, 'Подтвердите согласие с актуальными условиями обработки данных', 'CONSENT_REQUIRED')
  }
  return { name, phone, service, ...validateSchedule(body.date, body.time, body.duration === undefined ? SLOT_MINUTES : body.duration) }
}
