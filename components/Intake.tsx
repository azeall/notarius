'use client'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CASES, caseById } from '@/lib/cases'
import { notary } from '@/lib/data'
import BookingInline from './BookingInline'
import LiveStatus from './LiveStatus'

/**
 * Приём. Человек называет дело — и дальше страница собирает под него папку:
 * что взять, сколько стоит, когда прийти. Всё связанное общим состоянием
 * стоит здесь рядом: дело, отметки в чек-листе и выбранное время. Растаскивать
 * это по контекстам незачем — снаружи состояние никому не нужно.
 */

const LS_KEY = 'warm:bring:v1'

interface Slot { service: string; date: string; time: string; done: boolean }

export default function Intake() {
  const [caseId, setCaseId] = useState<string>(CASES[0].id)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [slot, setSlot] = useState<Slot>({ service: '', date: '', time: '', done: false })
  const [folderOpen, setFolderOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const c = useMemo(() => caseById(caseId), [caseId])
  const key = (docId: string) => `${caseId}:${docId}`
  const doneCount = c.bring.filter(d => checked[key(d.id)]).length
  const pct = Math.round((doneCount / c.bring.length) * 100)

  // Отметки переживают перезагрузку: человек собирает документы не за один
  // присест. В приватном окне localStorage бросает — тогда просто не помним.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch { /* приватное окно — работаем без памяти */ }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(checked)) } catch { /* см. выше */ }
  }, [checked])

  const toggle = (docId: string) =>
    setChecked(prev => ({ ...prev, [key(docId)]: !prev[key(docId)] }))

  const goto = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const accent = 'rgb(var(--violet-rgb))'
  const cardBg = 'rgb(var(--surface-rgb))'
  const rule = 'rgb(var(--violet-rgb) / 0.18)'

  return (
    <>
      {/* ── Первый экран: вопрос и шесть дел ───────────────────────── */}
      <section id="priem" className="pt-9 pb-12 sm:pt-14 sm:pb-14" style={{ background: 'rgb(var(--bg-rgb))' }}>
        <div className="wrap">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-8">
            <span className="text-[11px] tracking-[0.3em] uppercase" style={{ color: 'rgb(var(--muted-rgb))' }}>
              Нотариальная контора · Москва
            </span>
            <LiveStatus />
          </div>

          <h1
            className="font-serif font-medium m-0 mb-4"
            style={{ fontSize: 'clamp(34px, 5.4vw, 68px)', lineHeight: 1.04, letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}
          >
            С чем вы <em className="italic font-normal" style={{ color: accent }}>пришли?</em>
          </h1>
          <p className="m-0 mb-9 text-[16px] sm:text-[17px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))', maxWidth: '52ch' }}>
            Выберите дело — соберём под него папку: что взять с собой, сколько это стоит,
            сколько займёт и когда есть свободное время. Ничего уточнять по телефону не придётся.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {CASES.map(item => {
              const on = item.id === caseId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setCaseId(item.id); goto('delo') }}
                  aria-pressed={on}
                  className="text-left rounded-xl px-4 py-4 sm:px-5 sm:py-5 transition-all hover:-translate-y-0.5"
                  style={{
                    background: on ? accent : cardBg,
                    border: `1px solid ${on ? accent : rule}`,
                    color: on ? 'rgb(var(--bg-rgb))' : 'rgb(var(--text-rgb))',
                  }}
                >
                  <span className="block font-serif text-[17px] sm:text-[19px] leading-tight">{item.label}</span>
                  <span
                    className="block mt-1.5 text-[12px] tabular-nums"
                    style={{ color: on ? 'rgb(var(--bg-rgb) / 0.78)' : 'rgb(var(--muted-rgb))' }}
                  >
                    {item.duration} · {item.priceFrom}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mt-7 text-[14px]" style={{ color: 'rgb(var(--muted-rgb))' }}>
            Не нашли своё?{' '}
            <a href={notary.phoneHref} className="underline underline-offset-4" style={{ color: accent }}>
              {notary.phone}
            </a>{' '}
            — подскажем без записи и бесплатно.
          </p>
        </div>
      </section>

      {/* ── 01 · Ваше дело ─────────────────────────────────────────── */}
      <section id="delo" className="py-12 sm:py-14" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
        <div className="wrap">
          <StepHead n="01" title="Ваше дело" />
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 items-start">
            <div className="rounded-2xl p-6 sm:p-7" style={{ background: cardBg, border: `1px solid ${rule}` }}>
              <h2 className="font-serif font-medium m-0 mb-5" style={{ fontSize: 'clamp(24px, 3vw, 34px)', color: 'rgb(var(--text-rgb))' }}>
                {c.title}
              </h2>
              <dl className="grid sm:grid-cols-3 gap-5 m-0">
                <Fact k="Займёт" v={c.duration} />
                <Fact k="Явка" v={c.who} />
                <Fact k="Цена" v={c.priceFrom} />
              </dl>
              <p className="m-0 mt-5 pt-5 text-[13.5px]" style={{ borderTop: `1px dashed ${rule}`, color: 'rgb(var(--muted-rgb))' }}>
                Складывается из двух частей: {c.priceParts}. Тариф установлен Налоговым кодексом
                и одинаков у всех нотариусов; УПТХ утверждает {notary.chamber}.
              </p>
            </div>

            <div className="rounded-2xl p-6 sm:p-7" style={{ background: 'rgb(var(--bg-rgb))', border: `1px solid ${rule}` }}>
              <p className="text-[11px] tracking-[0.24em] uppercase m-0 mb-4" style={{ color: accent }}>
                Нотариус берёт на себя
              </p>
              <ul className="m-0 p-0 list-none space-y-3">
                {c.notary.map(n => (
                  <li key={n} className="flex gap-3 text-[15px] leading-snug" style={{ color: 'rgb(var(--text-b-rgb))' }}>
                    <svg className="w-4 h-4 flex-shrink-0 mt-1" fill="none" stroke={accent} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Что взять с собой ─────────────────────────────────── */}
      <section id="sbor" className="py-12 sm:py-14" style={{ background: 'rgb(var(--bg-rgb))' }}>
        <div className="wrap">
          <StepHead n="02" title="Что взять с собой" />
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${rule}` }}>
            <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4" style={{ background: cardBg }}>
              <span className="text-[13px]" style={{ color: 'rgb(var(--muted-rgb))' }}>
                Отметьте, что уже собрали — запомним до вашего визита
              </span>
              <span className="text-[13px] tabular-nums whitespace-nowrap" style={{ color: accent }}>
                собрано {doneCount} из {c.bring.length}
              </span>
            </div>
            <div className="h-1" style={{ background: 'rgb(var(--surface-4-rgb))' }}>
              <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: accent }} />
            </div>
            <ul className="m-0 p-0 list-none" style={{ background: 'rgb(var(--bg-rgb))' }}>
              {c.bring.map(d => {
                const on = !!checked[key(d.id)]
                return (
                  <li key={d.id} style={{ borderTop: `1px solid rgb(var(--violet-rgb) / 0.10)` }}>
                    <button
                      type="button"
                      onClick={() => toggle(d.id)}
                      aria-pressed={on}
                      className="w-full flex items-start gap-4 text-left px-5 sm:px-7 py-4 transition-colors hover:bg-[rgb(var(--surface-rgb))]"
                    >
                      <span
                        className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 grid place-items-center transition-colors"
                        style={{ background: on ? accent : 'transparent', border: `1.5px solid ${on ? accent : 'rgb(var(--muted-rgb) / 0.5)'}` }}
                        aria-hidden
                      >
                        {on && (
                          <svg className="w-3 h-3" fill="none" stroke="rgb(var(--bg-rgb))" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span>
                        <span
                          className="block text-[15.5px]"
                          style={{ color: 'rgb(var(--text-rgb))', textDecoration: on ? 'line-through' : 'none', opacity: on ? 0.55 : 1 }}
                        >
                          {d.label}
                        </span>
                        {d.note && (
                          <span className="block text-[13px] mt-0.5" style={{ color: 'rgb(var(--muted-rgb))' }}>{d.note}</span>
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 03 · Когда прийти ──────────────────────────────────────── */}
      <section id="kogda" className="py-12 sm:py-14" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
        <div className="wrap">
          <StepHead n="03" title="Когда прийти" />
          <div className="rounded-2xl p-5 sm:p-7" style={{ background: cardBg, border: `1px solid ${rule}` }}>
            <BookingInline embedded initialService={c.bookingService} onPick={setSlot} />
          </div>
        </div>
      </section>

      {/* ── Папка: закладка у левого края ──
          Была полоса во всю ширину внизу. Она висела на каждом экране,
          отъедала полосу под содержанием и на телефоне закрывала половину
          того, ради чего человек пришёл. Закладка занимает сорок пикселей у
          края и раскрывается только по нажатию — как язычок папки, за
          который её и вытягивают. */}
      <div className="folder no-print" data-open={folderOpen ? 'true' : 'false'}>
        <button
          type="button"
          className="folder__tab"
          onClick={() => setFolderOpen(o => !o)}
          aria-expanded={folderOpen}
          aria-controls="folder-panel"
          title="Папка визита"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
              d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          <span className="folder__count num">{doneCount}/{c.bring.length}</span>
          <span className="folder__word">Папка</span>
        </button>

        <div className="folder__panel" id="folder-panel" hidden={!folderOpen}>
          <p className="folder__k">Ваша папка</p>
          <p className="folder__case">{c.label}</p>

          <ul className="folder__docs">
            {c.bring.map(d => (
              <li key={d.id} data-done={checked[key(d.id)] ? 'true' : 'false'}>{d.label}</li>
            ))}
          </ul>

          <p className="folder__when">
            {slot.date && slot.time ? `${slot.date} в ${slot.time}` : 'Время не выбрано'}
          </p>

          <div className="folder__act">
            <button type="button" onClick={() => window.print()} className="folder__btn">Памятка</button>
            <button type="button" onClick={() => { setFolderOpen(false); goto('kogda') }} className="folder__btn folder__btn--fill">
              Записаться
            </button>
          </div>
        </div>
      </div>

      {/* ── Памятка для печати ──
          Уезжает порталом прямо в body. Внутри разметки страницы лист при
          печати получал нулевую ширину: содержащий блок схлопывался, и на
          бумагу уходила пустая страница. Ребёнком body таких сюрпризов нет,
          и правило «спрятать всё, кроме памятки» пишется в одну строку. */}
      {mounted && createPortal((
        <div className="print-sheet" aria-hidden>
        <h1>Памятка к визиту</h1>
        <p className="ps-lead">
          {c.title} · {notary.name}, {notary.title}
        </p>
        <table className="ps-facts">
          <tbody>
            <tr><th>Займёт</th><td>{c.duration}</td></tr>
            <tr><th>Явка</th><td>{c.who}</td></tr>
            <tr><th>Цена</th><td>{c.priceFrom} ({c.priceParts})</td></tr>
            <tr><th>Адрес</th><td>{notary.address}</td></tr>
            <tr><th>Телефон</th><td>{notary.phone}</td></tr>
            <tr><th>Приём</th><td>{slot.date && slot.time ? `${slot.date} в ${slot.time}` : 'время не выбрано'}</td></tr>
          </tbody>
        </table>
        <h2>Взять с собой</h2>
        <ul>
          {c.bring.map(d => (
            <li key={d.id}>
              [{checked[key(d.id)] ? '×' : ' '}] {d.label}{d.note ? ` — ${d.note}` : ''}
            </li>
          ))}
        </ul>
        <h2>Нотариус берёт на себя</h2>
        <ul>
          {c.notary.map(n => <li key={n}>{n}</li>)}
        </ul>
          <p className="ps-note">
            Демонстрационный образец: нотариус, адрес, телефон и реквизиты вымышлены.
          </p>
        </div>
      ), document.body)}
    </>
  )
}

function StepHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-6">
      <span className="text-[12px] tabular-nums tracking-[0.2em]" style={{ color: 'rgb(var(--violet-rgb))' }}>{n}</span>
      <span className="block flex-1 h-px" style={{ background: 'rgb(var(--violet-rgb) / 0.22)' }} />
      <span className="text-[11px] tracking-[0.26em] uppercase" style={{ color: 'rgb(var(--muted-rgb))' }}>{title}</span>
    </div>
  )
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10.5px] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgb(var(--muted-rgb))' }}>{k}</dt>
      <dd className="m-0 text-[16px] leading-snug" style={{ color: 'rgb(var(--text-rgb))' }}>{v}</dd>
    </div>
  )
}
