import Image from 'next/image'
import { notary } from '@/lib/data'

const officialOrgs = [
  {
    logo: '/notarius1.png',
    label: 'Федеральная нотариальная палата',
    href: 'https://notariat.ru/ru-ru/',
  },
  {
    logo: '/notarius2.png',
    label: 'Московская городская нотариальная палата',
    href: 'https://77.notariat.ru/ru-ru/',
  },
  {
    logo: '/notarius3.png',
    label: 'Министерство юстиции РФ',
    href: 'https://minjust.gov.ru/',
  },
  {
    logo: '/notarius3.png',
    label: 'Главное управление Минюста по Москве',
    href: 'https://to77.minjust.gov.ru/ru/',
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-400 mt-auto">
      {/* Official organisations */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-5">
            Официальные организации
          </p>
          <div className="flex flex-wrap gap-8">
            {officialOrgs.map(org => (
              <a
                key={org.href + org.label}
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={org.logo}
                    alt={org.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs text-center text-gray-400 group-hover:text-gold transition-colors leading-tight max-w-[130px]">
                  {org.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
        <p className="font-serif text-white font-semibold">{notary.name}</p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center items-center">
          <span>{notary.address}</span>
          <a href={notary.phoneHref} className="hover:text-gold transition-colors">
            {notary.phone}
          </a>
        </div>
        <p>© {new Date().getFullYear()} Все права защищены</p>
      </div>
    </footer>
  )
}
