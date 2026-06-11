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
    docsGroups: [
      {
        label: 'Для оформления завещания',
        docs: [
          'Паспорт завещателя',
          'Паспортные данные каждого наследника (ФИО, дата рождения, адрес регистрации)',
          'Документы на имущество — желательно, для точного указания в тексте завещания',
        ],
      },
      {
        label: 'Для получения свидетельства о праве на наследство',
        docs: [
          'Паспорт наследника',
          'Свидетельство о смерти наследодателя',
          'Справка о последнем месте регистрации умершего (форма № 9 / выписка из домовой книги)',
          'Документы, подтверждающие родство: свидетельство о рождении, браке, усыновлении — либо завещание',
          'Правоустанавливающие документы на наследуемое имущество (выписка из ЕГРН, ПТС, договор и т.д.)',
        ],
      },
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
    docsGroups: [
      {
        label: 'Документы для всех участников сделки',
        docs: [
          'Паспорта всех сторон сделки (продавцов, покупателей, одаряемых)',
          'ИНН (при наличии)',
        ],
      },
      {
        label: 'Документы на объект недвижимости',
        docs: [
          'Выписка из ЕГРН на объект — актуальная (нотариус может запросить самостоятельно)',
          'Правоустанавливающий документ: договор купли-продажи, дарения, мены, свидетельство о праве на наследство, решение суда и т.п.',
          'Технический / кадастровый паспорт (при необходимости)',
        ],
      },
      {
        label: 'Дополнительные документы',
        docs: [
          'Нотариальное согласие супруга продавца на отчуждение — если имущество приобреталось в браке',
          'Свидетельство о браке или расторжении брака',
          'Разрешение органа опеки — если среди собственников есть несовершеннолетние или недееспособные',
        ],
      },
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
    docsGroups: [
      {
        label: 'От физического лица',
        docs: [
          'Паспорт доверителя (явка обязательна)',
          'Паспортные данные представителя: ФИО, дата и место рождения, адрес регистрации — личная явка представителя не нужна',
          'Для доверенности на недвижимость — адрес и кадастровый номер объекта',
          'Для доверенности на автомобиль — VIN, марка, модель, гос. номер, ПТС',
        ],
      },
      {
        label: 'От юридического лица',
        docs: [
          'Паспорт руководителя (подписанта)',
          'Устав организации',
          'Свидетельство ОГРН и ИНН',
          'Протокол / решение об избрании руководителя',
          'Выписка из ЕГРЮЛ (актуальная, не старше 30 дней)',
          'Печать организации (при наличии)',
        ],
      },
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
    docsGroups: [
      {
        label: 'Для свидетельствования верности копии',
        docs: [
          'Паспорт заявителя',
          'Подлинник документа, с которого снимается копия (копия должна быть чёткой, без исправлений)',
        ],
      },
      {
        label: 'Для свидетельствования подлинности подписи',
        docs: [
          'Паспорт лица, чья подпись удостоверяется (личная явка обязательна)',
          'Документ, на котором ставится подпись (бланк заявления, карточка банка и т.п.)',
        ],
      },
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
    docsGroups: [
      {
        label: 'Для брачного договора и соглашений о разделе имущества',
        docs: [
          'Паспорта обоих супругов (явка обоих обязательна)',
          'Свидетельство о заключении брака',
          'Правоустанавливающие документы на имущество, режим которого определяется договором (выписка из ЕГРН, ПТС, банковские документы и т.д.)',
          'СНИЛС супругов (по запросу нотариуса)',
        ],
      },
      {
        label: 'Для согласия супруга на сделку',
        docs: [
          'Паспорт супруга, дающего согласие (личная явка)',
          'Свидетельство о заключении брака',
          'Данные об объекте сделки (адрес, кадастровый номер или ПТС)',
        ],
      },
      {
        label: 'Для согласия на выезд ребёнка за рубеж',
        docs: [
          'Паспорт родителя, дающего согласие',
          'Свидетельство о рождении ребёнка',
          'Паспорт или свидетельство о рождении ребёнка (для указания данных)',
          'Сведения о стране назначения и сопровождающем лице',
        ],
      },
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
    docsGroups: [
      {
        label: 'Для свидетельствования верности перевода',
        docs: [
          'Паспорт заявителя',
          'Оригинал документа на иностранном языке (либо нотариальная копия)',
          'Готовый текст перевода, выполненного дипломированным переводчиком (нотариус удостоверяет подпись переводчика, а не качество перевода)',
        ],
      },
      {
        label: 'Для проставления апостиля',
        docs: [
          'Паспорт заявителя',
          'Оригинал документа, на котором проставляется апостиль (диплом, свидетельство, выписка и т.д.)',
          'Апостиль проставляется нотариусом только на нотариально удостоверенные документы; на государственные документы (дипломы, свидетельства ЗАГС) — через соответствующие органы',
        ],
      },
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
    docsGroups: [
      {
        label: 'Общий пакет для юридического лица',
        docs: [
          'Паспорт руководителя (или иного уполномоченного лица)',
          'Устав организации (действующая редакция)',
          'Свидетельство о государственной регистрации (ОГРН)',
          'Свидетельство о постановке на учёт в налоговом органе (ИНН)',
          'Выписка из ЕГРЮЛ — актуальная, не старше 30 дней',
          'Протокол (решение) об избрании / назначении руководителя',
          'Печать организации (при наличии)',
        ],
      },
      {
        label: 'Для свидетельствования подписи на заявлении в ИФНС (формы Р11001, Р13014 и др.)',
        docs: [
          'Заполненная форма заявления',
          'Полный пакет документов юридического лица (см. выше)',
          'Личная явка заявителя-подписанта обязательна',
        ],
      },
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
    docsGroups: [
      {
        label: 'Базовые документы',
        docs: [
          'Паспорт заявителя',
          'Документы, относящиеся к конкретному нотариальному действию (уточняются при записи)',
        ],
      },
      {
        label: 'Для принятия в депозит денежных средств',
        docs: [
          'Паспорт должника (вносителя)',
          'Документ, подтверждающий обязательство (договор, решение суда и т.п.)',
          'Реквизиты кредитора для перечисления средств',
        ],
      },
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <section className="relative bg-navy text-cream overflow-hidden">
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
          <p className="text-slate max-w-xl">
            Полный спектр нотариальных действий для физических и юридических лиц в соответствии с законодательством РФ
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="bg-navy-dark">
        <div className="max-w-6xl mx-auto px-4 py-16">

          {/* Prep banner */}
          <Link
            href="/visit"
            className="group flex items-center gap-4 sm:gap-5 mb-8 rounded-2xl p-5 sm:p-6 transition-all overflow-hidden relative hover:-translate-y-0.5"
            style={{ background: '#ffffff', border: '1px solid rgba(83,74,183,0.25)' }}
          >
            <span className="w-12 h-12 rounded-xl bg-gold/15 grid place-items-center flex-shrink-0 text-gold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-cream text-lg leading-snug">Интерактивный чек-лист документов</h3>
              <p className="text-slate text-sm mt-0.5">Отметьте, что уже собрали, и распечатайте список перед визитом</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gold flex-shrink-0">
              Открыть
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map(s => (
              <div
                key={s.title}
                className="rounded-2xl p-6 transition-all group flex flex-col hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid rgba(83,74,183,0.15)' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg grid place-items-center flex-shrink-0 transition-colors text-gold" style={{ background: 'rgba(83,74,183,0.10)' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {s.icon}
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-cream text-lg leading-snug">{s.title}</h2>
                    <p className="text-slate text-sm mt-1">{s.desc}</p>
                  </div>
                </div>

                {/* Sub-services */}
                <ul className="space-y-1.5 pl-14 mb-5">
                  {s.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Documents accordion */}
                <details className="group/details mt-auto pt-4" style={{ borderTop: '1px solid rgba(83,74,183,0.12)' }}>
                  <summary className="flex items-center gap-2 cursor-pointer select-none text-sm font-semibold text-cream/80 hover:text-cream list-none transition-colors">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-gold transition-transform duration-200 group-open/details:rotate-90"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Необходимые документы
                  </summary>

                  <div className="mt-3 space-y-4">
                    {s.docsGroups.map(group => (
                      <div key={group.label}>
                        <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-2">{group.label}</p>
                        <ul className="space-y-1.5">
                          {group.docs.map(doc => (
                            <li key={doc} className="flex items-start gap-2 text-sm text-slate">
                              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <Link
                      href="/visit"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light transition-colors pt-1"
                    >
                      Открыть в чек-листе
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy border-t" style={{ borderColor: 'rgba(83,74,183,0.12)' }}>
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="font-serif text-2xl font-bold text-cream mb-3">Не нашли нужную услугу?</h2>
          <p className="text-slate mb-6 text-sm">Свяжитесь с нами — мы проконсультируем и поможем с любым нотариальным вопросом</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <Link href="/visit" className="border text-cream font-semibold px-8 py-3 rounded-lg hover:border-gold hover:text-gold transition-all text-sm" style={{ borderColor: 'rgba(83,74,183,0.35)' }}>
              Подготовка к визиту →
            </Link>
            <Link href="/prices" className="border text-cream font-semibold px-8 py-3 rounded-lg hover:border-gold hover:text-gold transition-all text-sm" style={{ borderColor: 'rgba(83,74,183,0.35)' }}>
              Тарифы и цены →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
