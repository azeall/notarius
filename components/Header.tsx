'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'
import ThemeToggle from '@/components/ThemeToggle'

const navLinks = [
  { href: '/',         label: 'Главная' },
  { href: '/services', label: 'Услуги' },
  { href: '/prices',   label: 'Цены' },
  { href: '/visit',    label: 'Подготовка' },
  { href: '/blog',     label: 'Блог' },
  { href: '/about',    label: 'О конторе' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // usePathname вне роутера отдаёт null — так шапка и падала в тестах.
  // В приложении такого не бывает, но ронять всю шапку из-за подсветки
  // пункта меню незачем.
  const pathname = usePathname() ?? '/'

  // Текущий раздел подсвечивается. Раньше подсветки не было вообще: на любой
  // из семи страниц меню выглядело одинаково, и человек не понимал, где он.
  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

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
        background: scrolled ? 'var(--header-scrolled)' : 'var(--header)',
        borderBottom: '1px solid rgb(var(--rule-rgb))',
      }}
    >
      <style>{`
        .hd-link{color:rgb(var(--muted-rgb));}
        .hd-link::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;
          background:rgb(var(--violet-rgb));transform:scaleX(0);transform-origin:right;
          transition:transform .3s cubic-bezier(.6,0,.3,1);}
        .hd-link:hover{color:rgb(var(--text-rgb));}
        .hd-link:hover::after{transform:scaleX(1);transform-origin:left;}
        .hd-link[data-current]{color:rgb(var(--violet-rgb));font-weight:500;}
        .hd-link[data-current]::after{transform:scaleX(1);}
      `}</style>

      <div
        className="mx-auto flex items-center justify-between gap-3 sm:gap-6 px-5 sm:px-8 md:px-10 py-4 md:py-[18px]"
        style={{ maxWidth: '1340px' }}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 no-underline group min-w-0">
          <div
            className="relative w-10 h-10 grid place-items-center flex-shrink-0 font-serif text-lg"
            style={{ border: '1px solid rgb(var(--text-rgb))', color: 'rgb(var(--text-rgb))' }}
          >
            {/* Corner decorations */}
            <span
              className="absolute top-0 left-0 w-1.5 h-1.5"
              style={{ borderTop: '2px solid rgb(var(--violet-rgb))', borderLeft: '2px solid rgb(var(--violet-rgb))' }}
              aria-hidden
            />
            <span
              className="absolute bottom-0 right-0 w-1.5 h-1.5"
              style={{ borderBottom: '2px solid rgb(var(--violet-rgb))', borderRight: '2px solid rgb(var(--violet-rgb))' }}
              aria-hidden
            />
            {notary.name.trim().charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-[15px] sm:text-[17px] text-cream transition-colors truncate" style={{ letterSpacing: '-0.01em' }}>
              {notary.name}
            </span>
            <span
              className="font-sans text-[10px] tracking-[0.20em] uppercase mt-1 truncate"
              style={{ color: 'rgb(var(--muted-rgb))' }}
            >
              Нотариус · Москва
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-[26px]" aria-label="Основная навигация">
          {navLinks.map(link => {
            const current = isCurrent(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className="hd-link relative py-1.5 text-[14px] transition-colors duration-200 no-underline"
                data-current={current ? '' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <BookingButton size="sm" className="hidden md:inline-flex" />
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5 text-cream"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
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
          style={{ borderTop: '1px solid rgb(var(--violet-rgb) / 0.10)', background: 'var(--header-scrolled)' }}
        >
          {navLinks.map(link => {
            const current = isCurrent(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className="py-4 text-[15px] tracking-[0.02em] transition-colors no-underline border-b"
                style={{
                  borderColor: 'rgb(var(--violet-rgb) / 0.10)',
                  color: current ? 'rgb(var(--violet-rgb))' : 'rgb(var(--text-rgb))',
                  fontWeight: current ? 600 : 500,
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="pt-4">
            <BookingButton className="w-full" />
          </div>
        </nav>
      )}
    </header>
  )
}
