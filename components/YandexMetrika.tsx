'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
  }
}

const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID)

export default function YandexMetrika() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!YM_ID) return
    ;(function (m: Window, e: Document, t: string, r: string, i: string) {
      const w = m as Window & { [key: string]: unknown }
      w[i] = w[i] || function (...args: unknown[]) { (w[i] as { a?: unknown[] }).a = (w[i] as { a?: unknown[] }).a || []; ((w[i] as { a?: unknown[] }).a!).push(args) }
      ;(w[i] as { l?: number }).l = 1 * (new Date() as unknown as number)
      const scripts = e.getElementsByTagName(t) as HTMLCollectionOf<HTMLScriptElement>
      for (let j = 0; j < scripts.length; j++) { if (scripts[j].src === r) return }
      const k = e.createElement(t) as HTMLScriptElement
      const a = e.getElementsByTagName(t)[0]
      k.async = true
      k.src = r
      a?.parentNode?.insertBefore(k, a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

    window.ym?.(YM_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    })
  }, [])

  useEffect(() => {
    if (!YM_ID) return
    window.ym?.(YM_ID, 'hit', `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`)
  }, [pathname, searchParams])

  if (!YM_ID) return null

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${YM_ID}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  )
}
