import type { Metadata } from 'next'
import BookingButton from '@/components/BookingButton'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Нотариальные услуги в Москве',
  description:
    'Полный перечень нотариальных услуг: удостоверение сделок с недвижимостью, оформление наследства и завещаний, доверенности, заверение копий документов, брачные договоры, нотариальный перевод и апостиль.',
  keywords: [
    'нотариальные услуги Москва',
    'удостоверение сделок с недвижимостью',
    'оформление наследства',
    'доверенность у нотариуса',
    'заверение копий',
    'брачный договор',
    'нотариальный перевод',
    'апостиль',
  ],
  alternates: { canonical: '/services' },
}

const SERVICES = [
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    title: 'Наследство и завещания',
    desc: 'Юридически безопасное оформление прав на наследство и составление завещаний.',
    items: [
      'Составление и удостоверение завещаний',
      'Выдача свидетельств о праве на наследство',
      'Принятие мер по охране наследственного имущества',
      'Ведение наследственных дел',
      'Удостоверение отказа от наследства',
    ],
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    title: 'Сделки с недвижимостью',
    desc: 'Нотариальное удостоверение сделок с квартирами, домами, земельными участками.',
    items: [
      'Договоры купли-продажи недвижимости',
      'Договоры дарения',
      'Договоры ренты и пожизненного содержания',
      'Ипотечные договоры',
      'Соглашения о разделе имущества',
    ],
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
    title: 'Доверенности',
    desc: 'Оформление любых видов доверенностей на представление интересов.',
    items: [
      'Генеральные доверенности',
      'Доверенности на продажу и покупку недвижимости',
      'Доверенности на автомобиль',
      'Доверенности для действий за рубежом',
      'Отмена доверенностей',
    ],
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    title: 'Заверение копий и подписей',
    desc: 'Свидетельствование верности копий документов и подлинности подписей.',
    items: [
      'Верность копий документов и выписок',
      'Свидетельствование подлинности подписи',
      'Заверение переводов документов',
      'Подпись на банковских карточках',
      'Копии судебных решений и архивных документов',
    ],
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    title: 'Семейные и брачные договоры',
    desc: 'Правовая защита имущественных интересов супругов.',
    items: [
      'Брачные договоры',
      'Соглашения о разделе совместно нажитого имущества',
      'Согласие супруга на совершение сделок',
      'Согласие на выезд ребёнка за рубеж',
      'Соглашения об уплате алиментов',
    ],
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />,
    title: 'Нотариальный перевод и апостиль',
    desc: 'Легализация документов для применения за рубежом.',
    items: [
      'Свидетельствование верности перевода',
      'Апостиль на российские документы',
      'Перевод паспортов и дипломов',
      'Нотариальное заверение копий для иностранных организаций',
    ],
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    title: 'Корпоративные нотариальные действия',
    desc: 'Нотариальное сопровождение бизнеса и юридических лиц.',
    items: [
      'Удостоверение учредительных документов',
      'Свидетельствование подписи на заявлениях в ИФНС',
      'Протоколы общих собраний',
      'Доверенности от юридических лиц',
      'Корпоративные договоры и соглашения',
    ],
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    title: 'Прочие нотариальные действия',
    desc: 'Специализированные нотариальные услуги по запросу.',
    items: [
      'Обеспечение доказательств',
      'Хранение документов и ценных бумаг',
      'Принятие денег и ценных бумаг в депозит',
      'Морской протест',
      'Удостоверение времени предъявления документа',
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Нотариальная контора</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Услуги</h1>
          <p className="text-gray-300 max-w-xl">
            Полный спектр нотариальных действий для физических и юридических лиц в соответствии с законодательством РФ
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map(s => (
              <div key={s.title} className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-5 h-5 text-navy group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {s.icon}
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-navy text-lg leading-snug">{s.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 pl-14">
                  {s.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="font-serif text-2xl font-bold text-navy mb-3">Не нашли нужную услугу?</h2>
          <p className="text-gray-500 mb-6 text-sm">Свяжитесь с нами — мы проконсультируем и поможем с любым нотариальным вопросом</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <Link href="/prices" className="border border-navy/20 text-navy font-semibold px-8 py-3 rounded-lg hover:border-gold hover:text-gold transition-all text-sm">
              Тарифы и цены →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
