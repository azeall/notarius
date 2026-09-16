import 'server-only'
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { STAFF_LIST, findStaffById } from './staff'

export const SESSION_SECONDS = 8 * 60 * 60
type Role = 'admin' | 'staff'
type Session = { v: 1; role: Role; sub: string; iat: number; exp: number }

export function strongPassword(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 12 && value.length <= 256 && value.trim().length >= 12
}
export function secretConfigured(): boolean {
  const secret = process.env.SESSION_SECRET ?? ''
  return /^[a-fA-F0-9]{64}$/.test(secret) && new Set(secret.toLowerCase()).size >= 12
}
export function accountPassword(role: Role, id: string): string | null {
  const value = role === 'admin' && id === 'admin' ? process.env.ADMIN_PASSWORD
    : role === 'staff' && findStaffById(id) ? process.env[`STAFF_${id.slice(6)}_PASS`] : undefined
  return strongPassword(value) ? value : null
}
export function passwordMatches(input: string, expected: string): boolean {
  return timingSafeEqual(createHash('sha256').update(input).digest(), createHash('sha256').update(expected).digest())
}
export function staffForUsername(username: string) {
  return STAFF_LIST.find(s => (process.env[`STAFF_${s.id.slice(6)}_USER`] ?? s.username) === username) ?? null
}
function signature(payload: string, role: Role, id: string): string | null {
  const password = accountPassword(role, id)
  if (!secretConfigured() || !password) return null
  // Current credentials bind the key: rotation invalidates existing sessions.
  const key = createHmac('sha256', Buffer.from(process.env.SESSION_SECRET!, 'hex'))
    .update(JSON.stringify([role, id, password, role === 'staff' ? process.env[`STAFF_${id.slice(6)}_USER`] ?? findStaffById(id)?.username : 'admin']))
    .digest()
  return createHmac('sha256', key).update(payload).digest('base64url')
}
export function issueSession(role: Role, sub: string): string | null {
  const iat = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(JSON.stringify({ v: 1, role, sub, iat, exp: iat + SESSION_SECONDS })).toString('base64url')
  const mac = signature(payload, role, sub)
  return mac ? `${payload}.${mac}` : null
}
export function verifySession(token: string | undefined, role: Role): Session | null {
  if (!token || token.length > 1024) return null
  try {
    const [payload, mac, extra] = token.split('.')
    if (extra !== undefined || !/^[A-Za-z0-9_-]+$/.test(payload) || !/^[A-Za-z0-9_-]{43}$/.test(mac)) return null
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Session
    const now = Math.floor(Date.now() / 1000)
    if (session.v !== 1 || session.role !== role || typeof session.sub !== 'string' ||
      !Number.isInteger(session.iat) || !Number.isInteger(session.exp) || session.iat > now ||
      session.exp <= now || session.exp - session.iat !== SESSION_SECONDS) return null
    const expected = signature(payload, role, session.sub)
    if (!expected || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null
    return session
  } catch { return null }
}
export async function adminAuthenticated(): Promise<boolean> {
  return verifySession((await cookies()).get('admin_auth')?.value, 'admin') !== null
}
export async function authenticatedStaff() {
  const session = verifySession((await cookies()).get('staff_auth')?.value, 'staff')
  return session ? findStaffById(session.sub) : null
}
export const sessionCookieOptions = {
  httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/',
  maxAge: SESSION_SECONDS, sameSite: 'lax' as const,
}
