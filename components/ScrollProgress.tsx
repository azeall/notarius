'use client'
import { useEffect, useState } from 'react'

/** Тонкая полоса прогресса прокрутки сверху. Цвет — акцент сайта (bg-gold-токен). */
export default function ScrollProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 60, pointerEvents: 'none' }}
    >
      <div
        className="bg-gold"
        style={{ height: '100%', width: `${p}%`, transition: 'width 0.12s linear', boxShadow: '0 0 10px rgba(0,0,0,0.18)' }}
      />
    </div>
  )
}
