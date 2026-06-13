'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { calcServices } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

function fmt(n: number): string {
  return n.toLocaleString('ru-RU') + ' ₽'
}

const STEPS = ['Услуга', 'Параметры', 'Итог'] as const

interface Part { label: string; value: number; color: string }

/** Плавный счётчик суммы. */
function useCountUp(value: number, active: boolean) {
  const [shown, setShown] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number>()
  useEffect(() => {
    if (!active) { setShown(value); fromRef.current = value; return }
    const from = fromRef.current
    const to = value
    if (from === to) return
    const start = performance.now()
    const dur = 600
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setShown(Math.round(from + (to - from) * e))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, active])
  return shown
}

/** Состав стоимости — анимированная полоса + легенда. */
function Composition({ parts, total }: { parts: Part[]; total: number }) {
  return (
    <div>
      <div className="flex h-3.5 rounded-full overflow-hidden mb-3" style={{ background: '#e7e3f8' }}>
        {parts.map(p => (
          <div key={p.label} title={p.label} style={{ width: total > 0 ? `${(p.value / total) * 100}%` : '0%', background: p.color, transition: 'width .5s cubic-bezier(0.2,0.7,0.2,1)' }} />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 m-0">
        {parts.map(p => (
          <li key={p.label} className="flex items-center gap-2 text-[12.5px]" style={{ color: '#5b5677' }}>
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
            {p.label}
            <span className="font-mono" style={{ color: '#9a96b5' }}>{total > 0 ? `${Math.round((p.value / total) * 100)}%` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CostCalculator() {
  const [step, setStep] = useState(0)
  const [activeId, setActiveId] = useState(calcServices[0].id)
  const [sum, setSum] = useState(5_000_000)
  const [pages, setPages] = useState(5)

  const svc = useMemo(() => calcServices.find(s => s.id === activeId) ?? calcServices[0], [activeId])

  const parts = useMemo<Part[]>(() => {
    const p: Part[] = []
    if (svc.tariff) p.push({ label: 'Нотариальный тариф', value: svc.tariff, color: '#534AB7' })
    if (svc.tariffPercent) p.push({ label: `Тариф ${svc.tariffPercent}% от суммы`, value: Math.round((sum * svc.tariffPercent) / 100), color: '#6f64d4' })
    if (svc.uptx) p.push({ label: 'УПТХ (правовая и техническая работа)', value: svc.uptx, color: '#9a8fe0' })
    if (svc.perPage) p.push({ label: `${pages} стр. × ${svc.perPage} ₽`, value: pages * svc.perPage, color: '#c8b27e' })
    return p
  }, [svc, sum, pages])

  const total = parts.reduce((a, b) => a + b.value, 0)
  const shownTotal = useCountUp(total, step === 2)
  const hasParams = !!(svc.needsSum || svc.needsPages)

  const next = () => setStep(s => Math.min(2, s + 1))
  const back = () => setStep(s => Math.max(0, s - 1))
  const reset = () => setStep(0)

  return (
    <section className="relative py-20 sm:py-24" style={{ background: '#eceafb' }}>
      <div className="mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1180px' }}>
        <div className="mb-9 reveal">
          <div className="inline-flex items-center gap-3.5 mb-4">
            <span className="block w-6 h-px" style={{ background: '#534AB7' }} />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(83,74,183,0.75)' }}>Калькулятор</span>
          </div>
          <h2 className="font-serif font-medium m-0" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#26223d' }}>
            Рассчитайте стоимость <em className="italic font-normal" style={{ color: '#534AB7' }}>за три шага</em>
          </h2>
        </div>

        {/* Прогресс */}
        <div className="flex items-center gap-2 sm:gap-4 mb-7 reveal">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
              <button onClick={() => i <= step && setStep(i)} disabled={i > step} className="flex items-center gap-2.5" style={{ cursor: i <= step ? 'pointer' : 'default' }}>
                <span className="grid place-items-center rounded-full font-mono text-sm font-bold transition-all" style={{ width: 34, height: 34, background: i <= step ? '#534AB7' : '#dad6f3', color: i <= step ? '#fff' : '#8b86ad', boxShadow: i === step ? '0 0 0 5px rgba(83,74,183,0.16)' : 'none' }}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="text-sm font-semibold hidden sm:block" style={{ color: i <= step ? '#26223d' : '#9a96b5' }}>{s}</span>
              </button>
              {i < STEPS.length - 1 && <span className="h-px flex-1 rounded" style={{ background: i < step ? '#534AB7' : '#dad6f3', transition: 'background .3s' }} />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 sm:p-9 bg-white reveal" style={{ border: '1px solid rgba(83,74,183,0.15)', boxShadow: '0 24px 60px rgba(83,74,183,0.10)' }}>

          {/* ШАГ 1 */}
          {step === 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#75718f' }}>Выберите услугу</p>
              <div className="grid sm:grid-cols-3 gap-2.5 mb-8">
                {calcServices.map(s => (
                  <button key={s.id} onClick={() => setActiveId(s.id)} className="text-left rounded-xl px-4 py-4 text-sm font-medium transition-all"
                    style={{ background: s.id === activeId ? 'rgba(83,74,183,0.10)' : '#f8f7fe', color: s.id === activeId ? '#534AB7' : '#26223d', border: `1.5px solid ${s.id === activeId ? '#534AB7' : 'rgba(83,74,183,0.12)'}` }}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={next} className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110" style={{ background: '#534AB7' }}>Далее →</button>
              </div>
            </div>
          )}

          {/* ШАГ 2 */}
          {step === 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#75718f' }}>Параметры</p>
              <p className="font-serif text-xl mb-6" style={{ color: '#26223d' }}>{svc.label}</p>

              {svc.needsSum && (
                <div className="mb-7">
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#75718f' }}>Сумма сделки</label>
                    <span className="font-mono font-bold text-base" style={{ color: '#534AB7' }}>{fmt(sum)}</span>
                  </div>
                  <input type="range" min={500_000} max={30_000_000} step={100_000} value={sum} onChange={e => setSum(Number(e.target.value))} className="w-full cc-range" />
                  <div className="flex justify-between text-[11px] mt-1" style={{ color: '#9a96b5' }}><span>500 тыс.</span><span>30 млн</span></div>
                </div>
              )}

              {svc.needsPages && (
                <div className="mb-7">
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#75718f' }}>Количество страниц</label>
                    <span className="font-mono font-bold text-base" style={{ color: '#534AB7' }}>{pages} стр.</span>
                  </div>
                  <input type="range" min={1} max={50} step={1} value={pages} onChange={e => setPages(Number(e.target.value))} className="w-full cc-range" />
                  <div className="flex justify-between text-[11px] mt-1" style={{ color: '#9a96b5' }}><span>1</span><span>50</span></div>
                </div>
              )}

              {!hasParams && (
                <p className="text-sm mb-6 rounded-xl px-4 py-3" style={{ background: '#f8f7fe', color: '#75718f' }}>
                  Для этой услуги стоимость фиксированная — смотрите состав ниже.
                </p>
              )}

              {/* Состав стоимости (живая визуализация) */}
              <div className="rounded-xl p-5 mb-8" style={{ background: '#f8f7fe', border: '1px solid rgba(83,74,183,0.10)' }}>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#75718f' }}>Из чего складывается</p>
                <Composition parts={parts} total={total} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button onClick={back} className="rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors" style={{ color: '#534AB7', border: '1.5px solid rgba(83,74,183,0.25)' }}>← Назад</button>
                <div className="flex items-center gap-4">
                  <span className="text-sm" style={{ color: '#75718f' }}>Итого ≈ <b className="font-mono" style={{ color: '#26223d' }}>{fmt(total)}</b></span>
                  <button onClick={next} className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110" style={{ background: '#534AB7' }}>Рассчитать →</button>
                </div>
              </div>
            </div>
          )}

          {/* ШАГ 3 */}
          {step === 2 && (
            <div className="grid md:grid-cols-[1fr_0.9fr] gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#75718f' }}>Расчёт · {svc.label}</p>
                <ul className="space-y-2.5 mb-6">
                  {parts.map(p => (
                    <li key={p.label} className="flex items-baseline justify-between gap-4 text-sm py-2" style={{ color: '#3b3658', borderBottom: '1px dashed rgba(83,74,183,0.15)' }}>
                      <span className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />{p.label}</span>
                      <span className="font-mono whitespace-nowrap">{fmt(p.value)}</span>
                    </li>
                  ))}
                </ul>
                <Composition parts={parts} total={total} />
                <div className="flex gap-3 mt-7">
                  <button onClick={back} className="rounded-xl px-5 py-3 text-sm font-semibold transition-colors" style={{ color: '#534AB7', border: '1.5px solid rgba(83,74,183,0.25)' }}>← Изменить</button>
                  <button onClick={reset} className="rounded-xl px-5 py-3 text-sm font-semibold transition-colors" style={{ color: '#75718f' }}>Начать заново</button>
                </div>
              </div>

              <div className="rounded-2xl p-7 flex flex-col" style={{ background: '#534AB7' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>Примерная стоимость</p>
                <div className="font-serif font-bold text-white mb-2" style={{ fontSize: 'clamp(34px,5vw,46px)', lineHeight: 1 }}>{fmt(shownTotal)}</div>
                <p className="text-[11px] leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Расчёт ориентировочный. Точная стоимость зависит от ситуации и определяется при записи.
                </p>
                <div className="mt-auto"><BookingButton className="w-full" /></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cc-range{-webkit-appearance:none;appearance:none;height:6px;border-radius:999px;background:linear-gradient(90deg,#534AB7,#8d84e0);outline:none;}
        .cc-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid #534AB7;cursor:pointer;box-shadow:0 3px 8px rgba(83,74,183,0.35);transition:transform .15s;}
        .cc-range::-webkit-slider-thumb:active{transform:scale(1.15);}
        .cc-range::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid #534AB7;cursor:pointer;box-shadow:0 3px 8px rgba(83,74,183,0.35);}
      `}</style>
    </section>
  )
}
