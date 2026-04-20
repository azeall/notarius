'use client'
import { useState, useEffect } from 'react'

function isOpenNow(): boolean {
  const now = new Date()
  // Convert to Moscow time (UTC+3)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const moscow = new Date(utc + 3 * 3600000)
  const h = moscow.getHours()
  const m = moscow.getMinutes()
  const totalMin = h * 60 + m
  const day = moscow.getDay() // 0=Sun, 6=Sat

  if (day === 0 || day === 6) return false
  if (day >= 1 && day <= 4) return totalMin >= 600 && totalMin < 1140 // Пн–Чт 10:00–19:00
  if (day === 5) {
    // Пятница: 10:00–13:00 / 14:00–18:00
    return (totalMin >= 600 && totalMin < 780) || (totalMin >= 840 && totalMin < 1080)
  }
  return false
}

export default function OpenStatus() {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    setOpen(isOpenNow())
    const t = setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => clearInterval(t)
  }, [])

  if (open === null) return null

  return (
    <span className="flex items-center gap-3">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          background: open ? '#4ade80' : '#f87171',
          boxShadow: `0 0 8px ${open ? '#4ade80' : '#f87171'}`,
          animation: open ? 'pulse-dot 2s infinite' : 'none',
        }}
      />
      <span className="text-[12px] text-slate tracking-[0.04em]">
        <strong
          className="font-medium"
          style={{ color: open ? '#f0ece4' : '#f87171' }}
        >
          {open ? 'Открыто сейчас' : 'Закрыто'}
        </strong>
        {' · '}Пн–Чт 10:00–19:00, Пт 10:00–18:00
      </span>
    </span>
  )
}
