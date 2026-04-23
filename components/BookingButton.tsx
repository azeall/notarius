'use client'
import { useState } from 'react'
import BookingModal from './BookingModal'

const BASE_CLASS =
  'booking-cta relative inline-flex items-center justify-center ' +
  'font-sans font-bold uppercase rounded-xl ' +
  'cursor-pointer overflow-hidden whitespace-nowrap ' +
  'transition-[transform,filter,box-shadow] duration-200 ' +
  'hover:-translate-y-0.5 active:scale-[0.98]'

const SIZE: Record<'sm' | 'md', string> = {
  // compact — for header nav
  sm: 'text-[10px] tracking-[0.18em] px-4 py-2',
  // full — for hero / section CTAs
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
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${BASE_CLASS} ${SIZE[size]} ${className}`}
        style={{ ...PREMIUM_STYLE, ...style }}
      >
        Записаться на приём
      </button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  )
}
