'use client'
import { useEffect, useState } from 'react'
import BookingButton from './BookingButton'

const MSK_OFFSET = 3

const SCHEDULE: Record<number, [number, number][]> = {
  0: [], 1: [[10, 19]], 2: [[10, 19]], 3: [[10, 19]], 4: [[10, 19]],
  5: [[10, 13], [14, 18]], 6: [],
}

function getMsk(): Date {
  const now = new Date()
  return new Date(now.getTime() + (now.getTimezoneOffset() + MSK_OFFSET * 60) * 60_000)
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

export default function LiveStatus() {
  const [status, setStatus] = useState<StatusInfo | null>(null)

  useEffect(() => {
    function refresh() {
      const msk = getMsk()
      setStatus(computeStatus(msk))
    }
    refresh()
    const t = setInterval(refresh, 60_000)
    return () => clearInterval(t)
  }, [])

  if (!status) return null

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
        <p className="text-[12px] text-slate">Выбор времени — в виджете записи.</p>
        <BookingButton size="sm" />
    </div>
    </>
  )
}
