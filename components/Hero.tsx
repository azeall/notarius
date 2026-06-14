'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { notary, heroStats } from '@/lib/data'
import { ALL_SLOTS } from '@/lib/slots'
import { SERVICES } from '@/lib/services'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1600, steps = 50
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current = Math.min(current + increment, value)
            setCount(Math.floor(current))
            if (current >= value) clearInterval(timer)
          }, duration / steps)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{count.toLocaleString('ru-RU')}{suffix}</span>
}

function todayYMD(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function isWeekendYMD(ymd: string): boolean {
  const [y, m, d] = ymd.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay()
  return dow === 0 || dow === 6
}

const INPUT = 'w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors'
const INPUT_STYLE: React.CSSProperties = { background: 'rgb(var(--surface-3-rgb))', border: '1px solid rgba(29,158,117,0.20)', color: 'rgb(var(--text-rgb))' }

/** Компактная форма записи прямо в hero — фича сайта. */
function HeroBookingCard() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState<string>(SERVICES[0])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [booked, setBooked] = useState<string[]>([])
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!date) { setBooked([]); setTime(''); return }
    fetch(`/api/appointments?date=${date}`)
      .then(r => r.json())
      .then(d => setBooked(Array.isArray(d.booked) ? d.booked : []))
      .catch(() => setBooked([]))
  }, [date])

  const freeSlots = useMemo(() => {
    if (!date || isWeekendYMD(date)) return []
    const b = new Set(booked)
    return ALL_SLOTS.filter(s => !b.has(s))
  }, [date, booked])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !date || !time) { setError('Заполните все поля'); return }
    if (!consent) { setError('Подтвердите согласие на обработку данных'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, date, time, duration: 30 }),
      })
      if (res.ok) setDone(true)
      else { const d = await res.json().catch(() => ({})); setError(d.error ?? 'Ошибка') }
    } catch { setError('Ошибка соединения') }
    setLoading(false)
  }

  return (
    <div
      className="relative rounded-3xl p-6 sm:p-7 bg-navy-card w-full max-w-[440px] mx-auto"
      style={{ border: '1px solid rgba(29,158,117,0.18)', boxShadow: '0 30px 70px rgba(29,158,117,0.16)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-sans font-extrabold m-0" style={{ fontSize: '20px', color: 'rgb(var(--text-rgb))', letterSpacing: '-0.01em' }}>
          Запись на приём
        </h2>
        <span className="text-[10px] font-bold tracking-wide uppercase rounded-full px-2.5 py-1" style={{ background: 'rgb(var(--surface-2-rgb))', color: 'rgb(var(--violet-rgb))' }}>
          ~30 секунд
        </span>
      </div>

      {done ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full grid place-items-center mx-auto mb-4" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
            <svg className="w-7 h-7" style={{ color: 'rgb(var(--violet-rgb))' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-sans font-bold mb-1" style={{ fontSize: '18px', color: 'rgb(var(--text-rgb))' }}>Вы записаны!</h3>
          <p className="text-sm m-0" style={{ color: 'rgb(var(--muted-rgb))' }}>
            {date} в <b style={{ color: 'rgb(var(--violet-rgb))' }}>{time}</b>. Мы свяжемся для подтверждения.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <select value={service} onChange={e => setService(e.target.value)} className={INPUT} style={INPUT_STYLE}>
            {SERVICES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" required min={todayYMD()} value={date} onChange={e => setDate(e.target.value)} className={INPUT} style={{ ...INPUT_STYLE, colorScheme: 'light' }} />
            <select value={time} onChange={e => setTime(e.target.value)} disabled={!date || freeSlots.length === 0} className={INPUT} style={INPUT_STYLE}>
              <option value="">Время</option>
              {freeSlots.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {date && isWeekendYMD(date) && <p className="text-xs m-0" style={{ color: '#c2410c' }}>Выходной — выберите будний день</p>}
          {date && !isWeekendYMD(date) && freeSlots.length > 0 && (
            <p className="text-xs m-0 flex items-center gap-1.5" style={{ color: 'rgb(var(--violet-rgb))' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'rgb(var(--violet-rgb))' }} />
              Свободно {freeSlots.length} {freeSlots.length === 1 ? 'окно' : freeSlots.length < 5 ? 'окна' : 'окон'} на эту дату
            </p>
          )}
          {date && !isWeekendYMD(date) && freeSlots.length === 0 && (
            <p className="text-xs m-0" style={{ color: '#c2410c' }}>На эту дату всё занято — выберите другой день</p>
          )}
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" className={INPUT} style={INPUT_STYLE} />
          <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (000) 000-00-00" inputMode="tel" className={INPUT} style={INPUT_STYLE} />

          <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 cursor-pointer" style={{ accentColor: 'rgb(var(--violet-rgb))' }} />
            <span className="text-[11px] leading-snug" style={{ color: 'rgb(var(--muted-b-rgb))' }}>
              Согласен(а) на обработку персональных данных (<a href="/privacy" target="_blank" className="underline" style={{ color: 'rgb(var(--violet-rgb))' }}>политика</a>)
            </span>
          </label>

          {error && <p className="text-xs m-0" style={{ color: '#dc2626' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !consent || !time}
            className="w-full font-bold py-3 rounded-xl text-sm text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'rgb(var(--violet-rgb))' }}
          >
            {loading ? 'Отправка…' : 'Записаться'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section data-hero className="relative overflow-hidden flex items-center" style={{ minHeight: '100dvh', background: 'rgb(var(--surface-rgb))' }}>
      <style>{`
        @keyframes mintPulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.06); } }
        @media (prefers-reduced-motion: reduce) { .mint-orb { animation: none !important; } }
      `}</style>

      {/* мятный клин + живые орбы */}
      <div className="absolute top-0 right-0 hidden lg:block" style={{ width: '46%', height: '100%', background: 'rgb(var(--surface-2-rgb))', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }} aria-hidden />
      <div className="mint-orb absolute rounded-full pointer-events-none" style={{ width: 300, height: 300, top: '8%', right: '4%', background: 'radial-gradient(circle, rgba(29,158,117,0.14), transparent 65%)', animation: 'mintPulse 9s ease-in-out infinite' }} aria-hidden />
      <div className="mint-orb absolute rounded-full pointer-events-none" style={{ width: 220, height: 220, bottom: '6%', left: '2%', background: 'radial-gradient(circle, rgba(29,158,117,0.10), transparent 65%)', animation: 'mintPulse 12s ease-in-out infinite' }} aria-hidden />

      <div className="relative w-full mx-auto px-5 sm:px-10 lg:px-16 py-16 lg:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center" style={{ maxWidth: '1320px' }}>
        <div>
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            <span className="block w-10 h-[2px]" style={{ background: 'rgb(var(--violet-rgb))' }} />
            <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgb(var(--violet-rgb))' }}>
              Нотариус города Москвы
            </span>
          </div>

          <h1
            className="font-sans font-extrabold leading-[1.02] mb-7 animate-fade-in-up"
            style={{ fontSize: 'clamp(40px, 6vw, 88px)', letterSpacing: '-0.03em', color: 'rgb(var(--text-rgb))', animationDelay: '80ms' }}
          >
            {surname}
            <br />
            <span style={{ color: 'rgb(var(--violet-rgb))' }}>{rest}</span>
          </h1>

          <p className="leading-relaxed mb-10 max-w-[500px] animate-fade-in-up" style={{ fontSize: '18px', lineHeight: '1.7', color: 'rgb(var(--muted-rgb))', animationDelay: '160ms' }}>
            Современная нотариальная контора: онлайн-запись за 30 секунд,
            прозрачные тарифы и проверка каждого документа.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-14 animate-fade-in-up" style={{ animationDelay: '220ms' }}>
            <a href={notary.phoneHref} className="inline-flex items-center gap-3 font-semibold text-[16px] no-underline transition-opacity hover:opacity-75" style={{ color: 'rgb(var(--text-rgb))' }}>
              <span className="w-11 h-11 rounded-full grid place-items-center" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              {notary.phone}
            </a>
            <span className="text-sm" style={{ color: 'rgb(var(--muted-b-rgb))' }}>{notary.address}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-[600px] pt-8 animate-fade-in-up" style={{ borderTop: '2px solid #e8f5f0', animationDelay: '300ms' }}>
            {heroStats.map(s => (
              <div key={s.label}>
                <div className="font-sans font-extrabold leading-none mb-2" style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', color: 'rgb(var(--violet-rgb))', letterSpacing: '-0.02em' }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[11px] sm:text-xs tracking-[0.16em] uppercase" style={{ color: 'rgb(var(--muted-b-rgb))' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Фича сайта — форма записи прямо в hero */}
        <div className="animate-fade-in" style={{ animationDelay: '260ms' }}>
          <HeroBookingCard />
        </div>
      </div>
    </section>
  )
}
