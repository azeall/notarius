'use client'
import { useState } from 'react'
import BookingModal from './BookingModal'

const BASE_CLASS =
  'booking-cta relative inline-flex items-center justify-center ' +
  'font-sans font-bold uppercase rounded-xl ' +
  'cursor-pointer overflow-hidden whitespace-nowrap ' +
  'transition-[transform,filter,box-shadow] duration-200 ' +
  'hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98] ' +
  'bg-gold text-white'

const SIZE: Record<'sm' | 'md', string> = {
  sm: 'text-[11px] tracking-[0.20em] px-6 py-3',
  md: 'text-[11px] sm:text-[12px] tracking-[0.22em] px-7 sm:px-10 py-4 sm:py-[18px]',
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
        style={{ boxShadow: '0 10px 26px -12px rgba(0,0,0,0.40)', ...style }}
      >
        Записаться на приём
      </button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  )
}
