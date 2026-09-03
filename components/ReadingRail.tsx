'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Корешок дела — полоса чтения в поле внутренней страницы.
 *
 * На «Ценах» или «Услугах» человек прокручивает третий экран и не знает ни
 * сколько осталось, ни в каком он разделе: заголовок уехал вверх. Корешок
 * отвечает на оба вопроса, не занимая места в колонке текста.
 *
 * Разделы берутся из самой разметки — все h2 страницы. Отдельный список
 * заголовков разошёлся бы с настоящими при первой же правке текста, а
 * проставлять id на шести страницах ради этого не нужно.
 *
 * Не показывается: на короткой странице, при prefers-reduced-motion,
 * на печати. На узком экране превращается в полоску под шапкой.
 */
export default function ReadingRail() {
  const fillRef = useRef<HTMLSpanElement | null>(null)
  const barRef = useRef<HTMLElement | null>(null)
  const capRef = useRef<HTMLSpanElement | null>(null)
  const [on, setOn] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(() => {
    const mq = (q: string) =>
      typeof window.matchMedia === 'function' ? window.matchMedia(q) : null
    if (mq('(prefers-reduced-motion: reduce)')?.matches) return

    const heads = Array.prototype.slice.call(
      document.querySelectorAll('main h2, main h3.rail-mark')
    ) as HTMLElement[]

    const long = () =>
      document.documentElement.scrollHeight > window.innerHeight * 1.5

    if (heads.length < 2 || !long()) return
    setOn(true)

    let raf = 0
    let lastTitle = ''

    const draw = () => {
      raf = 0
      const total = document.documentElement.scrollHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, window.scrollY / (total || 1)))

      if (fillRef.current) fillRef.current.style.height = (p * 100).toFixed(2) + '%'
      if (barRef.current) {
        const i = barRef.current.firstElementChild as HTMLElement | null
        if (i) i.style.width = (p * 100).toFixed(2) + '%'
      }
      if (capRef.current) capRef.current.style.top = (p * 100).toFixed(2) + '%'

      // Текущий раздел — последний заголовок, который уже прошёл верх экрана.
      let cur = ''
      for (const h of heads) {
        if (h.getBoundingClientRect().top < 140) cur = (h.textContent || '').trim()
        else break
      }
      if (cur !== lastTitle) { lastTitle = cur; setTitle(cur) }
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(draw) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    draw()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <span className="rail" data-on={on ? 'true' : 'false'} aria-hidden>
        <span className="rail-fill" ref={fillRef} />
        <span className="rail-cap" ref={capRef}>
          <b>{title || '—'}</b>
        </span>
      </span>
      <span className="rail-bar" data-on={on ? 'true' : 'false'} ref={barRef as never} aria-hidden>
        <i />
      </span>
    </>
  )
}
