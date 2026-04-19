'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { notary } from '@/lib/data'

const navLinks = [
  { href: '/',         label: 'Главная' },
  { href: '/services', label: 'Услуги' },
  { href: '/prices',   label: 'Тарифы' },
  { href: '/about',    label: 'О конторе' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="bg-navy text-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md"
        >
          <div className="w-9 h-9 flex-shrink-0">
            <Image
              src="/notarius4.png"
              alt="Логотип нотариуса"
              width={36}
              height={36}
              className="object-contain w-9 h-9"
            />
          </div>
          <span className="font-serif text-lg font-bold tracking-wide hover:text-gold transition-colors">
            {notary.name}
          </span>
        </Link>

        <nav className="hidden md:flex gap-1" aria-label="Основная навигация">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                text-sm uppercase tracking-wider px-3 py-2 rounded-md transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
                ${isActive(link.href)
                  ? 'text-gold font-semibold'
                  : 'hover:text-gold hover:bg-white/5'
                }
              `}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer min-h-[44px] min-w-[44px] items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="md:hidden bg-navy-dark px-4 pb-4 flex flex-col gap-1"
          aria-label="Мобильная навигация"
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                text-sm uppercase tracking-wider px-3 py-3 rounded-md transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
                ${isActive(link.href)
                  ? 'text-gold font-semibold bg-white/5'
                  : 'hover:text-gold hover:bg-white/5'
                }
              `}
              aria-current={isActive(link.href) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
