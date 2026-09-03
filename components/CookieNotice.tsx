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

  // Полоса во всю ширину снизу перекрывала содержание на каждом экране.
  // Теперь это карточка в углу. Папка визита переехала к левому краю, так
  // что отодвигать карточку вверх больше не от чего.
  return (
    <div
      className="no-print fixed z-50 left-3 right-3 sm:left-auto sm:right-5"
      style={{ pointerEvents: 'none', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
    >
      <div
        className="ml-auto flex flex-col gap-3 rounded-xl px-4 py-4"
        style={{
          maxWidth: '340px',
          background: 'rgb(var(--surface-4-rgb))',
          border: '1px solid rgb(var(--violet-rgb) / 0.28)',
          boxShadow: '0 16px 44px rgba(0,0,0,0.5)',
          pointerEvents: 'auto',
        }}
      >
        <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: 'rgb(var(--muted-rgb))' }}>
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
            className="px-3 py-2 rounded-lg text-[11.5px] font-semibold transition-colors whitespace-nowrap"
            style={{ border: '1px solid rgb(var(--violet-rgb) / 0.22)', color: 'rgb(var(--muted-rgb))' }}
          >
            Только необходимые
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg text-[11.5px] font-semibold transition-colors whitespace-nowrap"
            style={{ background: 'rgb(var(--violet-rgb))', color: 'rgb(var(--bg-rgb))' }}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  )
}
