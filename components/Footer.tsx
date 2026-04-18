import Image from 'next/image'
import { notary } from '@/lib/data'

const officialOrgs = [
  {
    logo: '/notarius1.jpg',
    label: 'Р¤РµРґРµСЂР°Р»СЊРЅР°СЏ РЅРѕС‚Р°СЂРёР°Р»СЊРЅР°СЏ РїР°Р»Р°С‚Р°',
    href: 'https://notariat.ru/ru-ru/',
  },
  {
    logo: '/notarius2.jpg',
    label: 'РњРѕСЃРєРѕРІСЃРєР°СЏ РіРѕСЂРѕРґСЃРєР°СЏ РЅРѕС‚Р°СЂРёР°Р»СЊРЅР°СЏ РїР°Р»Р°С‚Р°',
    href: 'https://77.notariat.ru/ru-ru/',
  },
  {
    logo: '/notarius3.jpg',
    label: 'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ СЋСЃС‚РёС†РёРё Р Р¤',
    href: 'https://minjust.gov.ru/',
  },
  {
    logo: '/notarius3.jpg',
    label: 'Р“Р»Р°РІРЅРѕРµ СѓРїСЂР°РІР»РµРЅРёРµ РњРёРЅСЋСЃС‚Р° РїРѕ РњРѕСЃРєРІРµ',
    href: 'https://to77.minjust.gov.ru/ru/',
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-400 mt-auto">
      {/* Official organisations */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-8 text-center">
            РћС„РёС†РёР°Р»СЊРЅС‹Рµ РѕСЂРіР°РЅРёР·Р°С†РёРё
          </p>
          <div className="flex flex-wrap justify-center gap-12">
            {officialOrgs.map(org => (
              <a
                key={org.href + org.label}
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-4 rounded border border-white/5 hover:border-gold/40 hover:bg-white/5 transition-all group w-40"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={org.logo}
                    alt={org.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs text-center text-gray-400 group-hover:text-gold transition-colors leading-tight">
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
        <p>В© {new Date().getFullYear()} Р’СЃРµ РїСЂР°РІР° Р·Р°С‰РёС‰РµРЅС‹</p>
      </div>
    </footer>
  )
}