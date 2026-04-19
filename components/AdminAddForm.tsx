'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SERVICES = [
  'Наследство и завещания',
  'Сделки с недвижимостью',
  'Доверенности',
  'Заверение копий и справок',
  'Брачный договор',
  'Согласие супруга',
  'Нотариальный перевод',
  'Другое',
]

const TIMES = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '14:00','14:30','15:00','15:30','16:00','16:30',
  '17:00','17:30','18:00','18:30',
]

export default function AdminAddForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', phone: '', service: SERVICES[0], date: '', time: TIMES[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setForm({ name: '', phone: '', service: SERVICES[0], date: '', time: TIMES[0] })
      setTimeout(() => { setSuccess(false); router.refresh() }, 1200)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Ошибка при добавлении')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-10">
      <h2 className="font-serif text-navy text-lg font-bold mb-5">Добавить запись вручную</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">ФИО</label>
          <input
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Иванов Иван Иванович"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Телефон</label>
          <input
            required
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+7 (999) 000-00-00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Услуга</label>
          <select
            value={form.service}
            onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          >
            {SERVICES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Дата</label>
          <input
            required
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Время</label>
          <select
            value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          >
            {TIMES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-3">✓ Запись добавлена!</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 bg-gold text-navy font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 text-sm"
      >
        {loading ? 'Добавление...' : 'Добавить запись'}
      </button>
    </form>
  )
}
