'use client'
import { useEffect, useRef, useState } from 'react'
import SectionMark from './SectionMark'

/**
 * Сцена приёма: стол нотариуса сверху.
 *
 * Раньше на этом месте закреплялся экран, внутри которого сменялись три
 * карточки текста. Человек отдавал три экрана прокрутки и узнавал три
 * предложения — показать было нечего. Здесь та же мысль показана предметами:
 * приходят документы, ложится бланк, набирается текст, ставится подпись,
 * прижимается печать, лист делится на два экземпляра.
 *
 * Механика своя, без GSAP. ScrollTrigger на этом сайте намеренно выключен на
 * телефонах и при prefers-reduced-motion, а сцена должна работать и там —
 * значит зависеть от него нельзя. Хватает position: sticky и доли прокрутки,
 * посчитанной в кадровом цикле.
 *
 * Состояние вычисляется от доли трека, а не накапливается по событиям:
 * прокрутка вверх честно откатывает сцену.
 */

interface Frame { n: string; t: string; d: string }

const FRAMES: Frame[] = [
  { n: '01', t: 'Вы приходите', d: 'Стол пуст, дело ещё не заведено. Достаточно паспорта и того, что мы назвали при записи.' },
  { n: '02', t: 'Сначала проверка', d: 'Паспорт сверяется, выписка из ЕГРН запрашивается по своим каналам, залоги и дееспособность — по реестрам.' },
  { n: '03', t: 'Потом текст', d: 'Нотариус пишет документ сам и читает его вслух. Формулировку правим до подписи, а не после сделки.' },
  { n: '04', t: 'Подпись и печать', d: 'Подпись ставится при нотариусе. Потом никто не скажет, что подписывал не он и не понимал, что подписывает.' },
  { n: '05', t: 'Два экземпляра', d: 'Один остаётся у вас, второй — в деле конторы. Сведения уходят в единую систему нотариата: потеряете свой — выдадим дубликат.' },
]

const MARKS = ['Паспорт', 'ЕГРН', 'Залоги', 'Дееспособность']

