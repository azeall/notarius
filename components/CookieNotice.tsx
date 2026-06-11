'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const KEY = 'cookie-consent'

export default function CookieNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true)
    } catch {
      /* ignore */
    }
  }, [])

  function accept() {
    try { localStorage.setItem(KEY, 'accepted') } catch { /* ignore */ }
    window.dispatchEvent(new Event('cookie-consent-accepted'))
    setShow(false)
  }

  function decline() {
    try { localStorage.setItem(KEY, 'declined') } catch { /* ignore */ }
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="mx-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-2xl px-4 py-4 sm:px-6"
        style={{
          maxWidth: '1100px',
          background: 'rgba(253,248,239,0.97)',
          border: '1px solid rgba(192,92,46,0.25)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.45)',
          pointerEvents: 'auto',
        }}
      >
        <p className="text-[13px] text-slate leading-relaxed flex-1">
          Мы используем файлы cookie и Яндекс.Метрику для аналитики сайта. Продолжая пользоваться сайтом,
          вы соглашаетесь с{' '}
          <Link href="/privacy" className="text-gold hover:text-gold-light underline underline-offset-2">
            политикой обработки персональных данных
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate hover:text-cream transition-colors whitespace-nowrap"
            style={{ border: '1px solid rgba(192,92,46,0.20)' }}
          >
            Только необходимые
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-gold hover:bg-gold-light transition-colors whitespace-nowrap"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  )
}
