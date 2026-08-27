import type { Metadata } from 'next'
import Link from 'next/link'
import { notary } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных',
  description:
    'Политика в отношении обработки персональных данных: какие данные собираются, цели, сроки, права субъекта данных. Согласие на обработку и использование cookie.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

const SECTIONS: { h: string; p?: string[]; ul?: string[] }[] = [
  {
    h: '1. Общие положения',
    p: [
      `Настоящая Политика определяет порядок обработки и защиты персональных данных физических лиц (далее — Пользователи), обращающихся к нотариусу ${notary.name} (далее — Оператор) через сайт.`,
      'Используя сайт и отправляя данные через форму записи на приём, Пользователь подтверждает согласие с условиями настоящей Политики.',
      'Обработка персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».',
    ],
  },
  {
    h: '2. Какие данные обрабатываются',
    p: ['При записи на приём через сайт Оператор обрабатывает:'],
    ul: [
      'фамилия, имя, отчество;',
      'номер телефона;',
      'выбранная услуга, желаемые дата и время приёма;',
      'технические данные посещения сайта (файлы cookie, данные веб-аналитики) — при согласии Пользователя.',
    ],
  },
  {
    h: '3. Цели обработки',
    ul: [
      'запись Пользователя на приём и согласование времени визита;',
      'связь с Пользователем для подтверждения или уточнения записи;',
      'улучшение работы сайта и анализ посещаемости (обезличенная статистика).',
    ],
  },
  {
    h: '4. Правовые основания',
    p: [
      'Обработка осуществляется на основании согласия Пользователя, выражаемого путём проставления отметки в форме записи, а также в случаях, предусмотренных законодательством Российской Федерации.',
    ],
  },
  {
    h: '5. Порядок и сроки обработки',
    p: [
      'Персональные данные обрабатываются с момента их предоставления и хранятся в течение срока, необходимого для целей обработки, после чего удаляются или обезличиваются.',
      'Согласие может быть отозвано Пользователем в любой момент путём обращения к Оператору по контактам, указанным ниже.',
    ],
  },
  {
    h: '6. Передача третьим лицам',
    p: [
      'Оператор не передаёт персональные данные третьим лицам, за исключением случаев, прямо предусмотренных законодательством Российской Федерации.',
    ],
  },
  {
    h: '7. Права субъекта персональных данных',
    p: ['Пользователь имеет право:'],
    ul: [
      'получать информацию об обработке своих персональных данных;',
      'требовать уточнения, блокирования или уничтожения данных, если они неполны, устарели, неточны или незаконно получены;',
      'отозвать согласие на обработку персональных данных.',
    ],
  },
  {
    h: '8. Файлы cookie и веб-аналитика',
    p: [
      'Сайт использует файлы cookie и сервис веб-аналитики Яндекс.Метрика для сбора обезличенной статистики посещений. Сбор включается только после согласия Пользователя в уведомлении о cookie.',
      'Пользователь может отключить cookie в настройках браузера; при этом часть функций сайта может работать некорректно.',
    ],
  },
  {
    h: '9. Защита данных',
    p: [
      'Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования и иных неправомерных действий.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <section className="relative bg-navy text-cream overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 py-14 md:py-16">
          <nav className="flex items-center gap-2 text-xs text-slate/80 mb-5">
            <Link href="/" className="hover:text-gold transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-slate">Политика конфиденциальности</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
            Политика обработки персональных данных
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="bg-navy-dark">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <div className="space-y-9">
            {SECTIONS.map(s => (
              <div key={s.h}>
                <h2 className="font-serif text-xl font-bold text-cream mb-3">{s.h}</h2>
                {s.p?.map((para, i) => (
                  <p key={i} className="text-slate leading-relaxed mb-3" style={{ lineHeight: '1.8' }}>{para}</p>
                ))}
                {s.ul && (
                  <ul className="space-y-2 mt-2">
                    {s.ul.map(item => (
                      <li key={item} className="flex items-start gap-3 text-slate leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Контакты оператора */}
            <div className="rounded-2xl p-6 mt-4" style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.15)' }}>
              <h2 className="font-serif text-xl font-bold text-cream mb-3">10. Контакты Оператора</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex gap-3"><dt className="text-slate/70 min-w-[90px]">Оператор</dt><dd className="text-cream">{notary.name}</dd></div>
                <div className="flex gap-3"><dt className="text-slate/70 min-w-[90px]">Адрес</dt><dd className="text-cream">{notary.address}</dd></div>
                <div className="flex gap-3"><dt className="text-slate/70 min-w-[90px]">Телефон</dt><dd className="text-cream">{notary.phone}</dd></div>
                <div className="flex gap-3"><dt className="text-slate/70 min-w-[90px]">Email</dt><dd className="text-cream">{notary.email}</dd></div>
              </dl>
            </div>

            <p className="text-xs text-slate/60">
              Настоящая Политика может быть изменена Оператором. Актуальная редакция размещена на этой странице.
            </p>
          </div>

          <div className="mt-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              На главную
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
