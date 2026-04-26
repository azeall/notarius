'use client'
import { useState } from 'react'

export default function StaffLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      window.location.href = '/staff'
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Неверный логин или пароль')
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl" style={{ width: '340px' }}>

        {/* Avatar icon */}
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
          {/* Login */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Введите логин"
              autoFocus
              autoComplete="off"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50 text-gray-900 placeholder:text-gray-400 [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#f9fafb] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#f9fafb] [&:-webkit-autofill:focus]:[-webkit-text-fill-color:#111827]"
            />
          </div>

          {/* Password with show/hide toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль"
                autoComplete="current-password"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-gray-50 text-gray-900 placeholder:text-gray-400 [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#f9fafb] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_#f9fafb] [&:-webkit-autofill:focus]:[-webkit-text-fill-color:#111827]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors p-0.5"
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? (
                  /* Eye-off */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  /* Eye */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
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
