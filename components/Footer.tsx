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
    { href: `tel:${notary.phone}`, label: notary.phone },
    { href: '/contacts', label: notary.address },
    { href: 'https://notariat.ru', label: 'notariat.ru' },
    { href: 'https://77.notariat.ru', label: '77.notariat.ru' },
  ],
}

export default function Footer() {
  return (
    <footer
      style={{
        background: '#040d18',
        borderTop: '1px solid rgba(184,154,90,0.12)',
        padding: '80px 0 32px',
      }}
    >
      <div className="mx-auto px-10" style={{ maxWidth: '1340px' }}>
        {/* Top grid */}
        <div
          className="grid gap-12 pb-12"
          style={{
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            borderBottom: '1px solid rgba(184,154,90,0.08)',
          }}
        >
          {/* Brand column */}
          <div>
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
              <h5
                className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-gold mb-5"
              >
                {title}
              </h5>
              {links.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-[13px] text-slate hover:text-gold-light transition-colors leading-loose no-underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Official orgs strip */}
        <div
          className="flex flex-wrap gap-x-12 gap-y-4 items-center py-8"
          style={{ borderBottom: '1px solid rgba(184,154,90,0.08)' }}
        >
          {[
            'Федеральная нотариальная палата',
            'Московская городская нотариальная палата',
            'Министерство юстиции РФ',
          ].map(org => (
            <div key={org} className="flex items-center gap-2.5">
              <span
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ border: '1px solid rgba(184,154,90,0.25)' }}
              />
              <span className="font-serif text-[13px] tracking-[0.04em]" style={{ color: '#4a5568' }}>
                {org}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6 text-[12px]"
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
