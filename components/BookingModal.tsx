'use client'
import { useState, useEffect } from 'react'

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

const MORNING = ['10:00','10:30','11:00','11:30','12:00','12:30']
const AFTERNOON = ['14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30']

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']

function fmtDate(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}
function isWeekday(y: number, m: number, d: number) {
  const day = new Date(y, m, d).getDay()
  return day !== 0 && day !== 6
}

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const today = new Date()
  const [step, setStep] = useState<1|2|3>(1)
  const [service, setService] = useState('')
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [day, setDay] = useState<number|null>(null)
  const [time, setTime] = useState('')
  const [booked, setBooked] = useState<string[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selDate = day ? fmtDate(year, month, day) : null

  useEffect(() => {
    if (!selDate) return
    fetch(`/api/appointments?date=${selDate}`)
      .then(r => r.json())
      .then(d => setBooked(d.bookedTimes ?? []))
      .catch(() => {})
  }, [selDate])

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
        body: JSON.stringify({ name, phone, service, date: selDate, time }),
      })
      if (res.ok) { setStep(3) }
      else { const d = await res.json(); setError(d.error ?? 'Ошибка') }
    } catch { setError('Ошибка соединения') }
    setLoading(false)
  }

  const SlotBtn = ({ t }: { t: string }) => {
    const isBooked = booked.includes(t)
    const isSel = time === t
    return (
      <button
        disabled={isBooked}
        onClick={() => setTime(t)}
        className={`text-xs py-2 rounded-lg border transition-all
          ${isSel ? 'bg-gold border-gold text-navy font-bold' : ''}
          ${isBooked ? 'border-white/5 bg-white/3 text-gray-600 cursor-not-allowed line-through' : ''}
          ${!isSel && !isBooked ? 'border-white/10 text-gray-300 hover:border-gold/50 hover:text-white' : ''}
        `}
      >
        {t}
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a2a4a] rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
          <h2 className="font-serif text-xl text-white font-bold">Запись на приём</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none transition-colors">&times;</button>
        </div>

        <div className="p-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Service */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Услуга</label>
                <select
                  value={service}
                  onChange={e => setService(e.target.value)}
                  className="w-full bg-[#111d33] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50"
                >
                  <option value="">— Выберите услугу —</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Calendar */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Дата</label>
                <div className="bg-[#111d33] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={prevMonth} className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">‹</button>
                    <span className="text-white text-sm font-medium">{MONTHS[month]} {year}</span>
                    <button onClick={nextMonth} className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">›</button>
                  </div>
                  <div className="grid grid-cols-7 mb-1">
                    {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => (
                      <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
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
                            ${sel ? 'bg-gold text-navy font-bold' : ''}
                            ${wd && !past && !sel ? 'text-white hover:bg-white/10' : ''}
                            ${(!wd || past) ? 'text-gray-600 cursor-not-allowed' : ''}
                          `}
                        >
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Time slots */}
              {day && (
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-3 block">Время</label>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Утро · 10:00 – 13:15</p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {MORNING.map(t => <SlotBtn key={t} t={t} />)}
                    </div>
                    <p className="text-xs text-gray-500">День · 14:00 – 19:00</p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {AFTERNOON.map(t => <SlotBtn key={t} t={t} />)}
                    </div>
                    <div className="flex gap-4 pt-1">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded border border-white/10 bg-transparent inline-block"/>Свободно</span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded border border-gold bg-gold inline-block"/>Выбрано</span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded border border-white/5 bg-white/5 inline-block"/>Занято</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={!service || !day || !time}
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-gold text-navy font-semibold text-sm disabled:opacity-30 hover:brightness-110 transition-all mt-2"
              >
                Далее →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#111d33] rounded-xl p-4 text-sm space-y-1.5">
                <p className="text-gray-400">Услуга: <span className="text-white">{service}</span></p>
                <p className="text-gray-400">Дата и время: <span className="text-gold font-medium">{selDate} в {time}</span></p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">ФИО</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="w-full bg-[#111d33] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Телефон</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full bg-[#111d33] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50 placeholder-gray-600"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/30 transition-colors">
                  ← Назад
                </button>
                <button
                  disabled={loading}
                  onClick={submit}
                  className="flex-1 py-3 rounded-xl bg-gold text-navy font-semibold text-sm disabled:opacity-50 hover:brightness-110 transition-all"
                >
                  {loading ? 'Отправка…' : 'Записаться'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto">
                <span className="text-gold text-2xl">✓</span>
              </div>
              <h3 className="text-white font-serif text-xl">Запись подтверждена!</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ждём вас <span className="text-white">{selDate}</span> в <span className="text-gold font-medium">{time}</span>.<br />
                При необходимости мы свяжемся с вами для подтверждения.
              </p>
              <button onClick={onClose} className="mt-2 px-8 py-3 rounded-xl bg-gold text-navy font-semibold text-sm hover:brightness-110 transition-all">
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
