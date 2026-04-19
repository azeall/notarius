'use client'
import { useState } from 'react'
import BookingModal from './BookingModal'

export default function BookingButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ??
          'inline-flex items-center justify-center gap-2 bg-gold text-white font-semibold px-8 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy min-h-[44px]'
        }
      >
        Записаться на приём
      </button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  )
}
