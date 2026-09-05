import { ImageResponse } from 'next/og'
import { notary } from '@/lib/data'

export const runtime = 'edge'
export const alt = `Нотариус ${notary.name} · Москва`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

export default async function OpengraphImage() {
  // PT Serif (static TTF, поддерживает кириллицу) из официального репозитория Google Fonts
  const [serifBold, serifRegular] = await Promise.all([
    loadFont('https://raw.githubusercontent.com/google/fonts/main/ofl/ptserif/PTSerif-Bold.ttf'),
    loadFont('https://raw.githubusercontent.com/google/fonts/main/ofl/ptserif/PTSerif-Regular.ttf'),
  ])

  const fonts = [
    ...(serifBold ? [{ name: 'PT Serif', data: serifBold, weight: 700 as const, style: 'normal' as const }] : []),
    ...(serifRegular ? [{ name: 'PT Serif', data: serifRegular, weight: 400 as const, style: 'normal' as const }] : []),
  ]

  const surname = notary.name.trim().split(/\s+/)[0]
  const initial = surname.charAt(0)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 55%, #e8f5f0 100%)',
          padding: '64px 72px',
          fontFamily: 'PT Serif',
          position: 'relative',
        }}
      >
        {/* Gold top hairline */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, transparent, #1D9E75, transparent)' }} />

        {/* Top row: monogram + chamber */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              width: 92,
              height: 92,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #1D9E75',
              color: '#27b585',
              fontSize: 52,
              fontWeight: 700,
            }}
          >
            {initial}
          </div>
          <div style={{ display: 'flex', color: '#167859', fontSize: 22, letterSpacing: 4, textTransform: 'uppercase' }}>
            Нотариальная контора
          </div>
        </div>

        {/* Name */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: 'rgb(var(--text-rgb))', fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
            {notary.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
            <div style={{ width: 64, height: 2, background: 'rgb(var(--violet-rgb))' }} />
            <div style={{ display: 'flex', color: 'rgb(var(--muted-rgb))', fontSize: 30, marginLeft: 20 }}>
              Нотариус города Москвы
            </div>
          </div>
        </div>

        {/* Bottom row: services + phone */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', color: 'rgb(var(--muted-rgb))', fontSize: 26 }}>
            Сделки · Наследство · Доверенности · Копии
          </div>
          <div style={{ display: 'flex', color: '#27b585', fontSize: 34, fontWeight: 700 }}>
            {notary.phone}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  )
}
