'use client'
import { useEffect, useState } from 'react'
import BookingModal from './BookingModal'
import { MORNING_SLOTS, AFTERNOON_SLOTS } from '@/lib/slots'

const MSK_OFFSET = 3

const SCHEDULE: Record<number, [number, number][]> = {
  0: [], 1: [[10, 19]], 2: [[10, 19]], 3: [[10, 19]], 4: [[10, 19]],
  5: [[10, 13], [14, 18]], 6: [],
}

const FRI_AFTERNOON = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
const DAY_SLOTS: Record<number, string[]> = {
  0: [], 1: [...MORNING_SLOTS, ...AFTERNOON_SLOTS], 2: [...MORNING_SLOTS, ...AFTERNOON_SLOTS],
  3: [...MORNING_SLOTS, ...AFTERNOON_SLOTS], 4: [...MORNING_SLOTS, ...AFTERNOON_SLOTS],
  5: [...MORNING_SLOTS, ...FRI_AFTERNOON], 6: [],
}

function getMsk(): Date {
  const now = new Date()
  return new Date(now.getTime() + (now.getTimezoneOffset() + MSK_OFFSET * 60) * 60_000)
}

function slotToMinutes(slot: string): number {
  const [h, m] = slot.split(':').map(Number)
  return h * 60 + m
}

interface StatusInfo {
  isOpen: boolean
  closesIn?: string
  opensAt?: string
}

const DAY_NAMES: Record<number, string> = {
  1: 'пн', 2: 'вт', 3: 'ср', 4: 'чт', 5: 'пт', 6: 'сб', 0: 'вс',
}

function pad2(n: number) { return String(n).padStart(2, '0') }

function computeStatus(msk: Date): StatusInfo {
  const nowMin = msk.getHours() * 60 + msk.getMinutes()
  const day = msk.getDay()
  for (const [openH, closeH] of SCHEDULE[day] ?? []) {
    if (nowMin >= openH * 60 && nowMin < closeH * 60) {
      const rem = closeH * 60 - nowMin
      return { isOpen: true, closesIn: rem >= 60 ? `через ${Math.floor(rem / 60)} ч` : `через ${rem} мин` }
    }
  }
  for (let d = 0; d <= 6; d++) {
    const checkDay = (day + d) % 7
    for (const [openH, closeH] of SCHEDULE[checkDay] ?? []) {
      if (d === 0 && nowMin >= closeH * 60) continue
      if (d === 0 && nowMin < openH * 60) {
        const mins = openH * 60 - nowMin
        return { isOpen: false, opensAt: mins < 60 ? `через ${mins} мин` : `сегодня в ${pad2(openH)}:00` }
      }
      if (d > 0) return { isOpen: false, opensAt: `${d === 1 ? 'завтра' : 'в ' + DAY_NAMES[checkDay]} в ${pad2(openH)}:00` }
    }
  }
  return { isOpen: false }
}

interface NearSlot { date: Date; slot: string; label: string }

function nextSlots(msk: Date, count: number): NearSlot[] {
  const results: NearSlot[] = []
  const nowMin = msk.getHours() * 60 + msk.getMinutes()
  for (let d = 0; d <= 6 && results.length < count; d++) {
    const date = new Date(msk)
    date.setDate(date.getDate() + d)
    const dow = date.getDay()
    for (const slot of DAY_SLOTS[dow] ?? []) {
      if (results.length >= count) break
      if (d === 0 && slotToMinutes(slot) < nowMin + 15) continue
      const prefix = d === 0 ? 'сегодня' : d === 1 ? 'завтра' : DAY_NAMES[dow]
      results.push({ date, slot, label: `${prefix} · ${slot}` })
    }
  }
  return results
}

