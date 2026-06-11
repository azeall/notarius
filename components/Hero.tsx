import { notary, motto } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: '100dvh', background: '#f5ede0' }}
    >
      <div className="relative w-full mx-auto px-5 sm:px-10 lg:px-16 py-16" style={{ maxWidth: '1280px' }}>
        <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-center">

          {/* Левая колонка: девиз */}
          <div>
            <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
              <span className="block w-10 h-px" style={{ background: '#c05c2e' }} />
              <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#c05c2e' }}>
                Нотариальная контора · Москва
              </span>
            </div>

            {/* Девиз */}
            <h1
              className="font-serif font-medium leading-[1.1] mb-8 animate-fade-in-up"
              style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', letterSpacing: '-0.01em', color: '#3d2010', animationDelay: '80ms' }}
            >
              «{motto}»
            </h1>

            <div className="flex items-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '140ms' }}>
              <span className="block w-12 h-px" style={{ background: 'rgba(192,92,46,0.5)' }} />
              <div>
                <p className="font-serif text-xl m-0" style={{ color: '#3d2010' }}>{notary.name}</p>
                <p className="text-sm m-0 mt-1" style={{ color: '#7d6a55' }}>{notary.title}</p>
              </div>
            </div>

            <p
              className="leading-relaxed mb-10 max-w-[480px] animate-fade-in-up"
              style={{ fontSize: '17px', lineHeight: '1.7', color: '#7d6a55', animationDelay: '200ms' }}
            >
              Тёплый приём и внимательное отношение к каждой ситуации.
              Сделки, наследство, доверенности и копии — спокойно и по закону.
            </p>

            <div className="flex flex-wrap items-center gap-5 animate-fade-in-up" style={{ animationDelay: '280ms' }}>
              <BookingButton />
              <a
                href={notary.phoneHref}
                className="inline-flex items-center gap-2.5 font-semibold text-[16px] no-underline transition-opacity hover:opacity-75"
                style={{ color: '#3d2010' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c05c2e" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {notary.phone}
              </a>
            </div>
          </div>

          {/* Правая колонка: фото-заглушка 400×600 */}
          <div className="relative mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            {/* Персиковая подложка со смещением */}
            <div
              className="absolute rounded-2xl"
              style={{ inset: '18px -18px -18px 18px', background: '#e8c9a0' }}
              aria-hidden
            />
            <div
              className="relative rounded-2xl flex flex-col items-center justify-center text-center"
              style={{
                width: 'min(400px, 78vw)',
                aspectRatio: '2 / 3',
                maxHeight: '600px',
                background: '#b9b1a4',
                border: '1px solid rgba(61,32,16,0.15)',
              }}
            >
              <svg width="84" height="84" viewBox="0 0 64 64" fill="none" stroke="rgba(61,32,16,0.30)" strokeWidth="1.4" aria-hidden>
                <circle cx="32" cy="22" r="10" />
                <path d="M12 54c2.5-10 10-16 20-16s17.5 6 20 16" />
              </svg>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase mt-4" style={{ color: 'rgba(61,32,16,0.45)' }}>
                [ фото нотариуса 400×600 ]
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
