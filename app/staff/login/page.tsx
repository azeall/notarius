'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StaffLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/staff-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/staff')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Неверный логин или пароль')
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 w-84 shadow-xl" style={{ width: '340px' }}>
        {/* Logo mark */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89a5a" strokeWidth="1.6">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-navy text-xl font-bold mb-1 text-center">Кабинет сотрудника</h1>
        <p className="text-gray-400 text-xs text-center mb-6">Войдите в свой личный кабинет</p>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="username"
              autoFocus
              autoComplete="username"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-navy font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 text-sm"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>

        <p className="text-center mt-4">
          <a href="/admin/login" className="text-xs text-gray-400 hover:text-gold transition-colors">
            Войти как нотариус
          </a>
        </p>
      </form>
    </div>
  )
}
