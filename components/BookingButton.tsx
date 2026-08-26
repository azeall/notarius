'use client'
import { useEffect, useState } from 'react'
import { notary } from '@/lib/data'
import { onNotarybotUnavailable, openNotarybot } from '@/lib/notarybot'

const BASE_CLASS =
  'booking-cta relative inline-flex items-center justify-center ' +
  'font-sans font-bold uppercase rounded-xl ' +
  'cursor-pointer overflow-hidden whitespace-nowrap ' +
  'transition-[transform,filter,box-shadow] duration-200 ' +
  'hover:-translate-y-0.5 active:scale-[0.98]'

const SIZE: Record<'sm' | 'md', string> = {
  // header — just a touch smaller than the full CTA
  sm: 'text-[11px] tracking-[0.20em] px-6 py-3',
  // hero / section CTAs
  md: 'text-[11px] sm:text-[12px] tracking-[0.22em] px-7 sm:px-10 py-4 sm:py-[18px]',
}

const PREMIUM_STYLE: React.CSSProperties = {
  background: 'linear-gradient(180deg, #c8a03c 0%, #a07828 100%)',
  color: '#1a1307',
  boxShadow: '0 8px 28px -10px rgba(200,160,60,0.50)',
}

export default function BookingButton({
  className = '',
  style,
  size = 'md',
}: {
  className?: string
  style?: React.CSSProperties
  size?: 'sm' | 'md'
}) {
  const [unavailable, setUnavailable] = useState(false)

  // Второй способ узнать о недоступности виджета — сообщение от скрипта.
  // Проверки при нажатии мало: скрипт может загрузиться и открыть окно,
  // в котором виджет так и не появится. Именно так и было, когда имя сервиса
  // резали провайдеры: посетитель видел ошибку браузера поверх сайта нотариуса.
  useEffect(() => onNotarybotUnavailable(() => setUnavailable(true)), [])

  // Запись идёт только через сервис заявок: он показывает перечень документов
  // и принимает сканы. Если скрипт виджета не загрузился, честно говорим об этом
  // и даём телефон — тупиковой кнопки быть не должно.
  const handleClick = () => {
    if (openNotarybot()) {
      setUnavailable(false)
      return
    }
    setUnavailable(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`${BASE_CLASS} ${SIZE[size]} ${className}`}
        style={{ ...PREMIUM_STYLE, ...style }}
      >
        Записаться на приём
      </button>

      {unavailable && (
        <p className="mt-3 text-[12px] leading-relaxed text-slate">
          Онлайн-запись сейчас недоступна. Позвоните нам:{' '}
          <a href={`tel:${notary.phoneE164}`} className="text-gold no-underline">
            {notary.phone}
          </a>
        </p>
      )}
    </>
  )
}
