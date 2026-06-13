'use client'
import { useMemo, useState } from 'react'

interface Item { id: string; label: string; note?: string }
interface Svc { id: string; label: string; bring: Item[]; notary: string[] }

// Заглушки-данные: что клиент приносит и что берёт на себя нотариус.
const DATA: Svc[] = [
  {
    id: 'will', label: 'Завещание',
    bring: [
      { id: 'pass', label: 'Паспорт' },
      { id: 'list', label: 'Перечень имущества', note: 'по желанию — поможем составить на месте' },
      { id: 'heirs', label: 'Данные наследников', note: 'ФИО, при наличии — даты рождения' },
    ],
    notary: ['Составим текст и разъясним последствия', 'Удостоверим и внесём в реестр завещаний'],
  },
  {
    id: 'poa', label: 'Доверенность',
    bring: [
      { id: 'pass', label: 'Паспорт доверителя' },
      { id: 'rep', label: 'Данные представителя', note: 'ФИО, дата рождения, адрес' },
      { id: 'scope', label: 'Сведения о полномочиях', note: 'объект, банк, орган — смотря для чего' },
    ],
    notary: ['Подготовим текст под вашу задачу', 'Проверим полномочия и удостоверим'],
  },
  {
    id: 'sale', label: 'Купля-продажа',
    bring: [
      { id: 'pass', label: 'Паспорта сторон' },
      { id: 'title', label: 'Правоустанавливающие документы', note: 'на объект недвижимости' },
      { id: 'egrn', label: 'Выписка из ЕГРН', note: 'при наличии — запросим сами' },
      { id: 'spouse', label: 'Согласие супруга', note: 'если требуется' },
    ],
    notary: ['Проверим чистоту сделки', 'Удостоверим договор и подадим на регистрацию электронно'],
  },
  {
    id: 'consent', label: 'Согласие супруга',
    bring: [
      { id: 'pass', label: 'Паспорт' },
      { id: 'marr', label: 'Свидетельство о браке' },
      { id: 'obj', label: 'Сведения об объекте сделки' },
    ],
    notary: ['Оформим согласие', 'Разъясним правовые последствия'],
  },
  {
    id: 'copy', label: 'Заверение копий',
    bring: [
      { id: 'orig', label: 'Оригиналы документов' },
    ],
    notary: ['Сверим копии с оригиналами', 'Засвидетельствуем верность копий'],
  },
  {
    id: 'translate', label: 'Перевод документов',
    bring: [
      { id: 'orig', label: 'Оригинал или нотариальная копия' },
      { id: 'names', label: 'Написание имён', note: 'как в загранпаспорте — для единообразия' },
    ],
    notary: ['Обеспечим перевод дипломированным переводчиком', 'Удостоверим подпись и подошьём к документу'],
  },
]

export default function BringChecklist() {
  const [activeId, setActiveId] = useState(DATA[0].id)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const svc = useMemo(() => DATA.find(s => s.id === activeId) ?? DATA[0], [activeId])
  const key = (i: Item) => `${svc.id}:${i.id}`
  const doneCount = svc.bring.filter(i => checked[key(i)]).length
  const pct = Math.round((doneCount / svc.bring.length) * 100)

  return (
    <section className="py-20 sm:py-24" style={{ background: '#efe4d1' }}>
      <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: '1080px' }}>
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center gap-3.5 mb-4">
            <span className="block w-6 h-px" style={{ background: '#c05c2e' }} />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(192,92,46,0.75)' }}>Памятка</span>
            <span className="block w-6 h-px" style={{ background: '#c05c2e' }} />
          </div>
          <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 50px)', color: '#3d2010' }}>
            Что взять <em className="italic font-normal" style={{ color: '#c05c2e' }}>с собой</em>
          </h2>
          <p className="mt-3 text-[15px]" style={{ color: '#7d6a55' }}>Выберите услугу — отметьте, что уже собрали</p>
        </div>

        <div className="grid md:grid-cols-[0.32fr_0.68fr] gap-6 reveal">
          {/* Услуги */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-1">
            {DATA.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className="text-left rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: s.id === activeId ? '#c05c2e' : '#fbf6ea',
                  color: s.id === activeId ? '#fff' : '#5d4a38',
                  border: `1px solid ${s.id === activeId ? '#c05c2e' : 'rgba(192,92,46,0.18)'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Чек-лист */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white" style={{ border: '1px solid rgba(192,92,46,0.16)', boxShadow: '0 20px 50px rgba(61,32,16,0.10)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: '#94816b' }}>Возьмите с собой</p>
              <span className="font-mono text-xs" style={{ color: '#c05c2e' }}>собрано {doneCount}/{svc.bring.length}</span>
            </div>
            {/* индикатор готовности */}
            <div className="h-1.5 rounded-full mb-5 mt-2 overflow-hidden" style={{ background: 'rgba(192,92,46,0.14)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#c05c2e', transition: 'width .4s cubic-bezier(0.2,0.7,0.2,1)' }} />
            </div>

            <ul key={svc.id} className="space-y-2.5 mb-7">
              {svc.bring.map((it, i) => {
                const on = !!checked[key(it)]
                return (
                  <li key={it.id} className="bc-row" style={{ animationDelay: `${i * 60}ms` }}>
                    <button
                      onClick={() => setChecked(c => ({ ...c, [key(it)]: !on }))}
                      className="w-full flex items-start gap-3 text-left rounded-xl px-4 py-3 transition-colors"
                      style={{ background: on ? 'rgba(192,92,46,0.07)' : '#faf5ec', border: '1px solid rgba(192,92,46,0.10)' }}
                    >
                      <span
                        className="grid place-items-center rounded-md flex-shrink-0 mt-0.5"
                        style={{ width: 22, height: 22, background: on ? '#c05c2e' : '#fff', border: `1.5px solid ${on ? '#c05c2e' : '#d9c9b4'}`, color: '#fff', fontSize: 13 }}
                      >
                        {on ? '✓' : ''}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium" style={{ color: '#3d2010', textDecoration: on ? 'line-through' : 'none', opacity: on ? 0.6 : 1 }}>{it.label}</span>
                        {it.note && <span className="block text-[12px] mt-0.5" style={{ color: '#94816b' }}>{it.note}</span>}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="rounded-xl p-5" style={{ background: '#f5ede0', border: '1px dashed rgba(192,92,46,0.3)' }}>
              <p className="text-[11px] tracking-[0.18em] uppercase m-0 mb-3" style={{ color: '#c05c2e' }}>Нотариус берёт на себя</p>
              <ul className="space-y-2 m-0">
                {svc.notary.map(n => (
                  <li key={n} className="flex items-start gap-2.5 text-[14px]" style={{ color: '#5d4a38' }}>
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#c05c2e" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference){
          .bc-row{opacity:0;animation:bcIn .5s cubic-bezier(0.2,0.7,0.2,1) forwards;}
        }
        @keyframes bcIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
      `}</style>
    </section>
  )
}
