'use client'
import { useState } from 'react'
import BookingModal from './BookingModal'

const PREMIUM_CLASS =
  'booking-cta relative inline-flex items-center justify-center gap-4 ' +
  'font-sans font-bold tracking-[0.22em] uppercase ' +
  'text-[11px] sm:text-[12px] ' +
  'px-7 sm:px-10 py-4 sm:py-[18px] ' +
  'rounded-full ' +
  'cursor-pointer overflow-hidden whitespace-nowrap ' +
  'transition-[transform,filter,box-shadow] duration-200 ' +
  'hover:-translate-y-0.5 active:scale-[0.98]'

const PREMIUM_STYLE: React.CSSProperties = {
  background: 'linear-gradient(180deg, #c8a03c 0%, #a07828 100%)',
  color: '#1a1307',
  boxShadow: '0 12px 40px -12px rgba(200,160,60,0.55)',
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
  const [open, setOpen] = useState(false)
  const sizeOverride =
    size === 'sm'
      ? 'text-[11px] tracking-[0.20em] px-5 py-3'
      : ''

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${PREMIUM_CLASS} ${sizeOverride} ${className}`}
        style={{ ...PREMIUM_STYLE, ...style }}
      >
        Записаться на приём
      </button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  )
}
