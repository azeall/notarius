'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Неверный пароль')
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-80 shadow-lg">
        <h1 className="font-serif text-navy text-xl font-bold mb-6 text-center">Вход</h1>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль"
          autoFocus
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gold text-navy font-semibold py-2.5 rounded-lg hover:brightness-110 transition-all"
        >
          Войти
        </button>
      </form>
    </div>
  )
}
