'use client'
import { useState } from 'react'
import BookingButton from '@/components/BookingButton'

interface Step { t: string; d: string; meta: string }

const STEPS: Step[] = [
  { t: 'Заявка', d: 'Записываетесь онлайн или по телефону. Подбираем удобное время — без очередей и ожидания.', meta: '5 минут' },
  { t: 'Консультация', d: 'Разбираем вашу ситуацию, называем точный список документов и ориентир по стоимости. Никаких сюрпризов.', meta: 'в день записи' },
  { t: 'Подготовка', d: 'Готовим проект документа заранее, проверяем данные и реквизиты, при необходимости запрашиваем выписки.', meta: '1–3 дня' },
  { t: 'Удостоверение', d: 'Подписание у нотариуса: разъясняем последствия простыми словами и ставим удостоверительную надпись и печать.', meta: 'один визит' },
  { t: 'Выдача', d: 'При необходимости подаём документы в Росреестр электронно. Выдаём готовые экземпляры на руки.', meta: 'сразу / по готовности' },
]

export default function DealTimeline() {
  const [active, setActive] = useState(0)
  const [done, setDone] = useState(false)
  const cur = STEPS[active]
  const last = STEPS.length - 1

  return (
    <section className="py-20 sm:py-24" style={{ background: 'rgb(var(--surface-rgb))' }}>
      <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1000px' }}>
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-3.5 mb-4">
            <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(192,92,46,0.75)' }}>Как всё проходит</span>
            <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
          </div>
          <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 50px)', color: 'rgb(var(--text-rgb))' }}>
            Путь от заявки <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>до документа</em>
          </h2>
          <p className="mt-3 text-[15px]" style={{ color: 'rgb(var(--muted-rgb))' }}>Нажмите на шаг, чтобы узнать подробности</p>
        </div>

        {/* Шаги */}
        <div className="relative mb-9 reveal">
          <span className="absolute left-0 right-0 top-[19px] h-0.5 rounded" style={{ background: 'rgba(192,92,46,0.18)' }} aria-hidden />
          <span
            className="absolute left-0 top-[19px] h-0.5 rounded"
            style={{ background: 'rgb(var(--violet-rgb))', width: `${(done ? 1 : active / last) * 100}%`, transition: 'width .4s cubic-bezier(0.2,0.7,0.2,1)' }}
            aria-hidden
          />
          <div className="relative grid" style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}>
            {STEPS.map((s, i) => {
              const reached = done || i <= active
              return (
                <button key={s.t} onClick={() => { setDone(false); setActive(i) }} className="flex flex-col items-center gap-2 group">
                  <span
                    className="grid place-items-center rounded-full font-mono text-sm font-bold transition-all"
                    style={{
                      width: 40, height: 40,
                      background: reached ? 'rgb(var(--violet-rgb))' : 'rgb(var(--surface-rgb))',
                      color: reached ? '#fff' : 'rgb(var(--muted-c-rgb))',
                      border: `2px solid ${reached ? 'rgb(var(--violet-rgb))' : 'rgba(192,92,46,0.3)'}`,
                      boxShadow: !done && i === active ? '0 0 0 5px rgba(192,92,46,0.16)' : 'none',
                    }}
                  >
                    {done || i < active ? '✓' : i + 1}
                  </span>
                  <span className="text-[11px] sm:text-[13px] font-semibold text-center px-1" style={{ color: i === active ? 'rgb(var(--text-rgb))' : 'rgb(var(--muted-b-rgb))' }}>{s.t}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Детали активного шага */}
        {!done && (
          <div key={active} className="dt-card rounded-2xl p-7 sm:p-9 grid sm:grid-cols-[auto_1fr] gap-6 items-start" style={{ background: 'rgb(var(--bg-rgb))', border: '1px solid rgba(192,92,46,0.16)' }}>
            <div className="font-serif leading-none" style={{ fontSize: 'clamp(56px,9vw,84px)', color: 'rgba(192,92,46,0.22)' }}>0{active + 1}</div>
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h3 className="font-serif m-0" style={{ fontSize: '26px', color: 'rgb(var(--text-rgb))' }}>{cur.t}</h3>
                <span className="text-[11px] font-semibold uppercase tracking-wider rounded-full px-3 py-1" style={{ background: 'rgba(192,92,46,0.12)', color: 'rgb(var(--violet-rgb))' }}>{cur.meta}</span>
              </div>
              <p className="m-0 text-[15.5px] leading-relaxed" style={{ color: 'rgb(var(--text-b-rgb))' }}>{cur.d}</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setActive(a => Math.max(0, a - 1))}
                  disabled={active === 0}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-35"
                  style={{ color: 'rgb(var(--violet-rgb))', border: '1.5px solid rgba(192,92,46,0.25)' }}
                >← Назад</button>
                <button
                  onClick={() => (active === last ? setDone(true) : setActive(a => a + 1))}
                  className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                  style={{ background: 'rgb(var(--violet-rgb))' }}
                >{active === last ? 'Готово ✓' : 'Дальше →'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Финал — путь пройден */}
        {done && (
          <div className="dt-card rounded-2xl p-9 sm:p-12 text-center" style={{ background: 'rgb(var(--bg-rgb))', border: '1px solid rgba(192,92,46,0.16)' }}>
            <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-5" style={{ background: 'rgb(var(--violet-rgb))', boxShadow: '0 12px 30px rgba(192,92,46,0.35)' }}>
              <svg className="w-8 h-8" fill="none" stroke="#fff" strokeWidth={2.4} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-serif m-0 mb-3" style={{ fontSize: 'clamp(26px,3.5vw,38px)', color: 'rgb(var(--text-rgb))' }}>
              Вы прошли <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>весь путь</em>
            </h3>
            <p className="m-0 mx-auto mb-7 text-[15.5px] leading-relaxed" style={{ color: 'rgb(var(--text-b-rgb))', maxWidth: '52ch' }}>
              От заявки до готового документа — мы рядом на каждом шаге. Запишитесь, и пройдём его вместе с самого начала.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <BookingButton />
              <button
                onClick={() => { setDone(false); setActive(0) }}
                className="rounded-xl px-6 py-3 text-sm font-semibold transition-colors"
                style={{ color: 'rgb(var(--violet-rgb))', border: '1.5px solid rgba(192,92,46,0.25)' }}
              >Пройти заново</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference){
          .dt-card{animation:dtIn .45s cubic-bezier(0.2,0.7,0.2,1);}
        }
        @keyframes dtIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
      `}</style>
    </section>
  )
}
