'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogoutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function logout() {
    setBusy(true)
    await fetch('/api/admin-logout', { method: 'POST' }).catch(() => {})
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={logout}
      disabled={busy}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream/70 hover:text-gold border border-white/10 hover:border-gold/50 rounded-md px-3 py-1.5 transition-colors disabled:opacity-50"
      title="Выйти из админки"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {busy ? 'Выход…' : 'Выйти'}
    </button>
  )
}
