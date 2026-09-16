import 'server-only'
import { NextResponse } from 'next/server'
import { BookingError, objectBody } from './booking-validation'

export const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
export function checkOrigin(req: Request) {
  const origin = req.headers.get('origin')
  if (req.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== new URL(req.url).origin)) {
    throw new BookingError(403, 'Недопустимый источник запроса')
  }
}
export async function readBody(req: Request) {
  checkOrigin(req)
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new BookingError(415, 'Требуется JSON')
  const reader = req.body?.getReader()
  if (!reader) throw new BookingError(400, 'Пустой запрос')
  let size = 0
  const chunks: Uint8Array[] = []
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 8192) { await reader.cancel(); throw new BookingError(413, 'Слишком большой запрос') }
      chunks.push(value)
    }
    return objectBody(JSON.parse(Buffer.concat(chunks).toString('utf8')))
  } catch (error) {
    if (error instanceof BookingError) throw error
    throw new BookingError(400, 'Некорректный JSON')
  } finally { reader.releaseLock() }
}
export function apiError(error: unknown) {
  if (error instanceof BookingError) return NextResponse.json({ error: error.message, ...(error.code ? { code: error.code } : {}) }, { status: error.status })
  return NextResponse.json({ error: 'Сервис временно недоступен' }, { status: 503 })
}
