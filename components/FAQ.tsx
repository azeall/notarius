'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Нужно ли записываться заранее?',
    a: 'Рекомендуем записываться заранее через сайт или по телефону — это гарантирует удобное время для посещения. При записи мы сможем сообщить, какие документы необходимо взять с собой.',
  },
  {
    q: 'Какие документы нужно взять с собой?',
    a: 'Обязательно — паспорт гражданина РФ. Для конкретного действия может потребоваться дополнительный перечень документов: свидетельства о праве собственности, ИНН, СНИЛС и пр. Точный список при записи.',
  },
  {
    q: 'Как долго оформляются документы?',
    a: 'Большинство нотариальных действий — доверенности, согласия, заявления — занимают 15–30 минут. Сделки с недвижимостью и оформление наследства требуют предварительной подготовки и займут несколько посещений.',
  },
  {
    q: 'Сколько стоят нотариальные услуги?',
    a: 'Стоимость складывается из государственной пошлины (тарифа), установленной Правительством, и услуг правового и технического характера (УПТХ). Полную стоимость можно узнать на странице «Цены» или по телефону.',
  },
  {
    q: 'Можно ли оформить доверенность без присутствия второй стороны?',
    a: 'Да. Для выдачи доверенности присутствует только доверитель (тот, кто её выдаёт). Лицо, указанное в доверенности, не требует явки.',
  },
  {
    q: 'Работаете ли вы с юридическими лицами?',
    a: 'Да, мы оказываем полный спектр нотариальных услуг для организаций: удостоверение уставов, протоколов, доверенностей от ЮЛ, свидетельствование верности копий и другие корпоративные нотариальные действия.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-navy-dark" style={{ padding: '120px 0' }}>
      <div className="mx-auto px-10" style={{ maxWidth: '1340px' }}>

        <div className="mb-16 reveal">
          <div className="inline-flex items-center gap-3.5 mb-5">
            <span className="block w-6 h-px bg-gold flex-shrink-0" />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
              Вопросы и ответы
            </span>
          </div>
          <h2
            className="font-serif font-medium text-cream"
            style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em', margin: 0 }}
          >
            Часто задаваемые <em className="italic font-normal text-gold">вопросы</em>
          </h2>
        </div>

        <div className="max-w-[860px]">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                borderTop: '1px solid rgba(184,154,90,0.10)',
                ...(i === FAQS.length - 1 ? { borderBottom: '1px solid rgba(184,154,90,0.10)' } : {}),
                animationDelay: `${i * 60}ms`,
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 text-left transition-colors duration-200"
                style={{ padding: '28px 0', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-expanded={open === i}
              >
                <span
                  className="font-serif text-cream text-[20px] leading-snug"
                  style={{ color: open === i ? '#d4b978' : '#f0ece4', transition: 'color .2s' }}
                >
                  {faq.q}
                </span>
                <span
                  className="w-9 h-9 grid place-items-center flex-shrink-0 rounded-full transition-all duration-300"
                  style={{
                    border: '1px solid rgba(184,154,90,0.30)',
                    color: '#b89a5a',
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    background: open === i ? 'rgba(184,154,90,0.10)' : 'transparent',
                    borderColor: open === i ? '#b89a5a' : 'rgba(184,154,90,0.30)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? '320px' : '0' }}
              >
                <p
                  className="text-slate leading-relaxed"
                  style={{ paddingBottom: '28px', fontSize: '15px', lineHeight: '1.75', maxWidth: '820px' }}
                >
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
