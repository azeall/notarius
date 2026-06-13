'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Двусторонний reveal: элемент проявляется при входе в зону видимости
 * (со стаггером data-reveal-delay) и снова скрывается при уходе —
 * скорость задаётся в CSS (.reveal — медленное скрытие, .reveal.in — проявление).
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
          const el = e.target as HTMLElement
          if (e.isIntersecting) {
            const raw = el.dataset.revealDelay
            el.style.transitionDelay = raw ? `${parseFloat(raw) || 0}ms` : ''
            el.classList.add('in')
          } else {
            el.style.transitionDelay = '0ms'
            el.classList.remove('in')
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -12% 0px' },
    )

    els.forEach(el => io.observe(el))

    return () => {
      io.disconnect()
      els.forEach(el => { el.classList.remove('in'); el.style.transitionDelay = '' })
    }
  }, [pathname])

  return null
}
