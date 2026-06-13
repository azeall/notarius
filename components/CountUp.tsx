'use client'
import { useEffect, useRef, useState } from 'react'

/** Счётчик с анимацией count-up при попадании в зону видимости. */
export default function CountUp({ value, suffix = '', className, style }: {
  value: number
  suffix?: string
  className?: string
  style?: React.CSSProperties
}) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const dur = 1600, steps = 50, inc = value / steps
        let cur = 0
        const t = setInterval(() => {
          cur = Math.min(cur + inc, value)
          setN(Math.floor(cur))
          if (cur >= value) clearInterval(t)
        }, dur / steps)
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return <span ref={ref} className={className} style={style}>{n.toLocaleString('ru-RU')}{suffix}</span>
}
