'use client'
import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'

const KEY = 'cookie-consent'
function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}
function snapshot() {
  try { return localStorage.getItem(KEY) } catch { return null }
}
const serverSnapshot = () => 'pending'


export default function CookieNotice() {
  const [show, setShow] = useState(true)
  const choice = useSyncExternalStore(subscribe, snapshot, serverSnapshot)

  function accept() {
    try { localStorage.setItem(KEY, 'accepted') } catch { /* ignore */ }
    window.dispatchEvent(new Event('cookie-consent-accepted'))
    setShow(false)
  }

  function decline() {
    try { localStorage.setItem(KEY, 'declined') } catch { /* ignore */ }
    setShow(false)
  }

  if (!show || choice) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="mx-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-2xl px-4 py-4 sm:px-6"
        style={{
          maxWidth: '1080px',
          background: 'rgba(255,255,255,0.97)',
          border: '1px solid rgb(var(--violet-rgb) / 0.25)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.45)',
          pointerEvents: 'auto',
        }}
      >
        <p className="text-[13px] text-slate leading-relaxed flex-1">
          Аналитика Яндекс.Метрики включается только по вашему выбору. Можно оставить только необходимые cookie. Подробнее — в{' '}
          <Link href="/privacy" className="underline underline-offset-2" style={{ color: 'rgb(var(--violet-rgb))' }}>
            политике обработки персональных данных
          </Link>
          .
        </p>
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2.5 text-[13px] font-medium text-slate hover:text-cream transition-colors whitespace-nowrap"
            style={{ border: '1px solid rgb(var(--rule-rgb))', borderRadius: 2 }}
          >
            Только необходимые
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap"
            style={{ background: 'rgb(var(--text-rgb))', color: 'rgb(var(--bg-rgb))', borderRadius: 2 }}
          >
            Разрешить аналитику
          </button>
        </div>
      </div>
    </div>
  )
}
