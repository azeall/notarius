import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/** Самовырисовывающаяся подпись пером — центрпис hero. */
function SignatureFlourish() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none" aria-hidden>
      <style>{`
        @keyframes sigDraw {
          0% { stroke-dashoffset: var(--len); opacity: 0; }
          8% { opacity: 1; }
          45% { stroke-dashoffset: 0; opacity: 1; }
          82% { stroke-dashoffset: 0; opacity: 1; }
          92% { opacity: 0; }
          100% { stroke-dashoffset: var(--len); opacity: 0; }
        }
        @keyframes nibFloat {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50% { transform: translateY(-10px) rotate(-4deg); }
        }
        .sig-path {
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: var(--len);
          stroke-dashoffset: var(--len);
          animation: sigDraw 7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sig-path { animation: none; stroke-dashoffset: 0; opacity: 1; }
          .sig-nib { animation: none !important; }
        }
      `}</style>

      <svg viewBox="0 0 560 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* фоновая мягкая клякса */}
        <ellipse cx="290" cy="190" rx="240" ry="130" fill="rgba(83,74,183,0.05)" />

        {/* росчерк-подпись */}
        <path
          className="sig-path"
          style={{ ['--len' as string]: '900px', animationDelay: '0s' }}
          stroke="#534AB7" strokeWidth="3.5"
          d="M60 220 C 90 110, 140 95, 158 160 C 172 210, 150 250, 128 244 C 108 238, 118 196, 162 178 C 220 154, 244 120, 262 96 C 276 78, 286 84, 280 110 C 270 152, 252 206, 258 224 C 264 240, 286 210, 306 186 C 322 166, 338 158, 348 170 C 358 182, 348 206, 360 212 C 376 220, 398 182, 428 168 C 462 152, 492 164, 500 186"
        />
        {/* подчёркивающий флориш */}
        <path
          className="sig-path"
          style={{ ['--len' as string]: '700px', animationDelay: '0.9s' }}
          stroke="#AFA9EC" strokeWidth="2.5"
          d="M70 278 C 180 310, 320 248, 410 270 C 460 282, 480 296, 470 304 C 458 314, 420 296, 442 286 C 470 272, 510 280, 528 270"
        />
        {/* точка в конце */}
        <circle cx="512" cy="196" r="5" fill="#534AB7">
          <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.42;0.48;0.82;0.92;1" dur="7s" repeatCount="indefinite" />
        </circle>

        {/* перо */}
        <g className="sig-nib" style={{ transformOrigin: '470px 120px', animation: 'nibFloat 5s ease-in-out infinite' }}>
          <path
            d="M470 60 L500 30 C508 22 520 24 522 34 C524 42 518 50 510 56 L478 86 L466 92 L470 78 Z"
            fill="#534AB7" opacity="0.9"
          />
          <line x1="474" y1="74" x2="496" y2="50" stroke="#f4f3fd" strokeWidth="2" />
        </g>

        {/* серебристые штрихи-документ позади */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1={120 + i * 8} y1={320 + i * 9} x2={440 - i * 14} y2={320 + i * 9} stroke="#c0bfcc" strokeWidth="1.5" opacity={0.5 - i * 0.1} />
        ))}
      </svg>
    </div>
  )
}

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section
      className="relative overflow-hidden flex"
      style={{ minHeight: '100dvh', background: '#f4f3fd' }}
    >
      {/* Вертикальный акцент-блок слева */}
      <aside
        className="hidden md:flex flex-col items-center justify-between flex-shrink-0 w-16 lg:w-20 py-10"
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

      {/* Контент: текст слева, подпись справа */}
      <div className="relative flex-1 flex items-center">
        <div className="w-full mx-auto px-5 sm:px-10 lg:px-16 py-16 grid lg:grid-cols-[1fr_0.9fr] gap-12 items-center" style={{ maxWidth: '1320px' }}>
          <div>
            <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
              <span className="block w-10 h-px" style={{ background: '#534AB7' }} />
              <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#534AB7' }}>
                Нотариальная контора · Москва
              </span>
            </div>

            <h1
              className="font-serif font-medium leading-[1.06] mb-3 animate-fade-in-up"
              style={{ fontSize: 'clamp(38px, 5.5vw, 76px)', letterSpacing: '-0.01em', color: '#26223d', animationDelay: '80ms' }}
            >
              {surname}
              <br />
              <span className="relative inline-block pb-3">
                {rest}
                <span
                  className="absolute left-0 right-0 bottom-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, #c0bfcc, rgba(192,191,204,0.1))' }}
                  aria-hidden
                />
              </span>
            </h1>

            <p className="font-serif italic mb-8 animate-fade-in-up" style={{ fontSize: '19px', color: '#75718f', animationDelay: '140ms' }}>
              — нотариус города Москвы
            </p>

            <p className="leading-relaxed mb-12 max-w-[480px] animate-fade-in-up" style={{ fontSize: '17px', lineHeight: '1.7', color: '#75718f', animationDelay: '200ms' }}>
              Каждый документ начинается с подписи. Сделки, наследство,
              доверенности и копии — элегантно, внимательно, по закону.
            </p>

            <div className="flex flex-wrap items-center gap-6 animate-fade-in-up" style={{ animationDelay: '280ms' }}>
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

          {/* Центрпис: подпись */}
          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '300ms' }}>
            <SignatureFlourish />
            <p className="text-center font-serif italic mt-2" style={{ color: '#8d89a6', fontSize: '14px' }}>
              подпись — начало каждого документа
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
