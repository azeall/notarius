'use client'
import { useState } from 'react'
import BookingModal from './BookingModal'

const SIZE: Record<'sm' | 'md', string> = {
  sm: 'text-[13px] px-5 py-2.5',
  md: 'text-[15px] px-7 py-4',
}

/** Основная кнопка записи: сплошная графитовая плашка, на наведении — акцент. */
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
        /* Основная кнопка: сплошной графит, без градиента и без блика.
           Градиент с пробегающим бликом — приём распродажи; здесь он обещал
           скидку там, где речь о нотариальном тарифе. */
        .lv-btn{position:relative;transition:background-color .3s ease,transform .15s ease;}
        .lv-btn:hover{background:rgb(var(--violet-rgb)) !important;}
        .lv-btn:active{transform:translateY(1px);}
      `}</style>
      <button
        onClick={() => setOpen(true)}
        className={`lv-btn inline-flex items-center justify-center font-sans font-medium cursor-pointer whitespace-nowrap ${SIZE[size]} ${className}`}
        style={{
          background: 'rgb(var(--text-rgb))',
          color: 'rgb(var(--bg-rgb))',
          border: '1px solid rgb(var(--text-rgb))',
          borderRadius: '2px',
          letterSpacing: '0.01em',
          ...style,
        }}
      >
        Записаться на приём
      </button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  )
}
