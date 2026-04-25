'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const YM_ID = 108757765

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export default function YandexMetrika() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    ;(function (m: Window & { [k: string]: unknown }, e: Document, t: string, r: string, i: string) {
      m[i] = m[i] || function (...a: unknown[]) { (m[i] as { a?: unknown[] }).a = (m[i] as { a?: unknown[] }).a || []; (m[i] as { a: unknown[] }).a.push(a) }
      ;(m[i] as { l?: number }).l = 1 * (new Date() as unknown as number)
      const scripts = e.getElementsByTagName(t) as HTMLCollectionOf<HTMLScriptElement>
      for (let j = 0; j < scripts.length; j++) { if (scripts[j].src === r) return }
      const k = e.createElement(t) as HTMLScriptElement
      const a = e.getElementsByTagName(t)[0]
      k.async = true; k.src = r; a?.parentNode?.insertBefore(k, a)
    })(window as Window & { [k: string]: unknown }, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

    window.ym?.(YM_ID, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    })
  }, [])

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : '')
    window.ym?.(YM_ID, 'hit', url)
  }, [pathname, searchParams])

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
