# Launch preflight

Run from this repository's root with the existing development dependencies installed
(`npm ci`, Node >=22). No new dependencies, network calls, database connections,
configuration changes, builds or generated files are involved.

```sh
npm run check:launch
npm run check:launch -- --expect-demo
npm run check:launch -- --live
npm run check:launch -- --live --json
npm run test:launch
```

For machine consumers use `node scripts/check-launch.mjs --live --json` directly
(or `npm run --silent check:launch -- --live --json`) to avoid npm's command banner.
Exit codes: **0** = requested automated checks passed, **1** = failed configuration
check, **2** = invalid CLI arguments. JSON contains `ok`, `mode`, `backend`,
`productionReady`, `summary`, and `checks` with stable `id`, `status` and `message`.
Statuses are `pass`, `fail`, or `manual`. Values and raw exceptions are never printed.

## Demo versus live

Default mode follows the actual `demoMode` export in `lib/data.ts`. A demo reports
**DEMO / NOT PRODUCTION**, exits 0 when its booking path is also demo, and does not
require replacing fictional identity or configuring live credentials.
`--expect-demo` additionally fails if the demo banner is disabled. Demo checks reject
live public booking mode, and on local-booking branches reject `BOOKING_ENABLED=true`.

Use **`--live` as a required predeployment gate for a real notary**, regardless of the
banner setting. The tool itself is not wired into builds or deployment. Live checks:

- Require `demoMode=false`, a name, license and registry number distinct from all
  four branches' known samples; no claim of registry authenticity is made.
- Reject the sample phone/email/address/social contacts. Check visible phone against
  E.164 and `tel:`, address against structured street/locality, and Telegram against
  its link. Unused Telegram/VK values can be empty.
- Check the **effective** `site.url` and an explicit canonical source. `siteUrl` in
  `lib/data.ts` wins over environment variables; an env override cannot fix a
  hardcoded demo URL. Require a public HTTPS origin without credentials, path, query,
  fragment or custom port. Known demo domains, example/local/IP hosts and recognizable
  demo/staging/preview hosts fail. Hyphenated Vercel subdomains are conservatively
  rejected because they can be branch/hash previews; use the notary's permanent domain.
- Require `NEXT_PUBLIC_BOOKING_MODE=live` and the actual booking configuration below.

## Branch-specific booking

The identical script detects the existing architecture from repository files. Both
or neither architecture markers fail closed and require review.

| Branch | Configuration checked |
| --- | --- |
| template | Actual exports from `lib/notarybot.ts`: `serverDemo=false`, `useServerWidget=true`, explicit `NEXT_PUBLIC_NOTARYBOT_URL` as an HTTPS **origin** and a non-demo `NEXT_PUBLIC_NOTARYBOT_SLUG`. The URL is the service root, not `/widget/...` or `/embed.js`. |
| site-lavender, site-warm, site-modern | Actual `LIVE_BOOKING` export from `components/BookingMode.tsx`, `BOOKING_ENABLED=true`, PostgreSQL `DATABASE_URL` syntax, and session/admin credential format matching existing auth requirements. Nonempty `STAFF_1_PASS` through `STAFF_5_PASS` must meet password length rules; absent staff accounts remain disabled. |

The production environment loader already bundled with Next loads `.env.production.local`,
`.env.local`, `.env.production`, `.env` with shell variables taking precedence, including
Next's variable expansion. `.env.example` is not loaded. This command always uses production
loading, even if the invoking shell says development/test. Loader errors are sanitized.

Existing TypeScript transpiles configuration **in memory**, then evaluates it with only
public configuration environment values, no imports, filesystem/network APIs or console,
and a one-second evaluation timeout. JSX is compiled but components are never rendered.
Unsupported imports, malformed syntax, missing exports or evaluation failures block the
check. No regex is used to parse TypeScript. This is for trusted project configuration:
Node's VM is not a security boundary for hostile source. Transpilation is not typechecking;
run the repository's normal tests and typecheck separately.

## What remains unknown

An exit 0 is **not production approval or a compliance certificate**.
`productionReady` is always false: legal, identity and hosting evidence remains manual.
The checker cannot establish ownership, authenticity, DNS/TLS readiness, database
connectivity/migrations/isolation, password randomness, or the service's tenant mode and
allowed origins. It does not audit every page, claim, image, review or map coordinate.

Complete the `manual` checks and existing `DEPLOYMENT.md` review with the owner, including
privacy/consent wording and actual data flows. For template, verify tenant identity,
live service configuration, allowed origins, widget opening and outage fallback with the
service owner. For the other branches, verify the isolated database, staff access and a
real booking flow. A custom hostname may still point to a preview or wrong deployment;
that cannot be determined offline.

Run the gate with the final build-time public environment and runtime server environment.
Next freezes `NEXT_PUBLIC_*` values into builds: passing against new env values does not
repair or validate an older deployed build. No existing `.next` output is inspected.

The same checker, tests and document are copied across all four branches. When updating
them, run `npm run test:launch`, `npm test -- --runInBand`, and
`npm run typecheck -- --incremental false` in each checkout. Fixture tests use temporary
directories, controlled child environments, both booking architectures, and never write
the repository's data or environment files.
