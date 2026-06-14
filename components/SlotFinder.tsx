'use client'
import { useEffect, useState } from 'react'
import { ALL_SLOTS } from '@/lib/slots'
import { notary } from '@/lib/data'
import BookingModal from './BookingModal'

const WD_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

interface DayAvail { date: Date; key: string; free: string[] }

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Ближайшие 6 рабочих дней, изначально все слоты свободны.
// Считается и на сервере (SSR), и на клиенте — окна видны сразу, без JS и без запроса к API.
function buildDays(): DayAvail[] {
  const today = new Date()
  const out: DayAvail[] = []
  for (let i = 0; i < 21 && out.length < 6; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) out.push({ date: d, key: ymd(d), free: [...ALL_SLOTS] })
  }
  return out
}

export default function SlotFinder() {
  const [days, setDays] = useState<DayAvail[]>(buildDays)
  const [pick, setPick] = useState<{ date: Date; time: string } | null>(null)

  // После монтирования уточняем занятость из API (и отсекаем прошедшее время сегодня).
  useEffect(() => {
    let cancelled = false
    const today = new Date()
    const nowMin = today.getHours() * 60 + today.getMinutes()
    const refine = (d: Date, booked: string[]) => {
      const set = new Set(booked)
      let free = ALL_SLOTS.filter(s => !set.has(s))
      if (ymd(d) === ymd(today)) {
        free = free.filter(s => { const [h, m] = s.split(':').map(Number); return h * 60 + m > nowMin + 30 })
      }
      return free
    }
    const fetchDay = (dd: DayAvail) => {
      const ctrl = new AbortController()
      const to = setTimeout(() => ctrl.abort(), 3500)
      return fetch(`/api/appointments?date=${dd.key}`, { signal: ctrl.signal })
        .then(r => r.json())
        .then(j => ({ dd, booked: Array.isArray(j.booked) ? (j.booked as string[]) : [] }))
        .catch(() => ({ dd, booked: [] as string[] }))
        .finally(() => clearTimeout(to))
    }
    Promise.all(days.map(fetchDay)).then(res => {
      if (cancelled) return
      setDays(res.map(({ dd, booked }) => ({ date: dd.date, key: dd.key, free: refine(dd.date, booked) })))
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const label = (d: Date): string => {
    const today = new Date()
    const tmr = new Date(today); tmr.setDate(today.getDate() + 1)
    if (ymd(d) === ymd(today)) return 'Сегодня'
    if (ymd(d) === ymd(tmr)) return 'Завтра'
    return `${WD_SHORT[d.getDay()]}, ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const withFree = days.filter(d => d.free.length > 0)
  const nearest = withFree[0]

  return (
    <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--surface-rgb))' }} suppressHydrationWarning>
      <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1180px' }} suppressHydrationWarning>
        <div className="flex items-center gap-3 mb-5 reveal">
          <span className="block w-10 h-[2px]" style={{ background: 'rgb(var(--violet-rgb))' }} />
          <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgb(var(--violet-rgb))' }}>Свободное время</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10 reveal">
          <h2 className="font-sans font-extrabold m-0" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}>
            Ближайшие окна <span style={{ color: 'rgb(var(--violet-rgb))' }}>для записи</span>
          </h2>
          <span className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgb(var(--violet-rgb))' }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'rgb(var(--violet-rgb))', animation: 'sfPing 1.6s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: 'rgb(var(--violet-rgb))' }} />
            </span>
            обновляется в реальном времени
          </span>
        </div>

        {nearest ? (
          <>
            {/* Ближайшее окно — крупно */}
            <div className="rounded-3xl p-6 sm:p-8 mb-5 flex flex-wrap items-center justify-between gap-5" style={{ background: 'rgb(var(--violet-rgb))' }}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] m-0 mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Самое раннее окно</p>
                <p className="font-sans font-extrabold text-white m-0" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: '-0.01em' }} suppressHydrationWarning>
                  {label(nearest.date)} · {nearest.free[0]}
                </p>
              </div>
              <button
                onClick={() => setPick({ date: nearest.date, time: nearest.free[0] })}
                className="rounded-xl px-7 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: '#fff', color: 'rgb(var(--violet-rgb))' }}
              >
                Записаться на это время
              </button>
            </div>

            {/* По дням */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {withFree.slice(0, 4).map((d) => (
                <div key={d.key} className="rounded-3xl p-6 bg-navy-card" style={{ border: '1px solid rgba(29,158,117,0.12)' }} suppressHydrationWarning>
                  <div className="flex items-baseline justify-between mb-4">
                    <p className="font-bold m-0" style={{ fontSize: '15px', color: 'rgb(var(--text-rgb))' }}>{label(d.date)}</p>
                    <span className="text-[11px] font-mono" style={{ color: 'rgb(var(--violet-rgb))' }}>{d.free.length} окон</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {d.free.slice(0, 6).map(t => (
                      <button
                        key={t}
                        onClick={() => setPick({ date: d.date, time: t })}
                        className="rounded-lg px-3 py-2 text-[13px] font-semibold font-mono transition-colors"
                        style={{ background: 'rgb(var(--surface-2-rgb))', color: 'rgb(var(--violet-rgb))' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgb(var(--violet-rgb))'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgb(var(--surface-2-rgb))'; e.currentTarget.style.color = 'rgb(var(--violet-rgb))' }}
                      >
                        {t}
                      </button>
                    ))}
                    {d.free.length > 6 && <span className="self-center text-[12px]" style={{ color: 'rgb(var(--muted-c-rgb))' }}>+{d.free.length - 6}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl p-10 text-center bg-navy-card" style={{ border: '1px solid rgba(29,158,117,0.12)' }}>
            <p className="m-0 mb-5 text-[15px]" style={{ color: 'rgb(var(--muted-rgb))' }}>На ближайшие дни запись заполнена — подберём удобное время по телефону.</p>
            <a href={notary.phoneHref} className="inline-flex items-center px-7 py-3 rounded-xl font-bold text-sm text-white no-underline transition-transform hover:-translate-y-0.5" style={{ background: 'rgb(var(--violet-rgb))' }}>{notary.phone}</a>
          </div>
        )}
      </div>

      {pick && (
        <BookingModal
          initialDate={{ year: pick.date.getFullYear(), month: pick.date.getMonth(), day: pick.date.getDate() }}
          initialTime={pick.time}
          onClose={() => setPick(null)}
        />
      )}

      <style>{`
        @keyframes sfPing{75%,100%{transform:scale(2.2);opacity:0;}}
      `}</style>
    </section>
  )
}
