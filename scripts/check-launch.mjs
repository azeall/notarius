import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { createRequire } from 'node:module'
import { Script } from 'node:vm'
import { isIP } from 'node:net'

const require = createRequire(import.meta.url)
const checks = []
const args = process.argv.slice(2)
const json = args.includes('--json')
const root = process.cwd()
let mode = 'unknown'
let backend = 'unknown'

function check(id, passed, message) {
  checks.push({ id, status: passed ? 'pass' : 'fail', message })
}
function manual(id, message) {
  checks.push({ id, status: 'manual', message })
}
function finish(code) {
  const ok = code === 0
  const summary = mode === 'demo'
    ? 'DEMO / NOT PRODUCTION: no live-launch approval.'
    : ok ? 'Automated checks passed; manual review remains. Not a compliance certificate.'
      : 'Launch blocked: resolve failed checks. Not a compliance certificate.'
  const report = { ok, mode, backend, productionReady: false, summary, checks }
  console.log(json ? JSON.stringify(report, null, 2) : [summary, ...checks.map(c => `${c.status.toUpperCase()} ${c.id}: ${c.message}`)].join('\n'))
  process.exitCode = code
}

// Evaluate only trusted, import-free configuration modules, never the application,
// database client, or auth module. VM is a side-effect guard, not a security sandbox.
function readConfig(file, env) {
  const ts = require('typescript')
  const source = readFileSync(join(root, file), 'utf8')
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node) ||
      (ts.isExportDeclaration(node) && node.moduleSpecifier) || node.kind === ts.SyntaxKind.ImportKeyword) throw new Error('Unsupported import')
    ts.forEachChild(node, visit)
  }
  visit(ast)
  const result = ts.transpileModule(source, {
    fileName: file, reportDiagnostics: true,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
  })
  if (result.diagnostics?.some(d => d.category === ts.DiagnosticCategory.Error)) throw new Error('Invalid TypeScript')
  const publicEnv = Object.fromEntries(Object.entries(env).filter(([key]) => key.startsWith('NEXT_PUBLIC_') || key === 'VERCEL_PROJECT_PRODUCTION_URL'))
  const script = new Script(`const exports = {}; const process = { env: ${JSON.stringify(publicEnv)} };\n${result.outputText}\nJSON.stringify(exports)`)
  return JSON.parse(script.runInNewContext({ console: undefined }, { timeout: 1000, contextCodeGeneration: { strings: false, wasm: false } }))
}

const normalize = value => typeof value === 'string' ? value.trim().toLowerCase().replace(/\s+/g, ' ') : ''
const present = value => typeof value === 'string' && value.trim().length > 0
const demoNames = ['Иванова Мария Сергеевна', 'Смирнова Елена Викторовна', 'Петрова Анна Владимировна'].map(normalize)
const demoHosts = ['notarius.ru', 'notarius-wn4h.vercel.app', 'notarius-lavender.vercel.app', 'notarius-warm.vercel.app', 'notarius-modern.vercel.app']
function publicHost(host) {
  host = host.toLowerCase().replace(/\.$/, '')
  return host.includes('.') && !isIP(host) && !host.includes(':') &&
    !/(^|\.)(localhost|local|internal|test|invalid|example|example\.com|example\.org|example\.net|example\.ru)$/.test(host) &&
    !demoHosts.includes(host) &&
    // Vercel branch/hash URLs contain additional hyphen-separated labels.
    !(host.endsWith('.vercel.app') && host.slice(0, -11).includes('-')) &&
    !/(^|[.-])(preview|demo|staging)([.-]|$)/.test(host)
}
function originUrl(value) {
  try {
    const url = new URL(value)
    return present(value) && value === value.trim() && url.protocol === 'https:' &&
      publicHost(url.hostname) && !url.username && !url.password &&
      !url.search && !url.hash && url.pathname === '/' && !url.port
  } catch { return false }
}
function password(value) {
  return typeof value === 'string' && value.length <= 256 && value.trim().length >= 12
}

