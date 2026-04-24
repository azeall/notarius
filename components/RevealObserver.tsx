'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    let io: IntersectionObserver | null = null
    let safetyTimer: ReturnType<typeof setTimeout> | null = null
    let visibilityHandler: (() => void) | null = null
    const cleanupTimers: ReturnType<typeof setTimeout>[] = []

    const reveal = (el: Element) => {
      const htmlEl = el as HTMLElement
      // Repurpose React's animationDelay inline style as transitionDelay
      // so stagger values set in component JSX actually work with the
      // CSS transition-based reveal system.
      const animDelay = htmlEl.style.animationDelay
      if (animDelay) {
        htmlEl.style.transitionDelay = animDelay
        const delayMs = parseFloat(animDelay) || 0
        // Remove transitionDelay after the element has finished animating in,
        // so that subsequent hover/focus transitions aren't delayed.
        const t = setTimeout(
          () => { htmlEl.style.transitionDelay = '' },
          delayMs + 850
        )
        cleanupTimers.push(t)
      }
      el.classList.add('in')
    }

    const setupTimer = setTimeout(() => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              reveal(e.target)
              io?.unobserve(e.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )

      document.querySelectorAll('.reveal').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 1.05) {
          reveal(el)
        } else {
          io!.observe(el)
        }
      })

      visibilityHandler = () => {
        if (!document.hidden) {
          document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
            const r = el.getBoundingClientRect()
            if (r.top < window.innerHeight * 1.2) reveal(el)
          })
        }
      }
      document.addEventListener('visibilitychange', visibilityHandler)

      safetyTimer = setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in)').forEach((el) => reveal(el))
      }, 2500)
    }, 100)

    return () => {
      clearTimeout(setupTimer)
      if (safetyTimer) clearTimeout(safetyTimer)
      cleanupTimers.forEach((t) => clearTimeout(t))
      if (io) io.disconnect()
      if (visibilityHandler)
        document.removeEventListener('visibilitychange', visibilityHandler)
      document.querySelectorAll('.reveal.in').forEach((el) => {
        el.classList.remove('in')
        ;(el as HTMLElement).style.transitionDelay = ''
      })
    }
  }, [pathname])

  return null
}
