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

/** Центрпис: документ проходит проверку — скан-луч, появляются галочки, печать-бейдж. */
function DocVerify() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none" aria-hidden>
      <style>{`
        @keyframes scanBeam {
          0% { top: 6%; opacity: 0; }
          6% { opacity: 1; }
          58% { top: 88%; opacity: 1; }
          64% { opacity: 0; }
          100% { top: 88%; opacity: 0; }
        }
        @keyframes checkPop1 {
          0%, 14% { opacity: 0; transform: scale(0.4); }
          19% { opacity: 1; transform: scale(1.15); }
          22% { transform: scale(1); }
          88% { opacity: 1; transform: scale(1); }
          96%, 100% { opacity: 0; transform: scale(1); }
        }
        @keyframes checkPop2 {
          0%, 26% { opacity: 0; transform: scale(0.4); }
          31% { opacity: 1; transform: scale(1.15); }
          34% { transform: scale(1); }
          88% { opacity: 1; transform: scale(1); }
          96%, 100% { opacity: 0; transform: scale(1); }
        }
        @keyframes checkPop3 {
          0%, 38% { opacity: 0; transform: scale(0.4); }
          43% { opacity: 1; transform: scale(1.15); }
          46% { transform: scale(1); }
          88% { opacity: 1; transform: scale(1); }
          96%, 100% { opacity: 0; transform: scale(1); }
        }
        @keyframes checkPop4 {
          0%, 50% { opacity: 0; transform: scale(0.4); }
          55% { opacity: 1; transform: scale(1.15); }
          58% { transform: scale(1); }
          88% { opacity: 1; transform: scale(1); }
          96%, 100% { opacity: 0; transform: scale(1); }
        }
        @keyframes badgePop {
          0%, 62% { opacity: 0; transform: scale(0.5) rotate(-14deg); }
          70% { opacity: 1; transform: scale(1.1) rotate(-8deg); }
          74% { transform: scale(1) rotate(-8deg); }
          88% { opacity: 1; }
          96%, 100% { opacity: 0; }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .dv-anim { animation-duration: 5.5s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
        @media (prefers-reduced-motion: reduce) { .dv-anim { animation: none !important; opacity: 1 !important; } }
      `}</style>

      {/* задние карточки */}
      <div className="absolute inset-0 rounded-2xl" style={{ background: '#def0e8', transform: 'rotate(5deg) translate(14px, 10px)' }} />
      <div className="absolute inset-0 rounded-2xl" style={{ background: '#e8f5f0', transform: 'rotate(-4deg) translate(-10px, 14px)' }} />

      {/* документ */}
      <div
        className="dv-anim relative rounded-2xl px-7 py-8 overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid rgba(29,158,117,0.20)', boxShadow: '0 24px 60px rgba(29,158,117,0.14)', animationName: 'cardFloat', animationDuration: '6s' }}
      >
        {/* шапка документа */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg grid place-items-center" style={{ background: '#e8f5f0' }}>
            <svg className="w-5 h-5" style={{ color: '#1D9E75' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="h-2.5 w-36 rounded" style={{ background: '#2c2c2c', opacity: 0.85 }} />
            <div className="h-2 w-24 rounded mt-1.5" style={{ background: '#dfe9e5' }} />
          </div>
        </div>

        {/* строки документа + галочки */}
        {['92%', '78%', '86%', '64%'].map((w, i) => (
          <div key={i} className="flex items-center gap-3 mb-4">
            <div className="h-2 rounded flex-1" style={{ background: '#eef4f1', maxWidth: w }} />
            <span
              className="dv-anim w-5 h-5 rounded-full grid place-items-center flex-shrink-0"
              style={{ background: '#1D9E75', opacity: 0, animationName: `checkPop${i + 1}` }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
          </div>
        ))}

        {/* подпись-строка */}
        <div className="flex items-end justify-between mt-7">
          <div>
            <div className="h-2 w-20 rounded mb-1.5" style={{ background: '#dfe9e5' }} />
            <svg width="92" height="26" viewBox="0 0 92 26"><path d="M4 18 C 18 4, 26 22, 38 12 S 60 4, 70 14 S 84 20, 90 12" fill="none" stroke="#2c2c2c" strokeWidth="1.6" opacity="0.7" /></svg>
          </div>
          {/* бейдж «проверено» */}
          <div
            className="dv-anim flex items-center gap-1.5 rounded-full px-3.5 py-2"
            style={{ background: '#1D9E75', opacity: 0, animationName: 'badgePop', boxShadow: '0 8px 22px rgba(29,158,117,0.35)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="text-white text-[11px] font-bold tracking-wide uppercase">Удостоверено</span>
          </div>
        </div>

        {/* скан-луч */}
        <div
          className="dv-anim absolute left-0 right-0 h-10 pointer-events-none"
          style={{
            top: '6%', opacity: 0, animationName: 'scanBeam',
            background: 'linear-gradient(180deg, transparent, rgba(29,158,117,0.16) 45%, rgba(29,158,117,0.30) 50%, rgba(29,158,117,0.16) 55%, transparent)',
          }}
        />
      </div>
    </div>
  )
}

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section className="relative overflow-hidden flex items-center" style={{ minHeight: '100dvh', background: '#ffffff' }}>
      <div
        className="absolute top-0 right-0 hidden lg:block"
        style={{ width: '42%', height: '100%', background: '#e8f5f0', clipPath: 'polygon(22% 0, 100% 0, 100% 100%, 0 100%)' }}
        aria-hidden
      />

      <div className="relative w-full mx-auto px-5 sm:px-10 lg:px-16 py-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center" style={{ maxWidth: '1320px' }}>
        <div>
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            <span className="block w-10 h-[2px]" style={{ background: '#1D9E75' }} />
            <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#1D9E75' }}>
              Нотариус города Москвы
            </span>
          </div>

          <h1
            className="font-sans font-extrabold leading-[1.02] mb-7 animate-fade-in-up"
            style={{ fontSize: 'clamp(40px, 6.5vw, 92px)', letterSpacing: '-0.03em', color: '#2c2c2c', animationDelay: '80ms' }}
          >
            {surname}
            <br />
            <span style={{ color: '#1D9E75' }}>{rest}</span>
          </h1>

          <p className="leading-relaxed mb-10 max-w-[500px] animate-fade-in-up" style={{ fontSize: '18px', lineHeight: '1.7', color: '#5d6e67', animationDelay: '160ms' }}>
            Современная нотариальная контора: онлайн-запись, прозрачные
            тарифы и проверка каждого документа.
          </p>

          <div className="flex flex-wrap items-center gap-5 mb-14 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
            <BookingButton />
            <a href={notary.phoneHref} className="inline-flex items-center gap-2.5 font-semibold text-[15px] no-underline transition-opacity hover:opacity-75" style={{ color: '#2c2c2c' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {notary.phone}
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-[600px] pt-8 animate-fade-in-up" style={{ borderTop: '2px solid #e8f5f0', animationDelay: '320ms' }}>
            {heroStats.map(s => (
              <div key={s.label}>
                <div className="font-sans font-extrabold leading-none mb-2" style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', color: '#1D9E75', letterSpacing: '-0.02em' }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[11px] sm:text-xs tracking-[0.16em] uppercase" style={{ color: '#7c8b85' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Центрпис: проверка документа */}
        <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '280ms' }}>
          <DocVerify />
        </div>
      </div>
    </section>
  )
}
