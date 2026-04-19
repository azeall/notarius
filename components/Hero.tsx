import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'
import ParticleCanvas from '@/components/ParticleCanvas'

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const patronymic = nameParts.length >= 3 ? nameParts[nameParts.length - 1] : ''
  const nameMain = nameParts.length >= 3
    ? nameParts.slice(0, -1).join(' ')
    : notary.name

  return (
    <section
      className="relative overflow-hidden flex flex-col"
      style={{
        minHeight: '100dvh',
        background:
          'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(200,160,60,0.07) 0%, transparent 60%),' +
          'radial-gradient(ellipse 70% 80% at 15% 90%, rgba(200,160,60,0.04) 0%, transparent 60%),' +
          'linear-gradient(180deg, #0d1b3e 0%, #0a1632 60%, #070f24 100%)',
      }}
    >
      {/* Particle canvas */}
      <ParticleCanvas className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.30) 100%)' }}
        aria-hidden
      />

      {/* Gold hairline top */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-[3]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(184,154,90,0.6), transparent)' }}
        aria-hidden
      />

      {/* Main grid */}
      <div
        className="relative z-[5] flex-1 mx-auto w-full flex items-center"
        style={{ maxWidth: '1480px', padding: '72px 64px 96px' }}
      >
        <div
          className="w-full grid items-center gap-16 md:gap-20"
          style={{ gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.95fr)' }}
        >
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-3 mb-8 animate-fade-in-up"
              style={{ animationDelay: '0ms' }}
            >
              <span className="block w-11 h-px bg-gold flex-shrink-0" />
              <span className="text-gold font-semibold text-[11px] tracking-[0.32em] uppercase">
                Нотариальная контора · с 2008 года
              </span>
            </div>

            {/* H1 */}
            <h1
              className="font-serif font-medium leading-[1.04] tracking-tight mb-7 animate-fade-in-up text-cream"
              style={{
                fontSize: 'clamp(44px, 5.4vw, 78px)',
                letterSpacing: '-0.01em',
                animationDelay: '80ms',
              }}
            >
              {nameMain}
              {patronymic && (
                <>
                  <br />
                  <em className="italic font-normal" style={{ color: '#e0bd5f' }}>{patronymic}</em>
                </>
              )}
            </h1>

            {/* Role */}
            <p
              className="font-serif italic text-slate mb-7 animate-fade-in-up"
              style={{ fontSize: '20px', animationDelay: '140ms' }}
            >
              — нотариус города Москвы
            </p>

            {/* Subtitle */}
            <p
              className="text-slate leading-relaxed mb-12 max-w-[540px] animate-fade-in-up"
              style={{ fontSize: '17px', lineHeight: '1.65', animationDelay: '200ms' }}
            >
              Защита ваших прав и юридическая безопасность каждой сделки.
              Полный спектр нотариальных действий с соблюдением конфиденциальности.
            </p>

            {/* Actions */}
            <div
              className="flex flex-wrap items-center gap-8 mb-14 animate-fade-in-up"
              style={{ animationDelay: '280ms' }}
            >
              <BookingButton
                className="relative inline-flex items-center gap-4 font-sans font-bold text-[12px] tracking-[0.22em] uppercase px-9 py-5 cursor-pointer overflow-hidden transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(180deg, #c8a03c 0%, #a07828 100%)',
                  color: '#1a1307',
                  boxShadow: '0 12px 40px -12px rgba(200,160,60,0.55)',
                }}
              />

              <a
                href={notary.phoneHref}
                className="flex items-center gap-4 group text-cream no-underline"
              >
                <span
                  className="w-11 h-11 rounded-full grid place-items-center flex-shrink-0 transition-colors"
                  style={{ border: '1px solid rgba(200,160,60,0.22)', color: '#b89a5a' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[11px] tracking-[0.22em] uppercase" style={{ color: '#6b7895' }}>
                    Приём по записи
                  </span>
                  <span className="font-serif text-[22px] text-cream">
                    {notary.phone}
                  </span>
                </span>
              </a>
            </div>

            {/* Trust row */}
            <div
              className="flex items-center gap-7 pt-9 animate-fade-in-up"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                maxWidth: '620px',
                animationDelay: '360ms',
              }}
            >
              {[
                { num: '18', lbl: 'лет практики' },
                { num: '12K+', lbl: 'удостоверений' },
                { num: '24/7', lbl: 'срочный выезд' },
              ].map((stat, i) => (
                <div key={stat.lbl} className="flex items-center gap-7">
                  <div className="flex flex-col">
                    <span className="font-serif text-[32px] leading-none text-gold mb-2">{stat.num}</span>
                    <span className="text-[11px] tracking-[0.18em] uppercase" style={{ color: '#6b7895' }}>
                      {stat.lbl}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="w-px h-9 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div
            className="hidden md:flex flex-col gap-5 animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            {/* Portrait placeholder */}
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: '4/5',
                maxWidth: '420px',
                border: '1px solid rgba(200,160,60,0.22)',
                background:
                  'repeating-linear-gradient(45deg, rgba(200,160,60,0.06) 0px, rgba(200,160,60,0.06) 2px, transparent 2px, transparent 12px),' +
                  'linear-gradient(160deg, rgba(200,160,60,0.10), rgba(10,22,40,0.40))',
              }}
            >
              {/* Inner frame */}
              <div
                className="absolute pointer-events-none"
                style={{ inset: '14px', border: '1px solid rgba(200,160,60,0.22)' }}
                aria-hidden
              />
              {/* Corner brackets */}
              {[
                { style: { top: 0, left: 0, borderTop: '1px solid #b89a5a', borderLeft: '1px solid #b89a5a' } },
                { style: { top: 0, right: 0, borderTop: '1px solid #b89a5a', borderRight: '1px solid #b89a5a' } },
                { style: { bottom: 0, left: 0, borderBottom: '1px solid #b89a5a', borderLeft: '1px solid #b89a5a' } },
                { style: { bottom: 0, right: 0, borderBottom: '1px solid #b89a5a', borderRight: '1px solid #b89a5a' } },
              ].map((c, i) => (
                <div key={i} className="absolute" style={{ width: 18, height: 18, ...c.style }} aria-hidden />
              ))}
              {/* Label */}
              <div
                className="absolute bottom-6 left-6 font-mono text-[11px] tracking-[0.15em] uppercase"
                style={{ color: '#6b7895' }}
              >
                [ портрет / {notary.address.split(',')[0]} ]
              </div>
            </div>

            {/* Credential cards */}
            <div className="grid grid-cols-2 gap-3.5" style={{ maxWidth: '420px' }}>
              {[
                {
                  icon: (
                    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M11 1.5 2 4.5v7c0 5.5 3.8 9.8 9 11.5 5.2-1.7 9-6 9-11.5v-7L11 1.5Z" />
                      <path d="m7 11.5 3 3 5-5.5" strokeWidth="1.6" />
                    </svg>
                  ),
                  code: 'Реестр · № 77/1842',
                  title: 'Лицензия\nМинюст РФ',
                  meta: 'Выдана 14.03.2008',
                  verify: 'Действующая',
                },
                {
                  icon: (
                    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M11 1.5 2 4.5v7c0 5.5 3.8 9.8 9 11.5 5.2-1.7 9-6 9-11.5v-7L11 1.5Z" />
                      <path d="M11 7v9M7 11h8M6 14h4M12 14h4" strokeWidth="1.3" />
                    </svg>
                  ),
                  code: 'Членство с 2009',
                  title: 'Член МГНП',
                  meta: 'Моск. гор. нотариальная палата',
                  verify: 'Активное',
                },
              ].map((cred) => (
                <div
                  key={cred.code}
                  className="relative group cursor-default transition-all duration-300"
                  style={{
                    padding: '22px 20px',
                    background: 'linear-gradient(170deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))',
                    border: '1px solid rgba(200,160,60,0.18)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {/* Gold corner decorations */}
                  <div
                    className="absolute top-0 left-0 w-3.5 h-px bg-gold"
                    aria-hidden
                  />
                  <div
                    className="absolute top-0 left-0 w-px h-3.5 bg-gold"
                    aria-hidden
                  />
                  {/* Shield icon */}
                  <div
                    className="w-9 h-9 mb-4 grid place-items-center text-gold"
                    style={{ background: 'radial-gradient(circle at 50% 40%, rgba(200,160,60,0.22), transparent 70%)' }}
                  >
                    {cred.icon}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase mb-1.5" style={{ color: '#6b7895' }}>
                    {cred.code}
                  </div>
                  <div className="font-serif text-[17px] leading-snug text-cream mb-2.5" style={{ whiteSpace: 'pre-line' }}>
                    {cred.title}
                  </div>
                  <div className="text-[12px] text-slate">{cred.meta}</div>
                  <div
                    className="absolute bottom-3.5 right-3.5 text-[10px] tracking-[0.16em] uppercase"
                    style={{ color: '#b89a5a', opacity: 0.7 }}
                  >
                    ✓ {cred.verify}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours pill */}
            <div
              className="flex items-center gap-3"
              style={{
                padding: '14px 20px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                maxWidth: '420px',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-dot"
                style={{ background: '#4ade80', boxShadow: '0 0 10px #4ade80' }}
              />
              <span className="text-[12px] text-slate tracking-[0.04em]">
                <strong className="text-cream font-medium">Открыто сейчас</strong>
                {' · '}Пн–Пт 9:00–20:00, Сб 10:00–16:00
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical address note */}
      <div
        className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block z-[6]"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg) translateY(50%)',
          fontSize: '10px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(184,154,90,0.20)',
          whiteSpace: 'nowrap',
        }}
      >
        {notary.address}
      </div>

      {/* Scroll cue */}
      <div
        className="absolute left-16 bottom-9 z-[6] hidden md:flex items-center gap-3.5"
        style={{ fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#6b7895' }}
      >
        <span>Листайте ниже</span>
        <span
          className="relative overflow-hidden"
          style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, #b89a5a, transparent)' }}
        >
          <span
            className="absolute inset-0 bg-gold animate-scroll-line"
            style={{ transformOrigin: 'left' }}
            aria-hidden
          />
        </span>
      </div>
    </section>
  )
}
