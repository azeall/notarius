import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import FAQSearch from '@/components/FAQSearch'
import BringChecklist from '@/components/BringChecklist'
import DealTimeline from '@/components/DealTimeline'
import BookingInline from '@/components/BookingInline'
import BookingButton from '@/components/BookingButton'
import CountUp from '@/components/CountUp'
import { notary, site } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Нотариус в Москве · Тёплый приём, надёжный результат',
  description:
    'Нотариальная контора в Москве: сделки, наследство, доверенности, заверение копий. FAQ с поиском, запись онлайн.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    title: `Нотариус ${notary.name} · Москва`,
    description: site.description,
  },
}

const SERVICES = [
  { t: 'Завещание', d: 'Зафиксируем вашу волю юридически безупречно — с тайной завещания и возможностью изменить его в любой момент.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
  { t: 'Доверенность', d: 'Генеральная, на автомобиль, на представление интересов — подготовим текст и удостоверим за один визит.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /> },
  { t: 'Купля-продажа', d: 'Проверим чистоту сделки, удостоверим договор и подадим документы на регистрацию в электронном виде.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
  { t: 'Согласие супруга', d: 'Оформим нотариальное согласие на сделку с общим имуществом — быстро и без лишних формальностей.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
  { t: 'Заверение копий', d: 'Засвидетельствуем верность копий документов и выписок — от одной страницы до целого архива.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /> },
  { t: 'Перевод документов', d: 'Нотариально заверенный перевод: подпись дипломированного переводчика, подшивка к оригиналу или копии.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /> },
]

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Счётчики на терракоте с волнистыми краями ── */}
      <section className="relative" style={{ background: 'rgb(var(--violet-rgb))' }}>
        <svg className="block w-full" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden style={{ marginTop: '-1px' }}>
          <path d="M0,38 C240,6 480,6 720,28 C960,50 1200,50 1440,22 L1440,0 L0,0 Z" style={{ fill: 'rgb(var(--bg-rgb))' }} />
        </svg>
        <div className="mx-auto px-5 sm:px-10 pt-2 pb-4" style={{ maxWidth: '1080px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
            {[
              { v: 15, s: ' лет', l: 'личной практики' },
              { v: 5000, s: '+', l: 'оформленных документов' },
              { v: 6, s: '', l: 'направлений услуг' },
              { v: 100, s: '%', l: 'юридическая сила' },
            ].map((st, i) => (
              <div key={st.l} className="text-center reveal" data-reveal-delay={i * 90}>
                <div className="font-serif font-medium leading-none mb-2" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', color: 'rgb(var(--surface-4-rgb))' }}>
                  <CountUp value={st.v} suffix={st.s} />
                </div>
                <div className="text-[11px] sm:text-xs tracking-[0.14em] uppercase" style={{ color: 'rgba(251,246,234,0.7)' }}>
                  {st.l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <svg className="block w-full" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden style={{ marginBottom: '-1px' }}>
          <path d="M0,26 C240,54 480,54 720,30 C960,6 1200,6 1440,34 L1440,64 L0,64 Z" style={{ fill: 'rgb(var(--surface-rgb))' }} />
        </svg>
      </section>

      {/* ── Услуги: тёплый зигзаг с нитью ── */}
      <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '900px' }}>
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-3.5 mb-4">
              <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
              <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(192,92,46,0.75)' }}>Услуги</span>
              <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
            </div>
            <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 50px)', color: 'rgb(var(--text-rgb))' }}>
              С чем мы <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>поможем</em>
            </h2>
          </div>

          <div className="relative">
            {/* пунктирная нить по центру */}
            <span
              className="hidden sm:block absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2"
              style={{ borderLeft: '2px dashed rgba(192,92,46,0.25)' }}
              aria-hidden
            />
            <div className="space-y-10 sm:space-y-4">
              {SERVICES.map((s, i) => {
                const left = i % 2 === 0
                return (
                  <div key={s.t} className={`sm:grid sm:grid-cols-2 sm:gap-16 items-center reveal`} data-reveal-delay={i * 70}>
                    <div className={left ? '' : 'sm:col-start-2'}>
                      <Link
                        href="/services"
                        className="group relative block rounded-2xl p-6 no-underline transition-all hover:-translate-y-1"
                        style={{ background: 'rgb(var(--bg-rgb))', border: '1px solid rgba(192,92,46,0.15)' }}
                      >
                        {/* узел нити */}
                        <span
                          className={`hidden sm:block absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ${left ? '-right-[74px]' : '-left-[74px]'}`}
                          style={{ background: 'rgb(var(--violet-rgb))', border: '3px solid #fdf8ef' }}
                          aria-hidden
                        />
                        <div className="flex items-center gap-4 mb-3">
                          <span className="w-11 h-11 rounded-full grid place-items-center flex-shrink-0" style={{ background: 'rgba(192,92,46,0.10)', color: 'rgb(var(--violet-rgb))' }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                          </span>
                          <h3 className="font-serif m-0 transition-colors group-hover:text-[#c05c2e]" style={{ fontSize: '21px', color: 'rgb(var(--text-rgb))' }}>{s.t}</h3>
                        </div>
                        <p className="text-[14px] leading-relaxed m-0" style={{ color: 'rgb(var(--muted-rgb))' }}>{s.d}</p>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Что взять с собой: интерактивный чек-лист (уникальная фича) ── */}
      <BringChecklist />

      {/* ── О нотариусе: фото + текст ── */}
      <section className="py-20" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10 grid md:grid-cols-[0.4fr_0.6fr] gap-10 items-center" style={{ maxWidth: '1080px' }}>
          <div
            className="relative rounded-2xl mx-auto flex items-center justify-center reveal"
            style={{ width: 'min(280px, 70vw)', aspectRatio: '3/4', background: 'rgb(var(--muted-d-rgb))', border: '1px solid rgba(61,32,16,0.15)' }}
          >
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: 'rgba(61,32,16,0.45)' }}>[ фото ]</p>
          </div>
          <div className="reveal">
            <h2 className="font-serif font-medium mb-5" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', color: 'rgb(var(--text-rgb))' }}>
              {notary.name}
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: 'rgb(var(--muted-rgb))', fontSize: '16px', lineHeight: '1.75' }}>
              Нотариус города Москвы, член Московской городской нотариальной палаты.
              Практика с {notary.practiceSince} года, лицензия {notary.license}.
            </p>
            <p className="leading-relaxed mb-7" style={{ color: 'rgb(var(--muted-rgb))', fontSize: '16px', lineHeight: '1.75' }}>
              Мы верим, что визит к нотариусу не должен быть стрессом: объясняем простыми
              словами, готовим документы заранее и бережно относимся к вашему времени.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.22em] uppercase no-underline pb-1 transition-opacity hover:opacity-70"
              style={{ color: 'rgb(var(--violet-rgb))', borderBottom: '1px solid rgba(192,92,46,0.30)' }}
            >
              Подробнее о нотариусе
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Как проходит сделка: интерактивный таймлайн ── */}
      <DealTimeline />

      {/* ── Отзывы: полароиды ── */}
      <section className="py-20 sm:py-24 overflow-hidden" style={{ background: 'rgb(var(--bg-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-3.5 mb-4">
              <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
              <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(192,92,46,0.75)' }}>Отзывы</span>
              <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
            </div>
            <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 50px)', color: 'rgb(var(--text-rgb))' }}>
              Тёплые <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>слова</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            {[
              { n: 'Ольга К.', s: 'наследство', t: 'Думали, утонем в бумагах — Анна Владимировна разложила всё по полочкам и сама запросила половину документов.', r: '-3deg' },
              { n: 'Дмитрий С.', s: 'доверенность', t: 'Приняли точно в назначенное время, доверенность сделали за полчаса. Очень душевная контора.', r: '2deg' },
              { n: 'Марина В.', s: 'купля-продажа', t: 'Сделку провели за один визит, всё объяснили простым языком. Спасибо за спокойствие!', r: '-1.5deg' },
            ].map((r, i) => (
              <figure
                key={r.n}
                className="m-0 p-5 pb-7 bg-navy-card reveal transition-transform hover:scale-[1.03] hover:rotate-0"
                style={{ transform: `rotate(${r.r})`, boxShadow: '0 16px 40px rgba(61,32,16,0.16)', borderRadius: '6px', transitionDuration: '300ms' }}
                data-reveal-delay={i * 100}
              >
                <div className="h-2 w-16 mx-auto -mt-8 mb-5 rounded-sm" style={{ background: 'rgba(232,201,160,0.9)', boxShadow: '0 2px 6px rgba(61,32,16,0.15)' }} aria-hidden />
                <blockquote className="m-0 mb-4 text-[14px] leading-relaxed" style={{ color: 'rgb(var(--text-b-rgb))' }}>{r.t}</blockquote>
                <figcaption className="font-serif italic text-[15px]" style={{ color: 'rgb(var(--violet-rgb))' }}>
                  — {r.n}
                  <span className="block not-italic font-sans text-[11px] mt-0.5" style={{ color: 'rgb(var(--muted-b-rgb))' }}>{r.s}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Бегущая строка услуг (кинетический акцент) ── */}
      <Marquee />

      {/* ── FAQ с live-поиском (уникальная фича) ── */}
      <FAQSearch />

      {/* ── Карта + часы работы ── */}
      <section className="py-20" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10 grid md:grid-cols-[0.6fr_0.4fr] gap-8 items-stretch" style={{ maxWidth: '1080px' }}>
          <div className="rounded-2xl overflow-hidden reveal" style={{ border: '1px solid rgba(192,92,46,0.20)', minHeight: '380px' }}>
            <iframe
              src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
              width="100%" height="100%" frameBorder="0" allowFullScreen
              className="w-full h-full" style={{ border: 'none', display: 'block', minHeight: '380px' }}
              title="Карта"
            />
          </div>
          <div className="rounded-2xl p-7 reveal" style={{ background: 'rgb(var(--bg-rgb))', border: '1px solid rgba(192,92,46,0.18)' }}>
            <h2 className="font-serif font-medium mb-5" style={{ fontSize: '24px', color: 'rgb(var(--text-rgb))' }}>Ждём вас</h2>
            <p className="text-[14px] m-0 mb-1" style={{ color: 'rgb(var(--muted-rgb))' }}>{notary.address}</p>
            <a href={notary.phoneHref} className="font-semibold text-[16px] no-underline" style={{ color: 'rgb(var(--violet-rgb))' }}>{notary.phone}</a>
            <div className="mt-6 pt-5" style={{ borderTop: '1px dashed rgba(192,92,46,0.3)' }}>
              <p className="text-[10px] tracking-[0.22em] uppercase m-0 mb-3" style={{ color: 'rgb(var(--violet-rgb))' }}>Часы работы</p>
              {notary.workingHours.slice(0, 7).map(w => (
                <div key={w.day} className="flex justify-between text-[13px] py-1.5" style={{ borderBottom: '1px solid rgba(192,92,46,0.08)' }}>
                  <span style={{ color: 'rgb(var(--text-b-rgb))' }}>{w.day}</span>
                  <span style={{ color: w.hours === 'Выходной' ? 'rgb(var(--muted-b-rgb))' : 'rgb(var(--text-rgb))', fontWeight: w.hours === 'Выходной' ? 400 : 600 }}>{w.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Форма записи ── */}
      <BookingInline />

      {/* ── CTA ── */}
      <section className="py-16 text-center" style={{ background: 'rgb(var(--surface-2-rgb))', borderTop: '1px solid rgba(192,92,46,0.12)' }}>
        <div className="mx-auto px-5" style={{ maxWidth: '640px' }}>
          <h2 className="font-serif font-medium mb-3" style={{ fontSize: 'clamp(26px, 3vw, 38px)', color: 'rgb(var(--text-rgb))' }}>
            Приходите — <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>поможем</em>
          </h2>
          <p className="mb-7 text-[15px]" style={{ color: 'rgb(var(--muted-rgb))' }}>
            {notary.address} · {notary.phone}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <Link
              href="/contacts"
              className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-sm no-underline transition-colors hover:text-white hover:bg-[#c05c2e]"
              style={{ border: '1px solid rgba(192,92,46,0.35)', color: 'rgb(var(--violet-rgb))' }}
            >
              Как добраться →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
