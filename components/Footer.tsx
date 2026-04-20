import Link from 'next/link'
import { notary } from '@/lib/data'

const footerLinks = {
  'Услуги': [
    { href: '/services', label: 'Наследство' },
    { href: '/services', label: 'Недвижимость' },
    { href: '/services', label: 'Доверенности' },
    { href: '/services', label: 'Копии и верность' },
  ],
  'Информация': [
    { href: '/about', label: 'О нотариусе' },
    { href: '/prices', label: 'Цены и тарифы' },
    { href: '/contacts', label: 'Контакты' },
    { href: '/contacts', label: 'Режим работы' },
  ],
  'Контакты': [
    { href: notary.phoneHref, label: notary.phone },
    { href: '/contacts', label: notary.address },
  ],
}

const ORGS = [
  {
    name: 'Федеральная нотариальная палата',
    href: 'https://notariat.ru',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4">
        <path d="M10 2v16M2 6h16M5 6 2 12h6L5 6zM15 6l-3 6h6l-3-6zM2 17h16" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Московская городская нотариальная палата',
    href: 'https://77.notariat.ru',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4">
        <path d="M10 1.5 2 5v5c0 4.5 3.4 8.2 8 9.5 4.6-1.3 8-5 8-9.5V5L10 1.5z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Министерство юстиции Российской Федерации',
    href: 'https://minjust.gov.ru',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4">
        <path d="M2 17h16M4 17V9M8 17V9M12 17V9M16 17V9M10 2l8 6H2l8-6z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer
      className="py-16 sm:py-20 pb-8"
      style={{
        background: '#040d18',
        borderTop: '1px solid rgba(184,154,90,0.12)',
      }}
    >
      <div className="mx-auto px-5 sm:px-8 md:px-10" style={{ maxWidth: '1340px' }}>
        {/* Top grid */}
        <div
          className="grid gap-8 sm:gap-10 md:gap-12 pb-10 sm:pb-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]"
          style={{
            borderBottom: '1px solid rgba(184,154,90,0.08)',
          }}
        >
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3.5 mb-5">
              <div
                className="relative w-10 h-10 grid place-items-center text-gold font-serif text-xl flex-shrink-0"
                style={{ border: '1px solid #b89a5a' }}
              >
                Б
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-cream text-base">{notary.name}</span>
                <span
                  className="font-sans text-[9px] tracking-[0.28em] uppercase mt-0.5"
                  style={{ color: 'rgba(184,154,90,0.70)' }}
                >
                  Нотариус · Москва
                </span>
              </div>
            </div>
            <p className="text-[13px] text-slate leading-relaxed mb-5" style={{ maxWidth: '280px' }}>
              Профессиональные нотариальные услуги с 2008 года. Надёжность, конфиденциальность, соблюдение закона.
            </p>
            <div className="flex flex-col gap-1">
              <a
                href={notary.phoneHref}
                className="text-[13px] text-slate hover:text-gold-light transition-colors leading-loose no-underline"
              >
                {notary.phone}
              </a>
              <span className="text-[13px] text-slate leading-loose">{notary.address}</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-gold mb-4 sm:mb-5">
                {title}
              </h5>
              {links.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-[13px] text-slate hover:text-gold-light transition-colors leading-relaxed py-1 no-underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Official orgs strip */}
        <div
          className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-5 items-center py-6 sm:py-8"
          style={{ borderBottom: '1px solid rgba(184,154,90,0.08)' }}
        >
          {ORGS.map(org => (
            <a
              key={org.name}
              href={org.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 no-underline transition-opacity hover:opacity-100"
              style={{ opacity: 0.55 }}
            >
              <span
                className="w-9 h-9 rounded-full flex-shrink-0 grid place-items-center text-gold flex-shrink-0"
                style={{
                  border: '1px solid rgba(184,154,90,0.35)',
                  background: 'rgba(184,154,90,0.06)',
                }}
              >
                {org.icon}
              </span>
              <span className="font-serif text-[13px] tracking-[0.02em]" style={{ color: '#6b7895' }}>
                {org.name}
              </span>
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6 text-[12px] text-center md:text-left"
          style={{ color: '#4a5568' }}
        >
          <p className="m-0">© {new Date().getFullYear()} {notary.name}. Все права защищены.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate transition-colors no-underline">Политика конфиденциальности</Link>
            <Link href="/admin" className="text-white/10 hover:text-white/30 transition-colors text-xs" title="Управление">
              ⚙
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
