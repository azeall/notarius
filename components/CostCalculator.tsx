'use client'
import { useMemo, useState } from 'react'
import { calcServices } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

function fmt(n: number): string {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function CostCalculator() {
  const [activeId, setActiveId] = useState(calcServices[0].id)
  const [sum, setSum] = useState('')
  const [pages, setPages] = useState('1')

  const svc = useMemo(() => calcServices.find(s => s.id === activeId) ?? calcServices[0], [activeId])

  const numSum = Math.max(0, Number(sum.replace(/\D/g, '')) || 0)
  const numPages = Math.max(1, Math.min(500, Number(pages) || 1))

  const parts: { label: string; value: number }[] = []
  if (svc.tariff) parts.push({ label: 'Нотариальный тариф', value: svc.tariff })
  if (svc.tariffPercent) parts.push({ label: `Тариф ${svc.tariffPercent}% от суммы`, value: Math.round((numSum * svc.tariffPercent) / 100) })
  if (svc.uptx) parts.push({ label: 'УПТХ', value: svc.uptx })
  if (svc.perPage) parts.push({ label: `${numPages} стр. × ${svc.perPage} ₽`, value: numPages * svc.perPage })
  const total = parts.reduce((a, b) => a + b.value, 0)
  const ready = !svc.needsSum || numSum > 0

  return (
    <section className="relative py-20 sm:py-24" style={{ background: '#eceafb' }}>
      <div className="mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1180px' }}>
        <div className="mb-10 reveal">
          <div className="inline-flex items-center gap-3.5 mb-4">
            <span className="block w-6 h-px" style={{ background: '#534AB7' }} />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(83,74,183,0.75)' }}>
              Калькулятор
            </span>
          </div>
          <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#26223d' }}>
            Узнайте примерную <em className="italic font-normal" style={{ color: '#534AB7' }}>стоимость</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 reveal">
          {/* Параметры */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white" style={{ border: '1px solid rgba(83,74,183,0.15)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#75718f' }}>Услуга</p>
            <div className="grid sm:grid-cols-2 gap-2 mb-6">
              {calcServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className="text-left rounded-xl px-4 py-3.5 text-sm font-medium transition-all"
                  style={{
                    background: s.id === activeId ? 'rgba(83,74,183,0.10)' : '#f8f7fe',
                    color: s.id === activeId ? '#534AB7' : '#26223d',
                    border: `1px solid ${s.id === activeId ? '#534AB7' : 'rgba(83,74,183,0.12)'}`,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {svc.needsSum && (
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#75718f' }}>
                  Сумма сделки, ₽
                </label>
                <input
                  inputMode="numeric"
                  value={sum}
                  onChange={e => setSum(e.target.value)}
                  placeholder="например, 10 000 000"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ background: '#f8f7fe', border: '1px solid rgba(83,74,183,0.20)', color: '#26223d' }}
                />
              </div>
            )}

            {svc.needsPages && (
              <div className="mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#75718f' }}>
                  Количество страниц
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={pages}
                  onChange={e => setPages(e.target.value)}
                  className="w-32 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ background: '#f8f7fe', border: '1px solid rgba(83,74,183,0.20)', color: '#26223d' }}
                />
              </div>
            )}
          </div>

          {/* Итог */}
          <div className="rounded-2xl p-6 sm:p-8 flex flex-col" style={{ background: '#534AB7' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Примерная стоимость
            </p>
            <ul className="space-y-2.5 mb-6">
              {parts.map(p => (
                <li key={p.label} className="flex items-baseline justify-between gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  <span>{p.label}</span>
                  <span className="font-mono whitespace-nowrap">{ready ? fmt(p.value) : '—'}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between gap-4 pt-4 mb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.25)' }}>
              <span className="font-serif text-lg text-white">Итого</span>
              <span className="font-serif font-bold text-white" style={{ fontSize: '32px' }}>
                {ready ? fmt(total) : 'введите сумму'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Расчёт ориентировочный. Точная стоимость зависит от конкретной ситуации и определяется при записи.
            </p>
            <div className="mt-auto">
              <BookingButton className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
