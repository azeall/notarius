'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    // Store all cleanup-needed refs in closure so the return fn can reach them
    let io: IntersectionObserver | null = null
    let safetyTimer: ReturnType<typeof setTimeout> | null = null
    let visibilityHandler: (() => void) | null = null

    const reveal = (el: Element) => el.classList.add('in')

    const setupTimer = setTimeout(() => {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              reveal(e.target)
              io?.unobserve(e.target)
            }
          }),
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )

      document.querySelectorAll('.reveal').forEach((el) => {
        const r = el.getBoundingClientRect()
        // Reveal immediately if already in or just below the viewport
        if (r.top < window.innerHeight * 1.05) {
          reveal(el)
        } else {
          io!.observe(el)
        }
      })

      // Re-check on tab focus
      visibilityHandler = () => {
        if (!document.hidden) {
          document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
            const r = el.getBoundingClientRect()
            if (r.top < window.innerHeight * 1.2) reveal(el)
          })
        }
      }
      document.addEventListener('visibilitychange', visibilityHandler)

      // Safety net: reveal anything still hidden after 2.5s
      safetyTimer = setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in)').forEach(reveal)
      }, 2500)
    }, 100)

    return () => {
      clearTimeout(setupTimer)
      if (safetyTimer) clearTimeout(safetyTimer)
      if (io) io.disconnect()
      if (visibilityHandler)
        document.removeEventListener('visibilitychange', visibilityHandler)
      // Reset so elements animate fresh on next route visit
      document.querySelectorAll('.reveal.in').forEach((el) =>
        el.classList.remove('in')
      )
    }
  }, [pathname])

  return null
}
