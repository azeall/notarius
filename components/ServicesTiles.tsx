import Link from 'next/link'

/**
 * Услуги сеткой.
 *
 * Было: зигзаг из шести карточек вдоль пунктирной нити — каждая карточка
 * занимала половину ширины, вторая половина всегда пустовала, и шесть услуг
 * растягивались на тысячу восемьсот пикселей. Приём красивый ровно один раз,
 * а платит за него человек, который шесть раз прокручивает пустоту.
 */

interface Tile { t: string; d: string; href: string }

const TILES: Tile[] = [
  { t: 'Наследство', d: 'Открытие наследственного дела, свидетельства о праве, отказ от наследства.', href: '/services' },
  { t: 'Сделки с недвижимостью', d: 'Купля-продажа, дарение, рента, ипотека. Проверка и электронная регистрация.', href: '/services' },
  { t: 'Доверенности', d: 'Генеральная, на автомобиль, для действий за рубежом. Отмена — в любой день.', href: '/services' },
  { t: 'Семейные договоры', d: 'Брачный договор, раздел имущества, согласия супруга, алименты.', href: '/services' },
  { t: 'Копии и подписи', d: 'Верность копий и выписок, подлинность подписи, банковские карточки.', href: '/services' },
  { t: 'Перевод и апостиль', d: 'Нотариальный перевод с подшивкой к оригиналу, апостиль на российские документы.', href: '/services' },
]

export default function ServicesTiles() {
  return (
    <section className="py-12 sm:py-14" style={{ background: 'rgb(var(--bg-rgb))' }}>
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 reveal">
          <h2
            className="font-serif font-medium m-0"
            style={{ fontSize: 'clamp(26px, 3.4vw, 42px)', color: 'rgb(var(--text-rgb))' }}
          >
            Все <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>направления</em>
          </h2>
          <Link href="/prices" className="text-[14px] no-underline" style={{ color: 'rgb(var(--violet-rgb))' }}>
            Цены на все действия →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TILES.map((s, i) => (
            <Link
              key={s.t}
              href={s.href}
              className="group block rounded-xl p-5 no-underline transition-transform hover:-translate-y-0.5 reveal"
              data-reveal-delay={i * 50}
              style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.16)' }}
            >
              <h3
                className="font-serif m-0 mb-2 transition-colors group-hover:text-[rgb(var(--violet-rgb))]"
                style={{ fontSize: '19px', color: 'rgb(var(--text-rgb))' }}
              >
                {s.t}
              </h3>
              <p className="m-0 text-[13.5px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))' }}>{s.d}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
