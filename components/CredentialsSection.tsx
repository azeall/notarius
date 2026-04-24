'use client'
import Link from 'next/link'

const CREDS = [
  {
    icon: (
      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M11 1.5 2 4.5v7c0 5.5 3.8 9.8 9 11.5 5.2-1.7 9-6 9-11.5v-7L11 1.5Z" />
        <path d="m7 11.5 3 3 5-5.5" strokeWidth="1.6" />
      </svg>
    ),
    code: 'Приказ № 77-ч',
    title: 'Назначение нотариусом',
    meta: '14.03.2008 · Минюст РФ',
    badge: 'Действующее',
  },
  {
    icon: (
      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M11 1.5 2 4.5v7c0 5.5 3.8 9.8 9 11.5 5.2-1.7 9-6 9-11.5v-7L11 1.5Z" />
        <path d="M11 7v9M7 11h8M6 14h4M12 14h4" strokeWidth="1.3" />
      </svg>
    ),
    code: 'МГНП · Рег. 1842',
    title: 'Член Московской палаты',
    meta: 'с 21.04.2009',
    badge: 'Активное',
  },
  {
    icon: (
      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="11" cy="8" r="4.5" />
        <path d="M3.5 22c1.5-4 4.3-6 7.5-6s6 2 7.5 6" />
      </svg>
    ),
    code: 'МГУ им. Ломоносова',
    title: 'Диплом юридического факультета',
    meta: 'с отличием · 2002',
    badge: 'Верифицировано',
  },
  {
    icon: (
      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="4" width="16" height="16" rx="2" />
        <path d="M7 4v16M15 4v16M3 12h16" strokeWidth="1.2" />
      </svg>
    ),
    code: 'Страховая сумма',
    title: 'Проф. ответственность',
    meta: '5\u00A0000\u00A0000 ₽ · ВСК',
    badge: 'Полис 2026',
  },
]

export default function CredentialsSection() {
  return (
    <section
      className="relative py-20 sm:py-[120px] overflow-hidden"
      style={{ background: '#06101f' }}
    >
      {/* Gold grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(184,154,90,0.05) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(184,154,90,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 100% 80% at 50% 50%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 50% 50%, black 30%, transparent 85%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1340px' }}>
        {/* Header */}
        <div className="flex items-end justify-between gap-10 mb-16 flex-wrap reveal">
          <div>
            <div className="inline-flex items-center gap-3.5 mb-5">
              <span className="block w-6 h-px bg-gold flex-shrink-0" />
              <span
                className="text-[11px] tracking-[0.32em] uppercase"
                style={{ color: 'rgba(184,154,90,0.70)' }}
              >
                Документы и членство
              </span>
            </div>
            <h2
              className="font-serif font-medium text-cream m-0"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
            >
              Подтверждённые{' '}
              <em className="italic font-normal text-gold">
                полномочия
              </em>
            </h2>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.22em] uppercase text-gold no-underline pb-1 transition-colors hover:text-gold-light flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(184,154,90,0.30)' }}
          >
            О нотариусе
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 4 credential cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {CREDS.map((c, i) => (
            <div
              key={c.code}
              className="relative reveal border border-gold/15 rounded-[14px] transition-all duration-300 hover:border-gold/40 hover:-translate-y-0.5"
              style={{
                padding: '22px',
                background: '#0f1e35',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="w-10 h-10 grid place-items-center text-gold mb-3.5"
                style={{ background: 'radial-gradient(circle, rgba(184,154,90,0.18), transparent 70%)' }}
              >
                {c.icon}
              </div>
              <div
                className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1.5"
                style={{ color: 'rgba(184,154,90,0.70)' }}
              >
                {c.code}
              </div>
              <h4
                className="font-serif font-medium text-cream m-0 mb-2"
                style={{ fontSize: '17px', lineHeight: '1.25' }}
              >
                {c.title}
              </h4>
              <div className="text-[12px] text-slate mb-3 font-mono">{c.meta}</div>
              <div
                className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.18em] uppercase font-semibold font-mono"
                style={{ color: '#4ade80' }}
              >
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {c.badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
