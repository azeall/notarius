'use client'
import { useRef } from 'react'
import { notary, motto } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/** Интерактивная визитка: 3D-наклон за курсором + блик; в покое мягко покачивается. */
function BusinessCard3D() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  function onMove(e: React.PointerEvent) {
    const card = cardRef.current, glare = glareRef.current, wrap = wrapRef.current
    if (!card || !glare || !wrap) return
    wrap.style.animationPlayState = 'paused'
    const r = card.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `rotateY(${nx * 16}deg) rotateX(${-ny * 14}deg)`
    glare.style.opacity = '1'
    glare.style.background = `radial-gradient(circle at ${(nx + 0.5) * 100}% ${(ny + 0.5) * 100}%, rgba(255,255,255,0.45), transparent 55%)`
  }

  function onLeave() {
    const card = cardRef.current, glare = glareRef.current, wrap = wrapRef.current
    if (!card || !glare || !wrap) return
    card.style.transform = 'rotateY(0deg) rotateX(0deg)'
    glare.style.opacity = '0'
    wrap.style.animationPlayState = 'running'
  }

  return (
    <div style={{ perspective: '1100px' }} className="select-none">
      <style>{`
        @keyframes cardSway {
          0%, 100% { transform: rotateY(-5deg) rotateX(3deg) translateY(0); }
          50% { transform: rotateY(5deg) rotateX(-2deg) translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) { .bc-sway { animation: none !important; } }
      `}</style>
      <div ref={wrapRef} className="bc-sway" style={{ animation: 'cardSway 7s ease-in-out infinite', transformStyle: 'preserve-3d' }}>
        <div
          ref={cardRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative mx-auto rounded-2xl overflow-hidden cursor-pointer"
          style={{
            width: 'min(420px, 86vw)',
            aspectRatio: '8 / 5',
            background: 'linear-gradient(135deg, #fdf8ef 0%, #f7eeda 100%)',
            border: '1px solid rgba(192,92,46,0.30)',
            boxShadow: '0 34px 80px rgba(61,32,16,0.30), inset 0 1px 0 rgba(255,255,255,0.8)',
            transition: 'transform 0.18s ease-out',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* фактура */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(192,92,46,0.025) 0 2px, transparent 2px 9px)' }} />
          {/* терракотовая кромка */}
          <div className="absolute top-0 left-0 bottom-0 w-2.5" style={{ background: '#c05c2e' }} />
          {/* уголки */}
          {[
            { top: 12, right: 12, borderTop: '2px solid rgba(192,92,46,0.45)', borderRight: '2px solid rgba(192,92,46,0.45)' },
            { bottom: 12, right: 12, borderBottom: '2px solid rgba(192,92,46,0.45)', borderRight: '2px solid rgba(192,92,46,0.45)' },
          ].map((s, i) => (
            <span key={i} className="absolute w-4 h-4 pointer-events-none" style={s as React.CSSProperties} aria-hidden />
          ))}

          {/* содержимое визитки */}
          <div className="relative h-full flex flex-col justify-between py-6 pl-9 pr-7">
            <div>
              <p className="m-0 text-[9px] font-bold tracking-[0.34em] uppercase" style={{ color: '#c05c2e' }}>
                {notary.title}
              </p>
              <h3 className="font-serif m-0 mt-3 leading-tight" style={{ fontSize: 'clamp(20px, 4.6vw, 27px)', color: '#3d2010' }}>
                {notary.name.split(' ')[0]}
                <br />
                <span className="font-normal">{notary.name.split(' ').slice(1).join(' ')}</span>
              </h3>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="m-0 font-mono text-[10px] tracking-wide" style={{ color: '#7d6a55' }}>лицензия {notary.license}</p>
                <p className="m-0 font-mono text-[12px] font-bold mt-1" style={{ color: '#3d2010' }}>{notary.phone}</p>
              </div>
              {/* монограмма */}
              <span
                className="w-12 h-12 rounded-full grid place-items-center font-serif text-xl flex-shrink-0"
                style={{ border: '1.5px solid rgba(192,92,46,0.55)', color: '#c05c2e', transform: 'translateZ(24px)' }}
              >
                {notary.name.charAt(0)}
              </span>
            </div>
          </div>

          {/* блик */}
          <div ref={glareRef} className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ opacity: 0 }} />
        </div>
      </div>
      <p className="text-center font-serif italic mt-6" style={{ color: '#94816b', fontSize: '14px' }}>
        наведите курсор — визитка живая
      </p>
    </div>
  )
}

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section className="relative overflow-hidden flex items-center" style={{ minHeight: '100dvh', background: '#f5ede0' }}>
      {/* фактура-полосы + персиковое пятно */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(192,92,46,0.03) 0 1px, transparent 1px 32px)' }} aria-hidden />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 480, height: 480, top: '-16%', right: '-8%', background: 'radial-gradient(circle, rgba(232,201,160,0.55), transparent 65%)' }} aria-hidden />

      <div className="relative w-full mx-auto px-5 sm:px-10 lg:px-16 py-16 grid md:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center" style={{ maxWidth: '1280px' }}>

        {/* Левая колонка: ИМЯ — главное */}
        <div>
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            <span className="block w-10 h-px" style={{ background: '#c05c2e' }} />
            <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#c05c2e' }}>
              Нотариальная контора · Москва
            </span>
          </div>

          <h1
            className="font-serif font-medium leading-[1.08] mb-5 animate-fade-in-up"
            style={{ fontSize: 'clamp(38px, 5.5vw, 74px)', letterSpacing: '-0.01em', color: '#3d2010', animationDelay: '80ms' }}
          >
            {surname}
            <br />
            {rest}
          </h1>

          <p className="font-serif italic mb-9 animate-fade-in-up" style={{ fontSize: 'clamp(18px, 2vw, 23px)', color: '#c05c2e', animationDelay: '140ms' }}>
            «{motto}»
          </p>

          <p className="leading-relaxed mb-10 max-w-[460px] animate-fade-in-up" style={{ fontSize: '17px', lineHeight: '1.7', color: '#7d6a55', animationDelay: '200ms' }}>
            Тёплый приём и внимание к каждой ситуации. Сделки, наследство,
            доверенности и копии — спокойно и по закону. Практика с {notary.practiceSince} года.
          </p>

          <div className="flex flex-wrap items-center gap-5 animate-fade-in-up" style={{ animationDelay: '280ms' }}>
            <BookingButton />
            <a href={notary.phoneHref} className="inline-flex items-center gap-2.5 font-semibold text-[16px] no-underline transition-opacity hover:opacity-75" style={{ color: '#3d2010' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c05c2e" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {notary.phone}
            </a>
          </div>

          <div className="flex items-center gap-4 mt-10 pt-6 text-[11px] tracking-[0.18em] uppercase animate-fade-in-up" style={{ borderTop: '1px solid rgba(192,92,46,0.18)', color: '#c05c2e', animationDelay: '340ms' }}>
            <span>Практика с {notary.practiceSince}</span>
            <span className="block w-1 h-1 rounded-full" style={{ background: '#e8c9a0' }} />
            <span>Лицензия {notary.license}</span>
          </div>
        </div>

        {/* Правая колонка: 3D-визитка */}
        <div className="animate-fade-in" style={{ animationDelay: '240ms' }}>
          <BusinessCard3D />
        </div>
      </div>
    </section>
  )
}
