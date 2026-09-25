import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const cli = fileURLToPath(new URL('./check-launch.mjs', import.meta.url))
const identity = {
  name: 'Соколова Ольга Игоревна', license: '№ 50/456', registryNumber: '50/987-н/50',
  address: 'ул. Центральная, 12, Тула',
  addressParts: { streetAddress: 'ул. Центральная, 12', addressLocality: 'Тула' },
  phone: '+7 (487) 234-56-78', phoneHref: 'tel:+74872345678', phoneE164: '+74872345678',
  email: 'office@sokolova-notary.ru', telegram: '', telegramHref: '', vk: '',
}
const liveEnv = {
  NEXT_PUBLIC_BOOKING_MODE: 'live', NEXT_PUBLIC_NOTARYBOT_URL: 'https://booking.sokolova-notary.ru',
  NEXT_PUBLIC_NOTARYBOT_SLUG: 'sokolova', BOOKING_ENABLED: 'true',
  DATABASE_URL: 'postgresql://office:PRIVATE_DB_PASSWORD@db.internal/office',
  SESSION_SECRET: '0123456789abcdef'.repeat(4), ADMIN_PASSWORD: 'PRIVATE_ADMIN_PASSWORD',
}
const widget = `export const serverDemo = process.env.NEXT_PUBLIC_BOOKING_MODE !== 'live'
export const notarybotUrl = (serverDemo ? 'https://app.guidecode.ru' : process.env.NEXT_PUBLIC_NOTARYBOT_URL || '').replace(/\\/+$/, '')
export const notarybotSlug = serverDemo ? 'demo' : process.env.NEXT_PUBLIC_NOTARYBOT_SLUG || ''
export const useServerWidget = serverDemo || Boolean(notarybotUrl && notarybotSlug)
`

function run(t, { demo = false, notary = {}, url = 'https://sokolova-notary.ru', backend = 'external', env = liveEnv, args = ['--live', '--json'], extra = '', widgetSource = widget, files = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'notary-launch-'))
  t.after(() => {
    const target = resolve(root)
    assert.equal(dirname(target), resolve(tmpdir()), 'cleanup must stay directly inside the temporary directory')
    assert.ok(basename(target).startsWith('notary-launch-'), 'cleanup must use the fixture prefix')
    rmSync(target, { recursive: true, force: true })
  })
  mkdirSync(join(root, 'lib'))
  mkdirSync(join(root, 'components'))
  const source = `export const demoMode: boolean = ${JSON.stringify(demo)}
export const notary = ${JSON.stringify({ ...identity, ...notary })} as const
export const siteUrl: string = ${JSON.stringify(url)}
export const site = { url: siteUrl || process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'https://notarius.ru') }
${extra}`
  writeFileSync(join(root, 'lib/data.ts'), source)
  if (backend === 'external') writeFileSync(join(root, 'lib/notarybot.ts'), widgetSource)
  if (backend === 'local') {
    writeFileSync(join(root, 'lib/booking.ts'), '// Existing local booking backend marker')
    writeFileSync(join(root, 'components/BookingMode.tsx'), `export const LIVE_BOOKING = process.env.NEXT_PUBLIC_BOOKING_MODE === 'live'\nexport default function Notice() { return <p>Demo</p> }`)
  }
  for (const [name, value] of Object.entries(files)) writeFileSync(join(root, name), value)
  const childEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(NEXT_PUBLIC_|VERCEL_|DATABASE_URL$|BOOKING_ENABLED$|SESSION_SECRET$|ADMIN_PASSWORD$|STAFF_|NODE_ENV$|__NEXT_PROCESSED_ENV$)/.test(key)))
  const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, env: { ...childEnv, ...env }, encoding: 'utf8', timeout: 15000 })
  assert.equal(readFileSync(join(root, 'lib/data.ts'), 'utf8'), source, 'checker must not modify configuration')
  return { ...result, report: result.stdout.trim().startsWith('{') ? JSON.parse(result.stdout) : null }
}

