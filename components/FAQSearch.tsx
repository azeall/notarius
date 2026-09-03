'use client'
import { useMemo, useState } from 'react'

const FAQS = [
  { q: 'Что такое нотариальное заверение?', a: 'Это удостоверение нотариусом подлинности подписи, верности копии документа или законности сделки. Нотариально заверенные документы имеют повышенную доказательную силу.' },
  { q: 'Сколько стоит доверенность?', a: 'Стоимость складывается из нотариального тарифа и платы за услуги правового и технического характера (УПТХ). Точную сумму назовём при записи — она зависит от вида доверенности.' },
  { q: 'Какие документы взять с собой?', a: 'Обязательно — паспорт. Для конкретного действия могут понадобиться дополнительные документы: свидетельства, выписки, правоустанавливающие документы. Перечень уточним при записи.' },
  { q: 'Нужно ли записываться заранее?', a: 'Рекомендуем записаться через сайт или по телефону — так вы не будете ждать в очереди, а мы заранее подготовим документы.' },
  { q: 'Можно ли оформить завещание в любой момент?', a: 'Да. Завещание составляется лично завещателем при предъявлении паспорта. Его можно изменить или отменить в любое время.' },
  { q: 'Сколько времени занимает приём?', a: 'Простые действия — доверенности, согласия, копии — занимают 15–30 минут. Сделки и наследственные дела требуют больше времени и нескольких визитов.' },
  { q: 'Что такое УПТХ?', a: 'Услуги правового и технического характера: составление проекта документа, консультация, печать, сканирование. Размер УПТХ ежегодно утверждается нотариальной палатой.' },
  { q: 'Делаете ли вы нотариальный перевод?', a: 'Да: нотариус свидетельствует подлинность подписи дипломированного переводчика на переводе документа. Перевод подшивается к оригиналу или копии.' },
  { q: 'Можно ли вызвать нотариуса на дом?', a: 'Да, выезд возможен для маломобильных граждан и в иных уважительных случаях. Стоимость и время выезда согласовываются по телефону.' },
  { q: 'Как оформить наследство?', a: 'Подайте нотариусу заявление о принятии наследства в течение 6 месяцев со дня смерти наследодателя. Понадобятся свидетельство о смерти, документы о родстве и документы на имущество.' },
  { q: 'Нужен ли нотариус при продаже доли в квартире?', a: 'Да, сделки по продаже доли в праве общей собственности постороннему лицу подлежат обязательному нотариальному удостоверению.' },
  { q: 'Принимаете ли вы карты?', a: 'Да, оплатить услуги можно наличными или банковской картой непосредственно в конторе.' },
]

export default function FAQSearch() {
  const [open, setOpen] = useState<number | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return FAQS
    return FAQS.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }, [query])

  return (
    <section className="py-12 sm:py-16" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
      <div className="wrap">
        <div className="mb-8 reveal">
          <div className="inline-flex items-center gap-3.5 mb-4">
            <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgb(var(--violet-rgb) / 0.75)' }}>
              Вопросы и ответы
            </span>
          </div>
          <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'rgb(var(--text-rgb))' }}>
            Частые <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>вопросы</em>
          </h2>
        </div>

        {/* Live-поиск */}
        <div className="relative max-w-[560px] mb-8 reveal">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'rgb(var(--text-rgb) / 0.35)' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по вопросам…"
            className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none"
            style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.25)', color: 'rgb(var(--text-rgb))' }}
          />
          {query && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'rgb(var(--muted-rgb))' }}>
              {filtered.length} из {FAQS.length}
            </span>
          )}
        </div>

        {/* Аккордеон */}
        {filtered.length === 0 ? (
          <p className="py-10 text-center" style={{ color: 'rgb(var(--muted-rgb))' }}>
            Ничего не найдено. Попробуйте другой запрос или{' '}
            <a href="/contacts" className="underline underline-offset-2" style={{ color: 'rgb(var(--violet-rgb))' }}>задайте вопрос нам напрямую</a>.
          </p>
        ) : (
          <div className="max-w-[860px]">
            {filtered.map((faq, i) => {
              const isOpen = open === i
              return (
                <div
                  key={faq.q}
                  style={{
                    borderTop: '1px solid rgb(var(--violet-rgb) / 0.15)',
                    ...(i === filtered.length - 1 ? { borderBottom: '1px solid rgb(var(--violet-rgb) / 0.15)' } : {}),
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left py-5"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-[17px] sm:text-[19px] leading-snug" style={{ color: isOpen ? 'rgb(var(--violet-rgb))' : 'rgb(var(--text-rgb))' }}>
                      {faq.q}
                    </span>
                    <span
                      className="w-8 h-8 grid place-items-center flex-shrink-0 rounded-full transition-transform duration-300"
                      style={{
                        border: '1px solid rgb(var(--violet-rgb) / 0.35)',
                        color: 'rgb(var(--violet-rgb))',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        background: isOpen ? 'rgb(var(--violet-rgb) / 0.08)' : 'transparent',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '400px' : '0' }}>
                    <p className="pb-5 text-[14px] sm:text-[15px] leading-relaxed m-0" style={{ color: 'rgb(var(--muted-rgb))', maxWidth: '780px' }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
