import { ImageResponse } from 'next/og'
import { notary } from '@/lib/data'

export const runtime = 'edge'
export const alt = `Нотариус ${notary.name} · Москва`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const [surname, ...restParts] = notary.name.trim().split(/\s+/)
  const rest = restParts.join(' ')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'radial-gradient(ellipse 60% 50% at 85% 20%, rgba(200,160,60,0.20) 0%, transparent 60%),' +
            'radial-gradient(ellipse 80% 60% at 15% 85%, rgba(200,160,60,0.10) 0%, transparent 60%),' +
            'linear-gradient(180deg, #0d1b3e 0%, #0a1632 55%, #050c1c 100%)',
          padding: '70px 88px',
          color: '#f0ece4',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Gold hairline top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #b89a5a, transparent)',
          }}
        />

        {/* Monogram + eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              border: '2px solid #b89a5a',
              color: '#b89a5a',
              fontSize: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'serif',
            }}
          >
            Б
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'sans-serif',
                color: '#b89a5a',
                fontSize: 22,
                letterSpacing: 8,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Нотариус · Москва
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'sans-serif',
                color: '#6b7895',
                fontSize: 18,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              Нотариальная контора · с 2008 года
            </div>
          </div>
        </div>

        {/* Name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 70,
            lineHeight: 1.05,
          }}
        >
          <div style={{ display: 'flex', color: '#e0bd5f', fontSize: 110, fontStyle: 'italic' }}>
            {surname}
          </div>
          {rest && (
            <div style={{ display: 'flex', color: '#f0ece4', fontSize: 96, marginTop: 8 }}>
              {rest}
            </div>
          )}
        </div>

        {/* Ornament */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 42 }}>
          <div style={{ width: 80, height: 2, background: '#b89a5a', opacity: 0.7 }} />
          <div
            style={{
              width: 12,
              height: 12,
              border: '2px solid #b89a5a',
              transform: 'rotate(45deg)',
            }}
          />
          <div style={{ width: 80, height: 2, background: '#b89a5a', opacity: 0.7 }} />
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            marginTop: 'auto',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 40,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720 }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'sans-serif',
                color: '#b89a5a',
                fontSize: 18,
                letterSpacing: 5,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Запись на приём онлайн
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'sans-serif',
                color: '#f0ece4',
                fontSize: 30,
                fontWeight: 500,
              }}
            >
              Сделки, наследство, доверенности, копии
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'sans-serif',
                color: '#8a9ab5',
                fontSize: 22,
                marginTop: 6,
              }}
            >
              {notary.address}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontFamily: 'sans-serif',
                color: '#6b7895',
                fontSize: 16,
                letterSpacing: 5,
                textTransform: 'uppercase',
              }}
            >
              Приём по записи
            </div>
            <div
              style={{
                display: 'flex',
                color: '#f0ece4',
                fontSize: 44,
                fontFamily: 'serif',
              }}
            >
              {notary.phone}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
