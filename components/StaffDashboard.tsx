'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { endTime } from '@/lib/slots'
import StaffAddForm from '@/components/StaffAddForm'
import StaffLogoutButton from '@/components/StaffLogoutButton'

type Appointment = {
  id: string
  name: string
  phone: string
  service: string
  date: string
  time: string
  duration: number
}

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}.${m}.${y}`
}

export default function StaffDashboard() {
  const searchParams = useSearchParams()
  const lookupDate = searchParams.get('date')

  const [staffName, setStaffName] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [today, setToday] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    // Check auth and get staff name
    const meRes = await fetch('/api/staff/me', { cache: 'no-store' })
    if (!meRes.ok) {
      window.location.href = '/staff/login'
      return
    }
    const me = await meRes.json()
    setStaffName(me.name)

    // Load appointments
    const url = lookupDate
      ? `/api/staff/schedule?date=${lookupDate}`
      : '/api/staff/schedule'
    const schedRes = await fetch(url, { cache: 'no-store' })
    if (!schedRes.ok) {
      window.location.href = '/staff/login'
      return
    }
    const data = await schedRes.json()
    setAppointments(data.appointments ?? [])
    setToday(data.today ?? '')
    setLoading(false)
  }, [lookupDate])

  useEffect(() => {
    load()
  }, [load])

  const byDate: Record<string, Appointment[]> = {}
  for (const a of appointments) {
    if (!byDate[a.date]) byDate[a.date] = []
    byDate[a.date].push(a)
  }
  const dateKeys = Object.keys(byDate).sort()

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 bg-white/10 rounded-xl" />
          <div className="h-4 w-32 bg-white/10 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl font-bold text-cream">Мои записи</h1>
          <p className="text-gold text-sm mt-1.5 font-medium">{staffName}</p>
        </div>
        <StaffLogoutButton />
      </div>

      {/* Add form */}
      <StaffAddForm staffName={staffName} onAdded={load} />

      {/* History lookup */}
      <HistoryPicker currentDate={lookupDate} today={today} />

      {lookupDate && (
        <p className="text-cream/60 text-sm mb-6">
          Записи за <span className="text-gold font-semibold">{formatDate(lookupDate)}</span>
        </p>
      )}

      {/* Appointments */}
      {dateKeys.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            {lookupDate ? `Нет записей за ${formatDate(lookupDate)}` : 'Нет предстоящих записей'}
          </p>
          {!lookupDate && (
            <p className="text-gray-500 text-sm mt-2">
              Прошедшие записи можно найти через «История записей» выше
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {dateKeys.map(date => {
            const items = byDate[date]
            const isToday = date === today
            return (
              <div key={date}>
                <h2 className="font-serif text-2xl font-bold text-cream mb-4 flex items-center gap-3">
                  {formatDate(date)}
                  {isToday && (
                    <span className="text-[11px] font-sans font-semibold tracking-widest uppercase bg-gold/20 text-gold px-3 py-1 rounded-full">
                      Сегодня
                    </span>
                  )}
                </h2>
                <div className="grid gap-3">
                  {items.map(a => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 hover:border-gold/30 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold font-bold text-lg">{a.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg leading-tight">{a.name}</p>
                          <p className="text-gray-500 text-sm mt-0.5">{a.phone}</p>
                          <p className="text-navy/70 text-sm mt-1 font-medium">{a.service}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <span className="inline-block bg-gold text-navy font-bold text-xl px-5 py-2 rounded-xl">
                          {a.time}–{endTime(a.time, a.duration)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function HistoryPicker({ currentDate, today }: { currentDate: string | null; today: string }) {
  const [value, setValue] = useState(currentDate ?? '')

  function go(date: string) {
    if (date) {
      window.location.href = `/staff?date=${date}`
    } else {
      window.location.href = '/staff'
    }
  }

  return (
    <div className="mb-8 flex items-center gap-3 flex-wrap">
      <span className="text-cream/60 text-sm font-medium">История записей:</span>
      <input
        type="date"
        value={value}
        max={today}
        onChange={e => setValue(e.target.value)}
        onBlur={e => go(e.target.value)}
        className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold"
      />
      {currentDate && (
        <button
          onClick={() => { setValue(''); go('') }}
          className="text-sm text-gold/70 hover:text-gold transition-colors"
        >
          Показать предстоящие
        </button>
      )}
    </div>
  )
}
