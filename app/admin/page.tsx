export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminAddForm from '@/components/AdminAddForm'

export default async function AdminPage() {
  const appointments = await prisma.appointment.findMany({
    where: { status: 'active' },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  const byDate: Record<string, typeof appointments> = {}
  for (const a of appointments) {
    if (!byDate[a.date]) byDate[a.date] = []
    byDate[a.date].push(a)
  }

  const dateKeys = Object.keys(byDate).sort()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-navy mb-10">Записи на приём</h1>

      <AdminAddForm />

      {dateKeys.length === 0 ? (
        <p className="text-gray-400 text-center py-16 text-lg">Нет активных записей</p>
      ) : (
        <div className="space-y-10">
          {dateKeys.map(date => {
            const [y, m, d] = date.split('-')
            const label = `${d}.${m}.${y}`
            const items = byDate[date]
            return (
              <div key={date}>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">{label}</h2>
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
