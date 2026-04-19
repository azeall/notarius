'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SERVICES = [
  'Наследство и завещания',
  'Сделки с недвижимостью',
  'Доверенности',
  'Заверение копий и справок',
  'Брачный договор',
  'Согласие супруга',
  'Нотариальный перевод',
  'Другое',
]

const MORNING = ['10:00','10:30','11:00','11:30','12:00','12:30']
const AFTERNOON = ['14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30']
const ALL_TIMES = [...MORNING, ...AFTERNOON]

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function AdminAddForm() {
  const router = useRouter()
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState(SERVICES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!selectedDate) return
    fetch(`/api/appointments?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => setBookedTimes(data.booked ?? []))
      .catch(() => {})
  }, [selectedDate])

  // Build calendar grid
  const firstDay = new Date(calYear, calMonth, 1)
  const lastDay = new Date(calYear, calMonth + 1, 0)
  // Monday-based week offset
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
    setLoading(true); setError('')
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, service, date: selectedDate, time: selectedTime }),
    })
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setName(''); setPhone(''); setService(SERVICES[0])
      setSelectedDate(''); setSelectedTime(''); setBookedTimes([])
      setTimeout(() => { setSuccess(false); router.refresh() }, 1500)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Это время уже занято')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
      <h2 className="font-serif text-navy text-xl font-bold mb-6">Добавить запись вручную</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Услуга</label>
            <select
              value={service}
              onChange={e => setService(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50"
            >
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">ФИО клиента</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Телефон</label>
            <input
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+7 (999) 000-00-00"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50"
            />
          </div>

          {selectedDate && selectedTime && (
            <div className="rounded-xl bg-navy/5 border border-navy/10 px-4 py-3 text-sm text-navy">
              <p className="font-semibold mb-0.5">Итог записи:</p>
              <p>{service}</p>
              <p>{selectedDate.split('-').reverse().join('.')} в {selectedTime}</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">✓ Запись успешно добавлена!</p>}

          <button
            type="submit"
            disabled={loading || !selectedDate || !selectedTime}
            className="w-full bg-gold text-navy font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-40 text-sm"
          >
            {loading ? 'Сохранение...' : 'Добавить запись'}
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Утро</p>
              <div className="grid grid-cols-6 gap-1.5 mb-3">
                {MORNING.map(t => {
                  const booked = bookedTimes.includes(t)
                  const sel = t === selectedTime
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedTime(t)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${booked ? 'bg-gray-100 text-gray-300 line-through cursor-not-allowed' : sel ? 'bg-gold text-navy' : 'bg-gray-50 text-gray-700 hover:bg-gold/10 border border-gray-200'}`}
                    >{t}</button>
                  )
                })}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">День</p>
              <div className="grid grid-cols-6 gap-1.5">
                {AFTERNOON.map(t => {
                  const booked = bookedTimes.includes(t)
                  const sel = t === selectedTime
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedTime(t)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${booked ? 'bg-gray-100 text-gray-300 line-through cursor-not-allowed' : sel ? 'bg-gold text-navy' : 'bg-gray-50 text-gray-700 hover:bg-gold/10 border border-gray-200'}`}
                    >{t}</button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
