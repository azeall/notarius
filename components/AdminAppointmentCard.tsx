'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DURATION_OPTIONS, endTime } from '@/lib/slots'

type Appointment = {
  id: string
  name: string
  phone: string
  service: string
  date: string
  time: string
  duration: number
  status: string
}

export default function AdminAppointmentCard({ a }: { a: Appointment }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [date, setDate] = useState(a.date)
  const [time, setTime] = useState(a.time)
  const [duration, setDuration] = useState<number>(a.duration)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function save() {
    setBusy(true); setErr('')
    const res = await fetch(`/api/admin/appointments/${a.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time, duration }),
    })
    setBusy(false)
    if (res.ok) { setEditing(false); router.refresh() }
    else { const d = await res.json().catch(() => ({})); setErr(d.error ?? 'Не удалось сохранить') }
  }

  async function del() {
    if (!window.confirm(`Удалить запись ${a.name} в ${a.time}?`)) return
    setBusy(true); setErr('')
    const res = await fetch(`/api/admin/appointments/${a.id}`, { method: 'DELETE' })
    setBusy(false)
    if (res.ok) { router.refresh() }
    else { const d = await res.json().catch(() => ({})); setErr(d.error ?? 'Не удалось удалить') }
  }

  const fmtDurLabel = (d: number) =>
    d < 60 ? `${d} мин` : d % 60 === 0 ? `${d/60} ч` : `${Math.floor(d/60)}ч ${d%60}м`

  return (
    <div className="w-full min-w-0 bg-white rounded-2xl px-3 sm:px-6 py-3 sm:py-5 shadow-sm border border-gray-100 hover:border-gold/30 transition-colors">
      {!editing ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-bold text-sm sm:text-lg">{a.name.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-sm sm:text-lg leading-tight truncate">{a.name}</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 truncate">{a.phone}</p>
              <p className="text-navy/70 text-xs sm:text-sm mt-1 font-medium truncate">{a.service}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="inline-block bg-gold text-navy font-bold text-xs sm:text-base px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg whitespace-nowrap">
              {a.time}–{endTime(a.time, a.duration)}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400">{fmtDurLabel(a.duration)}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setEditing(true)}
                className="text-[11px] sm:text-xs text-gray-500 hover:text-navy border border-gray-200 hover:border-navy/30 rounded-md px-2 py-1 transition-colors"
                title="Изменить"
              >
                Изменить
              </button>
              <button
                onClick={del}
                disabled={busy}
                className="text-[11px] sm:text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-md px-2 py-1 transition-colors disabled:opacity-50"
                title="Удалить"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-bold text-sm sm:text-lg">{a.name.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{a.name}</p>
              <p className="text-gray-500 text-xs truncate">{a.phone}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1">Дата</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1">Начало</label>
              <input
                type="time"
                step={1800}
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1">Длительность</label>
              <select
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:border-gold"
              >
                {DURATION_OPTIONS.map(d => <option key={d} value={d}>{fmtDurLabel(d)}</option>)}
              </select>
            </div>
          </div>
          {err && <p className="text-red-500 text-xs">{err}</p>}
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="flex-1 bg-gold text-navy font-semibold text-xs py-2 rounded-md hover:brightness-110 transition-all disabled:opacity-50"
            >
              {busy ? 'Сохранение…' : 'Сохранить'}
            </button>
            <button
              onClick={() => { setEditing(false); setDate(a.date); setTime(a.time); setDuration(a.duration); setErr('') }}
              className="flex-1 border border-gray-200 text-gray-600 text-xs py-2 rounded-md hover:border-gray-400 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
