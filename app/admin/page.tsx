export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { findStaffById } from '@/lib/staff'
import { ALL_SLOTS, buildBookedSet, toMinutes } from '@/lib/slots'
import AdminAddForm from '@/components/AdminAddForm'
import AdminHistoryPicker from '@/components/AdminHistoryPicker'
import AdminLogoutButton from '@/components/AdminLogoutButton'
import AdminAppointmentCard from '@/components/AdminAppointmentCard'
import AdminSearch from '@/components/AdminSearch'
import StaffTabs from '@/components/StaffTabs'

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}.${m}.${y}`
}

function addDays(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + delta)
  return dt.toISOString().split('T')[0]
}

function isWeekend(ymd: string): boolean {
  const [y, m, d] = ymd.split('-').map(Number)
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return dow === 0 || dow === 6
}

// Ближайшее свободное окно (по московскому времени)
function computeNextFree(
  today: string,
  rows: Array<{ date: string; time: string; duration: number }>,
): { date: string; time: string } | null {
  const byDate: Record<string, typeof rows> = {}
  for (const r of rows) (byDate[r.date] ??= []).push(r)

  // Москва = UTC+3
  const msk = new Date(Date.now() + 3 * 3600 * 1000)
  const mskNowMin = msk.getUTCHours() * 60 + msk.getUTCMinutes()

  for (let i = 0; i < 21; i++) {
    const day = addDays(today, i)
    if (isWeekend(day)) continue
    const booked = buildBookedSet(byDate[day] ?? [])
    for (const slot of ALL_SLOTS) {
      if (booked.has(slot)) continue
      if (i === 0 && toMinutes(slot) < mskNowMin) continue
      return { date: day, time: slot }
    }
  }
  return null
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { date?: string; staff?: string; q?: string }
}) {
  const today = new Date().toISOString().split('T')[0]
  const lookupDate = searchParams?.date ?? null
  const activeTab = searchParams?.staff ?? 'notary'
  const query = (searchParams?.q ?? '').trim()

  // Build DB filter (по сотруднику)
  let staffFilter: { staffId?: string | null } = { staffId: null }
  if (activeTab === 'all') {
    staffFilter = {}
  } else if (activeTab.startsWith('staff_')) {
    staffFilter = { staffId: activeTab }
  }

  // ── Сводка ──
  const horizon = addDays(today, 14)
  const upcoming = await prisma.appointment.findMany({
    where: { status: 'active', date: { gte: today, lte: horizon }, ...staffFilter },
    select: { date: true, time: true, duration: true },
  })
  const weekEnd = addDays(today, 6)
  const todayCount = upcoming.filter(a => a.date === today).length
  const weekCount = upcoming.filter(a => a.date >= today && a.date <= weekEnd).length
  const nextFree = computeNextFree(today, upcoming)

  // ── Поиск ──
  let searchResults: Awaited<ReturnType<typeof prisma.appointment.findMany>> = []
  if (query) {
    searchResults = await prisma.appointment.findMany({
      where: {
        ...staffFilter,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ],
      },
      orderBy: [{ date: 'desc' }, { time: 'asc' }],
      take: 50,
    })
  }

  // ── Основной список (если не идёт поиск) ──
  let appointments: Awaited<ReturnType<typeof prisma.appointment.findMany>> = []
  if (!query) {
    if (lookupDate) {
      appointments = await prisma.appointment.findMany({
        where: { date: lookupDate, ...staffFilter },
        orderBy: [{ time: 'asc' }],
      })
    } else {
      appointments = await prisma.appointment.findMany({
        where: { status: 'active', date: { gte: today }, ...staffFilter },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
      })
    }
  }

  const byDate: Record<string, typeof appointments> = {}
  for (const a of appointments) {
    if (!byDate[a.date]) byDate[a.date] = []
    byDate[a.date].push(a)
  }
  const dateKeys = Object.keys(byDate).sort()

  function staffLabel(staffId: string | null): string {
    if (!staffId) return 'Нотариус'
    return findStaffById(staffId)?.name ?? staffId
  }

  const currentTabLabel =
    activeTab === 'notary' ? 'Нотариус'
    : activeTab === 'all' ? 'Все сотрудники'
    : findStaffById(activeTab)?.name ?? activeTab

  const addFormDefaultStaff = activeTab === 'notary' || activeTab === 'all'
    ? null
    : activeTab

  const stats = [
    { label: 'Записей сегодня', value: String(todayCount) },
    { label: 'На этой неделе', value: String(weekCount) },
    {
      label: 'Ближайшее окно',
      value: nextFree ? `${formatDate(nextFree.date).slice(0, 5)} ${nextFree.time}` : '—',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="font-serif text-4xl font-bold text-cream">Записи на приём</h1>
          <p className="text-cream/40 text-sm mt-2">
            Просмотр: <span className="text-gold">{currentTabLabel}</span>
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-2xl px-4 py-4 sm:px-5 sm:py-5"
            style={{ background: '#fdf8ef', border: '1px solid rgba(192,92,46,0.15)' }}
          >
            <div className="font-serif text-gold font-bold leading-none" style={{ fontSize: 'clamp(20px, 4vw, 30px)' }}>
              {s.value}
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-cream/50 mt-2">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <AdminSearch initial={query} staff={activeTab} />

      {/* Staff filter tabs */}
      <div className="mt-6">
        <StaffTabs active={activeTab} />
      </div>

      {query ? (
        /* ── Результаты поиска ── */
        <div className="mt-8">
          <p className="text-cream/60 text-sm mb-4">
            Поиск: <span className="text-gold font-semibold">«{query}»</span> — найдено {searchResults.length}
          </p>
          {searchResults.length === 0 ? (
            <div className="text-center py-16 text-cream/40">Ничего не найдено</div>
          ) : (
            <div className="grid gap-3">
              {searchResults.map(a => (
                <div key={a.id}>
                  <p className="text-xs text-cream/40 mb-1 ml-1">
                    {formatDate(a.date)}
                    {activeTab === 'all' && <span style={{ color: '#c05c2e' }}> · {staffLabel(a.staffId ?? null)}</span>}
                  </p>
                  <AdminAppointmentCard a={a} isAdmin />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Add form */}
          <AdminAddForm defaultStaffId={addFormDefaultStaff} />

          {/* History lookup */}
          <AdminHistoryPicker
            currentDate={lookupDate}
            today={today}
            basePath={`/admin?staff=${activeTab}`}
          />

          {lookupDate && (
            <p className="text-cream/60 text-sm mb-6">
              Записи за <span className="text-gold font-semibold">{formatDate(lookupDate)}</span>
            </p>
          )}

          {/* Appointments list */}
          {dateKeys.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-cream/50 text-lg">
                {lookupDate ? `Нет записей за ${formatDate(lookupDate)}` : 'Нет предстоящих записей'}
              </p>
              {!lookupDate && (
                <p className="text-cream/30 text-sm mt-2">
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
                        <div key={a.id}>
                          {activeTab === 'all' && (
                            <p className="text-xs font-semibold mb-1 ml-1" style={{ color: '#c05c2e' }}>
                              {staffLabel(a.staffId ?? null)}
                            </p>
                          )}
                          <AdminAppointmentCard a={a} isAdmin />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
