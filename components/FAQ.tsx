'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Нужно ли записываться заранее?',
    a: 'Рекомендуем записываться заранее через форму на сайте или по телефону — это гарантирует удобное время без ожидания. Приём без записи возможен при наличии свободных мест.',
  },
  {
    q: 'Какие документы нужно взять с собой?',
    a: 'Обязательно — паспорт гражданина РФ. Для конкретных действий могут потребоваться дополнительные документы: свидетельства о праве собственности, ИНН, СНИЛС и др. Уточните полный список при записи.',
  },
  {
    q: 'Как долго оформляются документы?',
    a: 'Большинство нотариальных действий — доверенности, согласия, заверение копий — занимают 15–30 минут. Сделки с недвижимостью и оформление наследства требуют предварительной подготовки и могут занять несколько визитов.',
  },
  {
    q: 'Какова стоимость нотариальных услуг?',
    a: 'Стоимость складывается из государственной пошлины (тарифа), установленной законодательством, и платы за услуги правового и технического характера (УПТХ). Точную стоимость можно узнать на странице «Тарифы» или по телефону.',
  },
  {
    q: 'Можно ли оформить доверенность без присутствия доверенного лица?',
    a: 'Да. Для выдачи доверенности достаточно присутствия только доверителя (того, кто выдаёт доверенность). Данные доверенного лица указываются по копии его паспорта.',
  },
  {
    q: 'Работаете ли вы с юридическими лицами?',
    a: 'Да, мы оказываем полный спектр нотариальных услуг для организаций: удостоверение уставов, протоколов, доверенностей от юрлиц, свидетельствование подписей и другие корпоративные нотариальные действия.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Left-aligned header */}
        <div className="mb-10">
          <p className="text-gold uppercase tracking-[0.18em] text-xs font-semibold mb-2">Вопросы и ответы</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">Часто задаваемые вопросы</h2>
        </div>

        {/* Divider-style list — no card boxes */}
        <div className="divide-y divide-gray-100">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-navy text-sm pr-6 group-hover:text-gold transition-colors duration-200">
                  {faq.q}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 group-hover:border-gold/50 flex items-center justify-center transition-all duration-200 ${open === i ? 'bg-gold border-gold' : ''}`}
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${open === i ? 'rotate-180 text-navy' : 'text-gray-400 group-hover:text-gold'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {/* Smooth max-height transition — no Framer Motion needed */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-64' : 'max-h-0'}`}
              >
                <p className="text-gray-500 text-sm leading-relaxed pb-5 pr-10">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
