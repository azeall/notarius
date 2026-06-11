'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  AFTERNOON_SLOTS,
  DURATION_OPTIONS,
  MORNING_SLOTS,
  WORKING_HOURS_LABEL,
  endTime,
  expandSlots,
} from '@/lib/slots'
import { SERVICES, maxDurationForService, defaultDurationForService } from '@/lib/services'

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

const INPUT_STYLE: React.CSSProperties = { background: '#f4f3fd', border: '1px solid rgba(83,74,183,0.20)' }

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function AdminAddForm({ defaultStaffId }: { defaultStaffId?: string | null }) {
  const router = useRouter()
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState<number>(30)
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState<string>(SERVICES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [assigneeId] = useState<string | null>(defaultStaffId ?? null)

  useEffect(() => {
    if (!selectedDate) { setBookedTimes([]); return }
    fetch(`/api/appointments?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => setBookedTimes(Array.isArray(data.booked) ? data.booked : []))
      .catch(() => {})
  }, [selectedDate])

  const bookedSet = useMemo(() => new Set(bookedTimes), [bookedTimes])
  const selectionSlots = useMemo(() => {
    if (!selectedTime) return new Set<string>()
    return new Set(expandSlots(selectedTime, duration))
  }, [selectedTime, duration])

  const filteredDurations = DURATION_OPTIONS.filter(d => d <= maxDurationForService(service))
  const selectionFits = selectedTime ? expandSlots(selectedTime, duration).length > 0 : false
  const selectionConflicts = selectedTime
    ? expandSlots(selectedTime, duration).some(s => bookedSet.has(s))
    : false

  const firstDay = new Date(calYear, calMonth, 1)
  const lastDay = new Date(calYear, calMonth + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7
  const cells: (number | null)[] = Array(startOffset).fill(null)
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  function isDisabled(day: number) {
    const d = new Date(calYear, calMonth, day)
    const dow = d.getDay()
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d < todayMidnight || dow === 0 || dow === 6
  }
  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11) } else setCalMonth(m => m-1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0) } else setCalMonth(m => m+1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) { setError('Выберите дату и время'); return }
    if (!selectionFits || selectionConflicts) {
      setError(!selectionFits ? 'Запись не помещается в рабочее время' : 'Диапазон пересекается с занятым')
      return
    }
    setLoading(true); setError('')
    const res = await fetch('/api/admin/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, service, date: selectedDate, time: selectedTime, duration, staffId: assigneeId }),
    })
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setName(''); setPhone(''); setService(SERVICES[0])
      setSelectedDate(''); setSelectedTime(''); setDuration(defaultDurationForService(SERVICES[0])); setBookedTimes([])
      setTimeout(() => { setSuccess(false); router.refresh() }, 1500)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Это время уже занято')
    }
  }

  const renderSlot = (t: string) => {
    const isBooked = bookedSet.has(t)
    const isStart = t === selectedTime
    const isInSelection = selectionSlots.has(t)
    const conflict = isInSelection && isBooked && !isStart
    let cls = 'text-cream/80 border border-[rgba(83,74,183,0.15)] hover:bg-gold/15'
    let style: React.CSSProperties = { background: 'rgba(0,0,0,0.03)' }
    if (isBooked && !isStart) { cls = 'text-cream/20 line-through cursor-not-allowed border border-black/5'; style = { background: 'rgba(0,0,0,0.02)' } }
    if (isStart) { cls = 'text-white font-bold border border-gold'; style = { background: '#534AB7' } }
    else if (isInSelection && !conflict) { cls = 'text-cream border border-gold/50'; style = { background: 'rgba(83,74,183,0.28)' } }
    else if (isInSelection && conflict) { cls = 'text-red-300 border border-red-500/40'; style = { background: 'rgba(239,68,68,0.15)' } }
    return (
      <button key={t} type="button" disabled={isBooked} onClick={() => setSelectedTime(t)}
        className={`py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors ${cls}`} style={style}>
        {t}
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10" style={{ background: '#ffffff', border: '1px solid rgba(83,74,183,0.15)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 sm:mb-6">
        <h2 className="font-serif text-cream text-lg sm:text-xl font-bold">Добавить запись вручную</h2>
        <span className="text-xs text-cream/50">Приём: {WORKING_HOURS_LABEL}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left: fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cream/50 uppercase tracking-wide mb-1.5">Услуга</label>
            <select
              value={service}
              onChange={e => { const svc = e.target.value; setService(svc); setDuration(defaultDurationForService(svc)) }}
              className="w-full rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold"
              style={INPUT_STYLE}
            >
              {SERVICES.map(s => <option key={s} style={{ background: '#f4f3fd' }}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-cream/50 uppercase tracking-wide mb-1.5">ФИО клиента</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Иванов Иван Иванович"
              className="w-full rounded-xl px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold" style={INPUT_STYLE} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cream/50 uppercase tracking-wide mb-1.5">Телефон</label>
            <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (999) 000-00-00"
              className="w-full rounded-xl px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold" style={INPUT_STYLE} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream/50 uppercase tracking-wide mb-1.5">Длительность</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {filteredDurations.map(d => (
                <button key={d} type="button" onClick={() => setDuration(d)}
                  className={`py-2 rounded-lg text-xs font-medium transition-colors ${duration === d ? 'text-white border border-gold' : 'text-cream/80 border'}`}
                  style={duration === d ? { background: '#534AB7' } : { background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(83,74,183,0.15)' }}>
                  {d < 60 ? `${d} мин` : d % 60 === 0 ? `${d/60} ч` : `${Math.floor(d/60)}ч ${d%60}м`}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={
                !selectionFits || selectionConflicts
                  ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }
                  : { background: 'rgba(83,74,183,0.10)', border: '1px solid rgba(83,74,183,0.25)', color: '#26223d' }
              }
            >
              <p className="font-semibold mb-0.5">Итог записи:</p>
              <p>{service}</p>
              {!selectionFits
                ? <p>Не помещается в рабочее время</p>
                : selectionConflicts
                  ? <p>Диапазон пересекается с уже занятым</p>
                  : <p>{selectedDate.split('-').reverse().join('.')} с {selectedTime} до {endTime(selectedTime, duration)}</p>}
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-sm font-medium" style={{ color: '#6fbf99' }}>✓ Запись успешно добавлена!</p>}

          <button
            type="submit"
            disabled={loading || !selectedDate || !selectedTime || !selectionFits || selectionConflicts}
            className="w-full bg-gold text-white font-bold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Сохранение...'
              : !selectedDate ? 'Выберите дату ниже'
              : !selectedTime ? 'Выберите время ниже'
              : !selectionFits ? 'Не помещается в рабочее время'
              : selectionConflicts ? 'Время пересекается с занятым'
              : 'Добавить запись'}
          </button>
        </div>

        {/* Right: calendar + time slots */}
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-cream/60">‹</button>
              <span className="font-semibold text-cream text-sm">{MONTHS[calMonth]} {calYear}</span>
              <button type="button" onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-cream/60">›</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-cream/40 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const ymd = toYMD(new Date(calYear, calMonth, day))
                const disabled = isDisabled(day)
                const selected = ymd === selectedDate
                return (
                  <button key={i} type="button" disabled={disabled}
                    onClick={() => { setSelectedDate(ymd); setSelectedTime('') }}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                      ${disabled ? 'text-cream/20 cursor-not-allowed' : selected ? 'bg-gold text-white' : 'hover:bg-gold/10 text-cream/80'}`}>
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {selectedDate && (
            <div>
              <p className="text-xs font-semibold text-cream/40 uppercase tracking-wide mb-2">Утро · 10:00–13:00</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-3">{MORNING_SLOTS.map(renderSlot)}</div>
              <p className="text-xs font-semibold text-cream/40 uppercase tracking-wide mb-2">День · 14:00–19:00</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">{AFTERNOON_SLOTS.map(renderSlot)}</div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
