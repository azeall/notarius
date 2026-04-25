'use client'
import { useRef, useState } from 'react'

const YANDEX_URL = 'https://yandex.ru/maps/org/notarius_bykonya_r_ye_/113303371166/reviews/'

interface Review {
  author: string
  date: string
  text: string
  rating: number
  platform: 'Яндекс' | 'Google' | '2ГИС' | 'Zoon'
}

const REVIEWS: Review[] = [
  {
    author: 'Виктория Дорофеева',
    date: '11 февраля 2025',
    rating: 5,
    platform: 'Яндекс',
    text: 'Прекрасный нотариус. Все делают быстро и качественно. Приветствуется направление документов заранее. Обращалась несколько раз. Помощники всегда доходчиво и подробно разъясняют. Прозрачное ценообразование. Осталась довольна. Рекомендую.',
  },
  {
    author: 'Игорь В.',
    date: 'декабрь 2024',
    rating: 5,
    platform: 'Google',
    text: 'Оформляли с женой куплю-продажу квартиры. Нотариус профессионально вёл всю сделку, объяснил каждый пункт договора. Очень доволен результатом.',
  },
  {
    author: 'А. Лебедев',
    date: 'январь 2025',
    rating: 5,
    platform: '2ГИС',
    text: 'Обращался по вопросу вступления в наследство. Всё объяснили по шагам, подготовили документы точно в срок. Спасибо за терпение и профессионализм.',
  },
  {
    author: 'Дарья Д.',
    date: 'март 2025',
    rating: 5,
    platform: 'Яндекс',
    text: 'Делала доверенность на представление интересов. Всё прошло очень быстро и чётко. Сотрудники отзывчивые, объяснили что и как. Приятная обстановка в офисе.',
  },
  {
    author: 'Наталья С.',
    date: 'ноябрь 2024',
    rating: 5,
    platform: 'Google',
    text: 'Заверяла согласие супруга на сделку. Пришла без записи, приняли быстро. Всё чётко, без лишней бюрократии. Рекомендую.',
  },
  {
    author: 'Е. Громова',
    date: 'март 2025',
    rating: 5,
    platform: '2ГИС',
    text: 'Удобное расположение, удалось записаться с первого раза. Сделали доверенность за 20 минут. Персонал вежливый, всё объяснили.',
  },
  {
    author: 'М. Соловьёва',
    date: 'февраль 2025',
    rating: 5,
    platform: 'Яндекс',
    text: 'Удостоверяли сделку купли-продажи квартиры. Нотариус очень внимательно проверил все документы, объяснил каждый пункт договора. Спокойно и уверенно прошли сделку.',
  },
  {
    author: 'Р. Козлов',
    date: 'февраль 2025',
    rating: 5,
    platform: 'Google',
    text: 'Грамотный нотариус, внимательный персонал. Помогли с оформлением брачного договора, всё прошло без задержек и нареканий.',
  },
  {
    author: 'О. Тихонова',
    date: 'октябрь 2024',
    rating: 5,
    platform: 'Zoon',
    text: 'Удостоверяла сделку дарения. Нотариус очень внимательно проверил все документы, указал на возможные риски. Чувствуешь себя защищённой.',
  },
]

const PLATFORM_BG: Record<string, string> = {
  'Яндекс': 'rgba(255, 60, 0, 0.14)',
  'Google':  'rgba(66, 133, 244, 0.16)',
  '2ГИС':   'rgba(40, 180, 100, 0.16)',
  'Zoon':    'rgba(255, 90, 60, 0.16)',
}
const PLATFORM_FG: Record<string, string> = {
  'Яндекс': '#ff6040',
  'Google':  '#4285f4',
  '2ГИС':   '#28b464',
  'Zoon':    '#ff5a3c',
}

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

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const CARD_W = 320 + 16 // card width + gap

  function updateState() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
    setActive(Math.round(el.scrollLeft / CARD_W))
  }

  function scroll(dir: 1 | -1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * CARD_W, behavior: 'smooth' })
    setTimeout(updateState, 350)
  }

  return (
    <section className="relative py-20 sm:py-[120px]" style={{ background: '#06101f' }}>
      <div className="relative mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1340px' }}>

        {/* Header */}
        <div className="reveal mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-3.5 mb-5">
            <span className="block w-6 h-px bg-gold flex-shrink-0" />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
              Отзывы клиентов
            </span>
          </div>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h2
              className="font-serif font-medium text-cream m-0"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
            >
              Что говорят{' '}
              <em className="italic font-normal text-gold">клиенты</em>
            </h2>

            {/* Aggregate + arrows */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="font-sans font-semibold text-gold text-2xl leading-none">4.6</span>
                <Stars n={5} />
                <span className="text-[12px]" style={{ color: '#6b7895' }}>28+ отзывов</span>
              </div>
              <div className="flex gap-2">
                {([-1, 1] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => scroll(dir)}
                    aria-label={dir === -1 ? 'Назад' : 'Вперёд'}
                    className="w-9 h-9 rounded-full grid place-items-center transition-all"
                    style={{
                      border: '1px solid rgba(184,154,90,0.25)',
                      color: (dir === -1 ? canLeft : canRight) ? '#b89a5a' : 'rgba(184,154,90,0.22)',
                      background: (dir === -1 ? canLeft : canRight) ? 'rgba(184,154,90,0.08)' : 'transparent',
                      cursor: (dir === -1 ? canLeft : canRight) ? 'pointer' : 'default',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={dir === -1 ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={updateState}
          className="reveal flex gap-4 overflow-x-auto pb-3"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          } as React.CSSProperties}
        >
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 rounded-2xl flex-shrink-0"
              style={{
                width: '320px',
                scrollSnapAlign: 'start',
                border: '1px solid rgba(184,154,90,0.15)',
                background: i === active
                  ? 'rgba(184,154,90,0.07)'
                  : 'rgba(184,154,90,0.03)',
                transition: 'background 0.3s',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-cream text-[14px] mb-0.5">{r.author}</div>
                  <div className="text-[11px]" style={{ color: 'rgba(184,154,90,0.55)' }}>{r.date}</div>
                </div>
                <span
                  className="text-[10px] tracking-[0.06em] px-2.5 py-1 rounded-full flex-shrink-0 font-medium"
                  style={{ background: PLATFORM_BG[r.platform], color: PLATFORM_FG[r.platform] }}
                >
                  {r.platform}
                </span>
              </div>

              <Stars n={r.rating} />

              <p className="m-0 leading-relaxed" style={{ color: '#8a9ab8', fontSize: '13px', lineHeight: '1.7' }}>
                {r.text}
              </p>
            </div>
          ))}
        </div>

        {/* Dots + Yandex link */}
        <div className="flex items-center justify-between mt-5 flex-wrap gap-4 reveal">
          <div className="flex gap-1.5">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  scrollRef.current?.scrollTo({ left: i * CARD_W, behavior: 'smooth' })
                  setTimeout(updateState, 350)
                }}
                className="rounded-full transition-all"
                style={{
                  width: i === active ? '20px' : '6px',
                  height: '6px',
                  background: i === active ? '#b89a5a' : 'rgba(184,154,90,0.25)',
                }}
                aria-label={`Отзыв ${i + 1}`}
              />
            ))}
          </div>
          <a
            href={YANDEX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase no-underline pb-px transition-colors hover:text-gold-light"
            style={{ color: 'rgba(184,154,90,0.65)', borderBottom: '1px solid rgba(184,154,90,0.25)' }}
          >
            Все отзывы на Яндекс Картах
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}