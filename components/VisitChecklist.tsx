'use client'
import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { checklists } from '@/lib/checklists'
import { notary } from '@/lib/data'

const STORAGE_KEY = 'visit-checklist-v1'

export default function VisitChecklist() {
  const [activeId, setActiveId] = useState(checklists[0].id)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [hydrated, setHydrated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

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
                  background: isActive ? 'rgba(29,158,117,0.14)' : '#ffffff',
                  color: isActive ? '#2c2c2c' : 'rgb(var(--muted-rgb))',
                  border: `1px solid ${isActive ? 'rgb(var(--violet-rgb))' : 'rgba(29,158,117,0.12)'}`,
                }}
              >
                {c.title}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Checklist */}
      <div data-checklist className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgba(29,158,117,0.15)' }}>
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="font-serif text-2xl font-bold text-cream mb-1">{active.title}</h2>
            <p className="text-sm text-slate">Отметьте подготовленные документы</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              title="Сформировать чистый лист со списком документов и распечатать или сохранить в PDF"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gold rounded-lg px-3.5 py-2 hover:bg-gold-light transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Распечатать памятку
            </button>
            <button
              onClick={resetActive}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate rounded-lg px-3 py-2 hover:text-cream transition-all"
              style={{ border: '1px solid rgba(29,158,117,0.18)' }}
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
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: progress === 100 ? '#4f9d7a' : 'rgb(var(--violet-rgb))',
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
                    background: isChecked ? 'rgba(79,157,122,0.10)' : 'rgba(0,0,0,0.02)',
                    borderColor: isChecked ? 'rgba(79,157,122,0.40)' : 'rgba(29,158,117,0.12)',
                  }}
                >
                  <span
                    className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 grid place-items-center transition-all"
                    style={{
                      background: isChecked ? '#4f9d7a' : 'transparent',
                      border: `1.5px solid ${isChecked ? '#4f9d7a' : 'rgba(29,158,117,0.35)'}`,
                    }}
                  >
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-sm font-medium transition-colors"
                        style={{
                          color: isChecked ? 'rgb(var(--muted-b-rgb))' : '#2c2c2c',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {item.label}
                      </span>
                      {item.optional && (
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-slate rounded px-1.5 py-0.5" style={{ border: '1px solid rgba(29,158,117,0.20)' }}>
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
        <p className="text-xs text-slate/70 mt-2 leading-relaxed print:hidden">
          <span className="text-gold">«Распечатать памятку»</span> — соберёт чистый лист со списком документов
          и контактами нотариуса. Его удобно распечатать или сохранить в PDF и взять с собой.
        </p>
      </div>

      {/* Печатаемая памятка — рендерится в body, видна только при печати */}
      {mounted &&
        createPortal(
          <div className="print-sheet">
            <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#111', lineHeight: 1.5 }}>
              {/* Шапка */}
              <div style={{ borderBottom: '2px solid #1D9E75', paddingBottom: 14, marginBottom: 22 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#8a6d2f', marginBottom: 4 }}>
                  Памятка к визиту · {notary.title}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>Нотариус {notary.name}</div>
                <div style={{ fontSize: 13, color: '#444', marginTop: 6 }}>
                  {notary.address} · тел. {notary.phone}
                </div>
              </div>

              {/* Заголовок услуги */}
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
                Документы: {active.title}
              </div>

              {/* Список документов */}
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {active.items.map(item => {
                  const isChecked = !!checked[keyFor(item.label)]
                  return (
                    <li key={item.label} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid #e5e5e5', breakInside: 'avoid' }}>
                      <span
                        style={{
                          width: 15,
                          height: 15,
                          flexShrink: 0,
                          marginTop: 2,
                          border: '1.5px solid #555',
                          borderRadius: 3,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          lineHeight: 1,
                          color: '#111',
                        }}
                      >
                        {isChecked ? '✓' : ''}
                      </span>
                      <span>
                        <span style={{ fontSize: 14 }}>
                          {item.label}
                          {item.optional && <span style={{ color: '#888', fontStyle: 'italic' }}> — при необходимости</span>}
                        </span>
                        {item.note && <span style={{ display: 'block', fontSize: 12, color: '#666' }}>{item.note}</span>}
                      </span>
                    </li>
                  )
                })}
              </ul>

              {/* Подвал */}
              <div style={{ marginTop: 22, fontSize: 12, color: '#444' }}>
                <div style={{ marginBottom: 4 }}>• Берите оригиналы документов — копии для большинства действий не подходят.</div>
                <div style={{ marginBottom: 4 }}>• Приём по предварительной записи: {notary.phone}.</div>
                <div>• Пункты «при необходимости» нужны не во всех ситуациях — уточните при записи.</div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
