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
    a: 'Стоимость складывается из государственной пошлины (тарифа), установленной законодательством, и платы за услуги правового и технического характера (УПТХ). Точную стоимость можно узнать на странице «Услуги и тарифы» или по телефону.',
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
        <div className="text-center mb-12">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Вопросы и ответы</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">Часто задаваемые вопросы</h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-navy text-sm pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
