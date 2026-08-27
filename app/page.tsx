import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import FAQSearch from '@/components/FAQSearch'
import BringChecklist from '@/components/BringChecklist'
import DealTimeline from '@/components/DealTimeline'
import BookingInline from '@/components/BookingInline'
import BookingButton from '@/components/BookingButton'
import SectionMark from '@/components/SectionMark'
import ScrollRule from '@/components/ScrollRule'
import ScrollCount from '@/components/ScrollCount'
import LegalPhotos from '@/components/LegalPhotos'
import CredentialsSection from '@/components/CredentialsSection'
import { notary, site, photos, documentsDone } from '@/lib/data'
import { reviews } from '@/lib/reviews'

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
        <div className="wrap pt-2 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
            {[
              // Стаж считается от года начала практики, а не вписан рукой:
              // число в разметке через год устаревает, а править его никто не придёт.
              ...(notary.practiceSince
                ? [{ v: new Date().getFullYear() - Number(notary.practiceSince), s: ' лет', l: 'личной практики' }]
                : []),
              ...(documentsDone > 0
                ? [{ v: documentsDone, s: '+', l: 'оформленных документов' }]
                : []),
              { v: 6, s: '', l: 'направлений услуг' },
              { v: 100, s: '%', l: 'юридическая сила' },
            ].map((st, i) => (
              <div key={st.l} className="text-center reveal" data-reveal-delay={i * 90}>
                <div className="font-serif font-medium leading-none mb-2" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', color: 'rgb(var(--surface-4-rgb))' }}>
                  <ScrollCount value={st.v} suffix={st.s} />
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
              <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgb(var(--violet-rgb) / 0.75)' }}>Услуги</span>
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
              style={{ borderLeft: '2px dashed rgb(var(--violet-rgb) / 0.25)' }}
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
                        style={{ background: 'rgb(var(--bg-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.15)' }}
                      >
                        {/* узел нити */}
                        <span
                          className={`hidden sm:block absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ${left ? '-right-[74px]' : '-left-[74px]'}`}
                          style={{ background: 'rgb(var(--violet-rgb))', border: '3px solid #fdf8ef' }}
                          aria-hidden
                        />
                        <div className="flex items-center gap-4 mb-3">
                          <span className="w-11 h-11 rounded-full grid place-items-center flex-shrink-0" style={{ background: 'rgb(var(--violet-rgb) / 0.10)', color: 'rgb(var(--violet-rgb))' }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                          </span>
                          <h3 className="font-serif m-0 transition-colors group-hover:text-[rgb(var(--violet-rgb))]" style={{ fontSize: '21px', color: 'rgb(var(--text-rgb))' }}>{s.t}</h3>
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

      {/* ── О нотариусе ──
          Портрет показывается, только если он есть. Раньше на его месте
          рисовался серый прямоугольник с надписью «[ фото ]» — заглушка,
          которая на готовом сайте выглядит как незагрузившаяся картинка, а
          у большинства контор фото так и не появляется. Нет снимка —
          раздел просто становится текстовым во всю ширину. */}
      <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
        <div className="wrap">
          <div className="sd"><SectionMark n="02">О нотариусе</SectionMark></div>
          <div className={photos.portrait ? 'grid md:grid-cols-[0.34fr_0.66fr] gap-10 lg:gap-16 items-start' : ''}>
            {photos.portrait && (
              <div
                className="relative overflow-hidden sd"
                style={{ aspectRatio: '3/4', border: '1px solid rgb(var(--rule-rgb))' }}
              >
                <Image
                  src={photos.portrait}
                  alt={`${notary.name} — ${notary.title}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 340px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="sd">
              <h2
                className="font-serif font-medium m-0 mb-6"
                style={{ fontSize: 'clamp(28px, 3.6vw, 46px)', lineHeight: 1.08, letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}
              >
                {notary.name}
              </h2>
              <p className="m-0 mb-4 leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))', fontSize: '17px', lineHeight: 1.7, maxWidth: '58ch' }}>
                {notary.title}, член организации «{notary.chamber}».
                Практика с {notary.practiceSince} года, лицензия {notary.license}.
              </p>
              <p className="m-0 mb-8 leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))', fontSize: '17px', lineHeight: 1.7, maxWidth: '58ch' }}>
                Визит к нотариусу не должен быть испытанием: объясняем простыми словами,
                называем перечень документов заранее и не тянем время на приёме.
              </p>
              <Link href="/about" className="ln-more inline-flex items-center gap-2.5 text-[15px] no-underline" style={{ color: 'rgb(var(--text-rgb))' }}>
                Подробнее о нотариусе
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LegalPhotos />

      {/* ── Как проходит сделка: интерактивный таймлайн ── */}
      <DealTimeline />

      <CredentialsSection />

      {/* ── Отзывы: полароиды ── */}
      {reviews.length > 0 && (
      <section className="py-20 sm:py-24 overflow-hidden" style={{ background: 'rgb(var(--bg-rgb))' }}>
        <div className="wrap">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-3.5 mb-4">
              <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
              <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgb(var(--violet-rgb) / 0.75)' }}>Отзывы</span>
              <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
            </div>
            <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 50px)', color: 'rgb(var(--text-rgb))' }}>
              Тёплые <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>слова</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            {reviews.slice(0, 3).map((r, i) => (
              <figure
                key={r.name}
                className="m-0 p-5 pb-7 bg-navy-card reveal transition-transform hover:scale-[1.03] hover:rotate-0"
                style={{ transform: `rotate(${['-3deg', '2deg', '-1.5deg'][i % 3]})`, boxShadow: '0 16px 40px rgb(var(--text-rgb) / 0.16)', borderRadius: '6px', transitionDuration: '300ms' }}
                data-reveal-delay={i * 100}
              >
                <div className="h-2 w-16 mx-auto -mt-8 mb-5 rounded-sm" style={{ background: 'rgb(var(--muted-rgb) / 0.9)', boxShadow: '0 2px 6px rgb(var(--text-rgb) / 0.15)' }} aria-hidden />
                <blockquote className="m-0 mb-4 text-[14px] leading-relaxed" style={{ color: 'rgb(var(--text-b-rgb))' }}>{r.text}</blockquote>
                <figcaption className="font-serif italic text-[15px]" style={{ color: 'rgb(var(--violet-rgb))' }}>
                  — {r.name}
                  <span className="block not-italic font-sans text-[11px] mt-0.5" style={{ color: 'rgb(var(--muted-b-rgb))' }}>{r.service}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── FAQ с live-поиском (уникальная фича) ── */}
      <FAQSearch />

      {/* ── Карта + часы работы ── */}
      <section className="py-20" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="wrap grid md:grid-cols-[0.6fr_0.4fr] gap-8 items-stretch">
          <div className="rounded-2xl overflow-hidden reveal" style={{ border: '1px solid rgb(var(--violet-rgb) / 0.20)', minHeight: '380px' }}>
            <iframe
              src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
              width="100%" height="100%" frameBorder="0" allowFullScreen
              className="w-full h-full" style={{ border: 'none', display: 'block', minHeight: '380px' }}
              title="Карта"
            />
          </div>
          <div className="rounded-2xl p-7 reveal" style={{ background: 'rgb(var(--bg-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.18)' }}>
            <h2 className="font-serif font-medium mb-5" style={{ fontSize: '24px', color: 'rgb(var(--text-rgb))' }}>Ждём вас</h2>
            <p className="text-[14px] m-0 mb-1" style={{ color: 'rgb(var(--muted-rgb))' }}>{notary.address}</p>
            <a href={notary.phoneHref} className="font-semibold text-[16px] no-underline" style={{ color: 'rgb(var(--violet-rgb))' }}>{notary.phone}</a>
            <div className="mt-6 pt-5" style={{ borderTop: '1px dashed rgb(var(--violet-rgb) / 0.3)' }}>
              <p className="text-[10px] tracking-[0.22em] uppercase m-0 mb-3" style={{ color: 'rgb(var(--violet-rgb))' }}>Часы работы</p>
              {notary.workingHours.slice(0, 7).map(w => (
                <div key={w.day} className="flex justify-between text-[13px] py-1.5" style={{ borderBottom: '1px solid rgb(var(--violet-rgb) / 0.08)' }}>
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
      <section className="py-16 text-center" style={{ background: 'rgb(var(--surface-2-rgb))', borderTop: '1px solid rgb(var(--violet-rgb) / 0.12)' }}>
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
              className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-sm no-underline transition-colors hover:text-white hover:bg-[rgb(var(--violet-rgb))]"
              style={{ border: '1px solid rgb(var(--violet-rgb) / 0.35)', color: 'rgb(var(--violet-rgb))' }}
            >
              Как добраться →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
