'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { STAFF_LIST } from '@/lib/staff'
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
  const [assigneeId, setAssigneeId] = useState<string | null>(defaultStaffId ?? null)

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

  // Build calendar grid
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
    if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11) }
    else setCalMonth(m => m-1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0) }
    else setCalMonth(m => m+1)
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
    let cls = 'bg-gray-50 text-gray-700 hover:bg-gold/10 border border-gray-200'
    if (isBooked && !isStart) cls = 'bg-gray-100 text-gray-300 line-through cursor-not-allowed border border-gray-100'
    if (isStart) cls = 'bg-gold text-navy font-bold border border-gold'
    else if (isInSelection && !conflict) cls = 'bg-gold/30 text-navy border border-gold/60'
    else if (isInSelection && conflict) cls = 'bg-red-100 text-red-600 border border-red-300'
    return (
      <button
        key={t}
        type="button"
        disabled={isBooked}
        onClick={() => setSelectedTime(t)}
        className={`py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors ${cls}`}
      >
        {t}
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8 sm:mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 sm:mb-6">
        <h2 className="font-serif text-navy text-lg sm:text-xl font-bold">Добавить запись вручную</h2>
        <span className="text-xs text-gray-500">Приём: {WORKING_HOURS_LABEL}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left: fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Услуга</label>
            <select
              value={service}
              onChange={e => { const svc = e.target.value; setService(svc); setDuration(defaultDurationForService(svc)) }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50"
            >
              {SERVICES.map(s => <option key={s} className="text-gray-900">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">ФИО клиента</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Телефон</label>
            <input
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+7 (999) 000-00-00"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Длительность</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {filteredDurations.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`py-2 rounded-lg text-xs font-medium transition-colors
                    ${duration === d
                      ? 'bg-gold text-navy border border-gold'
                      : 'bg-gray-50 text-gray-700 hover:bg-gold/10 border border-gray-200'}`}
                >
                  {d < 60 ? `${d} мин` : d % 60 === 0 ? `${d/60} ч` : `${Math.floor(d/60)}ч ${d%60}м`}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                !selectionFits || selectionConflicts
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-navy/5 border border-navy/10 text-navy'
              }`}
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

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">✓ Запись успешно добавлена!</p>}

          <button
            type="submit"
            disabled={loading || !selectedDate || !selectedTime || !selectionFits || selectionConflicts}
            className="w-full bg-gold text-navy font-bold py-3 rounded-xl hover:brightness-110 transition-all disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-sm"
          >
            {loading
              ? 'Сохранение...'
              : !selectedDate
                ? 'Выберите дату ниже'
                : !selectedTime
                  ? 'Выберите время ниже'
                  : !selectionFits
                    ? 'Не помещается в рабочее время'
                    : selectionConflicts
                      ? 'Время пересекается с занятым'
                      : 'Добавить запись'}
          </button>
        </div>

        {/* Right: calendar + time slots */}
        <div>
          {/* Calendar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">‹</button>
              <span className="font-semibold text-navy text-sm">{MONTHS[calMonth]} {calYear}</span>
              <button type="button" onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">›</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const ymd = toYMD(new Date(calYear, calMonth, day))
                const disabled = isDisabled(day)
                const selected = ymd === selectedDate
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => { setSelectedDate(ymd); setSelectedTime('') }}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                      ${disabled ? 'text-gray-300 cursor-not-allowed' : selected ? 'bg-gold text-navy' : 'hover:bg-gold/10 text-gray-700'}`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Утро · 10:00–13:00</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-3">
                {MORNING_SLOTS.map(renderSlot)}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">День · 14:00–19:00</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {AFTERNOON_SLOTS.map(renderSlot)}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
