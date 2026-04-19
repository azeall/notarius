import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const appointments = await prisma.appointment.findMany({
    where: { status: 'active' },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  const grouped: Record<string, typeof appointments> = {}
  for (const a of appointments) {
    if (!grouped[a.date]) grouped[a.date] = []
    grouped[a.date].push(a)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-navy mb-2">Записи на приём</h1>
      <p className="text-gray-500 text-sm mb-8">Всего активных записей: {appointments.length}</p>

      {appointments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <p className="text-gray-400">Записей пока нет</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3 pl-1">{date}</h2>
              <div className="space-y-2">
                {items.map(a => (
                  <div key={a.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-semibold text-navy">{a.name}</p>
                      <p className="text-sm text-gray-500">{a.phone}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.service}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-gold/10 text-[#b89a5a] font-semibold text-sm px-3 py-1 rounded-lg">
                        {a.time}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(a.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
