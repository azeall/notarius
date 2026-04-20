'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const reveal = (el: Element) => el.classList.add('in')

    // Small delay so new page DOM settles after navigation
    const setup = setTimeout(() => {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) reveal(e.target) }),
        { threshold: 0.06 }
      )

      document.querySelectorAll('.reveal').forEach((el) => {
        // Already in viewport → reveal immediately
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 1.1) {
          reveal(el)
        } else {
          io.observe(el)
        }
      })

      // When user returns to this tab → show visible elements
      const onVisibility = () => {
        if (!document.hidden) {
          document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
            const r = el.getBoundingClientRect()
            if (r.top < window.innerHeight * 1.2) reveal(el)
          })
        }
      }
      document.addEventListener('visibilitychange', onVisibility)

      // Safety net: after 2s reveal everything still hidden
      const timer = setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in)').forEach(reveal)
      }, 2000)

      // Store cleanup on the setup timeout so outer cleanup can call it
      ;(setup as unknown as { _cleanup?: () => void })._cleanup = () => {
        io.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
        clearTimeout(timer)
      }
    }, 80)

    return () => {
      clearTimeout(setup)
      const cleanup = (setup as unknown as { _cleanup?: () => void })._cleanup
      if (cleanup) cleanup()
      // Reset all reveal elements so they animate in fresh on next visit
      document.querySelectorAll('.reveal.in').forEach((el) => el.classList.remove('in'))
    }
  }, [pathname]) // Re-run on every route change

  return null
}
