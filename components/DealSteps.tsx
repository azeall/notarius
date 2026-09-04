/**
 * Пять шагов сделки — все сразу.
 *
 * Раньше здесь стояла карусель: один шаг из пяти и кнопки «Назад / Дальше».
 * Пять коротких фраз читаются глазами за десять секунд, а нажатий на них
 * уходило пять — и пять сотен пикселей высоты на то, чтобы показать одну.
 * Ни один человек не дойдёт до пятого шага, если ради каждого надо кликать.
 */

interface Step { t: string; d: string; meta: string }

const STEPS: Step[] = [
  { t: 'Заявка', d: 'Записываетесь онлайн или по телефону. Подбираем удобное время — без очередей и ожидания.', meta: '5 минут' },
  { t: 'Консультация', d: 'Разбираем ситуацию, называем точный перечень документов и ориентир по стоимости. Никаких сюрпризов на приёме.', meta: 'в день записи' },
  { t: 'Подготовка', d: 'Готовим проект документа заранее, проверяем данные и реквизиты, при необходимости запрашиваем выписки.', meta: '1–3 дня' },
  { t: 'Удостоверение', d: 'Подписание у нотариуса: разъясняем последствия простыми словами, ставим удостоверительную надпись и печать.', meta: 'один визит' },
  { t: 'Выдача', d: 'При необходимости подаём документы в Росреестр электронно. Выдаём готовые экземпляры на руки.', meta: 'сразу / по готовности' },
]

export default function DealSteps() {
  return (
    <section className="py-12 sm:py-14" style={{ background: 'rgb(var(--surface-2-rgb))' }}>
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-9 reveal">
          <h2
            className="font-serif font-medium m-0"
            style={{ fontSize: 'clamp(26px, 3.4vw, 42px)', color: 'rgb(var(--text-rgb))' }}
          >
            Как проходит <em className="italic font-normal" style={{ color: 'rgb(var(--violet-rgb))' }}>сделка</em>
          </h2>
          <p className="m-0 text-[14px]" style={{ color: 'rgb(var(--muted-rgb))', maxWidth: '38ch' }}>
            Порядок одинаков и для доверенности на полчаса, и для сделки с квартирой —
            меняются только сроки.
          </p>
        </div>

        <ol className="m-0 p-0 list-none grid gap-px sm:grid-cols-2 lg:grid-cols-5"
            style={{ background: 'rgb(var(--violet-rgb) / 0.18)', border: '1px solid rgb(var(--violet-rgb) / 0.18)' }}>
          {STEPS.map((s, i) => (
            <li
              key={s.t}
              className="p-5 sm:p-6 reveal"
              data-reveal-delay={i * 70}
              style={{ background: 'rgb(var(--surface-rgb))' }}
            >
              <div className="flex items-baseline gap-2.5 mb-3">
                <span className="font-serif text-[26px] leading-none tabular-nums" style={{ color: 'rgb(var(--violet-rgb) / 0.80)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] tracking-[0.16em] uppercase" style={{ color: 'rgb(var(--muted-rgb))' }}>
                  {s.meta}
                </span>
              </div>
              <h3 className="font-serif m-0 mb-2" style={{ fontSize: '19px', color: 'rgb(var(--text-rgb))' }}>{s.t}</h3>
              <p className="m-0 text-[13.5px] leading-relaxed" style={{ color: 'rgb(var(--muted-rgb))' }}>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
