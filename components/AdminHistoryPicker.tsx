'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminHistoryPicker({
  currentDate,
  today,
}: {
  currentDate: string | null
  today: string
}) {
  const router = useRouter()
  const [date, setDate] = useState(currentDate ?? '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!date) {
      router.push('/admin')
    } else {
      router.push(`/admin?date=${date}`)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 sm:px-6 py-5 mb-6 sm:mb-8">
      <h3 className="font-serif text-cream font-semibold text-base mb-3">История записей</h3>
      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-2 sm:gap-3">
        <div className="flex-1 min-w-[140px] sm:min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
            Выберите дату
          </label>
          <input
            type="date"
            value={date}
            max={today}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-white/20 rounded-xl px-3 sm:px-4 py-2.5 text-sm bg-white/10 text-cream focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <button
          type="submit"
          className="px-4 sm:px-6 py-2.5 bg-gold/20 border border-gold/40 text-gold font-semibold text-sm rounded-xl hover:bg-gold/30 transition-colors whitespace-nowrap"
        >
          Показать
        </button>
        {currentDate && (
          <button
            type="button"
            onClick={() => { setDate(''); router.push('/admin') }}
            className="px-4 sm:px-5 py-2.5 border border-white/20 text-gray-400 font-semibold text-sm rounded-xl hover:border-white/40 transition-colors whitespace-nowrap"
          >
            Сбросить
          </button>
        )}
      </form>
      {!currentDate && (
        <p className="text-xs text-gray-500 mt-2.5">
          Выберите любую прошедшую дату, чтобы просмотреть записи за тот день
        </p>
      )}
    </div>
  )
}
