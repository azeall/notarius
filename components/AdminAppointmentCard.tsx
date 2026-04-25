'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { STAFF_LIST } from '@/lib/staff'
import {
  AFTERNOON_SLOTS,
  DURATION_OPTIONS,
  MORNING_SLOTS,
  endTime,
  expandSlots,
} from '@/lib/slots'

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

function fmtDurLabel(d: number) {
  return d < 60 ? `${d} мин` : d % 60 === 0 ? `${d / 60} ч` : `${Math.floor(d / 60)}ч ${d % 60}м`
}

function fmtDateRu(ymd: string) {
  const [y, m, d] = ymd.split('-')
  return `${d}.${m}.${y}`
}

function addDays(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + delta)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

function isWeekend(ymd: string): boolean {
  const [y, m, d] = ymd.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay()
  return dow === 0 || dow === 6
}

function stepWeekday(ymd: string, dir: 1 | -1): string {
  let next = addDays(ymd, dir)
  while (isWeekend(next)) next = addDays(next, dir)
  return next
}

export default function AdminAppointmentCard({ a }: { a: Appointment }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [date, setDate] = useState(a.date)
  const [time, setTime] = useState(a.time)
  const [duration, setDuration] = useState<number>(a.duration)
  const [dayBooked, setDayBooked] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [reassigning, setReassigning] = useState(false)
  const [newAssignee, setNewAssignee] = useState<string>('')

  // При открытии / смене даты подгружаем занятость
  useEffect(() => {
    if (!editing) return
    fetch(`/api/appointments?date=${date}`)
      .then(r => r.json())
      .then(d => setDayBooked(Array.isArray(d.booked) ? d.booked : []))
      .catch(() => setDayBooked([]))
  }, [date, editing])

  // Слоты, которые занимает ИСХОДНАЯ запись (a.time, a.duration) — важно,
  // чтобы на своей дате не показывать их «занятыми».
  const ownOriginalSlots = useMemo(() => new Set(expandSlots(a.time, a.duration)), [a.time, a.duration])

  // Итоговый набор «реально заблокированных для меня» слотов
  const blockedSet = useMemo(() => {
    const set = new Set(dayBooked)
    if (date === a.date) {
      for (const s of ownOriginalSlots) set.delete(s)
    }
    return set
  }, [dayBooked, date, a.date, ownOriginalSlots])

  // Слоты нового выбора (start + duration)
  const selectionSlots = useMemo(() => {
    if (!time) return new Set<string>()
    return new Set(expandSlots(time, duration))
  }, [time, duration])

  const selectionFits = selectionSlots.size > 0
  const selectionConflicts = [...selectionSlots].some(s => blockedSet.has(s))

  const changed = date !== a.date || time !== a.time || duration !== a.duration

  async function reassign() {
    const staffId = newAssignee === '' ? null : newAssignee
    setBusy(true); setErr('')
    const res = await fetch(`/api/admin/appointments/${a.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId }),
    })
    setBusy(false)
    if (res.ok) { setReassigning(false); router.refresh() }
    else { const d = await res.json().catch(() => ({})); setErr(d.error ?? 'Ошибка') }
  }

  function startEdit() {
    setEditing(true)
    setDate(a.date)
    setTime(a.time)
    setDuration(a.duration)
    setDayBooked([])
    setErr('')
  }

  function cancelEdit() {
    setEditing(false)
    setErr('')
  }

  async function save() {
    if (!selectionFits || selectionConflicts) {
      setErr(!selectionFits ? 'Не помещается в рабочее время' : 'Пересечение с другой записью')
      return
    }
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

  function renderSlot(t: string) {
    const isBlocked = blockedSet.has(t)
    const isStart = t === time
    const isInSelection = selectionSlots.has(t)
    const isOwnOriginal = date === a.date && ownOriginalSlots.has(t) && !isInSelection

    let cls = 'bg-gray-50 text-gray-700 hover:bg-gold/20 border border-gray-200'
    if (isBlocked && isInSelection) cls = 'bg-red-100 text-red-700 border border-red-300 line-through cursor-not-allowed'
    else if (isBlocked) cls = 'bg-gray-100 text-gray-300 line-through cursor-not-allowed border border-gray-100'
    else if (isStart) cls = 'bg-gold text-navy font-bold border border-gold shadow-sm'
    else if (isInSelection) cls = 'bg-gold/30 text-navy border border-gold/60'
    else if (isOwnOriginal) cls = 'bg-navy/5 text-navy/70 border border-navy/20 border-dashed'

    return (
      <button
        key={t}
        type="button"
        disabled={isBlocked}
        onClick={() => setTime(t)}
        className={`py-2 rounded-md text-[11px] sm:text-xs font-medium transition-colors ${cls}`}
        title={isBlocked ? 'Занято другой записью' : isOwnOriginal ? 'Текущее время записи' : 'Свободно'}
      >
        {t}
      </button>
    )
  }

  // ────────────────────── VIEW ──────────────────────
  if (!editing) {
    return (
      <div className="w-full min-w-0 bg-white rounded-2xl px-3 sm:px-6 py-3 sm:py-5 shadow-sm border border-gray-100 hover:border-gold/30 transition-colors">
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
                onClick={startEdit}
                className="text-[11px] sm:text-xs text-gray-500 hover:text-navy border border-gray-200 hover:border-navy/30 rounded-md px-2 py-1 transition-colors"
              >
                Изменить
              </button>
              <button
                onClick={del}
                disabled={busy}
                className="text-[11px] sm:text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-md px-2 py-1 transition-colors disabled:opacity-50"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ────────────────────── EDIT ──────────────────────
  return (
    <div className="w-full min-w-0 bg-white rounded-2xl px-3 sm:px-6 py-4 sm:py-5 shadow-md border-2 border-gold/40">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
          <span className="text-gold font-bold text-base">{a.name.charAt(0)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{a.name}</p>
          <p className="text-gray-500 text-xs truncate">{a.phone} · {a.service}</p>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-gold font-semibold bg-gold/10 border border-gold/30 px-2 py-1 rounded-md">
          Редактирование
        </span>
      </div>

      {/* Date stepper */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1.5">Дата</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDate(d => stepWeekday(d, -1))}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gold hover:text-gold transition-colors"
            title="Предыдущий рабочий день"
          >
            ‹
          </button>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value || a.date)}
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-gold font-medium text-center"
          />
          <button
            type="button"
            onClick={() => setDate(d => stepWeekday(d, +1))}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gold hover:text-gold transition-colors"
            title="Следующий рабочий день"
          >
            ›
          </button>
          {date !== a.date && (
            <button
              type="button"
              onClick={() => setDate(a.date)}
              className="text-[11px] text-gray-500 underline-offset-2 hover:underline whitespace-nowrap"
            >
              к исходной
            </button>
          )}
        </div>
      </div>

      {/* Duration pills */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1.5">Длительность</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {DURATION_OPTIONS.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={`py-2 rounded-md text-xs font-medium transition-colors
                ${duration === d
                  ? 'bg-gold text-navy border border-gold'
                  : 'bg-gray-50 text-gray-700 hover:bg-gold/10 border border-gray-200'}`}
            >
              {fmtDurLabel(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Time slot picker */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-2">Время (клик = новое начало)</label>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Утро · 10:00–13:00</p>
        <div className="grid grid-cols-6 gap-1.5 mb-2.5">
          {MORNING_SLOTS.map(renderSlot)}
        </div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">День · 14:00–19:00</p>
        <div className="grid grid-cols-5 gap-1.5">
          {AFTERNOON_SLOTS.map(renderSlot)}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[10px] text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gold" /> новое начало</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gold/30 border border-gold/60" /> продолжение</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border border-navy/30 border-dashed" /> исходное</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gray-100" /> занято</span>
        </div>
      </div>

      {/* Preview */}
      <div
        className={`rounded-md px-3 py-2 text-sm mb-3 ${
          !selectionFits || selectionConflicts
            ? 'bg-red-50 border border-red-200 text-red-700'
            : changed
              ? 'bg-gold/10 border border-gold/30 text-navy'
              : 'bg-gray-50 border border-gray-200 text-gray-600'
        }`}
      >
        {!selectionFits
          ? 'Не помещается в рабочее время'
          : selectionConflicts
            ? 'Пересекается с другой записью'
            : changed
              ? <>Перенос: <b>{fmtDateRu(a.date)} {a.time}–{endTime(a.time, a.duration)}</b> → <b>{fmtDateRu(date)} {time}–{endTime(time, duration)}</b></>
              : <>Без изменений: {fmtDateRu(date)} {time}–{endTime(time, duration)}</>}
      </div>

      {err && <p className="text-red-600 text-xs mb-2">{err}</p>}

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={busy || !changed || !selectionFits || selectionConflicts}
          className="flex-1 bg-gold text-navy font-semibold text-sm py-2.5 rounded-md hover:brightness-110 transition-all disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {busy ? 'Сохранение…' : changed ? 'Сохранить' : 'Нет изменений'}
        </button>
        <button
          onClick={cancelEdit}
          className="flex-1 sm:flex-initial sm:px-6 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-md hover:border-gray-400 transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>
  )
}
