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

          {/* 2-column card: info | map */}
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
                title="Карта"
              />
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
