'use client'
import { useEffect, useState } from 'react'

/** Тонкая полоса прогресса прокрутки сверху, цветом акцента. */
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
      style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 60, pointerEvents: 'none' }}
    >
      <div
        style={{ height: '100%', width: `${p}%`, background: 'rgb(var(--violet-rgb))', transition: 'width 0.12s linear' }}
      />
    </div>
  )
}
