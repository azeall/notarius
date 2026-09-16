/** @jest-environment node */
jest.mock('server-only', () => ({}), { virtual: true })
import { rows, limits } from '../../tests/security/booking-db'
jest.mock('@/lib/prisma', () => ({ prisma: require('../../tests/security/booking-db').db }))
const mockCookies = new Map<string, string>()
const mockHeaders = new Headers()
jest.mock('next/headers', () => ({
  cookies: () => ({ get: (name: string) => mockCookies.has(name) ? { value: mockCookies.get(name) } : undefined }),
  headers: () => mockHeaders,
}))
import { POST as publicPost, GET as publicGet } from '@/app/api/appointments/route'
import { POST as adminPost } from '@/app/api/admin/appointments/route'
import { POST as staffPost, GET as staffGet } from '@/app/api/staff/appointments/route'
import { GET as staffMe } from '@/app/api/staff/me/route'
import { GET as schedule } from '@/app/api/staff/schedule/route'
import { PATCH, DELETE } from '@/app/api/admin/appointments/[id]/route'
const valid = { name: 'Иван Иванов', phone: '+7 (999) 123-45-67', service: 'Доверенности', date: '2026-09-17', time: '10:00', consent: true, consentVersion: '2026-09-16' }
function request(body: unknown, url = 'http://localhost/api/appointments') {
  return new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}
beforeEach(() => {
  rows.length = 0; limits.clear(); mockCookies.clear(); mockHeaders.delete('x-staff-id')
  process.env.BOOKING_ENABLED = 'true'
  process.env.SESSION_SECRET = 'b70e8c425db131932f641ac102a854dcb14fc3003719f4bfcc4898ea607a1f55'
  process.env.ADMIN_PASSWORD = 'Admin-strong-password-123'
  process.env.STAFF_1_PASS = 'Staff-strong-password-123'
  jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] }).setSystemTime(new Date('2026-09-16T06:00:00Z'))
})
afterEach(() => jest.useRealTimers())
test('literal admin cookie does not authorize any mutation', async () => {
  mockCookies.set('admin_auth', '1')
  expect((await adminPost(request(valid))).status).toBe(401)
  expect((await PATCH(request({ status: 'active' }), { params: Promise.resolve({ id: 'x' }) } as any)).status).toBe(401)
  expect((await DELETE(request({}), { params: Promise.resolve({ id: 'x' }) } as any)).status).toBe(401)
})
test('literal staff cookie and forged identity header cannot read or create', async () => {
  mockCookies.set('staff_auth', 'staff_1'); mockHeaders.set('x-staff-id', 'staff_1')
  expect((await staffPost(request(valid))).status).toBe(401)
  expect((await staffGet(new Request('http://localhost?date=2026-09-17'))).status).toBe(401)
  expect((await staffMe()).status).toBe(401)
  expect((await schedule(new Request('http://localhost'))).status).toBe(401)
})
test.each([
  { name: 123 }, { name: 'x'.repeat(121) }, { phone: '123' }, { phone: {} },
  { date: '2026-02-30' }, { date: '2026-09-19' }, { date: '2026-09-15' },
  { service: 'unknown' }, { consent: 'true' }, { consent: false }, { consent: undefined },
  { duration: '30' }, { time: '13:00' }, { time: '18:30', duration: 60 },
])('public booking rejects invalid input %j', async change => {
  expect((await publicPost(request({ ...valid, ...change }))).status).toBe(400)
  expect(rows).toHaveLength(0)
})
test('simultaneous bookings for the same calendar cannot overlap', async () => {
  const responses = await Promise.all([publicPost(request(valid)), publicPost(request({ ...valid, phone: '89991234568' }))])
  expect(responses.map(r => r.status).sort()).toEqual([200, 409])
  expect(rows).toHaveLength(1)
})
test('public slots exclude staff calendars', async () => {
  rows.push({ date: valid.date, time: '10:00', duration: 30, status: 'active', staffId: 'staff_1' })
  expect(await (await publicGet(new Request(`http://localhost?date=${valid.date}`))).json()).toEqual({ booked: [] })
})
test('public writes require explicit deployment enablement', async () => {
  delete process.env.BOOKING_ENABLED
  expect((await publicPost(request(valid))).status).toBe(503)
  expect(rows).toHaveLength(0)
})


import { issueSession, verifySession } from '@/lib/auth'
import { POST as adminLogin } from '@/app/api/admin-login/route'
import { POST as staffLogin } from '@/app/api/staff-login/route'
import { GET as adminGet } from '@/app/api/admin/appointments/route'
import { POST as adminLogout } from '@/app/api/admin-logout/route'
import { POST as staffLogout } from '@/app/api/staff-logout/route'
import { db } from '../../tests/security/booking-db'
import AdminPage from '@/app/admin/page'
import StaffPage from '@/app/staff/page'
jest.mock('next/navigation', () => ({
  redirect: (path: string) => { throw new Error(`REDIRECT:${path}`) },
  useRouter: () => ({}), usePathname: () => '/', useSearchParams: () => new URLSearchParams(),
}))

