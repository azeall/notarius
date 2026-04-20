'use client'
import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add('in')

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) reveal(e.target) }),
      { threshold: 0.06 }
    )

    const observe = () =>
      document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    observe()

    // When user returns to this tab — show any elements that are now in view
    const onVisibility = () => {
      if (!document.hidden) {
        document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.top < window.innerHeight * 1.3) reveal(el)
        })
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Safety net: after 2.5 s reveal everything that's still hidden
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach(reveal)
    }, 2500)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      clearTimeout(timer)
    }
  }, [])

  return null
}
