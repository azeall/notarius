export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminAddForm from '@/components/AdminAddForm'
import AdminHistoryPicker from '@/components/AdminHistoryPicker'
import AdminAppointmentCard from '@/components/AdminAppointmentCard'
import { WORKING_HOURS_LABEL } from '@/lib/slots'

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
    appointments = await prisma.appointment.findMany({
      where: { date: lookupDate },
      orderBy: [{ time: 'asc' }],
    })
  } else {
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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6 sm:mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream">Записи на приём</h1>
        <p className="text-xs sm:text-sm text-cream/60">
          Рабочее время: <span className="text-gold">{WORKING_HOURS_LABEL}</span>
        </p>
      </div>

      <AdminAddForm />

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
                <div className="grid gap-3 w-full min-w-0">
                  {items.map(a => (
                    <AdminAppointmentCard key={a.id} a={a} />
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
