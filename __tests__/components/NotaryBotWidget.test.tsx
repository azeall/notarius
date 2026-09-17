/** @jest-environment node */
import { renderToStaticMarkup } from 'react-dom/server'

const originalEnv = process.env

afterEach(() => { process.env = originalEnv })

it.each([
  [undefined, undefined, undefined, 'https://app.guidecode.ru/embed.js', 'demo'],
  ['demo', 'https://live.example', 'real-notary', 'https://app.guidecode.ru/embed.js', 'demo'],
  ['live', 'https://live.example///', 'real-notary', 'https://live.example/embed.js', 'real-notary'],
  ['live', undefined, undefined, null, null],
  ['live', 'https://live.example', undefined, null, null],
  ['live', undefined, 'real-notary', null, null],
])('mode %s with URL %s and slug %s loads only the intended widget', (mode, url, slug, src, notary) => {
  process.env = { ...originalEnv }
  delete process.env.NEXT_PUBLIC_BOOKING_MODE
  delete process.env.NEXT_PUBLIC_NOTARYBOT_URL
  delete process.env.NEXT_PUBLIC_NOTARYBOT_SLUG
  if (mode) process.env.NEXT_PUBLIC_BOOKING_MODE = mode
  if (url) process.env.NEXT_PUBLIC_NOTARYBOT_URL = url
  if (slug) process.env.NEXT_PUBLIC_NOTARYBOT_SLUG = slug

  jest.isolateModules(() => {
    // Reload build-time configuration for each environment.
    const Widget = jest.requireActual('@/components/NotaryBotWidget').default
    const markup = renderToStaticMarkup(<Widget />)
    if (src) {
      expect(markup).toContain(`src="${src}"`)
      expect(markup).toContain(`data-notary="${notary}"`)
      expect(markup).toContain('data-launcher="none"')
    } else {
      expect(markup).toBe('')
      const { openNotarybot } = jest.requireActual('@/lib/notarybot')
      expect(openNotarybot()).toBe(false)
    }
    expect(jest.requireActual('@/components/BookingMode').LIVE_BOOKING).toBe(mode === 'live')
  })
})
