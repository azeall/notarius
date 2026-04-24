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
  title: 'Нотариус в Москве · Запись на приём онлайн',
  description:
    'Нотариальная контора в Москве. Удостоверение сделок, наследство, доверенности, брачные договоры, заверение копий. Запись онлайн, гибкие часы.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    title: `Нотариус ${notary.name} · Москва`,
    description: site.description,
  },
}

export default function HomePage() {
  const weekdayHours = 'Пн–Чт 10:00–19:00'
  const fridayHours = 'Пт 10:00–13:00 / 14:00–18:00'
  const weekendHours = 'Сб, Вс — выходной'

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
                  Адрес и контакты
                </span>
              </div>
              <h2
                className="font-serif font-medium text-cream m-0"
                style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
              >
                Как нас{' '}
                <em className="italic font-normal text-gold">найти</em>
              </h2>
            </div>
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.22em] uppercase text-gold no-underline pb-1 transition-colors hover:text-gold-light flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(184,154,90,0.30)' }}
            >
              Контакты
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* 2-column card: info | decorative map */}
          <div
            className="reveal grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] overflow-hidden rounded-2xl"
            style={{ border: '1px solid rgba(184,154,90,0.15)', background: 'rgba(184,154,90,0.12)' }}
          >
            {/* Info column */}
            <div style={{ padding: '44px 40px', background: '#0f1e35' }}>
              <h3
                className="font-serif font-medium text-cream"
                style={{ fontSize: '26px', margin: '0 0 20px' }}
              >
                Офис конторы
              </h3>
              {[
                {
                  k: 'Адрес',
                  v: notary.addressParts.streetAddress + ', ' + notary.addressParts.addressLocality,
                },
                {
                  k: 'Тел.',
                  v: notary.phone,
                  href: notary.phoneHref,
                },
                {
                  k: 'Часы',
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

            {/* Decorative map column — pulsing dot marker */}
            <div
              className="relative flex items-center justify-center"
              style={{ minHeight: '380px', background: '#07111f' }}
            >
              {/* Grid texture */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(184,154,90,0.04) 1px, transparent 1px),' +
                    'linear-gradient(90deg, rgba(184,154,90,0.04) 1px, transparent 1px)',
                  backgroundSize: '44px 44px',
                }}
                aria-hidden
              />

              {/* Horizontal boulevard */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '50%', left: 0, right: 0,
                  height: '14px',
                  marginTop: '-7px',
                  background: 'rgba(184,154,90,0.04)',
                  borderTop: '1px solid rgba(184,154,90,0.08)',
                  borderBottom: '1px solid rgba(184,154,90,0.08)',
                }}
                aria-hidden
              />
              {/* Vertical street */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: '40%', top: 0, bottom: 0,
                  width: '10px',
                  background: 'rgba(184,154,90,0.03)',
                  borderLeft: '1px solid rgba(184,154,90,0.07)',
                  borderRight: '1px solid rgba(184,154,90,0.07)',
                }}
                aria-hidden
              />

              {/* Outer slow pulse ring */}
              <div
                className="absolute pointer-events-none"
                style={{ width: 84, height: 84 }}
                aria-hidden
              >
                <span
                  className="block w-full h-full rounded-full animate-ping"
                  style={{
                    background: 'rgba(184,154,90,0.06)',
                    animationDuration: '2.4s',
                    animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
                  }}
                />
              </div>
              {/* Inner faster pulse ring */}
              <div
                className="absolute pointer-events-none"
                style={{ width: 52, height: 52 }}
                aria-hidden
              >
                <span
                  className="block w-full h-full rounded-full animate-ping"
                  style={{
                    background: 'rgba(184,154,90,0.09)',
                    animationDuration: '2.4s',
                    animationDelay: '0.6s',
                    animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
                  }}
                />
              </div>

              {/* Static ring */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{ width: 38, height: 38, border: '1px solid rgba(184,154,90,0.28)' }}
                aria-hidden
              />

              {/* Center dot */}
              <div
                className="absolute rounded-full z-10"
                style={{
                  width: 10, height: 10,
                  background: '#b89a5a',
                  boxShadow: '0 0 0 3px rgba(184,154,90,0.15), 0 0 18px rgba(184,154,90,0.55)',
                }}
              />

              {/* Connector line + street label */}
              <div
                className="absolute flex items-center gap-3 pointer-events-none"
                style={{ left: 'calc(50% + 14px)' }}
                aria-hidden
              >
                <div className="w-5 h-px flex-shrink-0" style={{ background: 'rgba(184,154,90,0.28)' }} />
                <span
                  className="font-mono text-[10px] tracking-[0.26em] uppercase whitespace-nowrap"
                  style={{ color: 'rgba(184,154,90,0.62)' }}
                >
                  {notary.addressParts.streetAddress}
                </span>
              </div>

              {/* Link to full contacts map */}
              <Link
                href="/contacts"
                className="absolute bottom-4 right-5 font-mono text-[10px] tracking-[0.18em] uppercase no-underline transition-colors hover:text-gold"
                style={{ color: 'rgba(184,154,90,0.28)' }}
              >
                открыть карту →
              </Link>
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
              Готовы помочь
            </span>
            <span className="block w-6 h-px bg-gold" />
          </div>

          <h2
            className="font-serif font-medium text-cream mb-5 reveal"
            style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
          >
            Готовы{' '}
            <em className="italic font-normal text-gold">записаться?</em>
          </h2>

          <p className="text-slate mb-12 leading-relaxed reveal" style={{ fontSize: '17px' }}>
            Позвоните, напишите или заполните форму — согласуем удобное время и подготовим всё необходимое к визиту.
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
