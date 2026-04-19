'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
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

  return (
    <header className="bg-navy text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
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

        <nav className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-wider hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col gap-1 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Открыть меню"
        >
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-navy-dark px-4 pb-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-wider hover:text-gold transition-colors"
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
