import { ImageResponse } from 'next/og'
import { notary } from '@/lib/data'

export const runtime = 'edge'
export const alt = `Нотариус ${notary.name} · Москва`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Загружаем TTF-файлы шрифтов через Google Fonts CSS API:
// 1) просим CSS с нужными начертаниями и только теми символами, которые
//    реально отрисуем (через &text=...), чтобы ответ был маленьким;
// 2) вытаскиваем URL из "src: url(...) format('truetype')";
// 3) скачиваем сам TTF и отдаём в ImageResponse.
async function loadGoogleFont(
  family: string,
  weights: string,
  italic: boolean,
  text: string,
): Promise<ArrayBuffer> {
  const italicAxis = italic ? 'ital,wght@1,' : 'wght@'
  const url =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${italicAxis}${weights}` +
    `&text=${encodeURIComponent(text)}&display=swap`

  const css = await (await fetch(url, {
    headers: {
      // User-Agent определяет, какой формат отдаст Google Fonts.
      // Нам нужен TTF (truetype), его понимает Satori напрямую.
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/96.0 Safari/537.36',
    },
  })).text()

  const match = css.match(/src:\s*url\((https:\/\/[^)]+\.ttf)\)/)
  if (!match) throw new Error(`Font file not found for ${family}`)
  const res = await fetch(match[1])
  if (!res.ok) throw new Error(`Font fetch failed ${res.status}`)
  return res.arrayBuffer()
}

export default async function OpengraphImage() {
  const [surname, ...restParts] = notary.name.trim().split(/\s+/)
  const rest = restParts.join(' ')

  // Текст, который реально попадёт на картинку (для &text=).
  const serifText =
    surname + ' ' + rest + ' ' +
    'Нотариус города Москвы приём по записи'
  const sansText =
    'НОТАРИУС · МОСКВА Нотариальная контора с 2008 года ' +
    'Сделки наследство доверенности копии онлайн-запись на приём ' +
    notary.phone + ' ' + notary.address +
    'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ' +
    '0123456789.,·—–-()+·: '

  const [playfairRegular, playfairItalic, manropeRegular, manropeBold] = await Promise.all([
    loadGoogleFont('Playfair Display', '500', false, serifText),
    loadGoogleFont('Playfair Display', '500', true,  serifText),
    loadGoogleFont('Manrope', '500', false, sansText),
    loadGoogleFont('Manrope', '700', false, sansText),
  ])

  const GOLD = '#c8a03c'
  const GOLD_LIGHT = '#e0bd5f'
  const CREAM = '#f0ece4'
  const SLATE = '#8a9ab5'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '72px 96px',
          color: CREAM,
          fontFamily: '"Manrope"',
          background:
            'radial-gradient(ellipse 60% 45% at 85% 18%, rgba(200,160,60,0.22) 0%, transparent 65%),' +
            'radial-gradient(ellipse 70% 55% at 12% 88%, rgba(200,160,60,0.14) 0%, transparent 65%),' +
            'linear-gradient(180deg, #0d1b3e 0%, #0a1632 55%, #050c1c 100%)',
          position: 'relative',
        }}
      >
        {/* Верхняя золотая тонкая линия */}
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

        {/* Монограмма сверху */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 96,
            height: 96,
            marginBottom: 32,
            border: `2px solid ${GOLD}`,
            color: GOLD,
            fontFamily: '"Playfair"',
            fontSize: 60,
            lineHeight: 1,
            position: 'relative',
          }}
        >
          Б
          <div style={{ position: 'absolute', top: -1, left: -1, width: 12, height: 12, borderTop: `2px solid ${GOLD}`, borderLeft: `2px solid ${GOLD}` }} />
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderBottom: `2px solid ${GOLD}`, borderRight: `2px solid ${GOLD}` }} />
        </div>

        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            color: GOLD,
            fontSize: 20,
            letterSpacing: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: 36,
          }}
        >
          Нотариус · Москва
        </div>

        {/* Имя — Playfair italic для фамилии, regular для имени-отчества */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: '"Playfair"',
            lineHeight: 1,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: 'flex',
              color: GOLD_LIGHT,
              fontStyle: 'italic',
              fontSize: 120,
            }}
          >
            {surname}
          </div>
          {rest && (
            <div
              style={{
                display: 'flex',
                color: CREAM,
                fontSize: 72,
                marginTop: 14,
                letterSpacing: -1,
              }}
            >
              {rest}
            </div>
          )}
        </div>

        {/* Орнамент */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 36 }}>
          <div style={{ width: 96, height: 2, background: GOLD, opacity: 0.6 }} />
          <div
            style={{
              width: 12,
              height: 12,
              border: `2px solid ${GOLD}`,
              transform: 'rotate(45deg)',
            }}
          />
          <div style={{ width: 96, height: 2, background: GOLD, opacity: 0.6 }} />
        </div>

        {/* Подзаголовок */}
        <div
          style={{
            display: 'flex',
            fontFamily: '"Playfair"',
            fontStyle: 'italic',
            color: SLATE,
            fontSize: 30,
            marginBottom: 48,
          }}
        >
          Нотариус города Москвы
        </div>

        {/* Нижний ряд */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            paddingTop: 28,
            borderTop: '1px solid rgba(184,154,90,0.30)',
            width: '100%',
            maxWidth: 900,
          }}
        >
          <div
            style={{
              display: 'flex',
              color: GOLD,
              fontSize: 16,
              letterSpacing: 6,
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            Приём по записи
          </div>
          <div style={{ display: 'flex', width: 1, height: 28, background: 'rgba(184,154,90,0.30)' }} />
          <div style={{ display: 'flex', color: CREAM, fontSize: 34, fontFamily: '"Playfair"' }}>
            {notary.phone}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Playfair', data: playfairRegular, style: 'normal', weight: 500 },
        { name: 'Playfair', data: playfairItalic,  style: 'italic', weight: 500 },
        { name: 'Manrope',  data: manropeRegular,  style: 'normal', weight: 500 },
        { name: 'Manrope',  data: manropeBold,     style: 'normal', weight: 700 },
      ],
    },
  )
}
