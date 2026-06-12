'use client'
import { useEffect, useState } from 'react'
import { notary, motto } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/** Девиз печатается по буквам, как на печатной машинке, с мигающим курсором. */
function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'hold' | 'erasing'>('typing')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setShown(text.length); return }

    let timer: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (shown < text.length) timer = setTimeout(() => setShown(s => s + 1), 75)
      else timer = setTimeout(() => setPhase('hold'), 0)
    } else if (phase === 'hold') {
      timer = setTimeout(() => setPhase('erasing'), 4200)
    } else {
      if (shown > 0) timer = setTimeout(() => setShown(s => s - 1), 28)
      else timer = setTimeout(() => setPhase('typing'), 700)
    }
    return () => clearTimeout(timer)
  }, [shown, phase, text.length])

  return (
    <span>
      «{text.slice(0, shown)}
      <span
        className="inline-block w-[3px] ml-0.5 align-baseline"
        style={{ height: '0.85em', background: '#c05c2e', animation: 'twBlink 1s step-end infinite' }}
        aria-hidden
      />
      »
      <style>{`@keyframes twBlink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }`}</style>
    </span>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden flex items-center" style={{ minHeight: '100dvh', background: '#f5ede0' }}>
      {/* Тонкая текстура-полосы */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(192,92,46,0.03) 0 1px, transparent 1px 32px)' }}
        aria-hidden
      />

      <div className="relative w-full mx-auto px-5 sm:px-10 lg:px-16 py-16 grid md:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center" style={{ maxWidth: '1280px' }}>

        {/* Левая колонка: печатающийся девиз */}
        <div>
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            <span className="block w-10 h-px" style={{ background: '#c05c2e' }} />
            <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#c05c2e' }}>
              Нотариальная контора · Москва
            </span>
          </div>

          <h1
            className="font-serif font-medium leading-[1.12] mb-8 animate-fade-in-up"
            style={{ fontSize: 'clamp(36px, 5vw, 66px)', letterSpacing: '-0.01em', color: '#3d2010', minHeight: '2.3em', animationDelay: '80ms' }}
          >
            <Typewriter text={motto} />
          </h1>

          <div className="flex items-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '140ms' }}>
            <span className="block w-12 h-px" style={{ background: 'rgba(192,92,46,0.5)' }} />
            <div>
              <p className="font-serif text-xl m-0" style={{ color: '#3d2010' }}>{notary.name}</p>
              <p className="text-sm m-0 mt-1" style={{ color: '#7d6a55' }}>{notary.title} · практика с {notary.practiceSince} года</p>
            </div>
          </div>

          <p className="leading-relaxed mb-10 max-w-[460px] animate-fade-in-up" style={{ fontSize: '17px', lineHeight: '1.7', color: '#7d6a55', animationDelay: '200ms' }}>
            Тёплый приём и внимание к каждой ситуации. Сделки, наследство,
            доверенности и копии — спокойно и по закону.
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
        </div>

        {/* Правая колонка: фото-арка с бейджем */}
        <div className="relative mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
          {/* персиковая арка-подложка */}
          <div
            className="absolute"
            style={{
              inset: '24px -20px -20px 24px',
              background: '#e8c9a0',
              borderRadius: '999px 999px 24px 24px',
            }}
            aria-hidden
          />
          {/* фото-заглушка 400×600 в форме арки */}
          <div
            className="relative flex flex-col items-center justify-center text-center overflow-hidden"
            style={{
              width: 'min(400px, 80vw)',
              aspectRatio: '2 / 3',
              maxHeight: '600px',
              background: '#b9b1a4',
              border: '1px solid rgba(61,32,16,0.15)',
              borderRadius: '999px 999px 24px 24px',
            }}
          >
            <svg width="84" height="84" viewBox="0 0 64 64" fill="none" stroke="rgba(61,32,16,0.30)" strokeWidth="1.4" aria-hidden>
              <circle cx="32" cy="22" r="10" />
              <path d="M12 54c2.5-10 10-16 20-16s17.5 6 20 16" />
            </svg>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase mt-4" style={{ color: 'rgba(61,32,16,0.45)' }}>
              [ фото нотариуса 400×600 ]
            </p>
          </div>

          {/* плавающий бейдж стажа */}
          <div
            className="absolute -left-6 bottom-16 rounded-2xl px-5 py-4 hidden sm:block"
            style={{ background: '#fdf8ef', border: '1px solid rgba(192,92,46,0.25)', boxShadow: '0 18px 44px rgba(61,32,16,0.18)', animation: 'warmFloat 5s ease-in-out infinite' }}
          >
            <style>{`
              @keyframes warmFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
              @media (prefers-reduced-motion: reduce) { [style*="warmFloat"] { animation: none !important; } }
            `}</style>
            <p className="font-serif font-bold m-0 leading-none" style={{ fontSize: '30px', color: '#c05c2e' }}>15+</p>
            <p className="text-[11px] tracking-[0.14em] uppercase m-0 mt-1.5" style={{ color: '#7d6a55' }}>лет практики</p>
          </div>

          {/* бейдж лицензии */}
          <div
            className="absolute -right-3 top-12 rounded-xl px-4 py-3 hidden sm:block"
            style={{ background: '#c05c2e', boxShadow: '0 14px 36px rgba(192,92,46,0.35)' }}
          >
            <p className="text-[10px] tracking-[0.16em] uppercase m-0" style={{ color: 'rgba(255,255,255,0.75)' }}>Лицензия</p>
            <p className="font-mono text-sm font-bold m-0 mt-0.5 text-white">{notary.license}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
