'use client'
import { createPortal } from 'react-dom'
import { useState, useEffect, useMemo } from 'react'
import {
  AFTERNOON_SLOTS,
  DURATION_OPTIONS,
  MORNING_SLOTS,
  WORKING_HOURS_LABEL,
  endTime,
  expandSlots,
} from '@/lib/slots'

const SERVICES = [
  'Удостоверение сделок с недвижимостью',
  'Оформление наследства',
  'Доверенности',
  'Заверение копий документов',
  'Нотариальные согласия',
  'Брачный договор',
  'Корпоративные документы',
  'Прочее',
]

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']

function fmtDate(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}
function isWeekday(y: number, m: number, d: number) {
  const day = new Date(y, m, d).getDay()
  return day !== 0 && day !== 6
}

interface BookingModalProps {
  onClose: () => void
  initialDate?: { year: number; month: number; day: number }
  initialTime?: string
}

export default function BookingModal({ onClose, initialDate, initialTime }: BookingModalProps) {
  const today = new Date()
  const [step, setStep] = useState<1|2|3>(1)
  const [service, setService] = useState('')
  const [year, setYear] = useState(initialDate?.year ?? today.getFullYear())
  const [month, setMonth] = useState(initialDate?.month ?? today.getMonth())
  const [day, setDay] = useState<number|null>(initialDate?.day ?? null)
  const [time, setTime] = useState(initialTime ?? '')
  const [duration, setDuration] = useState<number>(30)
  const [booked, setBooked] = useState<string[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const selDate = day ? fmtDate(year, month, day) : null

  useEffect(() => {
    if (!selDate) { setBooked([]); return }
    fetch(`/api/appointments?date=${selDate}`)
      .then(r => r.json())
      .then(d => setBooked(Array.isArray(d.booked) ? d.booked : []))
      .catch(() => {})
  }, [selDate])

  const bookedSet = useMemo(() => new Set(booked), [booked])

  // Слоты, которые займёт текущая (start, duration) — для подсветки
  const selectionSlots = useMemo(() => {
    if (!time) return new Set<string>()
    return new Set(expandSlots(time, duration))
  }, [time, duration])

  const selectionFits = time ? expandSlots(time, duration).length > 0 : false
  const selectionConflicts = time
    ? expandSlots(time, duration).some(s => bookedSet.has(s))
    : false

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow = new Date(year, month, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setDay(null); setTime('')
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setDay(null); setTime('')
  }

  const submit = async () => {
    if (!name.trim() || !phone.trim()) { setError('Заполните все поля'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, date: selDate, time, duration }),
      })
      if (res.ok) { setStep(3) }
      else { const d = await res.json().catch(() => ({})); setError(d.error ?? 'Ошибка') }
    } catch { setError('Ошибка соединения') }
    setLoading(false)
  }

  const renderSlot = (t: string) => {
    const isBooked = bookedSet.has(t)
    const isStart = time === t
    const isInSelection = selectionSlots.has(t)
    const conflict = isInSelection && bookedSet.has(t) && !isStart
    return (
      <button
        key={t}
        type="button"
        disabled={isBooked}
        onClick={() => setTime(t)}
        className={`text-xs py-2 rounded-lg border transition-all
          ${isBooked ? 'border-white/5 bg-white/3 text-gray-600 cursor-not-allowed line-through' : ''}
          ${!isBooked && isStart ? 'bg-gold border-gold text-navy font-bold' : ''}
          ${!isBooked && !isStart && isInSelection && !conflict ? 'bg-gold/30 border-gold/60 text-gold' : ''}
          ${!isBooked && !isStart && isInSelection && conflict ? 'bg-red-500/20 border-red-500/40 text-red-300' : ''}
          ${!isBooked && !isInSelection ? 'border-white/10 text-gray-300 hover:border-gold/50 hover:text-white' : ''}
        `}
      >
        {t}
      </button>
    )
  }

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{
          background: '#0d1b33',
          border: '1px solid rgba(184,154,90,0.30)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(184,154,90,0.10)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4"
          style={{ borderBottom: '1px solid rgba(184,154,90,0.12)' }}
        >
          <h2 className="font-serif text-lg sm:text-xl text-cream font-medium">Запись на приём</h2>
          <button
            onClick={onClose}
            className="text-slate hover:text-cream text-2xl leading-none transition-colors w-8 h-8 flex items-center justify-center"
          >
            &times;
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-[0.24em] text-slate mb-2 block">Услуга</label>
                <select
                  value={service}
                  onChange={e => setService(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-cream text-sm focus:outline-none"
                  style={{ background: '#060f1e', border: '1px solid rgba(184,154,90,0.20)' }}
                >
                  <option value="">— Выберите услугу —</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.24em] text-slate mb-2 block">Дата</label>
                <div className="rounded-xl p-4" style={{ background: '#060f1e', border: '1px solid rgba(184,154,90,0.12)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={prevMonth} className="text-slate hover:text-cream w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">‹</button>
                    <span className="text-cream text-sm font-medium">{MONTHS[month]} {year}</span>
                    <button onClick={nextMonth} className="text-slate hover:text-cream w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">›</button>
                  </div>
                  <div className="grid grid-cols-7 mb-1">
                    {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => (
                      <div key={d} className="text-center text-[10px] text-slate py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: offset }, (_, i) => <div key={`e${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const d = i + 1
                      const wd = isWeekday(year, month, d)
                      const past = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                      const sel = day === d
                      return (
                        <button
                          key={d}
                          disabled={!wd || past}
                          onClick={() => { setDay(d); setTime('') }}
                          className={`text-xs py-1.5 rounded-lg transition-all
                            ${sel ? 'text-navy font-bold' : ''}
                            ${wd && !past && !sel ? 'text-cream hover:bg-white/10' : ''}
                            ${(!wd || past) ? 'text-slate/30 cursor-not-allowed' : ''}
                          `}
                          style={sel ? { background: '#b89a5a' } : {}}
                        >
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {day && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] uppercase tracking-[0.24em] text-slate">Длительность</label>
                    <span className="text-[10px] text-slate/70">Рабочее время: {WORKING_HOURS_LABEL}</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-4">
                    {DURATION_OPTIONS.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`text-xs py-2 rounded-lg border transition-all
                          ${duration === d
                            ? 'bg-gold border-gold text-navy font-bold'
                            : 'border-white/10 text-gray-300 hover:border-gold/50 hover:text-white'}`}
                      >
                        {d < 60 ? `${d} мин` : d % 60 === 0 ? `${d/60} ч` : `${Math.floor(d/60)}ч ${d%60}м`}
                      </button>
                    ))}
                  </div>

                  <label className="text-[10px] uppercase tracking-[0.24em] text-slate mb-3 block">Начало</label>
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate">Утро · 10:00 – 13:00</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {MORNING_SLOTS.map(renderSlot)}
                    </div>
                    <p className="text-[11px] text-slate">День · 14:00 – 19:00</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {AFTERNOON_SLOTS.map(renderSlot)}
                    </div>
                  </div>

                  {time && (
                    <div
                      className={`mt-4 rounded-lg px-3 py-2 text-sm ${
                        !selectionFits
                          ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                          : selectionConflicts
                            ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                            : 'bg-gold/10 border border-gold/30 text-gold'
                      }`}
                    >
                      {!selectionFits
                        ? 'Запись не помещается в рабочее время — выберите другое начало или меньшую длительность.'
                        : selectionConflicts
                          ? 'Выбранный диапазон пересекается с уже занятым временем.'
                          : `Запись с ${time} до ${endTime(time, duration)}`}
                    </div>
                  )}
                </div>
              )}

              <button
                disabled={!service || !day || !time || !selectionFits || selectionConflicts}
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-30 hover:brightness-110 transition-all mt-2 text-navy"
                style={{ background: '#b89a5a' }}
              >
                Далее →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div
                className="rounded-xl p-4 text-sm space-y-1.5"
                style={{ background: '#060f1e', border: '1px solid rgba(184,154,90,0.12)' }}
              >
                <p className="text-slate">Услуга: <span className="text-cream">{service}</span></p>
                <p className="text-slate">
                  Дата и время:{' '}
                  <span className="text-gold font-medium">
                    {selDate} с {time} до {endTime(time, duration)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.24em] text-slate mb-2 block">ФИО</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="w-full rounded-lg px-3 py-2.5 text-cream text-sm focus:outline-none placeholder-slate/40"
                  style={{ background: '#060f1e', border: '1px solid rgba(184,154,90,0.20)' }}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.24em] text-slate mb-2 block">Телефон</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full rounded-lg px-3 py-2.5 text-cream text-sm focus:outline-none placeholder-slate/40"
                  style={{ background: '#060f1e', border: '1px solid rgba(184,154,90,0.20)' }}
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl text-slate text-sm hover:text-cream transition-colors"
                  style={{ border: '1px solid rgba(184,154,90,0.20)' }}
                >
                  ← Назад
                </button>
                <button
                  disabled={loading}
                  onClick={submit}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 hover:brightness-110 transition-all text-navy"
                  style={{ background: '#b89a5a' }}
                >
                  {loading ? 'Отправка…' : 'Записаться'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'rgba(184,154,90,0.10)', border: '1px solid rgba(184,154,90,0.30)' }}
              >
                <span className="text-gold text-2xl">✓</span>
              </div>
              <h3 className="text-cream font-serif text-xl">Запись подтверждена!</h3>
              <p className="text-slate text-sm leading-relaxed">
                Ждём вас <span className="text-cream">{selDate}</span> c{' '}
                <span className="text-gold font-medium">{time}</span> до{' '}
                <span className="text-gold font-medium">{time && endTime(time, duration)}</span>.<br />
                При необходимости мы свяжемся с вами для подтверждения.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-8 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all text-navy"
                style={{ background: '#b89a5a' }}
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
