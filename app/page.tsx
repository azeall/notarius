import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import CostCalculator from '@/components/CostCalculator'
import BookingInline from '@/components/BookingInline'
import BookingButton from '@/components/BookingButton'
import ScrollCount from '@/components/ScrollCount'
import LegalPhotos from '@/components/LegalPhotos'
import CredentialsSection from '@/components/CredentialsSection'
import SectionMark from '@/components/SectionMark'
import ScrollRule from '@/components/ScrollRule'
import { notary, site, documentsDone } from '@/lib/data'
import { reviews } from '@/lib/reviews'

export const metadata: Metadata = {
  title: 'Нотариус в Москве · Запись на приём онлайн',
  description:
    'Нотариальная контора в Москве. Удостоверение сделок, наследство, доверенности, заверение копий. Калькулятор стоимости и запись онлайн.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    title: `Нотариус ${notary.name} · Москва`,
    description: site.description,
  },
}

const STEPS = [
  {
    t: 'Запишитесь',
    d: 'Онлайн на сайте или по телефону. Выберите дату и время — контора работает по записи, чтобы никто не сидел в очереди.',
  },
  {
    t: 'Подготовьте документы',
    d: 'При записи мы называем точный перечень для вашего случая. Он у каждого свой: доверенность на автомобиль и вступление в наследство требуют разного.',
  },
  {
    t: 'Приходите на приём',
    d: 'Нотариус проверяет документы, разъясняет последствия сделки и удостоверяет её. Экземпляр остаётся у вас, сведения уходят в реестр.',
  },
]

