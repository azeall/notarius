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
      className="text-sm text-slate/80 hover:text-cream border border-black/10 hover:border-black/30 px-4 py-2 rounded-xl transition-colors"
    >
      Выйти
    </button>
  )
}
