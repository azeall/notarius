'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

const navLinks = [
  { href: '/',         label: 'Главная' },
  { href: '/services', label: 'Услуги' },
  { href: '/prices',   label: 'Цены' },
  { href: '/about',    label: 'О конторе' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-40 transition-colors duration-300"
      style={{
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        background: scrolled ? 'rgba(6,16,31,0.92)' : 'rgba(10,22,40,0.82)',
        borderBottom: '1px solid rgba(184,154,90,0.18)',
      }}
    >
      {/* Gold hairline */}
      <div
        className="absolute left-0 right-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(184,154,90,0.55), transparent)' }}
        aria-hidden
      />

      <div
        className="mx-auto flex items-center justify-between gap-6"
        style={{ maxWidth: '1340px', padding: '18px 40px' }}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3.5 no-underline group">
          <div
            className="relative w-10 h-10 grid place-items-center flex-shrink-0 text-gold font-serif text-xl"
            style={{ border: '1px solid #b89a5a' }}
          >
            {/* Corner decorations */}
            <span
              className="absolute top-0 left-0 w-1.5 h-1.5"
              style={{ borderTop: '1px solid #b89a5a', borderLeft: '1px solid #b89a5a' }}
              aria-hidden
            />
            <span
              className="absolute bottom-0 right-0 w-1.5 h-1.5"
              style={{ borderBottom: '1px solid #b89a5a', borderRight: '1px solid #b89a5a' }}
              aria-hidden
            />
            Б
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base text-cream group-hover:text-gold transition-colors">
              {notary.name}
            </span>
            <span
              className="font-sans text-[9px] tracking-[0.28em] uppercase mt-0.5"
              style={{ color: 'rgba(184,154,90,0.70)' }}
            >
              Нотариус · Москва
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-[34px]">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1.5 text-[11px] tracking-[0.20em] uppercase text-slate hover:text-cream transition-colors duration-200 no-underline group"
            >
              {link.label}
              <span
                className="absolute bottom-0 left-0 h-px bg-gold transition-all duration-300"
                style={{ width: 0 }}
                data-underline
              />
            </Link>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <BookingButton
            className="hidden md:inline-flex items-center gap-2.5 font-sans font-bold text-[11px] tracking-[0.20em] uppercase px-5 py-3 bg-gold text-navy hover:bg-gold-light transition-colors active:scale-[0.98] cursor-pointer"
          />
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5 text-gold"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Открыть меню"
          >
            <span className="block w-6 h-0.5 bg-current" />
            <span className="block w-6 h-0.5 bg-current" />
            <span className="block w-4 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden px-5 pb-5 flex flex-col gap-0"
          style={{ borderTop: '1px solid rgba(184,154,90,0.10)', background: 'rgba(6,16,31,0.96)' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3.5 text-[11px] tracking-[0.20em] uppercase text-slate hover:text-gold transition-colors no-underline border-b"
              style={{ borderColor: 'rgba(184,154,90,0.08)' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <BookingButton className="w-full text-center font-bold text-[11px] tracking-[0.20em] uppercase py-3 bg-gold text-navy hover:bg-gold-light transition-colors cursor-pointer" />
          </div>
        </nav>
      )}
    </header>
  )
}
