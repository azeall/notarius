'use client'
import { useRouter } from 'next/navigation'
import { STAFF_LIST } from '@/lib/staff'

const TABS = [
  { id: 'notary', label: 'Нотариус' },
  ...STAFF_LIST.map(s => ({ id: s.id, label: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1]?.[0] ?? '') + '.' })),
  { id: 'all', label: 'Все записи' },
]

export default function StaffTabs({ active }: { active: string }) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => router.push(`/admin?staff=${tab.id}`)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
            active === tab.id
              ? 'bg-gold text-navy shadow-sm'
              : 'bg-white/5 text-cream/70 border border-white/10 hover:border-gold/40 hover:text-cream'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
