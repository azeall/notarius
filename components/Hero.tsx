import { notary, motto } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/**
 * Hero «Вечерний кабинет»:
 * тёплая SVG-сцена — настольная лампа с дышащим конусом света,
 * стол с документами и книгами, пылинки, плывущие в луче.
 */

function EveningStudy() {
  const dust = [
    { cx: 330, cy: 420, r: 2.2, dur: 9, delay: 0 },
    { cx: 365, cy: 380, r: 1.6, dur: 7, delay: 1.2 },
    { cx: 400, cy: 440, r: 2.6, dur: 11, delay: 0.6 },
    { cx: 345, cy: 300, r: 1.4, dur: 8, delay: 2.1 },
    { cx: 415, cy: 330, r: 1.8, dur: 10, delay: 3 },
    { cx: 378, cy: 250, r: 1.3, dur: 6.5, delay: 1.8 },
    { cx: 300, cy: 360, r: 1.5, dur: 9.5, delay: 2.6 },
  ]
  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none" aria-hidden>
      <style>{`
        @keyframes lampBreathe {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }
        @keyframes dustRise {
          0% { transform: translateY(26px) translateX(0); opacity: 0; }
          12% { opacity: 0.9; }
          55% { transform: translateY(-34px) translateX(7px); opacity: 0.7; }
          100% { transform: translateY(-90px) translateX(-4px); opacity: 0; }
        }
        @keyframes sceneIn {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .study-scene { animation: sceneIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both; }
        .lamp-light { animation: lampBreathe 6.5s ease-in-out infinite; transform-origin: 370px 130px; }
        .lamp-glow { animation: glowPulse 6.5s ease-in-out infinite; transform-origin: 370px 470px; }
        .dust { animation: dustRise var(--d) ease-in-out var(--dl) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .study-scene, .lamp-light, .lamp-glow, .dust { animation: none !important; opacity: 1 !important; }
          .study-scene { transform: none; }
        }
      `}</style>

      <svg className="study-scene w-full h-auto" viewBox="0 0 560 540" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,213,158,0.55)" />
            <stop offset="70%" stopColor="rgba(255,213,158,0.16)" />
            <stop offset="100%" stopColor="rgba(255,213,158,0.04)" />
          </linearGradient>
          <radialGradient id="poolGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,196,128,0.55)" />
            <stop offset="100%" stopColor="rgba(255,196,128,0)" />
          </radialGradient>
        </defs>

        {/* шнур и лампа */}
        <line x1="370" y1="0" x2="370" y2="86" stroke="#3d2010" strokeWidth="3" />
        <circle cx="370" cy="92" r="4" fill="#3d2010" />
        <path d="M330 96 L410 96 L432 138 L308 138 Z" fill="#c05c2e" />
        <path d="M330 96 L410 96 L416 108 L324 108 Z" fill="rgba(255,255,255,0.18)" />
        <ellipse cx="370" cy="138" rx="62" ry="7" fill="#a34a22" />
        <circle cx="370" cy="142" r="7" fill="#ffd9a0" />

        {/* конус света (дышит) */}
        <g className="lamp-light">
          <path d="M318 134 L422 134 L508 470 L232 470 Z" fill="url(#coneGrad)" />
        </g>

        {/* тёплое пятно на столе */}
        <ellipse className="lamp-glow" cx="370" cy="470" rx="185" ry="30" fill="url(#poolGrad)" />

        {/* пылинки в луче */}
        {dust.map((p, i) => (
          <circle
            key={i}
            className="dust"
            cx={p.cx} cy={p.cy} r={p.r}
            fill="#ffdcae"
            style={{ ['--d' as string]: `${p.dur}s`, ['--dl' as string]: `${p.delay}s` }}
          />
        ))}

        {/* столешница */}
        <rect x="96" y="468" width="448" height="10" rx="3" fill="#4a2c14" />
        <rect x="96" y="478" width="448" height="4" fill="rgba(61,32,16,0.35)" />

        {/* стопка книг слева в полутени */}
        <g>
          <rect x="138" y="436" width="120" height="13" rx="2.5" fill="#7a4326" />
          <rect x="150" y="422" width="100" height="13" rx="2.5" fill="#a3552d" />
          <rect x="144" y="408" width="112" height="13" rx="2.5" fill="#8a6a4f" />
          <line x1="160" y1="442" x2="236" y2="442" stroke="rgba(245,237,224,0.35)" strokeWidth="1.5" />
          <line x1="170" y1="428" x2="230" y2="428" stroke="rgba(245,237,224,0.3)" strokeWidth="1.5" />
        </g>

        {/* документ в свете лампы */}
        <g transform="rotate(-5 392 430)">
          <rect x="318" y="386" width="148" height="84" rx="4" fill="#fdf8ef" stroke="rgba(61,32,16,0.18)" />
          <line x1="334" y1="406" x2="448" y2="406" stroke="#d8c5a8" strokeWidth="3" />
          <line x1="334" y1="420" x2="436" y2="420" stroke="#e2d3ba" strokeWidth="3" />
          <line x1="334" y1="434" x2="448" y2="434" stroke="#e2d3ba" strokeWidth="3" />
          <path d="M340 454 C 352 444, 360 460, 372 450 S 392 444, 400 452" fill="none" stroke="#3d2010" strokeWidth="1.6" opacity="0.75" />
        </g>

        {/* чернильница и перо справа */}
        <g>
          <rect x="486" y="446" width="26" height="22" rx="4" fill="#3d2010" />
          <ellipse cx="499" cy="446" rx="13" ry="4" fill="#241007" />
          <line x1="499" y1="446" x2="522" y2="402" stroke="#c05c2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M522 402 L530 388 L526 404 Z" fill="#c05c2e" />
        </g>

        {/* чашка чая в полутени */}
        <g opacity="0.85">
          <rect x="270" y="444" width="30" height="24" rx="5" fill="#a3552d" />
          <path d="M300 450 q12 4 0 12" fill="none" stroke="#a3552d" strokeWidth="3.5" />
          <path d="M278 436 q3 -7 0 -12 M290 436 q3 -7 0 -12" fill="none" stroke="rgba(255,220,174,0.6)" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>

      <p className="text-center font-serif italic mt-4" style={{ color: '#94816b', fontSize: '14px' }}>
        кабинет, где вас выслушают
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
      {/* тёплый градиент сверху-справа — отсвет лампы на весь hero */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 55% at 72% 30%, rgba(232,201,160,0.45), transparent 70%)' }} aria-hidden />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(192,92,46,0.025) 0 1px, transparent 1px 32px)' }} aria-hidden />

      <div className="relative w-full mx-auto px-5 sm:px-10 lg:px-16 py-16 grid md:grid-cols-[1.02fr_0.98fr] gap-12 lg:gap-14 items-center" style={{ maxWidth: '1280px' }}>

        {/* Имя — главное */}
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

          <div className="flex items-center gap-4 mt-10 pt-6 text-[11px] tracking-[0.18em] uppercase animate-fade-in-up" style={{ borderTop: '1px solid rgba(192,92,46,0.18)', color: '#c05c2e', animationDelay: '340ms' }}>
            <span>Практика с {notary.practiceSince}</span>
            <span className="block w-1 h-1 rounded-full" style={{ background: '#e8c9a0' }} />
            <span>Лицензия {notary.license}</span>
          </div>
        </div>

        {/* Сцена «вечерний кабинет» */}
        <div className="animate-fade-in" style={{ animationDelay: '240ms' }}>
          <EveningStudy />
        </div>
      </div>
    </section>
  )
}
