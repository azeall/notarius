'use client'
import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 18, suffix: '+', label: 'лет практики' },
  { value: 5000, suffix: '+', label: 'клиентов' },
  { value: 20, suffix: '+', label: 'видов услуг' },
  { value: 100, suffix: '%', label: 'юридическая сила' },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800, steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current = Math.min(current + increment, value)
            setCount(Math.floor(current))
            if (current >= value) clearInterval(timer)
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{count.toLocaleString('ru-RU')}{suffix}</span>
}

export default function StatsCounter() {
  return (
    <section
      className="relative"
      style={{
        background: '#0f1e35',
        borderTop: '1px solid rgba(184,154,90,0.12)',
        borderBottom: '1px solid rgba(184,154,90,0.12)',
        padding: '64px 0',
      }}
    >
      <div className="mx-auto px-10" style={{ maxWidth: '1340px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {STATS.map(stat => (
            <div key={stat.label} className="reveal">
              <div className="font-serif text-5xl font-medium text-gold mb-3 leading-none">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="text-[11px] tracking-[0.22em] uppercase"
                style={{ color: '#6b7895' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
