import { notary } from '@/lib/data'

const officialLinks = [
  {
    label: 'Федеральная нотариальная палата',
    href: 'https://notariat.ru/ru-ru/',
  },
  {
    label: 'Московская городская нотариальная палата',
    href: 'https://77.notariat.ru/ru-ru/',
  },
  {
    label: 'Министерство юстиции РФ',
    href: 'https://minjust.gov.ru/',
  },
  {
    label: 'Главное управление Минюста по Москве',
    href: 'https://to77.minjust.gov.ru/ru/',
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-400 mt-auto">
      {/* Official links */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Полезные ссылки</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {officialLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-gold transition-colors"
              >
                {link.label}
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
