'use client'
import { useEffect, useState } from 'react'
import { notary } from '@/lib/data'

/**
 * Карта Яндекса, которая не грузится сама.
 *
 * Встроенная карта — это сторонний скрипт: открыв страницу, посетитель
 * отдаёт Яндексу свой адрес, заголовки и куки, ничего для этого не сделав.
 * Аналитика на сайте уже ждёт согласия (YandexMetrika), а карта грузилась
 * сразу — то есть согласие спрашивали, но не у всех, кому оно нужно.
 *
 * Пока согласия нет, на месте карты стоит адрес и две ссылки: показать карту
 * здесь или открыть её у Яндекса. Нажатие на «Показать карту» — это и есть
 * согласие на встраивание, но только на текущий просмотр: в хранилище ничего
 * не пишется, и на следующей странице спросим снова.
 */
export default function YandexMap({
  className = '',
  style,
  title = 'Карта проезда',
}: {
  className?: string
  style?: React.CSSProperties
  title?: string
}) {
  const [allowed, setAllowed] = useState(false)

  // Стили карты приходят от места вызова, и среди них бывает filter: одна
  // из веток перекрашивает карту под тёмное оформление. К заглушке этот
  // фильтр применять нельзя — он выворачивает наизнанку её текст.
  const { filter: _mapFilter, ...placeholderStyle } = style ?? {}

  useEffect(() => {
    try {
      if (localStorage.getItem('cookie-consent') === 'accepted') setAllowed(true)
    } catch {
      /* ignore */
    }
    const onAccept = () => setAllowed(true)
    window.addEventListener('cookie-consent-accepted', onAccept)
    return () => window.removeEventListener('cookie-consent-accepted', onAccept)
  }, [])

  if (!allowed) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          textAlign: 'center',
          padding: 24,
          background: 'rgba(127,127,127,0.08)',
          ...placeholderStyle,
        }}
      >
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{notary.address}</p>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.85, maxWidth: '46ch', lineHeight: 1.5 }}>
          Карту показывает Яндекс. Открыв её, вы передадите ему сведения о своём посещении.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => setAllowed(true)}
            style={{
              border: '1px solid currentColor',
              background: 'transparent',
              color: 'inherit',
              font: 'inherit',
              fontSize: 13,
              padding: '9px 16px',
              cursor: 'pointer',
            }}
          >
            Показать карту
          </button>
          <a
            href={`https://yandex.ru/maps/?text=${encodeURIComponent(notary.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: '1px solid currentColor',
              color: 'inherit',
              textDecoration: 'none',
              fontSize: 13,
              padding: '9px 16px',
            }}
          >
            Открыть в Яндекс.Картах
          </a>
        </div>
      </div>
    )
  }

  return (
    <iframe
      src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen
      title={title}
      className={className}
      style={style}
    />
  )
}
