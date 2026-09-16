/** @jest-environment node */
// Opt-in integration against ONLY the isolated local test database. Creates a
// fresh schema each run; no drops, truncation, or changes to existing schemas.
jest.mock('server-only', () => ({}), { virtual: true })
import { PrismaClient } from '@prisma/client'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const integration = process.env.RUN_BOOKING_PG_TESTS === 'true' ? describe : describe.skip
integration('isolated PostgreSQL booking and migration integration', () => {
  let prisma: PrismaClient
  let booking: typeof import('@/lib/booking')
  let login: typeof import('@/lib/auth-login').login
  let schema: string
  const originalEnv = { ...process.env }
  const request = () => new Request('http://localhost/api/appointments', { method: 'POST' })
  function fixture(offset: number, time = '10:00') {
    const day = new Date()
    day.setUTCDate(day.getUTCDate() + 7 + offset)
    while ([0, 6].includes(day.getUTCDay())) day.setUTCDate(day.getUTCDate() + 1)
    return { name: 'Synthetic security test', phone: '+79991234567', service: 'Доверенности', date: day.toISOString().slice(0, 10), time, consent: true, consentVersion: '2026-09-16' }
  }
  beforeAll(async () => {
    const url = new URL(process.env.BOOKING_TEST_DATABASE_URL ?? '')
    if (url.protocol !== 'postgresql:' || url.hostname !== '127.0.0.1' || url.port !== '55432' || url.pathname !== '/notarius_booking_test' || url.username !== 'postgres') {
      throw new Error('Integration tests require the dedicated 127.0.0.1:55432/notarius_booking_test database')
    }
    schema = `security_${Date.now()}_${process.pid}`
    url.searchParams.set('schema', schema)
    process.env.DATABASE_URL = url.toString()
    process.env.BOOKING_ENABLED = 'true'
    process.env.TRUST_PROXY_IP = 'true'
    process.env.SESSION_SECRET = 'b70e8c425db131932f641ac102a854dcb14fc3003719f4bfcc4898ea607a1f55'
    process.env.ADMIN_PASSWORD = 'Integration-admin-password-123'
    const bootstrap = new PrismaClient({ datasources: { db: { url: url.toString() } } })
    await bootstrap.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`)
    function cli(args: string[]) {
      return execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), ...args], { cwd: process.cwd(), env: process.env, encoding: 'utf8', timeout: 30000, windowsHide: true })
    }
    // Simulate an existing deployment: original schema + historical appointment.
    cli(['db', 'execute', '--file', 'prisma/migrations/20260916000000_baseline/migration.sql', '--url', url.toString()])
    await bootstrap.$executeRaw`INSERT INTO "Appointment" (id, name, phone, service, date, time) VALUES ('historical-test', 'Historical synthetic record', '8 (999) 123-45-67', 'Доверенности', '2020-01-01', '10:00')`
    cli(['migrate', 'resolve', '--applied', '20260916000000_baseline'])
    cli(['migrate', 'deploy'])
    await bootstrap.$disconnect()
    prisma = require('@/lib/prisma').prisma
    booking = require('@/lib/booking')
    login = require('@/lib/auth-login').login
  }, 90000)
  afterAll(async () => {
    await prisma?.$disconnect()
    process.env = originalEnv
  })
  test('additive migration preserves historical data without inventing consent', async () => {
    const historical = await prisma.appointment.findUnique({ where: { id: 'historical-test' } })
    expect(historical).toMatchObject({ name: 'Historical synthetic record', phone: '8 (999) 123-45-67', consentVersion: null, consentAt: null })
  })
  test('concurrent overlapping creates commit exactly one appointment', async () => {
    const body = fixture(0)
    const results = await Promise.allSettled(Array.from({ length: 8 }, () => booking.createBooking(body, 'admin', request())))
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1)
    expect(results.filter(r => r.status === 'rejected').every(r => (r as PromiseRejectedResult).reason.status === 409)).toBe(true)
    expect(await prisma.appointment.count({ where: { date: body.date, staffId: null } })).toBe(1)
  })
  test('partial interval overlap is rejected but separate calendars succeed', async () => {
    const body = { ...fixture(3), duration: 90 }
    const first = await booking.createBooking(body, 'admin', request())
    const results = await Promise.allSettled([
      booking.createBooking({ ...body, time: '11:00', duration: 30 }, 'admin', request()),
      booking.createBooking({ ...body, staffId: 'staff_1' }, 'admin', request()),
    ])
    expect(results[0].status).toBe('rejected')
    expect(results[1].status).toBe('fulfilled')
    expect(first.staffId).toBeNull()
  })
  test('concurrent reassignment only permits one arrival in target calendar', async () => {
    const body = fixture(7)
    const a = await booking.createBooking({ ...body, staffId: 'staff_1' }, 'admin', request())
    const b = await booking.createBooking({ ...body, staffId: 'staff_2' }, 'admin', request())
    const results = await Promise.allSettled([booking.updateBooking(a.id, { staffId: null }), booking.updateBooking(b.id, { staffId: null })])
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1)
    expect(results.filter(r => r.status === 'rejected')).toHaveLength(1)
    expect(await prisma.appointment.count({ where: { date: body.date, staffId: null, status: 'active' } })).toBe(1)
  })
  test('reactivation and creation cannot overlap', async () => {
    const body = fixture(10)
    const row = await booking.createBooking(body, 'admin', request())
    await booking.updateBooking(row.id, { status: 'cancelled' })
    const results = await Promise.allSettled([booking.updateBooking(row.id, { status: 'active' }), booking.createBooking(body, 'admin', request())])
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1)
    expect(await prisma.appointment.count({ where: { date: body.date, staffId: null, status: 'active' } })).toBe(1)
  })
  test('concurrent public requests enforce IP limits inside the transaction', async () => {
    const body = fixture(14)
    const results = await Promise.allSettled(['10:00', '11:00', '12:00'].map((time, i) => {
      const req = request(); req.headers.set('x-forwarded-for', '192.0.2.10')
      return booking.createBooking({ ...body, time, phone: `8999000000${i}` }, 'public', req)
    }))
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(2)
    expect((results.find(r => r.status === 'rejected') as PromiseRejectedResult).reason.status).toBe(429)
    const saved = await prisma.appointment.findMany({ where: { date: body.date, ip: '192.0.2.10' } })
    expect(saved.every(row => row.consentVersion === '2026-09-16' && row.consentAt instanceof Date)).toBe(true)
  })
  test('concurrent normalized phone limits span separate IPs and dates', async () => {
    const body = fixture(17)
    const results = await Promise.allSettled(['+7 (999) 888-77-66', '89998887766', '9998887766'].map((phone, i) => {
      const req = request(); req.headers.set('x-forwarded-for', `192.0.2.${20 + i}`)
      return booking.createBooking({ ...body, time: ['10:00', '11:00', '12:00'][i], phone }, 'public', req)
    }))
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(2)
    expect((results.find(r => r.status === 'rejected') as PromiseRejectedResult).reason.status).toBe(409)
  })
  test('login limiter persists and enforces exactly five concurrent attempts', async () => {
    const responses = await Promise.all(Array.from({ length: 9 }, () => login(new Request('http://localhost/api/admin-login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'incorrect' }),
    }), 'admin')))
    expect(responses.filter(r => r.status === 401)).toHaveLength(5)
    expect(responses.filter(r => r.status === 429)).toHaveLength(4)
    expect((await prisma.loginRateLimit.findUnique({ where: { key: 'admin:admin' } }))?.attempts).toBe(5)
  })
})
