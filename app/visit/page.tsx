import type { Metadata } from 'next'
import Link from 'next/link'
import VisitChecklist from '@/components/VisitChecklist'
import BookingButton from '@/components/BookingButton'
import { notary } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Подготовка к визиту к нотариусу',
  description:
    'Интерактивный чек-лист документов для приёма у нотариуса: наследство, сделки с недвижимостью, доверенности, брачный договор, апостиль. Что взять с собой и как подготовиться.',
  keywords: [
    'какие документы нужны нотариусу',
    'что взять к нотариусу',
    'подготовка к визиту нотариус',
    'чек-лист документов нотариус',
  ],
  alternates: { canonical: '/visit' },
}

const STEPS = [
  {
    n: '01',
    title: 'Выберите услугу и соберите документы',
    text: 'Откройте чек-лист ниже, выберите нужное нотариальное действие и отметьте подготовленные документы. Список сохранится в браузере.',
  },
  {
    n: '02',
    title: 'Запишитесь на удобное время',
    text: 'Запишитесь онлайн или по телефону. При записи мы уточним детали и подтвердим точный перечень под вашу ситуацию.',
  },
  {
    n: '03',
    title: 'Приходите с оригиналами',
    text: 'Возьмите оригиналы документов и паспорт. Нотариус проверит комплект, разъяснит последствия сделки и удостоверит документ.',
  },
]

const NOTES = [
  {
    title: 'Берите оригиналы',
    text: 'Нотариус работает с подлинниками документов. Копии и фотографии не подходят для большинства действий.',
  },
  {
    title: 'Личное присутствие',
    text: 'Для большинства нотариальных действий нужна личная явка с паспортом. Заменить её доверенностью можно не всегда.',
  },
  {
    title: 'Документы без исправлений',
    text: 'Документы с подчистками, приписками и нечитаемым текстом не принимаются. Повреждённый документ лучше восстановить заранее.',
  },
  {
    title: 'Актуальные выписки',
    text: 'Выписка из ЕГРН и ЕГРЮЛ должны быть свежими. Часть сведений нотариус запрашивает самостоятельно в день обращения.',
  },
]

export default function VisitPage() {
  return (
    <>
      {/* Header */}
      <section className="relative bg-navy text-cream overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-visit" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-visit)" />
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Перед приёмом</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Подготовка к визиту</h1>
          <p className="text-slate max-w-xl">
            Соберите документы заранее по интерактивному чек-листу — визит пройдёт быстро и без повторных посещений
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-navy border-b" style={{ borderColor: 'rgba(192,92,46,0.12)' }}>
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <div key={s.n} className="relative">
                <span className="font-serif text-5xl font-bold" style={{ color: 'rgba(192,92,46,0.30)' }}>{s.n}</span>
                <h3 className="font-serif text-lg font-bold text-cream mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive checklist */}
      <section className="bg-navy-dark">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="block w-6 h-px bg-gold" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-gold/80">Чек-лист документов</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream">Что взять с собой</h2>
          </div>
          <VisitChecklist />
        </div>
      </section>

      {/* Notes */}
      <section className="bg-navy border-t" style={{ borderColor: 'rgba(192,92,46,0.12)' }}>
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="font-serif text-2xl font-bold text-cream mb-8">Что важно знать</h2>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {NOTES.map(n => (
              <div key={n.title} className="flex gap-4">
                <span className="w-9 h-9 rounded-lg grid place-items-center flex-shrink-0 text-gold" style={{ background: 'rgba(192,92,46,0.10)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-semibold text-cream mb-1.5">{n.title}</h3>
                  <p className="text-sm text-slate leading-relaxed">{n.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-dark border-t" style={{ borderColor: 'rgba(192,92,46,0.12)' }}>
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="font-serif text-2xl font-bold text-cream mb-3">Документы готовы?</h2>
          <p className="text-slate mb-6 text-sm">Запишитесь на приём в удобное время — или загляните в блог за подробностями</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <Link
              href="/blog"
              className="border text-cream font-semibold px-8 py-3 rounded-lg hover:border-gold hover:text-gold transition-all text-sm"
              style={{ borderColor: 'rgba(192,92,46,0.35)' }}
            >
              Полезные статьи →
            </Link>
            <a
              href={notary.phoneHref}
              className="border text-cream font-semibold px-8 py-3 rounded-lg hover:border-gold hover:text-gold transition-all text-sm"
              style={{ borderColor: 'rgba(192,92,46,0.35)' }}
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
