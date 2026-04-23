export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { findStaffById } from '@/lib/staff'
import AdminAddForm from '@/components/AdminAddForm'
import AdminHistoryPicker from '@/components/AdminHistoryPicker'
import AdminLogoutButton from '@/components/AdminLogoutButton'
import StaffTabs from '@/components/StaffTabs'

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}.${m}.${y}`
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { date?: string; staff?: string }
}) {
  const today = new Date().toISOString().split('T')[0]
  const lookupDate = searchParams?.date ?? null

  const activeTab = searchParams?.staff ?? 'notary'

  let staffFilter: { staffId?: string | null } = { staffId: null }
  if (activeTab === 'all') {
    staffFilter = {}
  } else if (activeTab.startsWith('staff_')) {
    staffFilter = { staffId: activeTab }
  }

  let appointments
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Header with logout */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="font-serif text-4xl font-bold text-cream">Записи на приём</h1>
          <p className="text-cream/40 text-sm mt-2">
            Просмотр: <span className="text-gold">{currentTabLabel}</span>
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* Staff filter tabs */}
      <div className="mt-8">
        <StaffTabs active={activeTab} />
      </div>

      {/* Add form — only when viewing notary calendar */}
      {activeTab === 'notary' && <AdminAddForm />}

      {/* Info hint for staff tabs */}
      {activeTab !== 'notary' && activeTab !== 'all' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-8 text-sm text-cream/60">
          Просмотр записей сотрудника{' '}
          <span className="text-gold font-medium">{currentTabLabel}</span>.{' '}
          Для добавления сотрудник должен войти в свой кабинет:{' '}
          <a href="/staff/login" className="text-gold underline underline-offset-2">
            /staff/login
          </a>
        </div>
      )}

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
                          {activeTab === 'all' && (
                            <p className="text-xs mt-1 font-semibold" style={{ color: '#b89a5a' }}>
                              {staffLabel(a.staffId ?? null)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <span className="inline-block bg-gold text-navy font-bold text-xl px-5 py-2 rounded-xl">
                          {a.time}
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