export default function DeskScene() {
  const trackRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [frame, setFrame] = useState(0)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const mq = (q: string) =>
      typeof window.matchMedia === 'function' ? window.matchMedia(q) : null
    if (mq('(prefers-reduced-motion: reduce)')?.matches) {
      // Конечный кадр и обычная прокрутка: сцена ничего не прячет, подписи
      // всех кадров в разметке и так видны.
      setStill(true)
      setFrame(FRAMES.length - 1)
      return
    }

    let raf = 0
    let last = -1

    const draw = () => {
      raf = 0
      const track = trackRef.current
      const stage = stageRef.current
      if (!track || !stage) return
      const rect = track.getBoundingClientRect()
      const total = track.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -rect.top / (total || 1)))
      stage.style.setProperty('--p', p.toFixed(4))
      const f = Math.min(FRAMES.length - 1, Math.floor(p * FRAMES.length))
      if (f !== last) { last = f; setFrame(f) }
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(draw) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    draw()

    /* ── Шаг за одно движение колеса ──
       Пять кадров на пяти экранах — это полсотни щелчков колеса, чтобы
       пройти сцену. Пока кадр закреплён, одно движение колеса переводит
       сцену на один кадр.

       Слушатель на фазе перехвата и с остановкой распространения: иначе
       следом отработает Lenis, у которого свой обработчик колеса, и кадр
       дёрнется дважды. Прокручиваем тоже через Lenis, если он есть, —
       собственный window.scrollTo дерётся с его инерцией.

       Выходы наружу оставлены: на первом кадре колесо вверх отдаёт прокрутку
       странице, на последнем — вниз. Палец не перехватываем: на телефоне это
       ломает привычную прокрутку, а трек там и без того короткий. */
    const ANCHORS = [0.08, 0.30, 0.50, 0.70, 0.94]
    let lock = false

    const geom = () => {
      const t = trackRef.current
      if (!t) return null
      const r = t.getBoundingClientRect()
      return { top: r.top + window.scrollY, total: t.offsetHeight - window.innerHeight }
    }
    const nearest = (p: number) => {
      let best = 0, dist = 9
      ANCHORS.forEach((a, i) => { const d = Math.abs(a - p); if (d < dist) { dist = d; best = i } })
      return best
    }

    const step = (dir: number, e?: Event) => {
      const g = geom()
      if (!g || g.total <= 0) return
      const y = window.scrollY
      if (y < g.top - 2 || y > g.top + g.total + 2) return
      if (lock) { e?.preventDefault(); return }
      const next = nearest((y - g.top) / g.total) + dir
      if (next < 0 || next >= ANCHORS.length) return
      e?.preventDefault()
      e?.stopPropagation()
      lock = true
      const target = Math.round(g.top + ANCHORS[next] * g.total)
      const lenis = (window as unknown as { __lenis?: { scrollTo?: (t: number, o?: object) => void } }).__lenis
      if (lenis?.scrollTo) lenis.scrollTo(target, { duration: 0.7 })
      else window.scrollTo({ top: target, behavior: 'smooth' })
      window.setTimeout(() => { lock = false }, 780)
    }

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return
      step(e.deltaY > 0 ? 1 : -1, e)
    }
    const onKey = (e: KeyboardEvent) => {
      const down = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' '
      const up = e.key === 'ArrowUp' || e.key === 'PageUp'
      if (!down && !up) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) return
      step(down ? 1 : -1, e)
    }
    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions)
      window.removeEventListener('keydown', onKey)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const cur = FRAMES[frame]

  return (
    <section className={`desk-track${still ? ' is-still' : ''}`} ref={trackRef as never}>
      <div className="desk-stick">
        <div className="wrap desk-grid">
          <div className="desk-copy">
            <SectionMark n="01">Как проходит приём</SectionMark>
            <h2 className="desk-h2">
              Тридцать минут <em>на столе нотариуса</em>
            </h2>

            <ol className="desk-chapters" aria-hidden>
              {FRAMES.map((f, i) => (
                <li key={f.n} data-on={i === frame ? 'true' : undefined}>
                  <i /><span>{f.t}</span>
                </li>
              ))}
            </ol>

            <div className="desk-caption" key={cur.n}>
              <span className="desk-no font-mono">Кадр {cur.n} / 05</span>
              <h3 className="desk-t">{cur.t}</h3>
              <p className="desk-d">{cur.d}</p>
            </div>

            {/* Без движения и без JS человек читает все кадры подряд:
                сцена ничего не прячет, она только показывает. */}
            <ol className="desk-fallback">
              {FRAMES.map(f => (
                <li key={f.n}>
                  <b>{f.n}. {f.t}</b> {f.d}
                </li>
              ))}
            </ol>
          </div>

          <div className="desk-stage" data-frame={frame} ref={stageRef} aria-hidden>
            <span className="desk-lamp" />

            <span className="obj obj--folder">
              <span className="obj-l">Дело</span>
              <span className="obj-n font-mono">№ 77/1201</span>
            </span>

            <span className="obj obj--passport"><span className="obj-l">Паспорт</span></span>
            <span className="obj obj--docs"><span className="obj-l">Документы</span></span>

            <span className="obj obj--form">
              <span className="form-hd font-mono">Нотариальное действие</span>
              <span className="form-lines">
                {[94, 86, 90, 72, 88, 62].map((w, i) => (
                  <i key={i} style={{ width: `${w}%`, transitionDelay: `${i * 90}ms` }} />
                ))}
              </span>
              <svg className="form-sign" viewBox="0 0 120 34" preserveAspectRatio="none">
                <path d="M4 26 C 14 4, 21 4, 24 18 C 27 32, 32 32, 36 17 C 40 2, 47 6, 46 20 C 45 31, 53 30, 60 18 C 67 6, 75 7, 76 19 C 77 30, 84 27, 92 15 C 98 6, 105 8, 108 18" />
              </svg>
              <span className="form-seal">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.4" />
                  <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth=".8" />
                  <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <text x="50" y="57" textAnchor="middle" className="seal-m">С</text>
                </svg>
              </span>
            </span>

            <span className="obj obj--copy">
              <span className="form-hd font-mono">Ваш экземпляр</span>
              <span className="copy-lines"><i /><i /><i /></span>
            </span>

            <span className="desk-marks">
              {MARKS.map((m, i) => (
                <span key={m} className="mark" style={{ transitionDelay: `${i * 110}ms` }}>
                  <i>✓</i>{m}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
