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

export default function SlotFinder() {
  const [days, setDays] = useState<DayAvail[] | null>(null)
  const [pick, setPick] = useState<{ date: Date; time: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    const today = new Date()
    const candidates: Date[] = []
    for (let i = 0; i < 21 && candidates.length < 6; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dow = d.getDay()
      if (dow !== 0 && dow !== 6) candidates.push(d)
    }
    const nowMin = today.getHours() * 60 + today.getMinutes()
    const computeFree = (d: Date, booked: string[]) => {
      const set = new Set(booked)
      let free = ALL_SLOTS.filter(s => !set.has(s))
      if (ymd(d) === ymd(today)) {
        free = free.filter(s => { const [h, m] = s.split(':').map(Number); return h * 60 + m > nowMin + 30 })
      }
      return free
    }

    // Сразу показываем окна (как все свободные), затем уточняем занятость из API.
    // Так секция никогда не выглядит пустой, даже если API недоступен.
    setDays(candidates.map(d => ({ date: d, key: ymd(d), free: computeFree(d, []) })))

    const fetchDay = (d: Date) => {
      const ctrl = new AbortController()
      const to = setTimeout(() => ctrl.abort(), 3500)
      return fetch(`/api/appointments?date=${ymd(d)}`, { signal: ctrl.signal })
        .then(r => r.json())
        .then(j => ({ d, booked: Array.isArray(j.booked) ? (j.booked as string[]) : [] }))
        .catch(() => ({ d, booked: [] as string[] }))
        .finally(() => clearTimeout(to))
    }
    Promise.all(candidates.map(fetchDay)).then(res => {
      if (cancelled) return
      setDays(res.map(({ d, booked }) => ({ date: d, key: ymd(d), free: computeFree(d, booked) })))
    })
    return () => { cancelled = true }
  }, [])

  const label = (d: Date): string => {
    const today = new Date()
    const tmr = new Date(today); tmr.setDate(today.getDate() + 1)
    if (ymd(d) === ymd(today)) return 'Сегодня'
    if (ymd(d) === ymd(tmr)) return 'Завтра'
    return `${WD_SHORT[d.getDay()]}, ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const withFree = (days ?? []).filter(d => d.free.length > 0)
  const nearest = withFree[0]

  return (
    <section className="py-20 sm:py-28" style={{ background: '#ffffff' }}>
      <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1180px' }}>
        <div className="flex items-center gap-3 mb-5 reveal">
          <span className="block w-10 h-[2px]" style={{ background: '#1D9E75' }} />
          <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#1D9E75' }}>Свободное время</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10 reveal">
          <h2 className="font-sans font-extrabold m-0" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', letterSpacing: '-0.02em', color: '#2c2c2c' }}>
            Ближайшие окна <span style={{ color: '#1D9E75' }}>для записи</span>
          </h2>
          <span className="flex items-center gap-2 text-sm font-medium" style={{ color: '#1D9E75' }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#1D9E75', animation: 'sfPing 1.6s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#1D9E75' }} />
            </span>
            обновляется в реальном времени
          </span>
        </div>

        {/* загрузка */}
        {days === null && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl p-6 bg-white" style={{ border: '1px solid rgba(29,158,117,0.12)' }}>
                <div className="h-3 w-20 rounded mb-4" style={{ background: '#e8f5f0' }} />
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4].map(j => <div key={j} className="h-8 w-14 rounded-lg" style={{ background: '#f1f8f5', animation: `sfShimmer 1.4s ${j * 0.12}s ease-in-out infinite` }} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {days !== null && withFree.length === 0 && (
          <div className="rounded-3xl p-10 text-center bg-white reveal" style={{ border: '1px solid rgba(29,158,117,0.12)' }}>
            <p className="m-0 mb-5 text-[15px]" style={{ color: '#5d6e67' }}>На ближайшие дни запись заполнена — подберём удобное время по телефону.</p>
            <a href={notary.phoneHref} className="inline-flex items-center px-7 py-3 rounded-xl font-bold text-sm text-white no-underline transition-transform hover:-translate-y-0.5" style={{ background: '#1D9E75' }}>{notary.phone}</a>
          </div>
        )}

        {days !== null && nearest && (
          <>
            {/* Ближайшее окно — крупно */}
            <div className="rounded-3xl p-6 sm:p-8 mb-5 flex flex-wrap items-center justify-between gap-5 reveal" style={{ background: '#1D9E75' }}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] m-0 mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Самое раннее окно</p>
                <p className="font-sans font-extrabold text-white m-0" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: '-0.01em' }}>
                  {label(nearest.date)} · {nearest.free[0]}
                </p>
              </div>
              <button
                onClick={() => setPick({ date: nearest.date, time: nearest.free[0] })}
                className="rounded-xl px-7 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: '#fff', color: '#1D9E75' }}
              >
                Записаться на это время
              </button>
            </div>

            {/* По дням */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {withFree.slice(0, 4).map((d, i) => (
                <div key={d.key} className="rounded-3xl p-6 bg-white reveal" style={{ border: '1px solid rgba(29,158,117,0.12)' }} data-reveal-delay={i * 70}>
                  <div className="flex items-baseline justify-between mb-4">
                    <p className="font-bold m-0" style={{ fontSize: '15px', color: '#2c2c2c' }}>{label(d.date)}</p>
                    <span className="text-[11px] font-mono" style={{ color: '#1D9E75' }}>{d.free.length} окон</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {d.free.slice(0, 6).map(t => (
                      <button
                        key={t}
                        onClick={() => setPick({ date: d.date, time: t })}
                        className="rounded-lg px-3 py-2 text-[13px] font-semibold font-mono transition-colors"
                        style={{ background: '#e8f5f0', color: '#1D9E75' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1D9E75'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#e8f5f0'; e.currentTarget.style.color = '#1D9E75' }}
                      >
                        {t}
                      </button>
                    ))}
                    {d.free.length > 6 && <span className="self-center text-[12px]" style={{ color: '#9aa8a2' }}>+{d.free.length - 6}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
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
        @keyframes sfShimmer{0%,100%{opacity:1;}50%{opacity:0.5;}}
      `}</style>
    </section>
  )
}
