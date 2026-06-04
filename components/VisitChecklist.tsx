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
                  background: isActive ? '#0a1628' : '#ffffff',
                  color: isActive ? '#f0ece4' : '#334155',
                  border: `1px solid ${isActive ? '#0a1628' : 'rgba(0,0,0,0.08)'}`,
                }}
              >
                {c.title}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy mb-1">{active.title}</h2>
            <p className="text-sm text-gray-500">Отметьте подготовленные документы</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy border border-navy/20 rounded-lg px-3 py-2 hover:border-gold hover:text-gold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Печать
            </button>
            <button
              onClick={resetActive}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:text-navy hover:border-gray-300 transition-all"
            >
              Сбросить
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 print:hidden">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Готовность обязательных документов</span>
            <span className="font-mono font-semibold text-navy">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: progress === 100 ? '#16a34a' : '#b89a5a',
              }}
            />
          </div>
          {progress === 100 && (
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1.5">
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
                    background: isChecked ? 'rgba(22,163,74,0.05)' : '#fafafa',
                    borderColor: isChecked ? 'rgba(22,163,74,0.30)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  <span
                    className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 grid place-items-center transition-all"
                    style={{
                      background: isChecked ? '#16a34a' : '#ffffff',
                      border: `1.5px solid ${isChecked ? '#16a34a' : 'rgba(0,0,0,0.20)'}`,
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
                          color: isChecked ? '#9ca3af' : '#1e293b',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {item.label}
                      </span>
                      {item.optional && (
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                          не для всех
                        </span>
                      )}
                    </span>
                    {item.note && <span className="block text-xs text-gray-400 mt-1">{item.note}</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          Пункты «не для всех» нужны только в определённых ситуациях. Точный перечень под вашу задачу
          уточнит нотариус при записи на приём.
        </p>
      </div>
    </div>
  )
}
