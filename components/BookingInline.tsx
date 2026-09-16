'use client'
import useToday from './useToday'
import BookingMode, { LIVE_BOOKING, CONSENT_VERSION } from './BookingMode'
import { useEffect, useMemo, useState } from 'react'
import { ALL_SLOTS } from '@/lib/slots'
import { SERVICES } from '@/lib/services'


function isWeekendYMD(ymd: string): boolean {
  const [y, m, d] = ymd.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay()
  return dow === 0 || dow === 6
}

/** Нативная форма записи: имя, телефон, дата, услуга, время → БД, подтверждение без перезагрузки. */
export default function BookingInline() {
  const today = useToday()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState<string>(SERVICES[0])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [availability, setAvailability] = useState<{ date: string; booked: string[] } | null>(null)
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!date || !LIVE_BOOKING) return
    fetch(`/api/appointments?date=${date}`)
      .then(r => r.json())
      .then(d => setAvailability({ date, booked: Array.isArray(d.booked) ? d.booked : [] }))
      .catch(() => setAvailability(null))
  }, [date])

  const freeSlots = useMemo(() => {
    if (!date || isWeekendYMD(date)) return []
    const bookedSet = new Set(LIVE_BOOKING ? (availability?.date === date ? availability.booked : []) : ['12:00', '12:30'])
    return ALL_SLOTS.filter(s => !bookedSet.has(s))
  }, [date, availability])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !date || !time) { setError('Заполните все поля'); return }
    if (!consent) { setError('Подтвердите согласие на обработку персональных данных'); return }
    if (!LIVE_BOOKING) { setError(''); setDone(true); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, date, time, duration: 30, consent: true, consentVersion: CONSENT_VERSION }),
      })
      if (res.ok) setDone(true)
      else { const d = await res.json().catch(() => ({})); setError(d.error ?? 'Ошибка') }
    } catch { setError('Ошибка соединения') }
    setLoading(false)
  }

  return (
    <section id="booking" className="relative py-20 sm:py-24 bg-navy-dark">
      <div className="mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1180px' }}>
        <div className="mb-10 reveal">
          <div className="inline-flex items-center gap-3.5 mb-4">
            <span className="block w-6 h-px bg-gold" />
            <span className="text-[11px] tracking-[0.32em] uppercase text-gold-ink/75">Онлайн-запись</span>
          </div>
          <h2 className="font-serif font-medium text-cream m-0" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
            Запишитесь <em className="italic font-normal text-gold-ink">на приём</em>
          </h2>
        </div>

        <div className="rounded-2xl p-6 sm:p-8 bg-navy-card reveal" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {done ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-5 bg-gold/10 border border-gold/40">
                <svg className="w-8 h-8 text-gold-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-cream mb-2">{LIVE_BOOKING ? 'Заявка отправлена' : 'Демонстрация завершена'}</h3>
              <p className="text-slate text-sm">
                {LIVE_BOOKING ? 'Вы выбрали ' : 'Пример: '}<span className="text-cream font-medium">{date}</span> в{' '}
                <span className="text-gold-ink font-semibold">{time}</span>. {LIVE_BOOKING ? 'Ожидайте подтверждения конторы.' : 'Запись не отправлена. Данные остались только на этой странице.'}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2"><BookingMode /></div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-2">Ваше имя</label>
                <input
                  required value={name} onChange={e => setName(e.target.value)} placeholder="Иванов Иван Иванович"
                  className="w-full rounded-xl px-4 py-3 text-sm text-cream bg-navy placeholder:text-slate/50 focus:outline-none focus:border-gold border border-gold/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-2">Телефон</label>
                <input
                  required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (000) 000-00-00" inputMode="tel"
                  className="w-full rounded-xl px-4 py-3 text-sm text-cream bg-navy placeholder:text-slate/50 focus:outline-none focus:border-gold border border-gold/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-2">Услуга</label>
                <select
                  value={service} onChange={e => setService(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-cream bg-navy focus:outline-none focus:border-gold border border-gold/20"
                >
                  {SERVICES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-2">Дата</label>
                <input
                  type="date" required min={today || undefined} value={date} onChange={e => { setDate(e.target.value); setTime('') }}
                  className="w-full rounded-xl px-4 py-3 text-sm text-cream bg-navy focus:outline-none focus:border-gold border border-gold/20"
                  style={{ colorScheme: 'light' }}
                />
              </div>

              {date && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-2">Время</label>
                  {isWeekendYMD(date) ? (
                    <p className="text-sm text-slate">Выходной день — выберите будний (пн–пт).</p>
                  ) : freeSlots.length === 0 ? (
                    <p className="text-sm text-slate">На эту дату свободных окон нет — выберите другой день.</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {freeSlots.map(s => (
                        <button
                          key={s} type="button" onClick={() => setTime(s)}
                          className={`py-2 rounded-lg text-xs font-medium transition-colors border ${
                            time === s ? 'bg-gold text-white border-gold font-bold' : 'text-slate border-gold/15 hover:border-gold/50 hover:text-cream'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <label className="md:col-span-2 flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
                />
                <span className="text-[12px] text-slate leading-snug">
                  {LIVE_BOOKING ? 'Я даю согласие на обработку персональных данных:' : 'Использую вымышленные данные и понимаю, что это демонстрация. Документ:'}{' '}
                  <a href="/consent" target="_blank" rel="noopener noreferrer" className="text-gold-ink underline underline-offset-2">
                    текст согласия
                  </a>; <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">политика конфиденциальности</a>
                </span>
              </label>

              {error && <p className="md:col-span-2 text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || !consent || !time}
                className="md:col-span-2 w-full bg-gold text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Отправка…' : !date ? 'Выберите дату' : !time ? 'Выберите время' : 'Записаться на приём'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
