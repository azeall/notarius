'use client'
import { useState, useEffect, useMemo } from 'react'
import { checklists } from '@/lib/checklists'

const STORAGE_KEY = 'visit-checklist-v1'

export default function VisitChecklist() {
  const [activeId, setActiveId] = useState(checklists[0].id)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [hydrated, setHydrated] = useState(false)

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
    } catch {
      /* ignore */
    }
  }, [checked, hydrated])

  const active = useMemo(
    () => checklists.find(c => c.id === activeId) ?? checklists[0],
    [activeId],
  )

  const keyFor = (itemLabel: string) => `${active.id}::${itemLabel}`

  const requiredItems = active.items.filter(i => !i.optional)
  const doneRequired = requiredItems.filter(i => checked[keyFor(i.label)]).length
  const progress = requiredItems.length === 0 ? 100 : Math.round((doneRequired / requiredItems.length) * 100)

  const toggle = (label: string) =>
    setChecked(prev => ({ ...prev, [keyFor(label)]: !prev[keyFor(label)] }))

  const resetActive = () =>
    setChecked(prev => {
      const next = { ...prev }
      active.items.forEach(i => delete next[keyFor(i.label)])
      return next
    })

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
      {/* Service selector */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3 print:hidden">Выберите услугу</p>
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 print:hidden">
          {checklists.map(c => {
            const isActive = c.id === activeId
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className="text-left whitespace-nowrap lg:whitespace-normal rounded-lg px-4 py-3 text-sm font-medium transition-all flex-shrink-0 lg:flex-shrink"
                style={{
                  background: isActive ? 'rgba(184,154,90,0.14)' : '#0f1e35',
                  color: isActive ? '#f0ece4' : '#8a9ab5',
                  border: `1px solid ${isActive ? '#b89a5a' : 'rgba(184,154,90,0.12)'}`,
                }}
              >
                {c.title}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Checklist */}
      <div data-checklist className="rounded-2xl p-6 sm:p-8" style={{ background: '#0f1e35', border: '1px solid rgba(184,154,90,0.15)' }}>
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="font-serif text-2xl font-bold text-cream mb-1">{active.title}</h2>
            <p className="text-sm text-slate">Отметьте подготовленные документы</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream rounded-lg px-3 py-2 hover:border-gold hover:text-gold transition-all"
              style={{ border: '1px solid rgba(184,154,90,0.30)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Печать
            </button>
            <button
              onClick={resetActive}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate rounded-lg px-3 py-2 hover:text-cream transition-all"
              style={{ border: '1px solid rgba(184,154,90,0.18)' }}
            >
              Сбросить
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 print:hidden">
          <div className="flex items-center justify-between text-xs text-slate mb-2">
            <span>Готовность обязательных документов</span>
            <span className="font-mono font-semibold text-cream">{progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: progress === 100 ? '#4f9d7a' : '#b89a5a',
              }}
            />
          </div>
          {progress === 100 && (
            <p className="text-xs text-emerald-light font-medium mt-2 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Всё готово — можно записываться на приём
            </p>
          )}
        </div>

        {/* Items */}
        <ul className="space-y-2.5">
          {active.items.map(item => {
            const isChecked = !!checked[keyFor(item.label)]
            return (
              <li key={item.label}>
                <button
                  onClick={() => toggle(item.label)}
                  className="w-full flex items-start gap-3.5 text-left rounded-xl p-3.5 transition-all border"
                  style={{
                    background: isChecked ? 'rgba(79,157,122,0.10)' : 'rgba(255,255,255,0.02)',
                    borderColor: isChecked ? 'rgba(79,157,122,0.40)' : 'rgba(184,154,90,0.12)',
                  }}
                >
                  <span
                    className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 grid place-items-center transition-all"
                    style={{
                      background: isChecked ? '#4f9d7a' : 'transparent',
                      border: `1.5px solid ${isChecked ? '#4f9d7a' : 'rgba(184,154,90,0.35)'}`,
                    }}
                  >
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-sm font-medium transition-colors"
                        style={{
                          color: isChecked ? '#6b7895' : '#f0ece4',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {item.label}
                      </span>
                      {item.optional && (
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-slate rounded px-1.5 py-0.5" style={{ border: '1px solid rgba(184,154,90,0.20)' }}>
                          не для всех
                        </span>
                      )}
                    </span>
                    {item.note && <span className="block text-xs text-slate/70 mt-1">{item.note}</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <p className="text-xs text-slate/70 mt-6 leading-relaxed">
          Пункты «не для всех» нужны только в определённых ситуациях. Точный перечень под вашу задачу
          уточнит нотариус при записи на приём.
        </p>
      </div>
    </div>
  )
}
