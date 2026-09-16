'use client'
import { useEffect, useMemo, useState } from 'react'
import { ALL_SLOTS } from '@/lib/slots'
import { notary } from '@/lib/data'
import BookingModal from './BookingModal'
import { LIVE_BOOKING } from './BookingMode'
import useToday from './useToday'

const WD_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

interface DayAvail { date: Date; key: string; free: string[] }

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Dates are calculated after mounting so cached SSR markup stays stable across days and time zones.
function buildDays(today: Date): DayAvail[] {
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
  const todayKey = useToday()
  const demoDays = useMemo(() => todayKey
    ? buildDays(new Date(`${todayKey}T12:00:00`)).map(dd => ({ ...dd, free: dd.free.filter(t => t !== '12:00' && t !== '12:30') }))
    : [], [todayKey])
  const [days, setDays] = useState<DayAvail[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [pick, setPick] = useState<{ date: Date; time: string } | null>(null)

  // После монтирования уточняем занятость из API (и отсекаем прошедшее время сегодня).
  useEffect(() => {
    if (!LIVE_BOOKING) return
    let cancelled = false
    const today = new Date()
    const initialDays = buildDays(today)
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
        .then(r => { if (!r.ok) throw new Error('Availability unavailable'); return r.json() })
        .then(j => {
          if (!Array.isArray(j.booked)) throw new Error('Invalid availability')
          return { dd, booked: j.booked as string[] }
        })
        .finally(() => clearTimeout(to))
    }
    Promise.all(initialDays.map(fetchDay)).then(res => {
      if (cancelled) return
      setDays(res.map(({ dd, booked }) => ({ date: dd.date, key: dd.key, free: refine(dd.date, booked) })))
    }).catch(() => { if (!cancelled) setFailed(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const label = (d: Date): string => {
    const today = new Date()
    const tmr = new Date(today); tmr.setDate(today.getDate() + 1)
    if (ymd(d) === ymd(today)) return 'Сегодня'
    if (ymd(d) === ymd(tmr)) return 'Завтра'
    return `${WD_SHORT[d.getDay()]}, ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const withFree = (LIVE_BOOKING ? days : demoDays).filter(d => d.free.length > 0)
  const nearest = withFree[0]

  return (
    <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--surface-rgb))' }}>
      <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1180px' }}>
        <div className="flex items-center gap-3 mb-5 reveal">
          <span className="block w-10 h-[2px]" style={{ background: 'rgb(var(--violet-rgb))' }} />
          <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgb(var(--violet-ink-rgb))' }}>Свободное время</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10 reveal">
          <h2 className="font-sans font-extrabold m-0" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}>
            Ближайшие окна <span style={{ color: 'rgb(var(--violet-ink-rgb))' }}>для записи</span>
          </h2>
          <span className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgb(var(--violet-ink-rgb))' }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'rgb(var(--violet-rgb))', animation: 'sfPing 1.6s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: 'rgb(var(--violet-rgb))' }} />
            </span>
            {LIVE_BOOKING ? 'Проверка расписания конторы' : 'Пример расписания · демо'}
          </span>
        </div>

        {!LIVE_BOOKING && <p className="text-sm mb-5">Демонстрация: используйте вымышленные данные. Запись не отправляется</p>}

        {(LIVE_BOOKING ? loading : !todayKey) ? (
          <p role="status">Подготавливаем календарь…</p>
        ) : nearest ? (
          <>
            {/* Ближайшее окно — крупно */}
            {/* Заливка тёмной мятой, а не акцентной: белым по #1D9E75 выходит
                3.39, и подпись «Самое раннее окно» на 75% давала 2.56. */}
            <div className="rounded-3xl p-6 sm:p-8 mb-5 flex flex-wrap items-center justify-between gap-5" style={{ background: 'rgb(var(--violet-ink-rgb))' }}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] m-0 mb-2" style={{ color: 'rgba(255,255,255,0.92)' }}>Самое раннее окно</p>
                <p className="font-sans font-extrabold text-white m-0" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: '-0.01em' }}>
                  {label(nearest.date)} · {nearest.free[0]}
                </p>
              </div>
              <button
                onClick={() => setPick({ date: nearest.date, time: nearest.free[0] })}
                className="rounded-xl px-7 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: '#fff', color: 'rgb(var(--violet-ink-rgb))' }}
              >
                Записаться на это время
              </button>
            </div>

            {/* По дням */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {withFree.slice(0, 4).map((d) => (
                <div key={d.key} className="rounded-3xl p-6 bg-navy-card" style={{ border: '1px solid rgba(29,158,117,0.12)' }}>
                  <div className="flex items-baseline justify-between mb-4">
                    <p className="font-bold m-0" style={{ fontSize: '15px', color: 'rgb(var(--text-rgb))' }}>{label(d.date)}</p>
                    <span className="text-[11px] font-mono" style={{ color: 'rgb(var(--violet-ink-rgb))' }}>{d.free.length} окон</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {d.free.slice(0, 6).map(t => (
                      <button
                        key={t}
                        onClick={() => setPick({ date: d.date, time: t })}
                        className="rounded-lg px-3 py-2 text-[13px] font-semibold font-mono transition-colors"
                        style={{ background: 'rgb(var(--surface-2-rgb))', color: 'rgb(var(--violet-ink-rgb))' }}
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
            <p className="m-0 mb-5 text-[15px]" style={{ color: 'rgb(var(--muted-rgb))' }}>{failed ? 'Не удалось проверить расписание. Уточните время по телефону.' : 'На ближайшие дни запись заполнена — подберём удобное время по телефону.'}</p>
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
