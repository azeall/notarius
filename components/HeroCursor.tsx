'use client'
import { useEffect, useRef } from 'react'

/**
 * Перо-спутник курсора: маленькое перо плавно следует за мышью,
 * показывается только над hero-секцией ([data-hero]). Десктоп, не трогает
 * нативный курсор. Цвет — акцент сайта (currentColor от text-gold).
 */
export default function HeroCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hero = document.querySelector('[data-hero]') as HTMLElement | null
    const el = ref.current
    if (!hero || !el) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, visible = false

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect()
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      if (inside) { tx = e.clientX; ty = e.clientY; if (!visible) { visible = true; el.style.opacity = '1' } }
      else if (visible) { visible = false; el.style.opacity = '0' }
    }
    const loop = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) rotate(-32deg)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="text-gold"
      style={{ position: 'fixed', left: -14, top: -22, zIndex: 55, opacity: 0, pointerEvents: 'none', transition: 'opacity .3s ease', willChange: 'transform' }}
    >
      <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
        {/* перо */}
        <path d="M3 31 L9 13 C11 7 18 3 23 2 C22 8 19 16 13 20 L3 31 Z" fill="currentColor" opacity="0.92" />
        <line x1="6" y1="24" x2="15" y2="11" stroke="#ffffff" strokeWidth="1.3" opacity="0.7" />
        <circle cx="3" cy="31" r="1.6" fill="currentColor" />
      </svg>
    </div>
  )
}
