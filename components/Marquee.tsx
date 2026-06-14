/**
 * Бегущая строка с услугами — кинетический «живой» акцент (вдохновлено onla-ai).
 * Чистый CSS, без JS. Останавливается на наведении, уважает reduced-motion.
 */
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
        .mq-band{position:relative;overflow:hidden;background:#2f2a63;padding:18px 0;
          -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);}
        .mq-track{display:flex;width:max-content;gap:0;animation:mqscroll 38s linear infinite;}
        .mq-band:hover .mq-track{animation-play-state:paused;}
        .mq-item{display:inline-flex;align-items:center;gap:clamp(28px,4vw,56px);
          padding-right:clamp(28px,4vw,56px);white-space:nowrap;
          font-family:var(--font-playfair),Georgia,serif;font-style:italic;
          font-size:clamp(18px,2.4vw,30px);color:#e9e7fa;}
        .mq-dot{width:7px;height:7px;border-radius:50%;
          background:linear-gradient(135deg,#efe2b6,#c8b27e);flex:none;}
        @keyframes mqscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion:reduce){.mq-track{animation:none;justify-content:center;flex-wrap:wrap;}}
      `}</style>
    </section>
  )
}
