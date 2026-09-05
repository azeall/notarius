import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import Intake from '@/components/Intake'
import DealSteps from '@/components/DealSteps'
import ServicesTiles from '@/components/ServicesTiles'
import FAQSearch from '@/components/FAQSearch'
import PhotoPlate from '@/components/PhotoPlate'
import CredentialsSection from '@/components/CredentialsSection'
import { notary, site, photos } from '@/lib/data'
import { reviews } from '@/lib/reviews'
import YandexMap from '@/components/YandexMap'

export const metadata: Metadata = {
  title: 'Нотариус в Москве · Тёплый приём, надёжный результат',
  description:
    'Нотариальная контора в Москве: сделки, наследство, доверенности, заверение копий. Выберите дело — покажем перечень документов, цену и свободное время.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    title: `Нотариус ${notary.name} · Москва`,
    description: site.description,
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Приём: вопрос, дело, документы, время ──
          Здесь вместо прежней витрины из двенадцати блоков идёт один приём.
          Всё, что связано общим состоянием, живёт в Intake. */}
      <Intake />

      {/* ── 04 · Куда прийти ── */}
      <section className="py-12 sm:py-14" style={{ background: 'rgb(var(--bg-rgb))' }}>
        <div className="wrap">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-[12px] tabular-nums tracking-[0.2em]" style={{ color: 'rgb(var(--violet-rgb))' }}>04</span>
            <span className="block flex-1 h-px" style={{ background: 'rgb(var(--violet-rgb) / 0.22)' }} />
            <span className="text-[11px] tracking-[0.26em] uppercase" style={{ color: 'rgb(var(--muted-rgb))' }}>Куда прийти</span>
          </div>

          <div className="grid md:grid-cols-[0.58fr_0.42fr] gap-4 items-stretch">
            <div className="rounded-2xl overflow-hidden reveal" style={{ border: '1px solid rgb(var(--violet-rgb) / 0.20)', minHeight: '330px' }}>
              <YandexMap
                className="w-full h-full"
                style={{border: 'none', display: 'block', minHeight: '330px'}}
                title="Карта"
              />
            </div>

            <div className="rounded-2xl p-6 reveal" style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.18)' }}>
              <h2 className="font-serif font-medium m-0 mb-2" style={{ fontSize: '23px', color: 'rgb(var(--text-rgb))' }}>Ждём вас</h2>
              <p className="text-[14px] m-0 mb-1" style={{ color: 'rgb(var(--muted-rgb))' }}>{notary.address}</p>
              <a href={notary.phoneHref} className="font-semibold text-[16px] no-underline" style={{ color: 'rgb(var(--violet-rgb))' }}>{notary.phone}</a>

              <div className="mt-5 pt-4" style={{ borderTop: '1px dashed rgb(var(--violet-rgb) / 0.3)' }}>
                <p className="text-[10px] tracking-[0.22em] uppercase m-0 mb-2" style={{ color: 'rgb(var(--violet-rgb))' }}>Часы приёма</p>
                {notary.workingHours.map(w => (
                  <div key={w.day} className="flex justify-between text-[13px] py-1" style={{ borderBottom: '1px solid rgb(var(--violet-rgb) / 0.08)' }}>
                    <span style={{ color: 'rgb(var(--text-b-rgb))' }}>{w.day}</span>
                    <span style={{ color: w.hours === 'Выходной' ? 'rgb(var(--muted-rgb))' : 'rgb(var(--text-rgb))' }}>{w.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <DealSteps />
      <ServicesTiles />

      {/* ── О нотариусе ── */}
      <section className="py-12 sm:py-14" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
        <div className="wrap">
          <div className="grid md:grid-cols-[0.38fr_0.62fr] gap-8 lg:gap-12 items-start">
            {!photos.portrait && (
              <div className="reveal">
                <PhotoPlate
                  src="/ph-docs.jpg"
                  alt="Папки с делами и документы на рабочем столе нотариуса"
                  caption="Дела конторы"
                  ratio="3 / 2"
                />
              </div>
            )}
            {photos.portrait && (
              <div className="relative overflow-hidden reveal" style={{ aspectRatio: '3/4', border: '1px solid rgb(var(--rule-rgb))' }}>
                <Image
                  src={photos.portrait}
                  alt={`${notary.name} — ${notary.title}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 340px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="reveal">
              <h2
                className="font-serif font-medium m-0 mb-5"
                style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', lineHeight: 1.08, letterSpacing: '-0.02em', color: 'rgb(var(--text-rgb))' }}
              >
                {notary.name}
              </h2>
              <p className="m-0 mb-4 leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))', fontSize: '16px', lineHeight: 1.7, maxWidth: '58ch' }}>
                {notary.title}, член организации «{notary.chamber}».
                Практика с {notary.practiceSince} года, лицензия {notary.license}.
              </p>
              <p className="m-0 mb-6 leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))', fontSize: '16px', lineHeight: 1.7, maxWidth: '58ch' }}>
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

      <CredentialsSection />

      {/* ── Отзывы ──
          Отзывы на образце сочинены, как имя и адрес. Выдавать их за слова
          живых людей нельзя, поэтому пометка стоит прямо в блоке, а не только
          в подвале, где её никто не читает. */}
      {reviews.length > 0 && (
        <section className="py-12 sm:py-14" style={{ background: 'rgb(var(--bg-rgb))' }}>
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-7 reveal">
              <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(26px, 3.4vw, 42px)', color: 'rgb(var(--text-rgb))' }}>
                Тёплые <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>слова</em>
              </h2>
              <p className="m-0 text-[12.5px]" style={{ color: 'rgb(var(--muted-rgb))' }}>
                Образцы формулировок: отзывы вымышлены, как и остальные данные демонстрации
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {reviews.slice(0, 3).map((r, i) => (
                <figure
                  key={r.name}
                  className="m-0 p-5 rounded-xl reveal"
                  style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.16)' }}
                  data-reveal-delay={i * 70}
                >
                  <blockquote className="m-0 mb-4 text-[14px] leading-relaxed" style={{ color: 'rgb(var(--text-b-rgb))' }}>{r.text}</blockquote>
                  <figcaption className="font-serif italic text-[15px]" style={{ color: 'rgb(var(--violet-rgb))' }}>
                    — {r.name}
                    <span className="block not-italic font-sans text-[11px] mt-0.5" style={{ color: 'rgb(var(--muted-rgb))' }}>{r.service}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSearch />

    </>
  )
}
