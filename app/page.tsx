import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import DocVerify from '@/components/DocVerify'
import SlotFinder from '@/components/SlotFinder'
import BookingButton from '@/components/BookingButton'
import LegalPhotos from '@/components/LegalPhotos'
import { notary, site, reviews } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Нотариус в Москве · Онлайн-запись за 30 секунд',
  description:
    'Современная нотариальная контора в Москве: онлайн-запись, прозрачные тарифы, проверка каждого документа. Сделки, наследство, доверенности, копии.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    title: `Нотариус ${notary.name} · Москва`,
    description: site.description,
  },
}

const ICON = {
  will: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  poa: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
  sale: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  consent: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  copy: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  translate: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />,
}

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Бегущая строка услуг (кинетический акцент) ── */}
      <Marquee />

      {/* ── Услуги: bento-сетка ── */}
      <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1180px' }}>
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12 reveal">
            <h2 className="font-sans font-extrabold m-0" style={{ fontSize: 'clamp(30px, 4vw, 48px)', letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}>
              Услуги <span style={{ color: 'rgb(var(--violet-rgb))' }}>конторы</span>
            </h2>
            <Link href="/services" className="inline-flex items-center gap-2 font-semibold text-sm no-underline transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--violet-rgb))' }}>
              Все услуги
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Большая плитка */}
            <Link
              href="/services"
              className="sm:col-span-2 lg:row-span-2 group rounded-3xl p-8 flex flex-col justify-between no-underline transition-transform hover:-translate-y-1 reveal"
              style={{ background: 'rgb(var(--violet-rgb))', minHeight: '280px' }}
            >
              <div className="w-12 h-12 rounded-xl grid place-items-center" style={{ background: 'rgba(255,255,255,0.16)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{ICON.sale}</svg>
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-white mb-2" style={{ fontSize: '26px', letterSpacing: '-0.01em' }}>Купля-продажа недвижимости</h3>
                <p className="text-sm leading-relaxed m-0 mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Полное сопровождение: проверка документов, удостоверение договора, электронная регистрация в Росреестре за 1 день.
                </p>
                <span className="inline-flex items-center gap-2 text-white text-sm font-semibold">
                  Подробнее
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </Link>

            {[
              { icon: ICON.will, t: 'Завещание', d: 'Составление и удостоверение' },
              { icon: ICON.poa, t: 'Доверенность', d: 'Любые виды за один визит' },
              { icon: ICON.consent, t: 'Согласие супруга', d: 'На сделки с имуществом' },
              { icon: ICON.copy, t: 'Заверение копий', d: 'Документы и выписки' },
              { icon: ICON.translate, t: 'Перевод документов', d: 'С нотариальным заверением' },
            ].map((s, i) => (
              <Link
                key={s.t}
                href="/services"
                className="group rounded-3xl p-6 bg-navy-card no-underline transition-all hover:-translate-y-1 reveal"
                style={{ border: '1px solid rgba(29,158,117,0.12)' }}
                data-reveal-delay={i * 60}
              >
                <div className="w-11 h-11 rounded-xl grid place-items-center mb-5" style={{ background: 'rgb(var(--surface-2-rgb))', color: 'rgb(var(--violet-rgb))' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </div>
                <h3 className="font-sans font-bold mb-1" style={{ fontSize: '17px', color: 'rgb(var(--text-rgb))' }}>{s.t}</h3>
                <p className="text-[13px] m-0" style={{ color: 'rgb(var(--muted-b-rgb))' }}>{s.d}</p>
              </Link>
            ))}

            {/* CTA-плитка */}
            <div className="rounded-3xl p-6 flex flex-col justify-between reveal" style={{ background: '#2c2c2c', minHeight: '180px' }} data-reveal-delay={300}>
              <p className="text-white font-bold m-0" style={{ fontSize: '17px' }}>Не нашли свою ситуацию?</p>
              <a href={notary.phoneHref} className="inline-flex items-center gap-2 font-semibold text-sm no-underline" style={{ color: '#27b585' }}>
                Позвоните — подскажем
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Проверка документов: анимация + текст ── */}
      <section className="py-20 sm:py-28" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10 grid lg:grid-cols-2 gap-14 items-center" style={{ maxWidth: '1180px' }}>
          <div className="reveal">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-10 h-[2px]" style={{ background: 'rgb(var(--violet-rgb))' }} />
              <span className="font-semibold text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgb(var(--violet-rgb))' }}>Контроль качества</span>
            </div>
            <h2 className="font-sans font-extrabold mb-6" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}>
              Каждый документ<br />проходит <span style={{ color: 'rgb(var(--violet-rgb))' }}>проверку</span>
            </h2>
            <div className="space-y-5">
              {[
                { t: 'Проверка по реестрам', d: 'ЕГРН, ЕГРЮЛ, реестры доверенностей и наследственных дел — в день обращения' },
                { t: 'Проверка личности и дееспособности', d: 'Удостоверяем личность сторон и отсутствие ограничений' },
                { t: 'Юридическая чистота текста', d: 'Каждая формулировка — по закону, без двусмысленностей' },
              ].map((p, i) => (
                <div key={p.t} className="flex gap-4 reveal" data-reveal-delay={i * 90}>
                  <span className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0 mt-0.5" style={{ background: 'rgb(var(--surface-2-rgb))', color: 'rgb(var(--violet-rgb))' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <div>
                    <h3 className="font-bold text-[16px] mb-1" style={{ color: 'rgb(var(--text-rgb))' }}>{p.t}</h3>
                    <p className="text-[14px] leading-relaxed m-0" style={{ color: 'rgb(var(--muted-b-rgb))' }}>{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal">
            <DocVerify />
          </div>
        </div>
      </section>

      {/* ── Поиск ближайшего свободного окна (уникальная фича) ── */}
      <SlotFinder />

      <LegalPhotos />

      {/* ── Отзывы: карточки с рейтингом ── */}
      {reviews.length > 0 && (
      <section className="py-20" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1180px' }}>
          <h2 className="font-sans font-extrabold mb-10 reveal" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}>
            Что говорят <span style={{ color: 'rgb(var(--violet-rgb))' }}>клиенты</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.slice(0, 3).map((r, i) => (
              <figure key={r.name} className="m-0 rounded-3xl p-7 bg-navy-card reveal" style={{ border: '1px solid rgba(29,158,117,0.12)' }} data-reveal-delay={i * 90}>
                <div className="flex gap-1 mb-4" aria-label="5 из 5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#1D9E75"><path d="M12 2l2.9 6.26 6.6.56-5 4.46 1.5 6.5L12 16.3 5.99 19.8l1.5-6.5-5-4.47 6.61-.56L12 2z" /></svg>
                  ))}
                </div>
                <blockquote className="m-0 mb-5 text-[14px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))' }}>{r.text}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full grid place-items-center font-bold text-sm text-white" style={{ background: 'rgb(var(--violet-rgb))' }}>{r.name.charAt(0)}</span>
                  <span>
                    <span className="block font-bold text-[14px]" style={{ color: 'rgb(var(--text-rgb))' }}>{r.name}</span>
                    <span className="block text-[12px]" style={{ color: 'rgb(var(--muted-b-rgb))' }}>{r.service}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Карта с плавающей карточкой ── */}
      <section className="py-20" style={{ background: 'rgb(var(--surface-rgb))' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1180px' }}>
          <div className="relative rounded-3xl overflow-hidden reveal" style={{ border: '1px solid rgba(29,158,117,0.15)', height: '440px' }}>
            <iframe
              src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
              width="100%" height="100%" frameBorder="0" allowFullScreen
              className="absolute inset-0 w-full h-full" style={{ border: 'none' }}
              title="Карта"
            />
            <div
              className="absolute left-4 top-4 sm:left-8 sm:top-8 rounded-2xl p-6 bg-navy-card max-w-[300px]"
              style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.18)', border: '1px solid rgba(29,158,117,0.15)' }}
            >
              <h2 className="font-sans font-extrabold m-0 mb-3" style={{ fontSize: '19px', color: 'rgb(var(--text-rgb))' }}>Наш офис</h2>
              <p className="text-sm m-0 mb-2" style={{ color: 'rgb(var(--muted-rgb))' }}>{notary.address}</p>
              <p className="text-sm m-0 mb-3" style={{ color: 'rgb(var(--muted-rgb))' }}>Пн–Пт 10:00–19:00</p>
              <a href={notary.phoneHref} className="font-bold text-[15px] no-underline" style={{ color: 'rgb(var(--violet-rgb))' }}>{notary.phone}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Гарантии: строка из 4 пунктов ── */}
      <section className="py-16" style={{ background: 'rgb(var(--surface-rgb))', borderTop: '1px solid rgba(29,158,117,0.10)' }}>
        <div className="mx-auto px-5 sm:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8" style={{ maxWidth: '1180px' }}>
          {[
            { t: 'Онлайн-запись 24/7', d: 'Выберите время сами — без звонков и ожидания' },
            { t: 'Прозрачные тарифы', d: 'Тариф + УПТХ, без скрытых доплат' },
            { t: 'Приём без очередей', d: 'Точно в назначенное время' },
            { t: 'Электронная регистрация', d: 'Подача в Росреестр за 1 рабочий день' },
          ].map((g, i) => (
            <div key={g.t} className="flex gap-4 reveal" data-reveal-delay={i * 80}>
              <span className="w-9 h-9 rounded-full grid place-items-center flex-shrink-0" style={{ background: 'rgb(var(--surface-2-rgb))', color: 'rgb(var(--violet-rgb))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              <div>
                <h3 className="font-bold text-[15px] mb-1" style={{ color: 'rgb(var(--text-rgb))' }}>{g.t}</h3>
                <p className="text-[13px] leading-relaxed m-0" style={{ color: 'rgb(var(--muted-b-rgb))' }}>{g.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 text-center" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
        <div className="mx-auto px-5" style={{ maxWidth: '640px' }}>
          <h2 className="font-sans font-extrabold mb-3" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}>
            Запись займёт <span style={{ color: 'rgb(var(--violet-rgb))' }}>30 секунд</span>
          </h2>
          <p className="mb-8 text-[15px]" style={{ color: 'rgb(var(--muted-rgb))' }}>
            Выберите услугу, дату и время — остальное мы возьмём на себя
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <a
              href={notary.phoneHref}
              className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-sm no-underline bg-navy-card transition-all hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(29,158,117,0.30)', color: 'rgb(var(--text-rgb))' }}
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
