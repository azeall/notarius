import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/** Перо вырисовывает подпись и движется вдоль линии (animateMotion). */
function SignatureFlourish() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none" aria-hidden>
      <style>{`
        @keyframes sigDraw {
          0% { stroke-dashoffset: var(--len); opacity: 0; }
          6% { opacity: 1; }
          52% { stroke-dashoffset: 0; opacity: 1; }
          84% { stroke-dashoffset: 0; opacity: 1; }
          94% { opacity: 0; }
          100% { stroke-dashoffset: var(--len); opacity: 0; }
        }
        .sig-path {
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: var(--len);
          stroke-dashoffset: var(--len);
          animation: sigDraw 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sig-path { animation: none; stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>

      <svg viewBox="0 0 560 340" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* путь подписи — по нему едет перо */}
          <path
            id="sigTrack"
            d="M60 210 C 90 100, 140 85, 158 150 C 172 200, 150 240, 128 234 C 108 228, 118 186, 162 168 C 220 144, 244 110, 262 86 C 276 68, 286 74, 280 100 C 270 142, 252 196, 258 214 C 264 230, 286 200, 306 176 C 322 156, 338 148, 348 160 C 358 172, 348 196, 360 202 C 376 210, 398 172, 428 158 C 462 142, 492 154, 500 176"
          />
        </defs>

        {/* мягкая клякса позади */}
        <ellipse cx="290" cy="180" rx="240" ry="125" fill="rgba(83,74,183,0.05)" />

        {/* линия подписи (рисуется) */}
        <use
          href="#sigTrack"
          className="sig-path"
          style={{ ['--len' as string]: '900px' }}
          stroke="#534AB7" strokeWidth="3.5"
        />
        {/* флориш-подчёркивание */}
        <path
          className="sig-path"
          style={{ ['--len' as string]: '640px', animationDelay: '0.5s' }}
          stroke="#AFA9EC" strokeWidth="2.5"
          d="M70 262 C 180 294, 320 232, 410 254 C 452 264, 470 276, 462 284 C 452 293, 422 278, 440 268 C 464 256, 502 264, 522 254"
        />

        {/* перо: остриё в (0,0), едет по подписи */}
        <g opacity="0.95">
          <g transform="translate(0,0)">
            <path d="M0 0 L10 -26 C13 -36 26 -38 30 -28 C33 -20 27 -10 16 -5 Z" fill="#534AB7" />
            <line x1="4" y1="-8" x2="14" y2="-24" stroke="#f4f3fd" strokeWidth="2" />
            <path d="M10 -26 C14 -42 22 -52 34 -58" fill="none" stroke="#8d89a6" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1;0" keyTimes="0;0.52;0.84;1" calcMode="linear">
            <mpath href="#sigTrack" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;1;0;0" keyTimes="0;0.05;0.52;0.84;0.94;1" dur="8s" repeatCount="indefinite" />
        </g>
      </svg>
    </div>
  )
}

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section className="relative overflow-hidden flex" style={{ minHeight: '100dvh', background: '#f4f3fd' }}>
      <style>{`
        @keyframes blobFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(34px,-26px) scale(1.08); } }
        @keyframes blobFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-28px,22px) scale(0.94); } }
        @media (prefers-reduced-motion: reduce) { .lav-blob { animation: none !important; } }
      `}</style>

      {/* живой фон: лавандовые блобы */}
      <div className="lav-blob absolute pointer-events-none" style={{ width: 520, height: 520, top: '-12%', right: '-6%', background: 'radial-gradient(circle, rgba(175,169,236,0.35), transparent 65%)', filter: 'blur(10px)', animation: 'blobFloat1 11s ease-in-out infinite' }} aria-hidden />
      <div className="lav-blob absolute pointer-events-none" style={{ width: 420, height: 420, bottom: '-14%', left: '8%', background: 'radial-gradient(circle, rgba(83,74,183,0.14), transparent 65%)', filter: 'blur(12px)', animation: 'blobFloat2 14s ease-in-out infinite' }} aria-hidden />

      {/* вертикальный акцент-блок */}
      <aside className="hidden md:flex flex-col items-center justify-between flex-shrink-0 w-16 lg:w-20 py-10 relative z-10" style={{ background: '#534AB7' }} aria-hidden>
        <span className="text-[10px] tracking-[0.35em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.85)' }}>
          Практика с {notary.practiceSince} года
        </span>
        <span className="block w-px flex-1 my-6" style={{ background: 'rgba(255,255,255,0.25)' }} />
        <span className="text-[10px] tracking-[0.35em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.85)' }}>
          Лицензия {notary.license}
        </span>
      </aside>

      <div className="relative flex-1 flex items-center z-10">
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
                <span className="absolute left-0 right-0 bottom-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #c0bfcc, rgba(192,191,204,0.1))' }} aria-hidden />
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
                <span className="w-12 h-12 rounded-full grid place-items-center flex-shrink-0 transition-colors group-hover:bg-[rgba(83,74,183,0.08)]" style={{ border: '1px solid rgba(83,74,183,0.30)', color: '#534AB7' }}>
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
