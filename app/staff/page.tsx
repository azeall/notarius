export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { findStaffById } from '@/lib/staff'
import StaffAddForm from '@/components/StaffAddForm'
import AdminHistoryPicker from '@/components/AdminHistoryPicker'
import StaffLogoutButton from '@/components/StaffLogoutButton'

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}.${m}.${y}`
}

export default async function StaffPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const staffId = cookies().get('staff_auth')?.value
  if (!staffId) redirect('/staff/login')

  const staff = findStaffById(staffId)
  if (!staff) redirect('/staff/login')

  const today = new Date().toISOString().split('T')[0]
  const lookupDate = searchParams?.date ?? null

  let appointments
  if (lookupDate) {
    appointments = await prisma.appointment.findMany({
      where: { date: lookupDate, staffId },
      orderBy: [{ time: 'asc' }],
    })
  } else {
    appointments = await prisma.appointment.findMany({
      where: { status: 'active', staffId, date: { gte: today } },
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl font-bold text-cream">Мои записи</h1>
          <p className="text-gold text-sm mt-1.5 font-medium">{staff.name}</p>
        </div>
        <StaffLogoutButton />
      </div>

      {/* Add form */}
      <StaffAddForm staffName={staff.name} />

      {/* History lookup */}
      <AdminHistoryPicker currentDate={lookupDate} today={today} basePath="/staff" />

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