const LS_CSS = `
.ls{display:flex;align-items:center;flex-wrap:wrap;gap:10px 14px;min-height:26px;
            font-size:13px;color:rgb(var(--muted-rgb));}
          .ls-date{font-family:var(--font-mono),monospace;letter-spacing:.02em;}
          .ls-sep{width:1px;height:13px;background:rgb(var(--rule-rgb));flex:none;}
          .ls-state{display:inline-flex;align-items:center;gap:8px;color:rgb(var(--text-rgb));font-weight:500;}
          .ls-dot{width:6px;height:6px;border-radius:50%;background:rgb(var(--muted-rgb));flex:none;}
          .ls-state.is-open .ls-dot{background:rgb(var(--ok-rgb));animation:lsPulse 2.4s ease-in-out infinite;}
          @keyframes lsPulse{0%,100%{opacity:1;}50%{opacity:.35;}}
          .ls-tail{color:rgb(var(--muted-rgb));font-weight:400;}
          .ls-lbl{font-size:11px;letter-spacing:.18em;text-transform:uppercase;}
          .ls-slots{display:inline-flex;flex-wrap:wrap;gap:6px;}
          .ls-slot{font-family:var(--font-mono),monospace;font-size:12px;padding:5px 10px;
            border:1px solid rgb(var(--rule-rgb));background:transparent;color:rgb(var(--text-rgb));
            cursor:pointer;transition:background-color .25s ease,border-color .25s ease,color .25s ease;}
          .ls-slot:hover{background:rgb(var(--text-rgb));border-color:rgb(var(--text-rgb));color:rgb(var(--bg-rgb));}
          @media (prefers-reduced-motion:reduce){.ls-state.is-open .ls-dot{animation:none;}}
          @media (max-width:640px){.ls-sep{display:none;}.ls-lbl{display:none;}}
`

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

/**
 * Строка состояния конторы: дата, открыто ли сейчас и ближайшие свободные
 * окна, по которым можно записаться в один щелчок.
 *
 * Стоит на первом экране вместо прежнего медальона. Медальон был одинаковым
 * украшением на всех четырёх сайтах и ничего не сообщал; эта строка меняется
 * каждую минуту и отвечает на первый вопрос пришедшего — «вы сейчас
 * работаете и когда к вам можно».
 *
 * Считается на клиенте после монтирования: время у посетителя своё, и
 * отрисовать это на сервере значит разойтись с разметкой при гидратации.
 * До первого расчёта полоса уже занимает свою высоту, иначе первый экран
 * подпрыгивает.
 */
export default function LiveStatus() {
  const [status, setStatus] = useState<StatusInfo | null>(null)
  const [slots, setSlots] = useState<NearSlot[]>([])
  const [today, setToday] = useState('')
  const [modal, setModal] = useState<{ date: Date; time: string } | null>(null)

  useEffect(() => {
    function refresh() {
      const msk = getMsk()
      setStatus(computeStatus(msk))
      setSlots(nextSlots(msk, 3))
      setToday(`${msk.getDate()} ${MONTHS[msk.getMonth()]}`)
    }
    refresh()
    const t = setInterval(refresh, 60_000)
    return () => clearInterval(t)
  }, [])

  // Пока состояние не посчитано, полоса уже занимает своё место: иначе
  // первый экран дёргается, когда строка появляется.
  if (!status) return (
    <div className="ls" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: LS_CSS }} />
    </div>
  )

  const initialDate = modal
    ? { year: modal.date.getFullYear(), month: modal.date.getMonth(), day: modal.date.getDate() }
    : undefined

  return (
    <>
      <div className="ls">
        <style dangerouslySetInnerHTML={{ __html: LS_CSS }} />
        <span className="ls-date">{today}</span>
        <span className="ls-sep" aria-hidden />
        <span className={`ls-state ${status.isOpen ? 'is-open' : ''}`}>
          <span className="ls-dot" aria-hidden />
          {status.isOpen ? 'Открыто' : 'Закрыто'}
          {status.isOpen && status.closesIn && <span className="ls-tail"> · до закрытия {status.closesIn}</span>}
          {!status.isOpen && status.opensAt && <span className="ls-tail"> · откроется {status.opensAt}</span>}
        </span>

        {slots.length > 0 && (
          <>
            <span className="ls-sep" aria-hidden />
            <span className="ls-lbl">Ближайшая запись</span>
            <span className="ls-slots">
              {slots.map(s => (
                <button key={s.label} className="ls-slot" onClick={() => setModal({ date: s.date, time: s.slot })}>
                  {s.label}
                </button>
              ))}
            </span>
          </>
        )}

      </div>
      {modal && (
        <BookingModal onClose={() => setModal(null)} initialDate={initialDate} initialTime={modal.time} />
      )}
    </>
  )
}