const HOURS_LINES = 'Пн–Пт 10:00–19:00\nСб, Вс — выходной'

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Полоса счётчиков: графитовая плашка, единственная тёмная на странице ── */}
      <section className="py-16 sm:py-20" style={{ background: 'rgb(var(--text-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-6">
            {[
              // Стаж считается от года начала практики, а не вписан рукой:
              // число в разметке через год устаревает, а править его никто не придёт.
              ...(notary.practiceSince
                ? [{ v: new Date().getFullYear() - Number(notary.practiceSince), s: ' лет', l: 'нотариальной практики' }]
                : []),
              ...(documentsDone > 0
                ? [{ v: documentsDone, s: '+', l: 'оформленных документов' }]
                : []),
              { v: 100, s: '%', l: 'юридическая сила' },
            ].map((st, i) => (
              <div key={st.l} className={`sd sd-${i + 1}`}>
                <div
                  className="font-serif font-medium leading-none mb-3 nums"
                  style={{ fontSize: 'clamp(34px, 4.6vw, 54px)', color: 'rgb(var(--bg-rgb))', letterSpacing: '-0.02em' }}
                >
                  <ScrollCount value={st.v} suffix={st.s} />
                </div>
                <div className="text-[12px] tracking-[0.16em] uppercase" style={{ color: 'rgb(var(--bg-rgb) / 0.62)' }}>
                  {st.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CostCalculator />

      <div className="px-5 sm:px-10" style={{ background: 'rgb(var(--bg-rgb))' }}><ScrollRule /></div>

      {/* ── Как проходит приём: шаги ложатся стопкой при прокрутке ── */}
      <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--bg-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-14 items-start">
            <div className="reveal">
              <SectionMark n="01">Как проходит приём</SectionMark>
            </div>

            <div>
              <h2
                className="font-serif font-medium m-0 mb-10 reveal"
                style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.08, letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}
              >
                Три шага, и ни одного лишнего
              </h2>

              {/* Раздел замирает, а шаги проходят внутри него по мере
                  прокрутки — порядок действий читается как порядок, а не как
                  три равноправные колонки. Где animation-timeline не
                  поддерживается, это остаётся обычным списком карточек. */}
              <div className="scene" data-scene>
                <div className="scene-inner">
                  {STEPS.map((s, i) => (
                    <article key={s.t} className="scene-step stack-card">
                      <span className="stack-n font-mono">0{i + 1}</span>
                      <h3
                        className="font-serif m-0 mb-3"
                        style={{ fontSize: 'clamp(21px, 2.6vw, 30px)', color: 'rgb(var(--text-rgb))', letterSpacing: '-0.01em' }}
                      >
                        {s.t}
                      </h3>
                      <p className="m-0 text-[16px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))', maxWidth: '54ch' }}>
                        {s.d}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection />

      <LegalPhotos />

      <div className="px-5 sm:px-10" style={{ background: 'rgb(var(--bg-rgb))' }}><ScrollRule /></div>

      {/* ── Отзывы ── */}
      {reviews.length > 0 && (
        <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--bg-rgb))' }}>
          <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
            <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-14 items-start">
              <div className="reveal">
                <SectionMark n="02">Отзывы</SectionMark>
              </div>

              <div>
                <blockquote
                  className="font-serif m-0 mb-6 reveal"
                  style={{ fontSize: 'clamp(23px, 2.8vw, 34px)', lineHeight: 1.34, letterSpacing: '-0.015em', color: 'rgb(var(--text-rgb))' }}
                >
                  {reviews[0].text}
                </blockquote>
                <p className="m-0 mb-12 text-[15px] reveal" style={{ color: 'rgb(var(--muted-rgb))' }}>
                  {reviews[0].name} · {reviews[0].service}
                </p>

                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                  {reviews.slice(1, 3).map((r, i) => (
                    <figure
                      key={r.name}
                      className="m-0 pt-6 reveal"
                      style={{ borderTop: '1px solid rgb(var(--rule-rgb))' }}
                      data-reveal-delay={i * 100}
                    >
                      <blockquote className="m-0 mb-3 text-[15px] leading-relaxed" style={{ color: 'rgb(var(--text-e-rgb))' }}>
                        {r.text}
                      </blockquote>
                      <figcaption className="text-[14px]" style={{ color: 'rgb(var(--muted-rgb))' }}>
                        {r.name} · {r.service}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Карта и контакты ── */}
      <section className="py-20 sm:py-24" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <div className="reveal"><SectionMark n="03">Как нас найти</SectionMark></div>
          <div className="grid md:grid-cols-[0.42fr_0.58fr] gap-8 items-stretch">
            <div className="reveal">
              {[
                { k: 'Адрес', v: notary.address },
                { k: 'Телефон', v: notary.phone, href: notary.phoneHref },
                { k: 'Часы', v: HOURS_LINES },
                { k: 'Email', v: notary.email, href: `mailto:${notary.email}` },
              ].map(row => (
                <div key={row.k} className="py-4" style={{ borderTop: '1px solid rgb(var(--rule-rgb))' }}>
                  <p className="text-[11px] tracking-[0.18em] uppercase m-0 mb-2" style={{ color: 'rgb(var(--muted-rgb))' }}>{row.k}</p>
                  {row.href
                    ? <a href={row.href} className="ln-more text-[17px] no-underline" style={{ color: 'rgb(var(--text-rgb))' }}>{row.v}</a>
                    : <p className="text-[17px] m-0 leading-snug" style={{ color: 'rgb(var(--text-rgb))', whiteSpace: 'pre-line' }}>{row.v}</p>}
                </div>
              ))}
            </div>
            <div className="reveal" style={{ border: '1px solid rgb(var(--rule-rgb))', minHeight: '400px' }}>
              <iframe
                src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
                width="100%" height="100%" frameBorder="0" allowFullScreen
                className="w-full h-full" style={{ border: 'none', display: 'block', minHeight: '400px', filter: 'saturate(0.75)' }}
                title="Карта"
              />
            </div>
          </div>
        </div>
      </section>

      <BookingInline />

      {/* ── Заключительный призыв ── */}
      <section className="py-20" style={{ background: 'rgb(var(--surface-rgb))', borderTop: '1px solid rgb(var(--rule-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10 text-center" style={{ maxWidth: '660px' }}>
          <h2
            className="font-serif font-medium mb-4"
            style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}
          >
            Остались вопросы?
          </h2>
          <p className="mb-8 text-[17px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))' }}>
            Позвоните — подскажем по документам и подберём удобное время
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <a
              href={notary.phoneHref}
              className="lv-btn2 inline-flex items-center justify-center no-underline"
              style={{ padding: '16px 24px' }}
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
