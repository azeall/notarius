'use client'
import Link from 'next/link'

const SERVICES = [
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    title: 'Наследство и завещания',
    text: 'Оформление завещаний, свидетельств о праве на наследство',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    title: 'Сделки с недвижимостью',
    text: 'Купля-продажа, дарение, ипотека, удостоверение договоров',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
    title: 'Доверенности',
    text: 'Генеральные доверенности, на автомобиль, представление интересов',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    title: 'Копии и верность',
    text: 'Нотариальные копии документов, выписок, право на списание',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    title: 'Брачный договор',
    text: 'Составление и удостоверение брачных договоров, соглашений о разделе имущества',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    title: 'Корпоративные услуги',
    text: 'Нотариально удостоверённые согласия на совершение сделок',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />,
    title: 'Нотариальный перевод',
    text: 'Свидетельствование подлинности перевода документов, апостиль',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    title: 'Нотариальные действия',
    text: 'Обеспечение доказательств, хранение документов, морское дело',
  },
]

export default function ServicesGrid() {
  return (
    <section className="bg-navy-dark relative py-20 sm:py-24 md:py-[120px]">
      {/* Gold grid background */}
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
        {/* Section header */}
        <div className="flex items-end justify-between mb-10 sm:mb-16 gap-6 sm:gap-10 flex-wrap reveal">
          <div>
            <div className="inline-flex items-center gap-3.5 mb-5">
              <span className="block w-6 h-px bg-gold flex-shrink-0" />
              <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
                Что мы предоставляем
              </span>
            </div>
            <h2
              className="font-serif font-medium text-cream"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em', margin: 0 }}
            >
              Нотариальные <em className="italic font-normal text-gold">услуги</em>
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.22em] uppercase text-gold no-underline pb-1 transition-colors hover:text-gold-light"
            style={{ borderBottom: '1px solid rgba(184,154,90,0.30)' }}
          >
            Все услуги
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 gap-3">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="group flex items-start gap-4 sm:gap-5 cursor-pointer transition-all duration-250 reveal p-5 sm:p-7"
              style={{
                border: '1px solid rgba(184,154,90,0.15)',
                borderLeft: '2px solid transparent',
                borderRadius: '16px',
                animationDelay: `${i * 40}ms`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderLeftColor = '#b89a5a'
                el.style.background = '#0f1e35'
                el.style.transform = 'translateX(2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderLeftColor = 'transparent'
                el.style.background = 'transparent'
                el.style.transform = 'translateX(0)'
              }}
            >
              <div
                className="w-12 h-12 flex-shrink-0 grid place-items-center rounded-[10px] text-gold"
                style={{ background: 'rgba(184,154,90,0.08)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {s.icon}
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-medium text-cream mb-2" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                  {s.title}
                </h3>
                <p className="text-[14px] text-slate leading-relaxed m-0">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 md:hidden text-center">
          <Link href="/services" className="text-gold text-sm tracking-[0.12em] uppercase no-underline hover:text-gold-light">
            Все услуги →
          </Link>
        </div>
      </div>
    </section>
  )
}
