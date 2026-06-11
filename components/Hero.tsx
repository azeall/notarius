import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

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
        <span
          className="text-[10px] tracking-[0.35em] uppercase whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.85)' }}
        >
          Практика с {notary.practiceSince} года
        </span>
        <span className="block w-px flex-1 my-6" style={{ background: 'rgba(255,255,255,0.25)' }} />
        <span
          className="text-[10px] tracking-[0.35em] uppercase whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.85)' }}
        >
          Лицензия {notary.license}
        </span>
      </aside>

      {/* Контент */}
      <div className="relative flex-1 flex items-center">
        <div className="w-full mx-auto px-5 sm:px-10 lg:px-20 py-16" style={{ maxWidth: '1180px' }}>
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <span className="block w-10 h-px" style={{ background: '#534AB7' }} />
            <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: '#534AB7' }}>
              Нотариальная контора · Москва
            </span>
          </div>

          {/* ФИО с серебристым подчёркиванием */}
          <h1
            className="font-serif font-medium leading-[1.06] mb-3 animate-fade-in-up"
            style={{ fontSize: 'clamp(38px, 6vw, 84px)', letterSpacing: '-0.01em', color: '#26223d', animationDelay: '80ms' }}
          >
            {surname}
            <br />
            <span className="relative inline-block pb-3">
              {rest}
              <span
                className="absolute left-0 right-0 bottom-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, #c0bfcc, rgba(192,191,204,0.15))' }}
                aria-hidden
              />
            </span>
          </h1>

          <p
            className="font-serif italic mb-8 animate-fade-in-up"
            style={{ fontSize: '19px', color: '#75718f', animationDelay: '140ms' }}
          >
            — нотариус города Москвы
          </p>

          <p
            className="leading-relaxed mb-12 max-w-[540px] animate-fade-in-up"
            style={{ fontSize: '17px', lineHeight: '1.7', color: '#75718f', animationDelay: '200ms' }}
          >
            Удостоверение сделок, наследство, доверенности и копии документов.
            Внимательно, спокойно и строго по закону.
          </p>

          {/* Действия */}
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
                <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: '#8d89a6' }}>
                  Приём по записи
                </span>
                <span className="font-medium text-[20px] transition-colors group-hover:text-[#534AB7]" style={{ color: '#26223d' }}>
                  {notary.phone}
                </span>
              </span>
            </a>
          </div>

          {/* Мобильная версия акцент-блока */}
          <div className="flex md:hidden items-center gap-4 mt-12 pt-6 text-[11px] tracking-[0.18em] uppercase" style={{ borderTop: '1px solid rgba(83,74,183,0.18)', color: '#534AB7' }}>
            <span>Практика с {notary.practiceSince}</span>
            <span className="block w-1 h-1 rounded-full" style={{ background: '#c0bfcc' }} />
            <span>Лицензия {notary.license}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
