import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import ServicesGrid from '@/components/ServicesGrid'
import HowItWorks from '@/components/HowItWorks'
import CredentialsSection from '@/components/CredentialsSection'
import FAQ from '@/components/FAQ'
import BookingButton from '@/components/BookingButton'
import { notary, site } from '@/lib/data'

export const metadata: Metadata = {
  title: '\u041D\u043E\u0442\u0430\u0440\u0438\u0443\u0441 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435 \u00B7 \u0417\u0430\u043F\u0438\u0441\u044C \u043D\u0430 \u043F\u0440\u0438\u0451\u043C \u043E\u043D\u043B\u0430\u0439\u043D',
  description:
    '\u041D\u043E\u0442\u0430\u0440\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u043A\u043E\u043D\u0442\u043E\u0440\u0430 \u0411\u044B\u043A\u043E\u043D\u044F \u0420\u0443\u0441\u043B\u0430\u043D\u0430 \u0415\u0432\u0433\u0435\u043D\u044C\u0435\u0432\u0438\u0447\u0430 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435. \u0423\u0434\u043E\u0441\u0442\u043E\u0432\u0435\u0440\u0435\u043D\u0438\u0435 \u0441\u0434\u0435\u043B\u043E\u043A, \u043D\u0430\u0441\u043B\u0435\u0434\u0441\u0442\u0432\u043E, \u0434\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u0438, \u0431\u0440\u0430\u0447\u043D\u044B\u0435 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u044B, \u0437\u0430\u0432\u0435\u0440\u0435\u043D\u0438\u0435 \u043A\u043E\u043F\u0438\u0439. \u0417\u0430\u043F\u0438\u0441\u044C \u043E\u043D\u043B\u0430\u0439\u043D, \u0433\u0438\u0431\u043A\u0438\u0435 \u0447\u0430\u0441\u044B.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    title: `\u041D\u043E\u0442\u0430\u0440\u0438\u0443\u0441 ${notary.name} \u00B7 \u041C\u043E\u0441\u043A\u0432\u0430`,
    description: site.description,
  },
}

