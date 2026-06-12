'use client'
import { useState } from 'react'
import BookingModal from './BookingModal'

const SIZE: Record<'sm' | 'md', string> = {
  sm: 'text-[13px] px-6 py-3',
  md: 'text-[15px] px-[34px] py-[18px]',
}

/** Кнопка в стиле макета: фиолетовый градиент + пробегающий блик на hover. */
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
      <style>{`
        .lv-btn { position: relative; overflow: hidden; transition: transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s ease; }
        .lv-btn::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.28) 50%, transparent 70%);
          transform: translateX(-130%); transition: transform .9s ease;
        }
        .lv-btn:hover { transform: translateY(-3px); box-shadow: 0 26px 48px -16px rgba(83,74,183,.95), inset 0 1px 0 rgba(255,255,255,.3); }
        .lv-btn:hover::after { transform: translateX(130%); }
      `}</style>
      <button
        onClick={() => setOpen(true)}
        className={`lv-btn inline-flex items-center justify-center font-sans font-semibold text-white rounded cursor-pointer whitespace-nowrap ${SIZE[size]} ${className}`}
        style={{
          background: 'linear-gradient(180deg, #5b51c2, #4a429f)',
          letterSpacing: '0.02em',
          boxShadow: '0 18px 38px -16px rgba(83,74,183,.85), inset 0 1px 0 rgba(255,255,255,.22)',
          ...style,
        }}
      >
        Записаться на приём
      </button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  )
}
