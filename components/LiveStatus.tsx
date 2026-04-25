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

export default function LiveStatus() {
  const [status, setStatus] = useState<StatusInfo | null>(null)
  const [slots, setSlots] = useState<NearSlot[]>([])
  const [modal, setModal] = useState<{ date: Date; time: string } | null>(null)

  useEffect(() => {
    function refresh() {
      const msk = getMsk()
      setStatus(computeStatus(msk))
      setSlots(nextSlots(msk, 4))
    }
    refresh()
    const t = setInterval(refresh, 60_000)
    return () => clearInterval(t)
  }, [])

  if (!status) return null

  const initialDate = modal
    ? { year: modal.date.getFullYear(), month: modal.date.getMonth(), day: modal.date.getDate() }
    : undefined

  return (
    <>
      <div className="flex flex-col items-center md:items-start gap-3 mb-6 sm:mb-7">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: status.isOpen ? '#4ade80' : '#f87171',
              boxShadow: `0 0 8px ${status.isOpen ? 'rgba(74,222,128,0.7)' : 'rgba(248,113,113,0.5)'}`,
              animation: status.isOpen ? 'pulse-dot 2s infinite' : 'none',
            }}
          />
          <span className="text-[13px] tracking-[0.04em]" style={{ color: '#c5bfb0' }}>
            <span style={{ color: status.isOpen ? '#e6faf0' : '#fca5a5', fontWeight: 500 }}>
              {status.isOpen ? 'Открыто сейчас' : 'Закрыто'}
            </span>
            {status.isOpen && status.closesIn && (
              <span style={{ color: '#6b7895' }}> · закрывается {status.closesIn}</span>
            )}
            {!status.isOpen && status.opensAt && (
              <span style={{ color: '#6b7895' }}> · откроется {status.opensAt}</span>
            )}
          </span>
        </div>
        {slots.length > 0 && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {slots.map((s) => (
              <button
                key={s.label}
                onClick={() => setModal({ date: s.date, time: s.slot })}
                className="text-[11px] tracking-[0.06em] px-3 py-1.5 rounded transition-all"
                style={{ border: '1px solid rgba(184,154,90,0.25)', color: '#c5a84a', background: 'rgba(184,154,90,0.06)' }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(184,154,90,0.14)'; b.style.borderColor = 'rgba(184,154,90,0.5)' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(184,154,90,0.06)'; b.style.borderColor = 'rgba(184,154,90,0.25)' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {modal && (
        <BookingModal onClose={() => setModal(null)} initialDate={initialDate} initialTime={modal.time} />
      )}
    </>
  )
}