export default function HomePage() {
  // Condensed working hours for map display
  const weekdayHours = '\u041F\u043D\u2013\u0427\u0442 10:00\u201319:00'
  const fridayHours = '\u041F\u0442 10:00\u201313:00 / 14:00\u201318:00'
  const weekendHours = '\u0421\u0431, \u0412\u0441 \u2014 \u0432\u044B\u0445\u043E\u0434\u043D\u043E\u0439'

  return (
    <>
      <Hero />

      <CredentialsSection />

      <ServicesGrid />

      <HowItWorks />

      {/* ── Map / Contacts section ── */}
      <section className="relative py-20 sm:py-[120px]" style={{ background: '#0a1628' }}>
        <div className="relative mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1340px' }}>

          {/* Section header */}
          <div className="flex items-end justify-between gap-10 mb-14 sm:mb-16 flex-wrap reveal">
            <div>
              <div className="inline-flex items-center gap-3.5 mb-5">
                <span className="block w-6 h-px bg-gold flex-shrink-0" />
                <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
                  \u0410\u0434\u0440\u0435\u0441 \u0438 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B
                </span>
              </div>
              <h2
                className="font-serif font-medium text-cream m-0"
                style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
              >
                \u041A\u0430\u043A \u043D\u0430\u0441{' '}
                <em className="italic font-normal text-gold">\u043D\u0430\u0439\u0442\u0438</em>
              </h2>
            </div>
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.22em] uppercase text-gold no-underline pb-1 transition-colors hover:text-gold-light flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(184,154,90,0.30)' }}
            >
              \u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* 3-column card: info | map | portrait */}
          <div
            className="reveal grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr_0.75fr] overflow-hidden rounded-2xl"
            style={{ border: '1px solid rgba(184,154,90,0.15)', background: 'rgba(184,154,90,0.12)' }}
          >
            {/* Info column */}
            <div style={{ padding: '44px 40px', background: '#0f1e35' }}>
              <h3
                className="font-serif font-medium text-cream"
                style={{ fontSize: '26px', margin: '0 0 20px' }}
              >
                \u041E\u0444\u0438\u0441 \u043A\u043E\u043D\u0442\u043E\u0440\u044B
              </h3>
              {[
                {
                  k: '\u0410\u0434\u0440\u0435\u0441',
                  v: notary.addressParts.streetAddress + ', ' + notary.addressParts.addressLocality,
                },
                {
                  k: '\u0422\u0435\u043B.',
                  v: notary.phone,
                  href: notary.phoneHref,
                },
                {
                  k: '\u0427\u0430\u0441\u044B',
                  v: weekdayHours + '\n' + fridayHours + '\n' + weekendHours,
                },
                {
                  k: 'Email',
                  v: notary.email,
                  href: `mailto:${notary.email}`,
                },
              ].map(row => (
                <div
                  key={row.k}
                  className="flex gap-3 py-3.5"
                  style={{ borderTop: '1px solid rgba(184,154,90,0.08)' }}
                >
                  <div
                    className="font-mono text-[10px] tracking-[0.2em] uppercase pt-0.5 flex-shrink-0"
                    style={{ color: 'rgba(184,154,90,0.70)', minWidth: '72px' }}
                  >
                    {row.k}
                  </div>
                  <div className="text-cream text-[14px] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                    {row.href ? (
                      <a href={row.href} className="text-cream hover:text-gold-light transition-colors no-underline">
                        {row.v}
                      </a>
                    ) : (
                      row.v
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map column */}
            <div className="relative" style={{ minHeight: '380px', background: '#0a1628' }}>
              <iframe
                src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'invert(0.85) hue-rotate(180deg)', border: 'none', display: 'block' }}
                title="\u041A\u0430\u0440\u0442\u0430"
              />
            </div>

            {/* Portrait column */}
            <div
              className="relative flex flex-col items-center justify-center text-center"
              style={{ padding: '32px 24px', background: '#0f1e35', minHeight: '380px' }}
            >
              {/* Corner brackets */}
              {[
                { top: 8, left: 8, borderTop: '1px solid #b89a5a', borderLeft: '1px solid #b89a5a' },
                { top: 8, right: 8, borderTop: '1px solid #b89a5a', borderRight: '1px solid #b89a5a' },
                { bottom: 8, left: 8, borderBottom: '1px solid #b89a5a', borderLeft: '1px solid #b89a5a' },
                { bottom: 8, right: 8, borderBottom: '1px solid #b89a5a', borderRight: '1px solid #b89a5a' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ width: 16, height: 16, position: 'absolute', ...s }}
                  aria-hidden
                />
              ))}

              {/* Silhouette icon */}
              <div className="mb-4" style={{ color: 'rgba(184,154,90,0.15)' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                  <circle cx="32" cy="22" r="10" />
                  <path d="M12 54c2.5-10 10-16 20-16s17.5 6 20 16" />
                </svg>
              </div>

              <p
                className="font-serif font-medium text-gold-light m-0 mb-1.5"
                style={{ fontSize: '19px', lineHeight: '1.2' }}
              >
                {notary.name.split(' ')[0]}<br />
                {notary.name.split(' ').slice(1).join(' ')}
              </p>
              <p
                className="font-mono text-[10px] tracking-[0.22em] uppercase mb-0"
                style={{ color: '#6b7895' }}
              >
                \u041D\u043E\u0442\u0430\u0440\u0438\u0443\u0441 \u00B7 \u041C\u043E\u0441\u043A\u0432\u0430 \u00B7 \u0441 2008
              </p>

              <div
                className="absolute bottom-4 left-0 right-0 text-center font-mono text-[10px] tracking-[0.14em]"
                style={{ color: 'rgba(184,154,90,0.30)' }}
              >
                [ \u0444\u043E\u0442\u043E \u043D\u043E\u0442\u0430\u0440\u0438\u0443\u0441\u0430 ]
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      {/* ── Bottom CTA ── */}
      <section
        className="relative py-20 sm:py-24 md:py-[120px]"
        style={{
          background: '#06101f',
          borderTop: '1px solid rgba(184,154,90,0.10)',
        }}
      >
        {/* Gold grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(184,154,90,0.04) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(184,154,90,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 80%)',
          }}
          aria-hidden
        />

        <div className="relative mx-auto px-5 sm:px-8 md:px-10 text-center" style={{ maxWidth: '780px' }}>
          <div className="inline-flex items-center gap-3.5 mb-6 reveal">
            <span className="block w-6 h-px bg-gold" />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
              \u0413\u043E\u0442\u043E\u0432\u044B \u043F\u043E\u043C\u043E\u0447\u044C
            </span>
            <span className="block w-6 h-px bg-gold" />
          </div>

          <h2
            className="font-serif font-medium text-cream mb-5 reveal"
            style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
          >
            \u0413\u043E\u0442\u043E\u0432\u044B{' '}
            <em className="italic font-normal text-gold">\u0437\u0430\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F?</em>
          </h2>

          <p className="text-slate mb-12 leading-relaxed reveal" style={{ fontSize: '17px' }}>
            \u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u0435, \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0438\u043B\u0438 \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0444\u043E\u0440\u043C\u0443 \u2014 \u0441\u043E\u0433\u043B\u0430\u0441\u0443\u0435\u043C \u0443\u0434\u043E\u0431\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0438 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u0438\u043C \u0432\u0441\u0451 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0435 \u043A \u0432\u0438\u0437\u0438\u0442\u0443.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center reveal">
            <BookingButton />
            <a
              href={notary.phoneHref}
              className="inline-flex items-center gap-2.5 font-sans font-semibold text-[11px] sm:text-[12px] tracking-[0.22em] uppercase px-5 sm:px-8 py-4 sm:py-5 text-cream no-underline transition-colors border hover:text-gold-light hover:border-gold whitespace-nowrap"
              style={{ borderColor: 'rgba(184,154,90,0.35)' }}
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
