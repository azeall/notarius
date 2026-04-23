'use client'
import { useRouter } from 'next/navigation'

export default function StaffLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/staff-logout', { method: 'POST' })
    router.push('/staff/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-400 hover:text-cream border border-white/10 hover:border-white/30 px-4 py-2 rounded-xl transition-colors"
    >
      Выйти
    </button>
  )
}
