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
    title: 'Заверение копий',
    text: 'Верность копий документов, выписок, справок любой сложности',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    title: 'Брачный договор',
    text: 'Составление и удостоверение брачных договоров, соглашений о разделе имущества',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    title: 'Согласие супруга',
    text: 'Нотариально удостоверенное согласие на совершение сделок',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />,
    title: 'Нотариальный перевод',
    text: 'Свидетельствование верности перевода документов, апостиль',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    title: 'Нотариальные действия',
    text: 'Обеспечение доказательств, хранение документов, морской протест',
  },
]

export default function ServicesGrid() {
  return (
    <section className="bg-gray-50/60">
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Left-aligned header with CTA right — variance 8 anti-center */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-gold uppercase tracking-[0.18em] text-xs font-semibold mb-2">Чем мы занимаемся</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">Нотариальные услуги</h2>
          </div>
          <Link
            href="/services"
            className="hidden md:inline-flex items-center gap-1.5 text-gold font-semibold text-sm hover:underline underline-offset-4 flex-shrink-0"
          >
            Все услуги
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* 2-column horizontal-layout cards */}
        <div className="grid md:grid-cols-2 gap-3">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="group flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100/80
                         hover:border-l-[3px] hover:border-l-gold hover:border-gray-100/80 hover:shadow-sm
                         transition-all duration-300 cursor-default animate-fade-in-up"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-navy/[0.06] group-hover:bg-gold/10 flex items-center justify-center flex-shrink-0 transition-colors duration-200 mt-0.5">
                <svg className="w-5 h-5 text-navy/70 group-hover:text-gold transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {s.icon}
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-navy text-sm mb-1.5 leading-snug">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 md:hidden text-center">
          <Link href="/services" className="text-gold font-semibold text-sm hover:underline">
            Все услуги →
          </Link>
        </div>

      </div>
    </section>
  )
}
