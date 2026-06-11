'use client'
import { useEffect, useRef, useState } from 'react'
import { notary, heroStats } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

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
          const duration = 1600, steps = 50
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current = Math.min(current + increment, value)
            setCount(Math.floor(current))
            if (current >= value) clearInterval(timer)
          }, duration / steps)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{count.toLocaleString('ru-RU')}{suffix}</span>
}

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: '100dvh', background: '#ffffff' }}
    >
      {/* Мятный угловой акцент */}
      <div
        className="absolute top-0 right-0 hidden lg:block"
        style={{
          width: '38%',
          height: '100%',
          background: '#e8f5f0',
          clipPath: 'polygon(28% 0, 100% 0, 100% 100%, 0 100%)',
        }}
        aria-hidden
      />

      <div className="relative w-full mx-auto px-5 sm:px-10 lg:px-16 py-16" style={{ maxWidth: '1280px' }}>
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
          <span className="block w-10 h-[2px]" style={{ background: '#1D9E75' }} />
          <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#1D9E75' }}>
            Нотариус города Москвы
          </span>
        </div>

        {/* Крупная типографика */}
        <h1
          className="font-sans font-extrabold leading-[1.02] mb-7 animate-fade-in-up"
          style={{ fontSize: 'clamp(42px, 7.5vw, 104px)', letterSpacing: '-0.03em', color: '#2c2c2c', animationDelay: '80ms' }}
        >
          {surname}
          <br />
          <span style={{ color: '#1D9E75' }}>{rest}</span>
        </h1>

        <p
          className="leading-relaxed mb-10 max-w-[520px] animate-fade-in-up"
          style={{ fontSize: '18px', lineHeight: '1.7', color: '#5d6e67', animationDelay: '160ms' }}
        >
          Современная нотариальная контора: онлайн-запись, прозрачные тарифы
          и юридическая безопасность каждой сделки.
        </p>

        {/* Действия */}
        <div className="flex flex-wrap items-center gap-5 mb-14 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
          <BookingButton />
          <a
            href={notary.phoneHref}
            className="inline-flex items-center gap-2.5 font-semibold text-[15px] no-underline transition-colors hover:opacity-75"
            style={{ color: '#2c2c2c' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {notary.phone}
          </a>
        </div>

        {/* Счётчики (count-up при появлении) */}
        <div
          className="grid grid-cols-3 gap-4 sm:gap-8 max-w-[640px] pt-8 animate-fade-in-up"
          style={{ borderTop: '2px solid #e8f5f0', animationDelay: '320ms' }}
        >
          {heroStats.map(s => (
            <div key={s.label}>
              <div
                className="font-sans font-extrabold leading-none mb-2"
                style={{ fontSize: 'clamp(26px, 4vw, 44px)', color: '#1D9E75', letterSpacing: '-0.02em' }}
              >
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[11px] sm:text-xs tracking-[0.16em] uppercase" style={{ color: '#7c8b85' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
