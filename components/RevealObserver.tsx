'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Одностороннее проявление: элемент показывается при входе в зону видимости
 * (со стаггером data-reveal-delay) и дальше остаётся показанным.
 *
 * Раньше reveal был двусторонним — блок гасился, стоило увести его за край
 * экрана. На витрине это выглядит эффектно, а здесь человек прокручивает
 * назад, чтобы перечитать перечень документов, и видит пустоту.
 *
 * Страховка на случай, если IntersectionObserver не сработает: элементы,
 * попавшие в кадр к моменту запуска, показываются сразу — иначе .reveal
 * с opacity:0 оставил бы страницу пустой.
 */
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!els.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const raw = el.dataset.revealDelay
          el.style.transitionDelay = raw ? `${parseFloat(raw) || 0}ms` : ''
          el.classList.add('in')
          io.unobserve(el)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -12% 0px' },
    )

    els.forEach(el => io.observe(el))

    return () => {
      io.disconnect()
      els.forEach(el => { el.style.transitionDelay = '' })
    }
  }, [pathname])

  return null
}
