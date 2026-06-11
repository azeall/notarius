'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSearch({ initial, staff }: { initial: string; staff: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initial)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    const params = new URLSearchParams()
    if (staff && staff !== 'notary') params.set('staff', staff)
    if (q) params.set('q', q)
    const qs = params.toString()
    router.push(qs ? `/admin?${qs}` : '/admin')
  }

  function clear() {
    setValue('')
    const params = new URLSearchParams()
    if (staff && staff !== 'notary') params.set('staff', staff)
    const qs = params.toString()
    router.push(qs ? `/admin?${qs}` : '/admin')
  }

  return (
    <form onSubmit={submit} className="mt-4 flex gap-2">
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Поиск по имени или телефону…"
          className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors"
          style={{ background: '#fdf8ef', border: '1px solid rgba(192,92,46,0.18)' }}
        />
      </div>
      {initial && (
        <button
          type="button"
          onClick={clear}
          className="px-4 rounded-xl text-sm text-cream/60 hover:text-cream transition-colors"
          style={{ border: '1px solid rgba(192,92,46,0.18)' }}
        >
          Сброс
        </button>
      )}
      <button
        type="submit"
        className="px-5 rounded-xl text-sm font-semibold text-white bg-gold hover:bg-gold-light transition-colors"
      >
        Найти
      </button>
    </form>
  )
}
