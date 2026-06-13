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
        .dv-anim { animation-duration: 5.5s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
        @media (prefers-reduced-motion: reduce) { .dv-anim { animation: none !important; opacity: 1 !important; } }
      `}</style>

      <div className="absolute inset-0 rounded-2xl" style={{ background: '#def0e8', transform: 'rotate(5deg) translate(14px, 10px)' }} />
      <div className="absolute inset-0 rounded-2xl" style={{ background: '#e8f5f0', transform: 'rotate(-4deg) translate(-10px, 14px)' }} />

      <div
        className="dv-anim relative rounded-2xl px-7 py-8 overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid rgba(29,158,117,0.20)', boxShadow: '0 24px 60px rgba(29,158,117,0.14)', animationName: 'cardFloat', animationDuration: '6s' }}
      >
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

        <div className="flex items-end justify-between mt-7">
          <div>
            <div className="h-2 w-20 rounded mb-1.5" style={{ background: '#dfe9e5' }} />
            <svg width="104" height="28" viewBox="0 0 104 28" fill="none" stroke="#2c2c2c" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8,20 C2,12 12,3 19,11 C24,17 16,24 23,21 C28,19 25,11 32,13 C39,15 34,24 42,19 C48,15 44,9 52,11 C60,13 64,22 75,9 C79,4 84,8 87,3" strokeWidth="1.5" opacity="0.78" />
              <path d="M11,24 C34,28 60,27 84,19 C92,16.5 88,11 80,15" strokeWidth="1.9" opacity="0.6" />
            </svg>
          </div>
          <div
            className="dv-anim flex items-center gap-1.5 rounded-full px-3.5 py-2"
            style={{ background: '#1D9E75', opacity: 0, animationName: 'badgePop', boxShadow: '0 8px 22px rgba(29,158,117,0.35)' }}
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
