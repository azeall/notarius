'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { STAFF_LIST } from '@/lib/staff'
import { notary } from '@/lib/data'
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
  staffId?: string | null
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

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  completed: { label: 'Состоялась', color: '#6fbf99', bg: 'rgba(79,157,122,0.14)', border: 'rgba(79,157,122,0.4)' },
  no_show:   { label: 'Не пришёл',  color: '#e0a33a', bg: 'rgba(224,163,58,0.14)', border: 'rgba(224,163,58,0.4)' },
  cancelled: { label: 'Отменена',   color: '#9aa5b8', bg: 'rgba(154,165,184,0.12)', border: 'rgba(154,165,184,0.35)' },
}

export default function AdminAppointmentCard({ a, isAdmin }: { a: Appointment; isAdmin?: boolean }) {
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

  useEffect(() => {
    if (!editing) return
    fetch(`/api/appointments?date=${date}`)
      .then(r => r.json())
      .then(d => setDayBooked(Array.isArray(d.booked) ? d.booked : []))
      .catch(() => setDayBooked([]))
  }, [date, editing])

  const ownOriginalSlots = useMemo(() => new Set(expandSlots(a.time, a.duration)), [a.time, a.duration])

  const blockedSet = useMemo(() => {
    const set = new Set(dayBooked)
    if (date === a.date) {
      for (const s of ownOriginalSlots) set.delete(s)
    }
    return set
  }, [dayBooked, date, a.date, ownOriginalSlots])

  const selectionSlots = useMemo(() => {
    if (!time) return new Set<string>()
    return new Set(expandSlots(time, duration))
  }, [time, duration])

  const selectionFits = selectionSlots.size > 0
  const selectionConflicts = [...selectionSlots].some(s => blockedSet.has(s))
  const changed = date !== a.date || time !== a.time || duration !== a.duration

  const phoneDigits = a.phone.replace(/\D/g, '')
  const waText = encodeURIComponent(
    `Здравствуйте, ${a.name}! Напоминаем о записи к нотариусу ${notary.name}: ${fmtDateRu(a.date)} в ${a.time}. ` +
    `Адрес: ${notary.address}. Телефон: ${notary.phone}.`,
  )
  const waHref = `https://wa.me/${phoneDigits}?text=${waText}`

  async function setStatus(status: string) {
    setBusy(true); setErr('')
    const res = await fetch(`/api/admin/appointments/${a.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setBusy(false)
    if (res.ok) router.refresh()
    else { const d = await res.json().catch(() => ({})); setErr(d.error ?? 'Ошибка') }
  }

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
    setEditing(true); setDate(a.date); setTime(a.time); setDuration(a.duration); setDayBooked([]); setErr('')
  }
  function cancelEdit() { setEditing(false); setErr('') }

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
    if (res.ok) router.refresh()
    else { const d = await res.json().catch(() => ({})); setErr(d.error ?? 'Не удалось удалить') }
  }

  function renderSlot(t: string) {
    const isBlocked = blockedSet.has(t)
    const isStart = t === time
    const isInSelection = selectionSlots.has(t)
    const isOwnOriginal = date === a.date && ownOriginalSlots.has(t) && !isInSelection

    let cls = 'text-cream/80 border border-[rgba(192,92,46,0.15)] hover:bg-gold/15'
    let style: React.CSSProperties = { background: 'rgba(0,0,0,0.03)' }
    if (isBlocked && isInSelection) { cls = 'text-red-300 border border-red-500/40 line-through cursor-not-allowed'; style = { background: 'rgba(239,68,68,0.15)' } }
    else if (isBlocked) { cls = 'text-cream/20 line-through cursor-not-allowed border border-black/5'; style = { background: 'rgba(0,0,0,0.02)' } }
    else if (isStart) { cls = 'text-white font-bold border border-gold'; style = { background: '#c05c2e' } }
    else if (isInSelection) { cls = 'text-cream border border-gold/50'; style = { background: 'rgba(192,92,46,0.28)' } }
    else if (isOwnOriginal) { cls = 'text-cream/60 border border-dashed'; style = { background: 'rgba(0,0,0,0.04)', borderColor: 'rgba(192,92,46,0.35)' } }

    return (
      <button
        key={t}
        type="button"
        disabled={isBlocked}
        onClick={() => setTime(t)}
        className={`py-2 rounded-md text-[11px] sm:text-xs font-medium transition-colors ${cls}`}
        style={style}
        title={isBlocked ? 'Занято другой записью' : isOwnOriginal ? 'Текущее время записи' : 'Свободно'}
      >
        {t}
      </button>
    )
  }

  const statusMeta = a.status !== 'active' ? STATUS_META[a.status] : null
  const dimmed = a.status === 'cancelled' || a.status === 'no_show'

  // ────────────────────── VIEW ──────────────────────
  if (!editing) {
    return (
      <div
        className="w-full min-w-0 rounded-2xl px-3 sm:px-5 py-3 sm:py-4 transition-colors"
        style={{
          background: '#fdf8ef',
          border: '1px solid rgba(192,92,46,0.15)',
          opacity: dimmed ? 0.65 : 1,
        }}
      >
        {/* Top: client + time */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-bold text-sm sm:text-lg">{a.name.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-cream text-sm sm:text-lg leading-tight truncate">{a.name}</p>
              <p className="text-slate text-xs sm:text-sm mt-0.5 truncate">{a.phone}</p>
              <p className="text-gold/80 text-xs sm:text-sm mt-1 font-medium truncate">{a.service}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="inline-block bg-gold text-white font-bold text-xs sm:text-base px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg whitespace-nowrap">
              {a.time}–{endTime(a.time, a.duration)}
            </span>
            <span className="text-[10px] sm:text-xs text-cream/40">{fmtDurLabel(a.duration)}</span>
            {statusMeta && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{ color: statusMeta.color, background: statusMeta.bg, border: `1px solid ${statusMeta.border}` }}
              >
                {statusMeta.label}
              </span>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(192,92,46,0.10)' }}>
          {/* Contact */}
          <a
            href={`tel:+${phoneDigits}`}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-cream/80 rounded-md px-2.5 py-1.5 transition-colors hover:text-gold"
            style={{ border: '1px solid rgba(192,92,46,0.18)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Позвонить
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium rounded-md px-2.5 py-1.5 transition-opacity hover:opacity-80"
            style={{ color: '#6fbf99', border: '1px solid rgba(79,157,122,0.35)' }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
            </svg>
            WhatsApp
          </a>

          <span className="mx-0.5 w-px h-4 self-center" style={{ background: 'rgba(192,92,46,0.15)' }} />

          {/* Status */}
          {a.status === 'active' ? (
            <>
              <button onClick={() => setStatus('completed')} disabled={busy}
                className="text-[11px] sm:text-xs rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50 hover:opacity-80"
                style={{ color: '#6fbf99', border: '1px solid rgba(79,157,122,0.30)' }}>
                Состоялась
              </button>
              <button onClick={() => setStatus('no_show')} disabled={busy}
                className="text-[11px] sm:text-xs rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50 hover:opacity-80"
                style={{ color: '#e0a33a', border: '1px solid rgba(224,163,58,0.30)' }}>
                Не пришёл
              </button>
            </>
          ) : (
            <button onClick={() => setStatus('active')} disabled={busy}
              className="text-[11px] sm:text-xs text-cream/60 rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50 hover:text-cream"
              style={{ border: '1px solid rgba(192,92,46,0.18)' }}>
              Вернуть в активные
            </button>
          )}

          <span className="mx-0.5 w-px h-4 self-center" style={{ background: 'rgba(192,92,46,0.15)' }} />

          {/* Manage */}
          <button onClick={startEdit}
            className="text-[11px] sm:text-xs text-cream/70 hover:text-gold rounded-md px-2.5 py-1.5 transition-colors"
            style={{ border: '1px solid rgba(192,92,46,0.18)' }}>
            Перенести
          </button>
          {isAdmin && (
            <button onClick={() => { setReassigning(r => !r); setNewAssignee(a.staffId ?? '') }}
              className="text-[11px] sm:text-xs rounded-md px-2.5 py-1.5 transition-colors hover:opacity-80"
              style={{ color: '#7fb3f5', border: '1px solid rgba(96,165,250,0.30)' }}>
              Передать
            </button>
          )}
          <button onClick={del} disabled={busy}
            className="text-[11px] sm:text-xs rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50 hover:opacity-80"
            style={{ color: '#e07a7a', border: '1px solid rgba(224,122,122,0.30)' }}>
            Удалить
          </button>
        </div>

        {isAdmin && reassigning && (
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            <select
              value={newAssignee}
              onChange={e => setNewAssignee(e.target.value)}
              className="text-xs rounded-md px-2 py-1.5 text-cream focus:outline-none focus:border-gold"
              style={{ background: '#f5ede0', border: '1px solid rgba(192,92,46,0.25)' }}
            >
              <option value="">Нотариус</option>
              {STAFF_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button onClick={reassign} disabled={busy}
              className="text-xs bg-gold text-white font-semibold px-3 py-1.5 rounded-md hover:brightness-110 disabled:opacity-50 whitespace-nowrap">
              {busy ? '…' : 'ОК'}
            </button>
            <button onClick={() => setReassigning(false)} className="text-sm text-cream/40 hover:text-cream px-1">×</button>
          </div>
        )}

        {err && <p className="text-red-400 text-xs mt-2">{err}</p>}
      </div>
    )
  }

  // ────────────────────── EDIT ──────────────────────
  return (
    <div className="w-full min-w-0 rounded-2xl px-3 sm:px-6 py-4 sm:py-5" style={{ background: '#fdf8ef', border: '2px solid rgba(192,92,46,0.40)' }}>
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
          <span className="text-gold font-bold text-base">{a.name.charAt(0)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-cream text-sm sm:text-base truncate">{a.name}</p>
          <p className="text-slate text-xs truncate">{a.phone} · {a.service}</p>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-gold font-semibold bg-gold/10 border border-gold/30 px-2 py-1 rounded-md">
          Перенос
        </span>
      </div>

      {/* Date stepper */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide text-cream/50 mb-1.5">Дата</label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setDate(d => stepWeekday(d, -1))}
            className="w-9 h-9 flex items-center justify-center rounded-md text-cream/70 hover:text-gold transition-colors"
            style={{ border: '1px solid rgba(192,92,46,0.20)' }} title="Предыдущий рабочий день">‹</button>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value || a.date)}
            className="flex-1 rounded-md px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold font-medium text-center"
            style={{ background: '#f5ede0', border: '1px solid rgba(192,92,46,0.20)', colorScheme: 'light' }}
          />
          <button type="button" onClick={() => setDate(d => stepWeekday(d, +1))}
            className="w-9 h-9 flex items-center justify-center rounded-md text-cream/70 hover:text-gold transition-colors"
            style={{ border: '1px solid rgba(192,92,46,0.20)' }} title="Следующий рабочий день">›</button>
          {date !== a.date && (
            <button type="button" onClick={() => setDate(a.date)}
              className="text-[11px] text-cream/50 hover:text-cream hover:underline whitespace-nowrap">к исходной</button>
          )}
        </div>
      </div>

      {/* Duration pills */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide text-cream/50 mb-1.5">Длительность</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {DURATION_OPTIONS.map(d => (
            <button key={d} type="button" onClick={() => setDuration(d)}
              className={`py-2 rounded-md text-xs font-medium transition-colors ${duration === d ? 'text-white border border-gold' : 'text-cream/80 border'}`}
              style={duration === d ? { background: '#c05c2e' } : { background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(192,92,46,0.15)' }}>
              {fmtDurLabel(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Time slot picker */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide text-cream/50 mb-2">Время (клик = новое начало)</label>
        <p className="text-[10px] font-semibold text-cream/40 uppercase tracking-wide mb-1.5">Утро · 10:00–13:00</p>
        <div className="grid grid-cols-6 gap-1.5 mb-2.5">{MORNING_SLOTS.map(renderSlot)}</div>
        <p className="text-[10px] font-semibold text-cream/40 uppercase tracking-wide mb-1.5">День · 14:00–19:00</p>
        <div className="grid grid-cols-5 gap-1.5">{AFTERNOON_SLOTS.map(renderSlot)}</div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[10px] text-cream/50">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gold" /> новое начало</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(192,92,46,0.28)' }} /> продолжение</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border border-dashed" style={{ borderColor: 'rgba(192,92,46,0.5)' }} /> исходное</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.06)' }} /> занято</span>
        </div>
      </div>

      {/* Preview */}
      <div
        className="rounded-md px-3 py-2 text-sm mb-3"
        style={
          !selectionFits || selectionConflicts
            ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }
            : changed
              ? { background: 'rgba(192,92,46,0.10)', border: '1px solid rgba(192,92,46,0.3)', color: '#3d2010' }
              : { background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(192,92,46,0.15)', color: '#7d6a55' }
        }
      >
        {!selectionFits
          ? 'Не помещается в рабочее время'
          : selectionConflicts
            ? 'Пересекается с другой записью'
            : changed
              ? <>Перенос: <b>{fmtDateRu(a.date)} {a.time}–{endTime(a.time, a.duration)}</b> → <b>{fmtDateRu(date)} {time}–{endTime(time, duration)}</b></>
              : <>Без изменений: {fmtDateRu(date)} {time}–{endTime(time, duration)}</>}
      </div>

      {err && <p className="text-red-400 text-xs mb-2">{err}</p>}

      <div className="flex gap-2">
        <button onClick={save} disabled={busy || !changed || !selectionFits || selectionConflicts}
          className="flex-1 bg-gold text-white font-semibold text-sm py-2.5 rounded-md hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {busy ? 'Сохранение…' : changed ? 'Сохранить' : 'Нет изменений'}
        </button>
        <button onClick={cancelEdit}
          className="flex-1 sm:flex-initial sm:px-6 text-cream/70 text-sm py-2.5 rounded-md hover:text-cream transition-colors"
          style={{ border: '1px solid rgba(192,92,46,0.20)' }}>
          Отмена
        </button>
      </div>
    </div>
  )
}
