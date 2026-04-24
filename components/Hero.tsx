import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'
import SealCanvas from '@/components/SealCanvas'

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section
      className="relative overflow-hidden flex flex-col"
      style={{
        minHeight: '100dvh',
        background:
          'radial-gradient(ellipse 80% 60% at 85% 15%, rgba(184,154,90,0.09), transparent 60%),' +
          'radial-gradient(ellipse 70% 80% at 10% 90%, rgba(184,154,90,0.05), transparent 60%),' +
          'linear-gradient(180deg, #0a1628 0%, #081329 60%, #06101f 100%)',
      }}
    >
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)' }}
        aria-hidden
      />

      {/* Gold hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-[3]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(184,154,90,0.6), transparent)' }}
        aria-hidden
      />

      {/* Main grid */}
      <div
        className="relative z-[5] flex-1 mx-auto w-full flex items-center px-5 sm:px-8 md:px-16 py-16 md:py-20"
        style={{ maxWidth: '1480px' }}
      >
        <div className="w-full grid items-center gap-10 md:gap-20 grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">

          {/* ── LEFT COLUMN ── */}
          <div className="min-w-0 text-center md:text-left">
            {/* Eyebrow */}
            <div
              className="flex items-center justify-center md:justify-start gap-3 mb-6 sm:mb-8 animate-fade-in-up"
              style={{ animationDelay: '0ms' }}
            >
              <span className="block w-8 sm:w-11 h-px bg-gold flex-shrink-0" />
              <span className="text-gold font-semibold text-[10px] sm:text-[11px] tracking-[0.28em] sm:tracking-[0.32em] uppercase whitespace-nowrap">
                <span className="md:hidden">с 2008 года</span>
                <span className="hidden md:inline">Нотариальная контора · с 2008 года</span>
              </span>
              <span className="block w-8 sm:hidden h-px bg-gold flex-shrink-0" />
            </div>

            {/* H1 */}
            <h1
              className="font-serif font-medium leading-[1.04] tracking-tight mb-5 sm:mb-7 animate-fade-in-up text-cream break-words"
              style={{ fontSize: 'clamp(34px, 5.4vw, 78px)', letterSpacing: '-0.01em', animationDelay: '80ms' }}
            >
              <em className="italic font-normal" style={{ color: '#e0bd5f' }}>{surname}</em>
              {rest && (
                <>
                  <br />
                  {rest}
                </>
              )}
            </h1>

            {/* Gold ornament */}
            <div
              className="flex items-center justify-center md:justify-start gap-3 mb-5 sm:mb-6 animate-fade-in-up"
              style={{ animationDelay: '120ms' }}
              aria-hidden
            >
              <span className="block w-10 h-px bg-gold/70 flex-shrink-0" />
              <span className="block w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ border: '1px solid #b89a5a' }} />
              <span className="block w-10 h-px bg-gold/70 flex-shrink-0 md:hidden" />
            </div>

            {/* Role */}
            <p
              className="font-serif italic text-slate mb-6 sm:mb-7 animate-fade-in-up"
              style={{ fontSize: '18px', animationDelay: '140ms' }}
            >
              — нотариус города Москвы
            </p>

            {/* Subtitle */}
            <p
              className="text-slate leading-relaxed mb-10 sm:mb-12 max-w-[560px] mx-auto md:mx-0 animate-fade-in-up"
              style={{ fontSize: '17px', lineHeight: '1.65', animationDelay: '200ms' }}
            >
              Защита ваших прав и юридическая безопасность каждой сделки. Полный спектр нотариальных действий с соблюдением конфиденциальности и профессиональной этики.
            </p>

            {/* Actions */}
            <div
              className="flex flex-col md:flex-row md:flex-wrap items-center md:items-center justify-center md:justify-start gap-6 md:gap-8 mb-12 sm:mb-14 animate-fade-in-up"
              style={{ animationDelay: '280ms' }}
            >
              <BookingButton />

              <a
                href={notary.phoneHref}
                className="flex items-center gap-3 sm:gap-4 group text-cream no-underline min-w-0 text-left"
              >
                <span
                  className="w-12 h-12 rounded-full grid place-items-center flex-shrink-0 transition-all group-hover:bg-gold/10 group-hover:border-gold/50"
                  style={{ border: '1px solid rgba(200,160,60,0.30)', color: '#b89a5a' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase whitespace-nowrap"
                    style={{ color: '#6b7895' }}
                  >
                    Приём по записи
                  </span>
                  <span className="font-serif text-[19px] sm:text-[22px] text-cream group-hover:text-gold-light transition-colors whitespace-nowrap">
                    {notary.phone}
                  </span>
                </span>
              </a>
            </div>

            {/* Trust row */}
            <div
              className="flex items-center justify-center md:justify-start gap-3 sm:gap-7 pt-8 sm:pt-9 animate-fade-in-up mx-auto md:mx-0"
              style={{
                borderTop: '1px solid rgba(184,154,90,0.18)',
                maxWidth: '620px',
                animationDelay: '360ms',
              }}
            >
              {[
                { num: '18', lbl: 'лет практики' },
                { num: '12K+', lbl: 'удостоверений' },
                { num: '24/7', lbl: 'срочный выезд' },
              ].map((stat, i) => (
                <div key={stat.lbl} className="flex items-center gap-3 sm:gap-7 min-w-0">
                  <div className="flex flex-col items-center md:items-start min-w-0 text-center md:text-left">
                    <span className="font-serif text-[26px] sm:text-[32px] leading-none text-gold mb-1.5 sm:mb-2">{stat.num}</span>
                    <span
                      className="text-[9px] sm:text-[11px] tracking-[0.18em] uppercase whitespace-nowrap"
                      style={{ color: '#6b7895' }}
                    >
                      {stat.lbl}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="w-px h-9 flex-shrink-0" style={{ background: 'rgba(184,154,90,0.20)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN — Notarial Seal Canvas ── */}
          <div
            className="hidden md:flex items-center justify-center animate-fade-in"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '720px',
              height: '100%',
              overflow: 'visible',
              animationDelay: '200ms',
            }}
          >
            <SealCanvas
              style={{
                width: '160%',
                height: '160%',
                maxWidth: '880px',
                maxHeight: '880px',
                display: 'block',
                position: 'relative',
                zIndex: 3,
              }}
            />
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
