'use client'
import { useRef, useState } from 'react'

const YANDEX_ORG_ID = '' // TODO: вставить ID организации Горбунова на Яндекс Картах

interface Review {
  author: string
  date: string
  text: string
  rating: number
  platform: 'Google' | '2GIS' | 'Zoon'
}

const OTHER_REVIEWS: Review[] = [
  {
    author: 'Марина К.',
    date: 'март 2025',
    rating: 5,
    platform: 'Google',
    text: 'Оформляли куплю-продажу квартиры. Николай Александрович подробно разобрал каждый пункт договора, ни одного вопроса не осталось открытым. Сделка прошла идеально.',
  },
  {
    author: 'Дмитрий П.',
    date: 'апрель 2025',
    rating: 5,
    platform: 'Google',
    text: 'Делал доверенность на автомобиль. Записался онлайн, пришёл — всё уже было готово к подписанию. Быстро, чётко, без лишних слов. Однозначно рекомендую.',
  },
  {
    author: 'Светлана Р.',
    date: 'февраль 2025',
    rating: 5,
    platform: '2GIS',
    text: 'Обращалась по наследству — сложная ситуация с несколькими наследниками. Нотариус разобрал всё спокойно и профессионально, подсказал оптимальный путь. Очень благодарна.',
  },
  {
    author: 'А. Воронов',
    date: 'январь 2025',
    rating: 5,
    platform: '2GIS',
    text: 'Заверяли брачный договор. Николай Александрович очень внимательно подошёл к формулировкам, объяснил последствия каждого пункта. Ушли уверенными в правильности решения.',
  },
  {
    author: 'Ольга Т.',
    date: 'март 2025',
    rating: 5,
    platform: 'Google',
    text: 'Удостоверяла согласие на выезд ребёнка. Приняли без очереди, всё сделали за 15 минут. Вежливо, спокойно, профессионально. Спасибо!',
  },
  {
    author: 'И. Захаров',
    date: 'апрель 2025',
    rating: 5,
    platform: 'Zoon',
    text: 'Удобное расположение в Саларьево, парковка есть. Сделали заверение копий и доверенность за один визит. Нотариус грамотный, персонал приветливый.',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < n ? '#b89a5a' : 'none'} stroke="#b89a5a" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

const PLATFORM_COLOR: Record<string, string> = {
  Google: 'rgba(66,133,244,0.18)',
  '2GIS': 'rgba(40,180,100,0.18)',
  Zoon:   'rgba(255,90,60,0.18)',
}
const PLATFORM_TEXT: Record<string, string> = {
  Google: '#4285f4',
  '2GIS': '#28b464',
  Zoon:   '#ff5a3c',
}
const PLATFORM_LABEL: Record<string, string> = {
  Google: 'Google',
  '2GIS': '2ГИС',
  Zoon:   'Zoon',
}

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  function updateArrows() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  function scroll(dir: 1 | -1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 320, behavior: 'smooth' })
    setTimeout(updateArrows, 350)
  }

  return (
    <section className="relative py-20 sm:py-[120px]" style={{ background: '#06101f' }}>
      <div className="relative mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1340px' }}>

        {/* Header */}
        <div className="flex items-end justify-between gap-10 mb-14 sm:mb-16 flex-wrap reveal">
          <div>
            <div className="inline-flex items-center gap-3.5 mb-5">
              <span className="block w-6 h-px bg-gold flex-shrink-0" />
              <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
                Отзывы клиентов
              </span>
            </div>
            <h2
              className="font-serif font-medium text-cream m-0"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
            >
              Что говорят{' '}
              <em className="italic font-normal text-gold">клиенты</em>
            </h2>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-8 items-start reveal">

          {/* Yandex widget */}
          <div
            className="rounded-2xl overflow-hidden flex-shrink-0"
            style={{ border: '1px solid rgba(184,154,90,0.15)', height: '520px', width: '460px', maxWidth: '100%' }}
          >
            {YANDEX_ORG_ID ? (
              <iframe
                src={`https://yandex.ru/maps-reviews-widget/${YANDEX_ORG_ID}?comments`}
                width="460"
                height="520"
                frameBorder="0"
                title="Отзывы на Яндекс Картах"
                style={{ display: 'block', filter: 'invert(0.88) hue-rotate(180deg) brightness(0.92)', width: '460px', minWidth: '460px' }}
                allowFullScreen
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-4"
                style={{ background: '#0f1e35' }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(184,154,90,0.4)" strokeWidth="1.4">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-center" style={{ color: 'rgba(184,154,90,0.40)' }}>
                  Яндекс Карты<br/>скоро будут здесь
                </p>
              </div>
            )}
          </div>

          {/* Other platforms */}
          <div className="flex flex-col gap-5 min-w-0">

            {/* Label + arrows */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] tracking-[0.26em] uppercase mb-2" style={{ color: 'rgba(184,154,90,0.60)' }}>
                  Другие платформы
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Google', '2GIS', 'Zoon'].map(p => (
                    <span key={p} className="text-[10px] tracking-[0.08em] px-2.5 py-0.5 rounded-full font-medium"
                      style={{ background: PLATFORM_COLOR[p], color: PLATFORM_TEXT[p] }}>
                      {PLATFORM_LABEL[p]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {([[-1, 'M15 18l-6-6 6-6'], [1, 'M9 18l6-6-6-6']] as [number, string][]).map(([dir, d]) => (
                  <button
                    key={dir}
                    onClick={() => scroll(dir as 1 | -1)}
                    className="w-9 h-9 rounded-full grid place-items-center transition-all"
                    style={{
                      border: '1px solid rgba(184,154,90,0.25)',
                      color: (dir === -1 ? canLeft : canRight) ? '#b89a5a' : 'rgba(184,154,90,0.25)',
                      background: (dir === -1 ? canLeft : canRight) ? 'rgba(184,154,90,0.08)' : 'transparent',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={d} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable cards */}
            <div
              ref={scrollRef}
              onScroll={updateArrows}
              className="flex gap-4 overflow-x-auto pb-1"
              style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
              {OTHER_REVIEWS.map((r) => (
                <div
                  key={r.author}
                  className="flex flex-col gap-3.5 p-5 rounded-xl flex-shrink-0"
                  style={{
                    width: '284px',
                    scrollSnapAlign: 'start',
                    border: '1px solid rgba(184,154,90,0.15)',
                    background: 'rgba(184,154,90,0.04)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-cream text-[14px]">{r.author}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'rgba(184,154,90,0.55)' }}>{r.date}</div>
                    </div>
                    <span
                      className="text-[10px] tracking-[0.06em] px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                      style={{ background: PLATFORM_COLOR[r.platform], color: PLATFORM_TEXT[r.platform] }}
                    >
                      {PLATFORM_LABEL[r.platform]}
                    </span>
                  </div>
                  <Stars n={r.rating} />
                  <p className="leading-relaxed m-0" style={{ color: '#8a9ab8', fontSize: '13px', lineHeight: '1.65' }}>
                    {r.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Aggregate rating */}
            <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(184,154,90,0.10)' }}>
              <span className="font-serif text-gold text-2xl leading-none">4.6</span>
              <Stars n={5} />
              <span className="text-[12px]" style={{ color: '#6b7895' }}>средняя оценка · 28+ отзывов</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}