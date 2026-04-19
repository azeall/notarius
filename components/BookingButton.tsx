'use client'
import { useState } from 'react'
import BookingModal from './BookingModal'

export default function BookingButton({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? 'inline-block bg-gold text-navy font-semibold px-8 py-3 hover:brightness-110 transition-all'}
        style={style}
      >
        Записаться на приём
      </button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  )
}
