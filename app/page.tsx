import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import CostCalculator from '@/components/CostCalculator'
import BookingInline from '@/components/BookingInline'
import BookingButton from '@/components/BookingButton'
import CountUp from '@/components/CountUp'
import LegalPhotos from '@/components/LegalPhotos'
import { notary, site, reviews, documentsDone } from '@/lib/data'

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

const SERVICES = [
  { n: '01', title: 'Завещание', text: 'Составление и удостоверение завещаний любой сложности' },
  { n: '02', title: 'Доверенность', text: 'Генеральные, на автомобиль, на представление интересов' },
  { n: '03', title: 'Купля-продажа', text: 'Удостоверение сделок с недвижимостью и долями' },
  { n: '04', title: 'Согласие супруга', text: 'Нотариальные согласия на совершение сделок' },
  { n: '05', title: 'Заверение копий', text: 'Верность копий документов и выписок' },
  { n: '06', title: 'Перевод документов', text: 'Свидетельствование подписи переводчика' },
]

const STEPS = [
  { t: 'Запишитесь', d: 'Онлайн на сайте или по телефону — выберите удобные дату и время' },
  { t: 'Подготовьте документы', d: 'При записи подскажем точный перечень для вашей ситуации' },
  { t: 'Приходите на приём', d: 'Всё пройдёт спокойно, внимательно и строго по закону' },
]

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Бегущая строка услуг (кинетический акцент) ── */}
      <Marquee />

      {/* ── Услуги: минималистичный нумерованный список ── */}
      <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12 reveal">
            <div>
              <div className="inline-flex items-center gap-3.5 mb-4">
                <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
                <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(83,74,183,0.75)' }}>Услуги</span>
              </div>
              <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 50px)', color: 'rgb(var(--text-rgb))' }}>
                Чем мы <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>поможем</em>
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.22em] uppercase no-underline pb-1 transition-opacity hover:opacity-70"
              style={{ color: 'rgb(var(--violet-rgb))', borderBottom: '1px solid rgba(83,74,183,0.30)' }}
            >
              Все услуги
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div>
            {SERVICES.map((s, i) => (
              <Link
                key={s.n}
                href="/services"
                className="group grid grid-cols-[48px_1fr] sm:grid-cols-[80px_240px_1fr_24px] items-baseline gap-4 sm:gap-8 py-6 no-underline transition-all hover:pl-2 reveal"
                style={{ borderTop: '1px solid rgba(83,74,183,0.12)', ...(i === SERVICES.length - 1 ? { borderBottom: '1px solid rgba(83,74,183,0.12)' } : {}) }}
                data-reveal-delay={i * 60}
              >
                <span className="font-serif text-[28px] sm:text-[34px] leading-none transition-colors" style={{ color: 'rgb(var(--hair-rgb))' }}>
                  {s.n}
                </span>
                <span className="font-serif text-[20px] sm:text-[24px] transition-colors group-hover:text-[#534AB7]" style={{ color: 'rgb(var(--text-rgb))' }}>
                  {s.title}
                </span>
                <span className="hidden sm:block text-[14px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))' }}>
                  {s.text}
                </span>
                <span className="hidden sm:grid w-6 h-6 rounded-full place-items-center transition-all opacity-0 group-hover:opacity-100" style={{ background: 'rgba(83,74,183,0.10)', color: 'rgb(var(--violet-rgb))' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Полоса счётчиков ── */}
      <section className="py-16 sm:py-20" style={{ background: 'rgb(var(--violet-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
            {[
              // Стаж считается от года начала практики, а не вписан рукой:
              // число в разметке через год устаревает, а править его никто не придёт.
              ...(notary.practiceSince
                ? [{ v: new Date().getFullYear() - Number(notary.practiceSince), s: ' лет', l: 'нотариальной практики' }]
                : []),
              ...(documentsDone > 0
                ? [{ v: documentsDone, s: '+', l: 'оформленных документов' }]
                : []),
              { v: 6, s: '', l: 'направлений услуг' },
              { v: 100, s: '%', l: 'юридическая сила' },
            ].map((st, i) => (
              <div key={st.l} className="text-center reveal" data-reveal-delay={i * 90}>
                <div className="font-serif font-medium leading-none mb-2" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', color: '#ffffff' }}>
                  <CountUp value={st.v} suffix={st.s} />
                </div>
                <div className="text-[11px] sm:text-xs tracking-[0.16em] uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {st.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Калькулятор стоимости (уникальная фича) ── */}
      <CostCalculator />

      {/* ── Как проходит приём: 3 шага ── */}
      <section className="py-20 sm:py-24" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <h2 className="font-serif font-medium mb-12 reveal" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', color: 'rgb(var(--text-rgb))' }}>
            Как проходит <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>приём</em>
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.t} className="relative reveal" data-reveal-delay={i * 100}>
                <div
                  className="w-10 h-10 rounded-full grid place-items-center font-serif text-lg mb-4"
                  style={{ background: i === 2 ? 'rgb(var(--violet-rgb))' : 'rgba(83,74,183,0.10)', color: i === 2 ? '#fff' : 'rgb(var(--violet-rgb))' }}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <span className="hidden sm:block absolute top-5 left-12 right-0 h-px" style={{ background: 'rgba(83,74,183,0.15)' }} aria-hidden />
                )}
                <h3 className="font-serif text-xl mb-2" style={{ color: 'rgb(var(--text-rgb))' }}>{s.t}</h3>
                <p className="text-sm leading-relaxed m-0" style={{ color: 'rgb(var(--muted-rgb))' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LegalPhotos />

      {/* ── Гильош-разделитель ── */}
      <div className="reveal" style={{ background: 'rgb(var(--bg-rgb))' }} aria-hidden>
        <div className="mx-auto flex items-center gap-4 py-2" style={{ maxWidth: 260 }}>
          <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(83,74,183,0.35))' }} />
          <svg width="44" height="14" viewBox="0 0 44 14" fill="none">
            <path d="M2 7 Q 11 0 22 7 Q 33 14 42 7" stroke="#534AB7" strokeWidth="1" opacity="0.5" />
            <path d="M2 7 Q 11 14 22 7 Q 33 0 42 7" stroke="#AFA9EC" strokeWidth="1" opacity="0.6" />
            <rect x="19" y="4" width="6" height="6" transform="rotate(45 22 7)" fill="none" stroke="#534AB7" strokeWidth="1" />
          </svg>
          <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(83,74,183,0.35), transparent)' }} />
        </div>
      </div>

      {/* ── Отзывы: крупная цитата + малые ── */}
      {reviews.length > 0 && (
      <section className="py-20 sm:py-24" style={{ background: 'rgb(var(--bg-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center" style={{ maxWidth: '1080px' }}>
          <div className="reveal">
            <span className="font-serif block leading-none mb-4" style={{ fontSize: '90px', color: 'rgba(83,74,183,0.18)' }}>«</span>
            <blockquote className="font-serif italic m-0 mb-6" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: '1.45', color: 'rgb(var(--text-rgb))' }}>
              {reviews[0].text}
            </blockquote>
            <p className="m-0 text-sm" style={{ color: 'rgb(var(--muted-rgb))' }}>
              <span className="font-semibold" style={{ color: 'rgb(var(--violet-rgb))' }}>{reviews[0].name}</span> · {reviews[0].service}
            </p>
          </div>
          <div className="space-y-4">
            {reviews.slice(1, 3).map((r, i) => (
              <figure key={r.name} className="m-0 rounded-2xl p-6 bg-navy-card reveal" style={{ border: '1px solid rgba(83,74,183,0.14)' }} data-reveal-delay={i * 100}>
                <blockquote className="m-0 mb-3 text-[14px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))' }}>{r.text}</blockquote>
                <figcaption className="text-[13px]"><span className="font-semibold" style={{ color: 'rgb(var(--violet-rgb))' }}>{r.name}</span> <span style={{ color: 'rgb(var(--muted-b-rgb))' }}>· {r.service}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Карта и контакты ── */}
      <section className="py-20" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10 grid md:grid-cols-[0.45fr_0.55fr] gap-8 items-stretch" style={{ maxWidth: '1080px' }}>
          <div className="rounded-2xl p-7 sm:p-8 reveal" style={{ background: 'rgb(var(--bg-rgb))', border: '1px solid rgba(83,74,183,0.14)' }}>
            <h2 className="font-serif font-medium mb-6" style={{ fontSize: '26px', color: 'rgb(var(--text-rgb))' }}>Как нас найти</h2>
            {[
              { k: 'Адрес', v: notary.address },
              { k: 'Телефон', v: notary.phone, href: notary.phoneHref },
              { k: 'Часы', v: 'Пн–Пт 10:00–19:00\nСб, Вс — выходной' },
              { k: 'Email', v: notary.email, href: `mailto:${notary.email}` },
            ].map(row => (
              <div key={row.k} className="py-3.5" style={{ borderTop: '1px solid rgba(83,74,183,0.10)' }}>
                <p className="text-[10px] tracking-[0.22em] uppercase m-0 mb-1" style={{ color: 'rgb(var(--violet-rgb))' }}>{row.k}</p>
                {row.href
                  ? <a href={row.href} className="text-[15px] no-underline transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--text-rgb))' }}>{row.v}</a>
                  : <p className="text-[15px] m-0" style={{ color: 'rgb(var(--text-rgb))', whiteSpace: 'pre-line' }}>{row.v}</p>}
              </div>
            ))}
          </div>
          <div className="rounded-2xl overflow-hidden reveal" style={{ border: '1px solid rgba(83,74,183,0.18)', minHeight: '380px' }}>
            <iframe
              src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
              width="100%" height="100%" frameBorder="0" allowFullScreen
              className="w-full h-full" style={{ border: 'none', display: 'block', minHeight: '380px' }}
              title="Карта"
            />
          </div>
        </div>
      </section>

      {/* ── Форма записи ── */}
      <BookingInline />

      {/* ── CTA ── */}
      <section className="py-16 text-center" style={{ background: 'rgb(var(--surface-rgb))', borderTop: '1px solid rgba(83,74,183,0.10)' }}>
        <div className="mx-auto px-5" style={{ maxWidth: '640px' }}>
          <h2 className="font-serif font-medium mb-3" style={{ fontSize: 'clamp(26px, 3vw, 36px)', color: 'rgb(var(--text-rgb))' }}>
            Остались вопросы?
          </h2>
          <p className="mb-7 text-[15px]" style={{ color: 'rgb(var(--muted-rgb))' }}>
            Позвоните — подскажем по документам и подберём удобное время
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <a
              href={notary.phoneHref}
              className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-sm no-underline transition-colors hover:text-white hover:bg-[#534AB7]"
              style={{ border: '1px solid rgba(83,74,183,0.35)', color: 'rgb(var(--violet-rgb))' }}
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
