// Set YANDEX_ORG_ID to your numeric org ID from Yandex Business to show the live embed.
// Find it in your Yandex Maps URL: yandex.ru/maps/org/<NAME>/<ID>/
const YANDEX_ORG_ID = '113303371166'

interface StaticReview {
  author: string
  date: string
  text: string
  rating: number
  platform: string
}

const STATIC_REVIEWS: StaticReview[] = [
  {
    author: 'Алина К.',
    date: 'март 2025',
    rating: 5,
    platform: 'Яндекс',
    text: 'Обратилась по вопросу оформления наследства. Всё разъяснили чётко и по делу, никаких лишних действий — только необходимые документы. Доверяю полностью.',
  },
  {
    author: 'С. Матвеев',
    date: 'февраль 2025',
    rating: 5,
    platform: 'Google',
    text: 'Заверяли доверенность на управление имуществом. Быстро, профессионально, без очередей. Персонал вежливый, атмосфера деловая. Рекомендую.',
  },
  {
    author: 'М. Соловьёва',
    date: 'январь 2025',
    rating: 5,
    platform: '2ГИС',
    text: 'Удостоверяли сделку купли-продажи квартиры. Нотариус очень внимательно проверил все документы, объяснил каждый пункт договора. Спокойно и уверенно прошли сделку.',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < n ? '#b89a5a' : 'none'} stroke="#b89a5a" strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  return (
    <section className="relative py-20 sm:py-[120px]" style={{ background: '#06101f' }}>
      <div className="relative mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1340px' }}>
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

        {YANDEX_ORG_ID ? (
          <div className="reveal rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(184,154,90,0.15)' }}>
            <iframe
              src={`https://yandex.ru/maps-reviews-widget/${YANDEX_ORG_ID}?comments`}
              width="100%"
              height="520"
              frameBorder="0"
              title="Отзывы на Яндекс Картах"
              style={{ display: 'block', filter: 'invert(0.88) hue-rotate(180deg) brightness(0.92)' }}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATIC_REVIEWS.map((r, i) => (
              <div
                key={r.author}
                className="reveal flex flex-col gap-4 p-7 rounded-2xl"
                data-reveal-delay={i * 100}
                style={{ border: '1px solid rgba(184,154,90,0.15)', background: 'rgba(184,154,90,0.04)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-cream text-[15px]">{r.author}</div>
                    <div className="text-[11px] tracking-[0.08em] mt-0.5" style={{ color: 'rgba(184,154,90,0.60)' }}>
                      {r.date}
                    </div>
                  </div>
                  <span
                    className="text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded flex-shrink-0"
                    style={{ border: '1px solid rgba(184,154,90,0.20)', color: 'rgba(184,154,90,0.70)' }}
                  >
                    {r.platform}
                  </span>
                </div>
                <Stars n={r.rating} />
                <p className="leading-relaxed flex-1" style={{ color: '#8a9ab8', fontSize: '14px', lineHeight: '1.65' }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
