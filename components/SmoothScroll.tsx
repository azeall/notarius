'use client'
import { useEffect } from 'react'

/** Плавная инерционная прокрутка (Lenis). Только desktop, уважает reduced-motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return // не трогаем тач-устройства

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let frame = 0
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.5 })
      const prev = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      const loop = (t: number) => { lenis?.raf(t); frame = requestAnimationFrame(loop) }
      frame = requestAnimationFrame(loop)
      ;(lenis as unknown as { _prevSB?: string })._prevSB = prev
    })

    return () => {
      cancelled = true
      if (frame) cancelAnimationFrame(frame)
      document.documentElement.style.scrollBehavior = ''
      lenis?.destroy()
    }
  }, [])
  return null
}
