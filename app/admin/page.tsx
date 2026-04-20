export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminAddForm from '@/components/AdminAddForm'
import AdminHistoryPicker from '@/components/AdminHistoryPicker'

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}.${m}.${y}`
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const today = new Date().toISOString().split('T')[0]
  const lookupDate = searchParams?.date ?? null

  let appointments
  if (lookupDate) {
    // History: show all appointments for the selected date (any status)
    appointments = await prisma.appointment.findMany({
      where: { date: lookupDate },
      orderBy: [{ time: 'asc' }],
    })
  } else {
    // Default: only today + future active appointments
    appointments = await prisma.appointment.findMany({
      where: {
        status: 'active',
        date: { gte: today },
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    })
  }

  const byDate: Record<string, typeof appointments> = {}
  for (const a of appointments) {
    if (!byDate[a.date]) byDate[a.date] = []
    byDate[a.date].push(a)
  }

  const dateKeys = Object.keys(byDate).sort()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-6 sm:mb-10">Записи на приём</h1>

      <AdminAddForm />

      {/* History lookup */}
      <AdminHistoryPicker currentDate={lookupDate} today={today} />

      {lookupDate && (
        <p className="text-cream/60 text-sm mb-6">
          Записи за <span className="text-gold font-semibold">{formatDate(lookupDate)}</span>
        </p>
      )}

      {dateKeys.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            {lookupDate
              ? `Нет записей за ${formatDate(lookupDate)}`
              : 'Нет предстоящих записей'}
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-cream mb-4 flex flex-wrap items-center gap-3">
                  {formatDate(date)}
                  {isToday && (
                    <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-widest uppercase bg-gold/20 text-gold px-3 py-1 rounded-full">
                      Сегодня
                    </span>
                  )}
                </h2>
                <div className="grid gap-3">
                  {items.map(a => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-3 bg-white rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100 hover:border-gold/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold font-bold text-base sm:text-lg">{a.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-base sm:text-lg leading-tight truncate">{a.name}</p>
                          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 truncate">{a.phone}</p>
                          <p className="text-navy/70 text-xs sm:text-sm mt-1 font-medium truncate">{a.service}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="inline-block bg-gold text-navy font-bold text-base sm:text-xl px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl">
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
