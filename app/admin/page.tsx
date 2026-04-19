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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-navy mb-8">Записи на приём</h1>

      <AdminAddForm />

      {Object.keys(byDate).length === 0 ? (
        <p className="text-gray-500">Нет активных записей.</p>
      ) : (
        Object.entries(byDate).map(([date, items]) => {
          const [y, m, d] = date.split('-')
          const label = `${d}.${m}.${y}`
          return (
            <div key={date} className="mb-8">
              <h2 className="font-semibold text-navy text-lg mb-3 border-b border-gray-200 pb-2">{label}</h2>
              <div className="space-y-2">
                {items.map(a => (
                  <div key={a.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">{a.name}</p>
                      <p className="text-sm text-gray-500">{a.phone} · {a.service}</p>
                    </div>
                    <span className="text-sm font-semibold bg-gold/10 text-navy px-3 py-1 rounded-full">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
