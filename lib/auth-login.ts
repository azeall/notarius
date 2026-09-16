import 'server-only'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from './prisma'
import { accountPassword, issueSession, passwordMatches, secretConfigured, sessionCookieOptions, staffForUsername } from './auth'
import { apiError, readBody, unauthorized } from './auth-http'

async function allowAttempt(account: string): Promise<boolean> {
  return prisma.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(723641, 2)`
    const now = new Date()
    const previous = await tx.loginRateLimit.findUnique({ where: { key: account } })
    if (previous && previous.resetAt > now && previous.attempts >= 5) return false
    const data = previous && previous.resetAt > now
      ? { attempts: previous.attempts + 1, resetAt: previous.resetAt }
      : { attempts: 1, resetAt: new Date(now.getTime() + 15 * 60 * 1000) }
    await tx.loginRateLimit.upsert({ where: { key: account }, create: { key: account, ...data }, update: data })
    return true
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, maxWait: 10000, timeout: 15000 })
}
export async function login(req: Request, role: 'admin' | 'staff') {
  try {
    const body = await readBody(req)
    if (typeof body.password !== 'string' || body.password.length > 256 ||
      (role === 'staff' && (typeof body.username !== 'string' || body.username.length > 80))) return unauthorized()
    if (!secretConfigured()) return NextResponse.json({ error: 'Вход не настроен' }, { status: 503 })
    const staff = role === 'staff' ? staffForUsername((body.username as string).trim()) : null
    const id = role === 'admin' ? 'admin' : staff?.id ?? 'unknown'
    // Bounded account keys shared by deployments; cannot be bypassed by spoofing IP.
    // Tradeoff: repeated failures temporarily prevent that account's login.
    if (!await allowAttempt(`${role}:${id}`)) return NextResponse.json({ error: 'Слишком много попыток. Повторите через 15 минут.' }, { status: 429, headers: { 'Retry-After': '900' } })
    const password = accountPassword(role, id)
    if (!password || !passwordMatches(body.password, password)) return unauthorized()
    const token = issueSession(role, id)
    if (!token) return unauthorized()
    const response = NextResponse.json({ ok: true })
    response.cookies.set(`${role}_auth`, token, sessionCookieOptions)
    return response
  } catch (error) { return apiError(error) }
}