test('all private reads reject legacy credentials before database access', async () => {
  const read = jest.spyOn(db.appointment, 'findMany')
  mockCookies.set('admin_auth', '1'); mockCookies.set('staff_auth', 'staff_1')
  mockHeaders.set('x-staff-id', 'staff_1')
  try {
    expect((await adminGet(new Request('http://localhost?date=2026-09-17'))).status).toBe(401)
    expect((await staffGet(new Request('http://localhost?date=2026-09-17'))).status).toBe(401)
    expect((await staffMe()).status).toBe(401)
    expect((await schedule(new Request('http://localhost'))).status).toBe(401)
    await expect(AdminPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('REDIRECT:/admin/login')
    await expect(StaffPage({ searchParams: Promise.resolve({ _sid: 'staff_1' } as any) })).rejects.toThrow('REDIRECT:/staff/login')
    expect(read).not.toHaveBeenCalled()
  } finally { read.mockRestore() }
})
test('signed sessions authorize only their own role and expire', async () => {
  const token = issueSession('admin', 'admin')!
  mockCookies.set('admin_auth', token)
  expect((await adminPost(request(valid))).status).toBe(200)
  expect(verifySession(token, 'staff')).toBeNull()
  expect(verifySession(token.slice(0, -1) + '!', 'admin')).toBeNull()
  jest.setSystemTime(new Date('2026-09-16T14:00:00Z'))
  expect(verifySession(token, 'admin')).toBeNull()
})
test('credential and secret rotation revoke sessions; no missing or weak fallbacks', () => {
  const adminToken = issueSession('admin', 'admin')!
  const staffToken = issueSession('staff', 'staff_1')!
  expect(verifySession(staffToken, 'staff')?.sub).toBe('staff_1')
  process.env.STAFF_1_PASS = 'Changed-staff-password-456'
  expect(verifySession(staffToken, 'staff')).toBeNull()
  process.env.ADMIN_PASSWORD = 'Changed-admin-password-456'
  expect(verifySession(adminToken, 'admin')).toBeNull()
  delete process.env.ADMIN_PASSWORD
  expect(issueSession('admin', 'admin')).toBeNull()
  process.env.ADMIN_PASSWORD = 'notary2024'
  expect(issueSession('admin', 'admin')).toBeNull()
  process.env.SESSION_SECRET = 'a'.repeat(64)
  expect(issueSession('staff', 'staff_1')).toBeNull()
  delete process.env.SESSION_SECRET
  expect(issueSession('staff', 'staff_1')).toBeNull()
})
test('login without secret fails closed and missing staff password never enables pass1', async () => {
  delete process.env.SESSION_SECRET
  expect((await adminLogin(request({ password: process.env.ADMIN_PASSWORD }))).status).toBe(503)
  process.env.SESSION_SECRET = 'b70e8c425db131932f641ac102a854dcb14fc3003719f4bfcc4898ea607a1f55'
  delete process.env.STAFF_1_PASS
  expect((await staffLogin(request({ username: 'helper1', password: 'pass1' }))).status).toBe(401)
})
test('parallel login attempts have a shared five-attempt limit and reset', async () => {
  const responses = await Promise.all(Array.from({ length: 8 }, () => adminLogin(request({ password: 'wrong' }))))
  expect(responses.map(r => r.status).sort()).toEqual([401, 401, 401, 401, 401, 429, 429, 429])
  expect((await adminLogin(request({ password: process.env.ADMIN_PASSWORD }))).status).toBe(429)
  jest.setSystemTime(new Date('2026-09-16T06:16:00Z'))
  const response = await adminLogin(request({ password: process.env.ADMIN_PASSWORD }))
  expect(response.status).toBe(200)
  const token = response.cookies.get('admin_auth')?.value
  expect(verifySession(token, 'admin')?.sub).toBe('admin')
  expect(response.headers.get('set-cookie')).toMatch(/HttpOnly/i)
})
test('signed staff identity ignores forged headers and reassignment fields', async () => {
  mockCookies.set('staff_auth', issueSession('staff', 'staff_1')!)
  mockHeaders.set('x-staff-id', 'staff_2')
  expect((await staffPost(request({ ...valid, staffId: 'staff_2' }))).status).toBe(200)
  expect(rows[0].staffId).toBe('staff_1')
  expect(await (await staffMe()).json()).toEqual({ id: 'staff_1', name: 'Помощник 1' })
})
test('separate calendars can book concurrently; reassignment and reactivation check target conflicts', async () => {
  mockCookies.set('admin_auth', issueSession('admin', 'admin')!)
  const results = await Promise.all([
    adminPost(request(valid)), adminPost(request({ ...valid, staffId: 'staff_1' })),
  ])
  expect(results.map(r => r.status)).toEqual([200, 200])
  const row = rows.find(r => r.staffId === 'staff_1')
  const params = { params: Promise.resolve({ id: row.id }) }
  expect((await PATCH(request({ staffId: null }), params)).status).toBe(409)
  expect(row.staffId).toBe('staff_1')
  expect((await PATCH(request({ status: 'cancelled' }), params)).status).toBe(200)
  expect((await PATCH(request({ staffId: null }), params)).status).toBe(200)
  expect((await PATCH(request({ status: 'active' }), params)).status).toBe(409)
  expect(row.status).toBe('cancelled')
})
test('public booking persists the exact consent version, timestamp and normalized phone', async () => {
  expect((await publicPost(request(valid))).status).toBe(200)
  expect(rows[0]).toMatchObject({ phone: '+79991234567', consentVersion: '2026-09-16', consentAt: new Date('2026-09-16T06:00:00Z') })
})
test.each([{ consentVersion: undefined }, { consentVersion: '2020-01-01' }, { consentVersion: true }])('rejects absent or stale consent version %j', async change => {
  expect((await publicPost(request({ ...valid, ...change }))).status).toBe(400)
})
test('Moscow date and time are enforced at the UTC boundary', async () => {
  jest.setSystemTime(new Date('2026-09-16T21:30:00Z')) // Moscow September 17, 00:30
  expect((await publicPost(request({ ...valid, date: '2026-09-16', time: '18:00' }))).status).toBe(400)
  expect((await publicPost(request(valid))).status).toBe(200)
  rows.length = 0
  jest.setSystemTime(new Date('2026-09-17T07:00:01Z')) // Moscow 10:00:01
  expect((await publicPost(request(valid))).status).toBe(400)
})
test('concurrent public requests cannot race around the IP limit', async () => {
  const responses = await Promise.all(['10:00', '11:00', '12:00'].map((time, i) => publicPost(request({ ...valid, time, phone: `8999123456${i}` }))))
  expect(responses.map(r => r.status).sort()).toEqual([200, 200, 429])
  expect(rows).toHaveLength(2)
})
test('equivalent formatted phones cannot race around the future booking limit', async () => {
  process.env.TRUST_PROXY_IP = 'true'
  try {
    const responses = await Promise.all(['+7 (999) 123-45-67', '89991234567', '9991234567'].map((phone, i) => {
      const req = request({ ...valid, phone, time: ['10:00', '11:00', '12:00'][i] })
      req.headers.set('x-forwarded-for', `192.0.2.${i + 1}`)
      return publicPost(req)
    }))
    expect(responses.map(r => r.status).sort()).toEqual([200, 200, 409])
  } finally { delete process.env.TRUST_PROXY_IP }
})
test('malformed JSON, null, arrays and oversized bodies return controlled errors', async () => {
  for (const value of [null, [], 'wrong']) expect((await publicPost(request(value))).status).toBe(400)
  const broken = new Request('http://localhost', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' })
  expect((await publicPost(broken)).status).toBe(400)
  expect((await publicPost(request({ ...valid, name: 'x'.repeat(9000) }))).status).toBe(413)
})
test('cross-site mutations are rejected and logout requires a signed session', async () => {
  mockCookies.set('admin_auth', issueSession('admin', 'admin')!)
  const req = request(valid)
  req.headers.set('origin', 'https://attacker.example')
  expect((await adminPost(req)).status).toBe(403)
  expect((await adminLogout(new Request('http://localhost', { method: 'POST' }))).cookies.get('admin_auth')?.value).toBe('')
  expect((await staffLogout(new Request('http://localhost', { method: 'POST' }))).status).toBe(401)
})


test('authenticated staff reads only their calendar and cannot use admin endpoints', async () => {
  mockCookies.set('staff_auth', issueSession('staff', 'staff_1')!)
  rows.push(
    { id: 'own', date: valid.date, time: '10:00', duration: 30, status: 'active', staffId: 'staff_1' },
    { id: 'other', date: valid.date, time: '11:00', duration: 30, status: 'active', staffId: 'staff_2' },
    { id: 'notary', date: valid.date, time: '12:00', duration: 30, status: 'active', staffId: null },
  )
  const response = await schedule(new Request(`http://localhost?date=${valid.date}&staffId=staff_2`))
  expect((await response.json()).appointments.map((a: any) => a.id)).toEqual(['own'])
  expect(await (await staffGet(new Request(`http://localhost?date=${valid.date}&staffId=staff_2`))).json()).toEqual({ booked: ['10:00'] })
  expect((await adminPost(request(valid))).status).toBe(401)
  mockCookies.set('admin_auth', issueSession('admin', 'admin')!)
  expect(await (await adminGet(new Request(`http://localhost?date=${valid.date}&staffId=staff_2`))).json()).toEqual({ booked: ['11:00'] })
  expect(await (await adminGet(new Request(`http://localhost?date=${valid.date}`))).json()).toEqual({ booked: ['12:00'] })
})
test('limiter database failure refuses login and never sets a session', async () => {
  const transaction = jest.spyOn(db, '$transaction').mockRejectedValueOnce(new Error('database unavailable'))
  try {
    const response = await adminLogin(request({ password: process.env.ADMIN_PASSWORD }))
    expect(response.status).toBe(503)
    expect(response.cookies.get('admin_auth')).toBeUndefined()
  } finally { transaction.mockRestore() }
})
