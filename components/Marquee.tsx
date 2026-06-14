/** Бегущая строка услуг — кинетический «живой» акцент. Чистый CSS, пауза на hover, reduced-motion safe. */
const ITEMS = [
  'Удостоверение сделок',
  'Наследственные дела',
  'Доверенности',
  'Брачные договоры',
  'Согласия супругов',
  'Заверение копий',
  'Нотариальный перевод',
  'Корпоративные документы',
]

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <section className="mq-band" aria-hidden>
      <div className="mq-track">
        {row.map((t, i) => (
          <span className="mq-item" key={i}>
            {t}
            <span className="mq-dot" />
          </span>
        ))}
      </div>
      <style>{`
        .mq-band{position:relative;overflow:hidden;background:#0f1714;padding:16px 0;
          -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);}
        .mq-track{display:flex;width:max-content;animation:mqscroll 36s linear infinite;}
        .mq-band:hover .mq-track{animation-play-state:paused;}
        .mq-item{display:inline-flex;align-items:center;gap:clamp(24px,3.5vw,48px);
          padding-right:clamp(24px,3.5vw,48px);white-space:nowrap;
          font-family:var(--font-manrope),system-ui,sans-serif;font-weight:800;text-transform:uppercase;
          letter-spacing:.04em;font-size:clamp(14px,1.7vw,20px);color:#e8f5f0;}
        .mq-dot{width:7px;height:7px;border-radius:50%;background:#1D9E75;flex:none;
          box-shadow:0 0 10px rgba(29,158,117,.7);}
        @keyframes mqscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion:reduce){.mq-track{animation:none;justify-content:center;flex-wrap:wrap;}}
      `}</style>
    </section>
  )
}
