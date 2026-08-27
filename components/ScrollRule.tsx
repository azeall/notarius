'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Линейка, которая прочерчивается по мере прокрутки.
 *
 * Разделитель между разделами, привязанный к положению страницы, а не к
 * таймеру: линия дорисовывается ровно настолько, насколько человек
 * продвинулся. Это тот самый «переход» между блоками — заметный, но
 * ничего не загораживающий и не задерживающий.
 *
 * Считается на requestAnimationFrame от события прокрутки и трогает только
 * transform, поэтому не вызывает пересчёта раскладки.
 */
export default function ScrollRule() {
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setP(1); return }
    let frame = 0
    const measure = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 0 — линейка ещё ниже экрана, 1 — поднялась до трети сверху.
      const t = (vh - r.top) / (vh * 0.72)
      setP(Math.max(0, Math.min(1, t)))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={ref} className="sr-wrap" aria-hidden>
      <span className="sr-line" style={{ transform: `scaleX(${p})` }} />
      <span className="sr-mark" style={{ opacity: p > 0.92 ? 1 : 0 }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .sr-wrap{position:relative;height:1px;max-width:1080px;margin:0 auto;
          background:rgb(var(--rule-rgb) / .55);}
        .sr-line{position:absolute;inset:0;background:rgb(var(--violet-rgb));
          transform-origin:left center;will-change:transform;}
        .sr-mark{position:absolute;right:0;top:-3px;width:7px;height:7px;
          background:rgb(var(--violet-rgb));transform:rotate(45deg);
          transition:opacity .35s ease;}
      ` }} />
    </div>
  )
}
