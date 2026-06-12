import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/**
 * Hero «Гравированный вензель»:
 * гигантский инициал в технике гравюры (штриховка + тройная обводка),
 * фон — дрейфующие гильош-волны, как на ценных бумагах.
 */

function GuillocheWaves() {
  // три волновых слоя шириной 200% — бесшовный дрейф
  const wave = (amp: number, k: number) => {
    let d = `M0 ${260 + amp * Math.sin(0)}`
    for (let x = 0; x <= 2400; x += 20) {
      d += ` L${x} ${260 + amp * Math.sin((x / 2400) * Math.PI * 2 * k)}`
    }
    return d
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <style>{`
        @keyframes guilDrift { from { transform: translateX(0); } to { transform: translateX(-1200px); } }
        @media (prefers-reduced-motion: reduce) { .guil-layer { animation: none !important; } }
      `}</style>
      {[
        { amp: 60, k: 3, dur: '52s', y: '12%', o: 0.10 },
        { amp: 90, k: 2, dur: '74s', y: '38%', o: 0.08 },
        { amp: 46, k: 4, dur: '38s', y: '70%', o: 0.12 },
      ].map((w, i) => (
        <svg
          key={i}
          className="guil-layer absolute left-0"
          style={{ top: w.y, width: '2400px', height: '520px', opacity: w.o, animation: `guilDrift ${w.dur} linear infinite` }}
          viewBox="0 0 2400 520"
        >
          {[0, 14, 28].map(dy => (
            <path key={dy} d={wave(w.amp, w.k)} transform={`translate(0 ${dy})`} fill="none" stroke="#534AB7" strokeWidth="1" />
          ))}
        </svg>
      ))}
    </div>
  )
}

function EngravedInitial({ letter }: { letter: string }) {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
      style={{ right: '-2%', width: 'min(46vw, 640px)' }}
      aria-hidden
    >
      <style>{`
        @keyframes monogramReveal {
          0% { clip-path: inset(100% 0 0 0); opacity: 0; }
          15% { opacity: 1; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        @keyframes monogramBreathe {
          0%, 100% { filter: drop-shadow(0 0 26px rgba(83,74,183,0.14)); }
          50% { filter: drop-shadow(0 0 48px rgba(83,74,183,0.30)); }
        }
        .monogram-svg {
          animation: monogramReveal 1.5s cubic-bezier(0.6, 0, 0.2, 1) 0.25s both,
                     monogramBreathe 7s ease-in-out 2s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .monogram-svg { animation: none; clip-path: none; opacity: 1; }
        }
      `}</style>
      <svg className="monogram-svg w-full h-auto" viewBox="0 0 560 640" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* гравюрная штриховка */}
          <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="#AFA9EC" strokeWidth="1.6" opacity="0.55" />
          </pattern>
        </defs>
        {/* серебряная тень-офсет (нижний слой гравюры) */}
        <text
          x="292" y="500" textAnchor="middle"
          fontFamily="var(--font-playfair), Georgia, serif" fontSize="560" fontWeight="500"
          fill="none" stroke="#c0bfcc" strokeWidth="1.5" opacity="0.8"
        >
          {letter}
        </text>
        {/* штриховая заливка */}
        <text
          x="280" y="488" textAnchor="middle"
          fontFamily="var(--font-playfair), Georgia, serif" fontSize="560" fontWeight="500"
          fill="url(#hatch)"
        >
          {letter}
        </text>
        {/* основной контур */}
        <text
          x="280" y="488" textAnchor="middle"
          fontFamily="var(--font-playfair), Georgia, serif" fontSize="560" fontWeight="500"
          fill="none" stroke="#534AB7" strokeWidth="2"
        >
          {letter}
        </text>
      </svg>
    </div>
  )
}

function SilverRule() {
  // линейка бланка: серебряная линия с засечками
  return (
    <div className="flex items-end gap-0 mt-5 mb-2 max-w-[420px]" aria-hidden>
      {[...Array(5)].map((_, i) => (
        <span key={i} className="flex-1 flex items-end">
          <span className="block w-px h-2.5" style={{ background: '#c0bfcc' }} />
          <span className="block flex-1 h-px" style={{ background: i < 4 ? '#c0bfcc' : 'linear-gradient(90deg,#c0bfcc,transparent)' }} />
        </span>
      ))}
    </div>
  )
}

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section className="relative overflow-hidden flex" style={{ minHeight: '100dvh', background: '#f4f3fd' }}>
      <GuillocheWaves />
      <EngravedInitial letter={surname.charAt(0)} />

      {/* вертикальный акцент-блок */}
      <aside
        className="hidden md:flex flex-col items-center justify-between flex-shrink-0 w-16 lg:w-20 py-10 relative z-20"
        style={{ background: '#534AB7' }}
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.35em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.85)' }}>
          Практика с {notary.practiceSince} года
        </span>
        <span className="block w-px flex-1 my-6" style={{ background: 'rgba(255,255,255,0.25)' }} />
        <span className="text-[10px] tracking-[0.35em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.85)' }}>
          Лицензия {notary.license}
        </span>
      </aside>

      {/* контент */}
      <div className="relative flex-1 flex items-center z-10">
        <div className="w-full mx-auto px-5 sm:px-10 lg:px-16 py-16" style={{ maxWidth: '1320px' }}>
          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-9 animate-fade-in-up">
              <span className="block w-10 h-px" style={{ background: '#534AB7' }} />
              <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#534AB7' }}>
                Нотариальная контора · Москва
              </span>
            </div>

            <h1
              className="font-serif font-medium leading-[1.04] mb-2 animate-fade-in-up"
              style={{ fontSize: 'clamp(40px, 6vw, 86px)', letterSpacing: '-0.015em', color: '#26223d', animationDelay: '80ms' }}
            >
              {surname}
              <br />
              <span className="font-normal italic" style={{ color: '#534AB7' }}>{rest}</span>
            </h1>

            <SilverRule />

            <p className="font-serif italic mb-9 animate-fade-in-up" style={{ fontSize: '19px', color: '#75718f', animationDelay: '160ms' }}>
              нотариус города Москвы
            </p>

            <p className="leading-relaxed mb-12 max-w-[470px] animate-fade-in-up" style={{ fontSize: '17px', lineHeight: '1.75', color: '#75718f', animationDelay: '220ms' }}>
              Каждое имя ставит свою подпись под важными решениями.
              Сделки, наследство, доверенности и копии — элегантно,
              внимательно и строго по закону.
            </p>

            <div className="flex flex-wrap items-center gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <BookingButton />
              <a href={notary.phoneHref} className="flex items-center gap-3.5 no-underline group">
                <span
                  className="w-12 h-12 rounded-full grid place-items-center flex-shrink-0 transition-colors group-hover:bg-[rgba(83,74,183,0.08)]"
                  style={{ border: '1px solid rgba(83,74,183,0.30)', color: '#534AB7' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: '#8d89a6' }}>Приём по записи</span>
                  <span className="font-medium text-[20px] transition-colors group-hover:text-[#534AB7]" style={{ color: '#26223d' }}>{notary.phone}</span>
                </span>
              </a>
            </div>

            <div className="flex md:hidden items-center gap-4 mt-12 pt-6 text-[11px] tracking-[0.18em] uppercase" style={{ borderTop: '1px solid rgba(83,74,183,0.18)', color: '#534AB7' }}>
              <span>Практика с {notary.practiceSince}</span>
              <span className="block w-1 h-1 rounded-full" style={{ background: '#c0bfcc' }} />
              <span>Лицензия {notary.license}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