if (args.some(arg => !['--live', '--expect-demo', '--json', '--help'].includes(arg)) ||
  (args.includes('--live') && args.includes('--expect-demo'))) {
  check('cli.options', false, 'Use --live OR --expect-demo, optionally --json; --help lists usage.')
  finish(2)
} else if (args.includes('--help')) {
  mode = 'help'
  manual('cli.usage', 'Run from repository root: node scripts/check-launch.mjs [--live | --expect-demo] [--json]. Uses production .env files and shell overrides; no network or writes.')
  finish(0)
} else {
  try {
    // Use the exact loader already shipped with Next, including expansion and
    // production precedence. Suppress loader diagnostics: they may contain values.
    process.env.NODE_ENV = 'production'
    const nextRequire = createRequire(require.resolve('next/package.json'))
    let envError = false
    nextRequire('@next/env').loadEnvConfig(resolve(root), false, { info() {}, error() { envError = true } })
    if (envError) throw new Error('Environment load failed')
    const env = process.env
    const data = readConfig('lib/data.ts', env)
    if (typeof data.demoMode !== 'boolean' || !data.notary || !data.site) throw new Error('Unsupported data exports')
    const external = existsSync(join(root, 'lib/notarybot.ts'))
    const local = existsSync(join(root, 'lib/booking.ts'))
    if (external === local) throw new Error('Unknown booking architecture')
    backend = external ? 'external-widget' : 'local-booking'
    const booking = readConfig(external ? 'lib/notarybot.ts' : 'components/BookingMode.tsx', env)
    if (external ? typeof booking.serverDemo !== 'boolean' || typeof booking.useServerWidget !== 'boolean' : typeof booking.LIVE_BOOKING !== 'boolean') throw new Error('Unsupported booking exports')
    mode = args.includes('--live') ? 'live' : args.includes('--expect-demo') ? 'demo' : data.demoMode ? 'demo' : 'live'
    if (mode === 'demo') {
      check('mode.demo', data.demoMode === true, 'Demo expectation requires demoMode=true; this is not production.')
      check('booking.demo', env.NEXT_PUBLIC_BOOKING_MODE !== 'live' &&
        (external ? booking.serverDemo === true : booking.LIVE_BOOKING === false && env.BOOKING_ENABLED !== 'true'),
      'Demo must not expose a live booking path or enable the local public booking API.')
      manual('demo.data', 'Use fictional visitor data. Demo success does not approve a live launch.')
    } else {
      check('mode.live', data.demoMode === false, 'Live requires demoMode=false after replacing fictional content.')
      const n = data.notary
      for (const [key, placeholders] of [
        ['name', demoNames], ['license', [normalize('№ 77/318-н')]], ['registryNumber', [normalize('77/1201-н/77')]],
      ]) {
        check(`identity.${key}`, present(n[key]) && !placeholders.includes(normalize(n[key])), `notary.${key} must be explicitly configured and differ from known demo values; authenticity requires manual verification.`)
      }
      const digits = value => typeof value === 'string' ? value.replace(/\D/g, '') : ''
      check('contact.phone', /^\+[1-9]\d{7,14}$/.test(n.phoneE164 ?? '') &&
        n.phoneE164 !== '+74950000000' && digits(n.phone) === n.phoneE164.slice(1) && n.phoneHref === `tel:${n.phoneE164}`,
      'Visible phone, phoneE164 and tel link must agree and not retain the demo number.')
      const email = normalize(n.email)
      check('contact.email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && publicHost(email.split('@')[1]), 'Configure a non-placeholder contact email.')
      const address = normalize(n.address)
      const street = normalize(n.addressParts?.streetAddress)
      const city = normalize(n.addressParts?.addressLocality)
      check('contact.address', Boolean(address && street && city) && !address.includes(normalize('Тверская, 18к1')) &&
        address.includes(street) && address.includes(city), 'Replace the sample address; visible address must include structured street and locality.')
      const telegram = normalize(n.telegram)
      const telegramHref = normalize(n.telegramHref)
      check('contact.social', ((!telegram && !telegramHref) || (/^@[a-z0-9_]+$/.test(telegram) && telegram !== '@notarius' && telegramHref === `https://t.me/${telegram.slice(1)}`)) &&
        (!present(n.vk) || (normalize(n.vk) !== 'https://vk.com/notarius' && /^https:\/\/vk\.com\/[a-z0-9_.-]+\/?$/i.test(n.vk))),
      'Remove unused sample social contacts or configure matching Telegram and non-demo VK links.')
      check('site.canonical', originUrl(data.site.url) && Boolean(present(data.siteUrl) || present(env.NEXT_PUBLIC_SITE_URL) || present(env.VERCEL_PROJECT_PRODUCTION_URL)),
        'Effective site.url must be an explicit HTTPS origin, without credentials/path/query or demo/local/preview host. lib/data.ts siteUrl takes precedence over env.')
      check('booking.live', env.NEXT_PUBLIC_BOOKING_MODE === 'live' && (external || booking.LIVE_BOOKING === true), 'Public booking mode must explicitly be live and match the actual interface export.')
      if (external) {
        check('booking.serverDemo', booking.serverDemo === false, 'The actual widget configuration must disable serverDemo for live visitors.')
        check('booking.widget', booking.useServerWidget === true, 'The external booking widget must be enabled.')
        check('booking.url', originUrl(booking.notarybotUrl) && present(env.NEXT_PUBLIC_NOTARYBOT_URL), 'Configure an HTTPS service origin, without credentials, path, query, fragment or preview/local host.')
        check('booking.slug', present(env.NEXT_PUBLIC_NOTARYBOT_SLUG) && /^[a-z0-9][a-z0-9_-]*$/i.test(booking.notarybotSlug ?? '') &&
          !['demo', 'test', 'example', 'notarius'].includes(normalize(booking.notarybotSlug)), 'Configure a non-demo tenant slug; URL path syntax is not a slug.')
        manual('booking.remote', 'Verify tenant identity, allowed_origins, live service mode, widget opening and outage fallback with the service owner; no remote requests were made.')
      } else {
        check('booking.enabled', env.BOOKING_ENABLED === 'true', 'Local public booking requires BOOKING_ENABLED=true.')
        let database = false
        try {
          const url = new URL(env.DATABASE_URL)
          database = ['postgres:', 'postgresql:'].includes(url.protocol) && Boolean(url.hostname && url.username && url.pathname.length > 1)
        } catch { /* Never report a URL or parser error. */ }
        check('booking.database', database, 'DATABASE_URL must describe a PostgreSQL database; connection, migrations and isolation are not verified.')
        check('booking.session', /^[a-fA-F0-9]{64}$/.test(env.SESSION_SECRET ?? '') && new Set((env.SESSION_SECRET ?? '').toLowerCase()).size >= 12, 'SESSION_SECRET must satisfy the existing auth requirements (64 hex characters, at least 12 distinct).')
        check('booking.admin', password(env.ADMIN_PASSWORD), 'ADMIN_PASSWORD must satisfy the existing auth length requirements (12–256 characters).')
        check('booking.staff', [1, 2, 3, 4, 5].every(i => !env[`STAFF_${i}_PASS`] || password(env[`STAFF_${i}_PASS`])), 'Configured staff passwords must meet auth length requirements; omitted staff accounts stay disabled.')
        manual('booking.local', 'Verify database reachability, migrations, office isolation, enabled staff accounts, proxy trust and an end-to-end booking; no database connection was made.')
      }
      manual('identity.review', 'Verify notary identity, registry/license, office, all displayed claims, photos, reviews, map coordinates and contact ownership with the owner. Matching configuration is not proof of authenticity.')
      manual('hosting.review', 'Verify domain ownership, DNS/TLS, final build-time public env and runtime env, hosting/data location and operational readiness. Existing build artifacts are not inspected.')
      manual('legal.review', 'Owner/legal review required for policy, consent, actual data flows and service arrangements. This tool does not certify compliance.')
    }
  } catch {
    check('config.read', false, 'Could not safely load supported configuration. Check TypeScript syntax, import-free config exports, booking architecture and installed project dependencies. Raw diagnostics are suppressed.')
  }
  finish(checks.some(c => c.status === 'fail') ? 1 : 0)
}