function fails(result, id) {
  assert.equal(result.status, 1, result.stdout + result.stderr)
  assert.ok(result.report.checks.some(check => check.id === id && check.status === 'fail'), result.stdout)
}

test('default demo succeeds but explicitly says not production', t => {
  const result = run(t, { demo: true, env: {}, args: ['--json'] })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.report.productionReady, false)
  assert.equal(result.report.mode, 'demo')
  assert.match(result.report.summary, /not.production/i)
})
test('expected demo rejects a live site and a live booking path', t => {
  fails(run(t, { args: ['--expect-demo', '--json'] }), 'mode.demo')
  fails(run(t, { demo: true, args: ['--expect-demo', '--json'] }), 'booking.demo')
})
test('live rejects demo identity and server demo even with banner disabled', t => {
  const result = run(t, { notary: { name: 'Иванова Мария Сергеевна', license: '№ 77/318-н', registryNumber: '77/1201-н/77' }, env: {} })
  fails(result, 'identity.name')
  fails(result, 'identity.license')
  fails(result, 'identity.registryNumber')
  fails(result, 'booking.live')
  fails(result, 'booking.serverDemo')
})
test('customized external and local live fixtures pass with manual review outstanding', t => {
  for (const backend of ['external', 'local']) {
    const result = run(t, { backend })
    assert.equal(result.status, 0, result.stdout + result.stderr)
    assert.equal(result.report.mode, 'live')
    assert.equal(result.report.productionReady, false)
    assert.ok(result.report.checks.some(check => check.status === 'manual'))
  }
})
test('default runs live checks when demoMode is false', t => {
  fails(run(t, { env: {}, args: ['--json'] }), 'booking.live')
})
test('known demo identities from every design and missing identifiers fail', t => {
  for (const name of ['Смирнова Елена Викторовна', 'Петрова Анна Владимировна', '  Иванова   Мария Сергеевна  ', '']) {
    fails(run(t, { notary: { name } }), 'identity.name')
  }
  fails(run(t, { notary: { registryNumber: '' } }), 'identity.registryNumber')
  fails(run(t, { demo: true }), 'mode.live')
})
test('contacts reject sample data and inconsistent visible and structured values', t => {
  for (const notary of [{ phoneHref: 'tel:+74951234567' }, { phoneE164: '+74951234567' }]) {
    fails(run(t, { notary }), 'contact.phone')
  }
  fails(run(t, { notary: { phone: '+7 (495) 000-00-00', phoneE164: '+74950000000', phoneHref: 'tel:+74950000000' } }), 'contact.phone')
  fails(run(t, { notary: { email: 'priem@example.ru' } }), 'contact.email')
  fails(run(t, { notary: { address: 'ул. Тверская, 18к1, Москва' } }), 'contact.address')
  fails(run(t, { notary: { addressParts: { streetAddress: 'Другой адрес', addressLocality: 'Тула' } } }), 'contact.address')
  fails(run(t, { notary: { telegram: '@office', telegramHref: 'https://t.me/someone-else' } }), 'contact.social')
})
test('canonical rejects preview, localhost, sample and non-origin URLs', t => {
  for (const url of ['http://sokolova-notary.ru', 'https://localhost', 'https://127.0.0.1', 'https://[::1]', 'https://office-git-main-team.vercel.app', 'https://office-a1b2c3-team.vercel.app', 'https://notarius-modern.vercel.app', 'https://example.com', 'https://office.local', 'https://sokolova-notary.ru/path', 'https://user:password@sokolova-notary.ru']) {
    fails(run(t, { url }), 'site.canonical')
  }
  fails(run(t, { url: '' }), 'site.canonical')
})
test('canonical uses actual data precedence rather than a misleading env override', t => {
  fails(run(t, { url: 'https://notarius-warm.vercel.app', env: { ...liveEnv, NEXT_PUBLIC_SITE_URL: 'https://sokolova-notary.ru' } }), 'site.canonical')
  assert.equal(run(t, { url: '', env: { ...liveEnv, NEXT_PUBLIC_SITE_URL: 'https://sokolova-notary.ru' } }).status, 0)
})
test('external booking rejects disabled widget, demo tenant and unsafe service URL', t => {
  for (const value of ['', 'http://booking.sokolova-notary.ru', 'https://localhost', 'https://booking.sokolova-notary.ru/widget/demo', 'https://user:PRIVATE_PASSWORD@booking.sokolova-notary.ru', 'https://booking.sokolova-notary.ru?token=PRIVATE_TOKEN']) {
    fails(run(t, { env: { ...liveEnv, NEXT_PUBLIC_NOTARYBOT_URL: value } }), 'booking.url')
  }
  for (const value of ['', 'demo', 'DEMO', 'demo/../sokolova', 'example']) {
    fails(run(t, { env: { ...liveEnv, NEXT_PUBLIC_NOTARYBOT_SLUG: value } }), 'booking.slug')
  }
  fails(run(t, { widgetSource: widget.replace('export const useServerWidget = serverDemo || Boolean(notarybotUrl && notarybotSlug)', 'export const useServerWidget = false') }), 'booking.widget')
})
test('local booking requires server enablement and usable database/auth configuration', t => {
  for (const [key, value, id] of [
    ['BOOKING_ENABLED', 'false', 'booking.enabled'], ['DATABASE_URL', '', 'booking.database'],
    ['DATABASE_URL', 'https://db.internal', 'booking.database'], ['SESSION_SECRET', 'a'.repeat(64), 'booking.session'],
    ['ADMIN_PASSWORD', 'short', 'booking.admin'], ['STAFF_1_PASS', 'short', 'booking.staff'],
  ]) fails(run(t, { backend: 'local', env: { ...liveEnv, [key]: value } }), id)
  fails(run(t, { backend: 'local', demo: true, env: { BOOKING_ENABLED: 'true' }, args: ['--expect-demo', '--json'] }), 'booking.demo')
})
test('unsupported architecture and invalid TS fail closed without exposing diagnostics', t => {
  fails(run(t, { backend: 'unknown' }), 'config.read')
  for (const extra of ['export const invalid = ;', 'throw new Error("PRIVATE_ERROR_VALUE")', 'console.log("PRIVATE_LOG_VALUE")', 'import fs from "node:fs"', 'while (true) {}']) {
    const result = run(t, { extra })
    fails(result, 'config.read')
    assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE_/)
  }
})
test('CLI loads production env files with shell precedence and never prints secret values', t => {
  const envText = Object.entries(liveEnv).map(([key, value]) => `${key}=${value}`).join('\n')
  const result = run(t, { backend: 'local', env: {}, files: { '.env.production': envText } })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  fails(run(t, { backend: 'local', env: { BOOKING_ENABLED: 'false' }, files: { '.env.production': envText } }), 'booking.enabled')
  for (const args of [['--live', '--json'], ['--live']]) {
    const result = run(t, { env: { ...liveEnv, NEXT_PUBLIC_NOTARYBOT_URL: 'https://user:PRIVATE_PASSWORD@bad.invalid?secret=PRIVATE_TOKEN', SESSION_SECRET: 'PRIVATE_SESSION_SECRET' }, args })
    assert.equal(result.status, 1)
    assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE_/)
  }
})
test('invalid or conflicting CLI options produce sanitized JSON and exit 2', t => {
  for (const args of [['--live', '--expect-demo', '--json'], ['--PRIVATE_ARGUMENT', '--json']]) {
    const result = run(t, { args })
    assert.equal(result.status, 2)
    assert.equal(result.report.ok, false)
    assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE_ARGUMENT/)
  }
})
