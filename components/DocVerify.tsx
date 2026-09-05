/** Анимация «документ проходит проверку»: скан-луч, галочки, бейдж (loop). */
export default function DocVerify() {
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
        @keyframes stampPop {
          0%, 56% { opacity: 0; transform: scale(1.6); }
          66% { opacity: 0.85; transform: scale(0.92); }
          72% { transform: scale(1); }
          88% { opacity: 0.85; }
          96%, 100% { opacity: 0; }
        }
        .dv-anim { animation-duration: 5.5s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
        @media (prefers-reduced-motion: reduce) { .dv-anim { animation: none !important; opacity: 1 !important; } }
      `}</style>

      <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgb(var(--surface-5-rgb))', transform: 'rotate(5deg) translate(14px, 10px)' }} />
      <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgb(var(--surface-2-rgb))', transform: 'rotate(-4deg) translate(-10px, 14px)' }} />

      <div
        className="dv-anim relative rounded-2xl px-7 py-8 overflow-hidden"
        style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgba(29,158,117,0.20)', boxShadow: '0 24px 60px rgba(29,158,117,0.14)', animationName: 'cardFloat', animationDuration: '6s' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg grid place-items-center" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
            <svg className="w-5 h-5" style={{ color: 'rgb(var(--violet-ink-rgb))' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="h-2.5 w-36 rounded" style={{ background: '#2c2c2c', opacity: 0.85 }} />
            <div className="h-2 w-24 rounded mt-1.5" style={{ background: 'rgb(var(--hair-rgb))' }} />
          </div>
        </div>

        {['92%', '78%', '86%', '64%'].map((w, i) => (
          <div key={i} className="flex items-center gap-3 mb-4">
            <div className="h-2 rounded flex-1" style={{ background: 'rgb(var(--surface-2-rgb))', maxWidth: w }} />
            <span
              className="dv-anim w-5 h-5 rounded-full grid place-items-center flex-shrink-0"
              style={{ background: 'rgb(var(--violet-rgb))', opacity: 0, animationName: `checkPop${i + 1}` }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
          </div>
        ))}

        <div className="flex items-end justify-between mt-7">
          <div>
            <div className="h-2 w-20 rounded mb-2" style={{ background: 'rgb(var(--hair-rgb))' }} />
            {/* круглая печать нотариуса на месте подписи */}
            <svg
              width="62" height="62" viewBox="0 0 70 70"
              className="dv-anim" style={{ opacity: 0, animationName: 'stampPop' }}
            >
              <g transform="translate(35,35) rotate(-8)" fill="none" stroke="#1D9E75">
                <circle r="31" strokeWidth="2.4" opacity="0.82" />
                <circle r="26" strokeWidth="1" opacity="0.55" />
                <path id="dvStampRing" d="M-20,0 a20,20 0 1,1 40,0 a20,20 0 1,1 -40,0" />
                <text fontSize="6" fontWeight="700" letterSpacing="1.3" fill="#1D9E75" fillOpacity="0.85" stroke="none">
                  <textPath href="#dvStampRing" startOffset="0">· НОТАРИУС · ГОРОД МОСКВА </textPath>
                </text>
                <g strokeWidth="1.6" opacity="0.85" strokeLinecap="round">
                  <line x1="0" y1="-11" x2="0" y2="8" />
                  <line x1="-10" y1="-7.5" x2="10" y2="-7.5" />
                  <path d="M-10,-7.5 L-13.5,-0.5 M-10,-7.5 L-6.5,-0.5" strokeWidth="0.7" />
                  <path d="M-14,-0.5 a4.5,2.6 0 0 0 9,0" strokeWidth="1.3" />
                  <path d="M10,-7.5 L6.5,-0.5 M10,-7.5 L13.5,-0.5" strokeWidth="0.7" />
                  <path d="M5,-0.5 a4.5,2.6 0 0 0 9,0" strokeWidth="1.3" />
                  <line x1="-6" y1="8" x2="6" y2="8" strokeWidth="1.8" />
                </g>
                <circle cx="0" cy="-11.6" r="1.5" fill="#1D9E75" stroke="none" opacity="0.85" />
              </g>
            </svg>
          </div>
          <div
            className="dv-anim flex items-center gap-1.5 rounded-full px-3.5 py-2"
            style={{ background: 'rgb(var(--violet-rgb))', opacity: 0, animationName: 'badgePop', boxShadow: '0 8px 22px rgba(29,158,117,0.35)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="text-white text-[11px] font-bold tracking-wide uppercase">Удостоверено</span>
          </div>
        </div>

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
