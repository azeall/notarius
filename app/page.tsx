import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import CostCalculator from '@/components/CostCalculator'
import BookingInline from '@/components/BookingInline'
import BookingButton from '@/components/BookingButton'
import { notary, site } from '@/lib/data'

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

      {/* ── Услуги: минималистичный нумерованный список ── */}
      <section className="py-20 sm:py-28" style={{ background: '#ffffff' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12 reveal">
            <div>
              <div className="inline-flex items-center gap-3.5 mb-4">
                <span className="block w-6 h-px" style={{ background: '#534AB7' }} />
                <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(83,74,183,0.75)' }}>Услуги</span>
              </div>
              <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 50px)', color: '#26223d' }}>
                Чем мы <em className="italic font-normal" style={{ color: '#534AB7' }}>поможем</em>
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.22em] uppercase no-underline pb-1 transition-opacity hover:opacity-70"
              style={{ color: '#534AB7', borderBottom: '1px solid rgba(83,74,183,0.30)' }}
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
                <span className="font-serif text-[28px] sm:text-[34px] leading-none transition-colors" style={{ color: '#c0bfcc' }}>
                  {s.n}
                </span>
                <span className="font-serif text-[20px] sm:text-[24px] transition-colors group-hover:text-[#534AB7]" style={{ color: '#26223d' }}>
                  {s.title}
                </span>
                <span className="hidden sm:block text-[14px] leading-relaxed" style={{ color: '#75718f' }}>
                  {s.text}
                </span>
                <span className="hidden sm:grid w-6 h-6 rounded-full place-items-center transition-all opacity-0 group-hover:opacity-100" style={{ background: 'rgba(83,74,183,0.10)', color: '#534AB7' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Калькулятор стоимости (уникальная фича) ── */}
      <CostCalculator />

      {/* ── Как проходит приём: 3 шага ── */}
      <section className="py-20 sm:py-24" style={{ background: '#ffffff' }}>
        <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
          <h2 className="font-serif font-medium mb-12 reveal" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', color: '#26223d' }}>
            Как проходит <em className="italic font-normal" style={{ color: '#534AB7' }}>приём</em>
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.t} className="relative reveal" data-reveal-delay={i * 100}>
                <div
                  className="w-10 h-10 rounded-full grid place-items-center font-serif text-lg mb-4"
                  style={{ background: i === 2 ? '#534AB7' : 'rgba(83,74,183,0.10)', color: i === 2 ? '#fff' : '#534AB7' }}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <span className="hidden sm:block absolute top-5 left-12 right-0 h-px" style={{ background: 'rgba(83,74,183,0.15)' }} aria-hidden />
                )}
                <h3 className="font-serif text-xl mb-2" style={{ color: '#26223d' }}>{s.t}</h3>
                <p className="text-sm leading-relaxed m-0" style={{ color: '#75718f' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Форма записи ── */}
      <BookingInline />

      {/* ── CTA ── */}
      <section className="py-16 text-center" style={{ background: '#ffffff', borderTop: '1px solid rgba(83,74,183,0.10)' }}>
        <div className="mx-auto px-5" style={{ maxWidth: '640px' }}>
          <h2 className="font-serif font-medium mb-3" style={{ fontSize: 'clamp(26px, 3vw, 36px)', color: '#26223d' }}>
            Остались вопросы?
          </h2>
          <p className="mb-7 text-[15px]" style={{ color: '#75718f' }}>
            Позвоните — подскажем по документам и подберём удобное время
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <a
              href={notary.phoneHref}
              className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-sm no-underline transition-colors hover:text-white hover:bg-[#534AB7]"
              style={{ border: '1px solid rgba(83,74,183,0.35)', color: '#534AB7' }}
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
