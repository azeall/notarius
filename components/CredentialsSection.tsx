import Link from 'next/link'
import PhotoPlate from '@/components/PhotoPlate'
import { notary, demoMode } from '@/lib/data'

/**
 * Блок доверия: чем подтверждены полномочия нотариуса.
 *
 * Это единственное, чего нет ни на одном из сайтов, откуда взято оформление.
 * Дизайнерским витринам доверие не нужно — им нужно впечатление. Человеку,
 * который несёт сюда документы на квартиру, нужно ровно обратное: номер,
 * палата, страховка и ссылка на реестр, где всё это можно перепроверить.
 *
 * Каждое поле берётся из lib/data.ts и пропадает, если поле пустое: у одной
 * конторы нет реестрового номера, у другой не указана страховая сумма, и
 * дыра в вёрстке хуже, чем строка меньше.
 *
 * Раскладка — не четыре одинаковые карточки, а ряды с линейками: карточка
 * здесь ничего не сообщает об иерархии, а линейка читается как строка
 * документа, что этому блоку и нужно.
 */

type Row = { label: string; value: string; note?: string }

export default function CredentialsSection() {
  const years = notary.practiceSince
    ? new Date().getFullYear() - Number(notary.practiceSince)
    : 0

  const rows: Row[] = [
    {
      label: 'Лицензия',
      value: notary.license,
      note: 'Приказ Министерства юстиции Российской Федерации',
    },
    ...(notary.registryNumber
      ? [{
          label: 'Реестровый номер',
          value: notary.registryNumber,
          note: 'По нему нотариуса находят в реестре Федеральной нотариальной палаты',
        }]
      : []),
    {
      label: 'Нотариальная палата',
      value: notary.chamber,
      note: 'Членство действующее',
    },
    ...(notary.insuranceSum
      ? [{
          label: 'Страхование ответственности',
          value: notary.insuranceSum,
          note: 'Ошибка нотариуса возмещается из страховой суммы, а не из кармана клиента',
        }]
      : []),
    ...(years > 0
      ? [{
          label: 'Практика',
          value: `с ${notary.practiceSince} года`,
          note: `${years} лет непрерывной нотариальной деятельности`,
        }]
      : []),
  ]

  return (
    <section
      className="py-20 sm:py-28"
      style={{ background: 'rgb(var(--surface-2-rgb))' }}
      aria-labelledby="creds-title"
    >
      <div
        className="wrap grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start"
      >
        <div className="reveal lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-3.5 mb-4">
            <span className="block w-6 h-px" style={{ background: 'rgb(var(--violet-rgb))' }} />
            <span
              className="text-[12px] tracking-[0.24em] uppercase"
              style={{ color: 'rgb(var(--violet-rgb))' }}
            >
              Полномочия
            </span>
          </div>
          <h2
            id="creds-title"
            className="font-serif font-medium m-0 mb-5"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)', lineHeight: 1.1, color: 'rgb(var(--text-rgb))' }}
          >
            Всё, что можно{' '}
            <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>
              проверить
            </em>
          </h2>
          <p
            className="m-0 mb-7"
            style={{ fontSize: '16px', lineHeight: 1.65, color: 'rgb(var(--muted-rgb))', maxWidth: '38ch' }}
          >
            Нотариуса назначает государство, и его полномочия подтверждаются
            публично. Ниже — данные, по которым это можно сделать самостоятельно,
            не выходя с этой страницы.
          </p>
          <a
            href={notary.fnpVerifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-[14px] font-semibold no-underline pb-1 transition-opacity hover:opacity-70"
            style={{ color: 'rgb(var(--violet-rgb))', borderBottom: '1px solid rgb(var(--violet-rgb) / 0.35)' }}
          >
            Проверить в реестре ФНП
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5" />
            </svg>
          </a>

          {/* Под текстом оставалось пустое место почти в экран высотой. Снимок
              конторы закрывает его и заодно отвечает на невысказанный вопрос
              «куда я вообще приду». */}
          <div className="mt-10 sd">
            <PhotoPlate
              src="/ph-room.jpg"
              alt="Кабинет нотариальной конторы: стол, кресла для посетителей, шкафы с делами"
              caption="Кабинет конторы"
              ratio="4 / 3"
            />
          </div>
        </div>

        <dl className="m-0">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`grid sm:grid-cols-[190px_1fr] gap-1.5 sm:gap-8 py-6 sd sd-${Math.min(i + 1, 5)}`}
              style={{
                borderTop: '1px solid rgb(var(--violet-rgb) / 0.16)',
                ...(i === rows.length - 1 ? { borderBottom: '1px solid rgb(var(--violet-rgb) / 0.16)' } : {}),
              }}
            >
              <dt
                className="text-[12px] tracking-[0.18em] uppercase leading-relaxed"
                style={{ color: 'rgb(var(--muted-rgb))' }}
              >
                {r.label}
              </dt>
              <dd className="m-0">
                <p
                  className="font-serif m-0 mb-1.5 nums"
                  style={{ fontSize: 'clamp(19px, 2vw, 23px)', lineHeight: 1.25, color: 'rgb(var(--text-rgb))' }}
                >
                  {r.value}
                </p>
                {r.note && (
                  <p className="m-0 text-[14px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))' }}>
                    {r.note}
                  </p>
                )}
              </dd>
            </div>
          ))}

          {demoMode && (
            /* Пока витрина работает на вымышленном нотариусе, блок обязан сам
               сказать об этом. Номер лицензии выглядит убедительно именно
               потому, что так и задумано, — и без оговорки это уже не макет. */
            <p
              className="mt-5 mb-0 text-[13px] leading-relaxed"
              style={{ color: 'rgb(var(--muted-rgb))' }}
            >
              Данные в этом блоке — демонстрационные. На сайте действующей конторы
              здесь стоят её настоящие номер лицензии, реестровый номер и полис.
            </p>
          )}
        </dl>
      </div>
    </section>
  )
}
