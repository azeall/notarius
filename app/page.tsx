import Hero from '@/components/Hero'
import WorkingHours from '@/components/WorkingHours'
import ContactCard from '@/components/ContactCard'
import Link from 'next/link'

const servicesPreview = [
  'РќР°СЃР»РµРґСЃС‚РІРѕ Рё Р·Р°РІРµС‰Р°РЅРёСЏ',
  'РЎРґРµР»РєРё СЃ РЅРµРґРІРёР¶РёРјРѕСЃС‚СЊСЋ',
  'Р”РѕРІРµСЂРµРЅРЅРѕСЃС‚Рё',
  'Р—Р°РІРµСЂРµРЅРёРµ РєРѕРїРёР№ Рё РїРѕРґРїРёСЃРµР№',
]

const whyItems = [
  {
    title: 'Р®СЂРёРґРёС‡РµСЃРєР°СЏ Р·Р°С‰РёС‚Р°',
    text: 'РќРѕС‚Р°СЂРёР°Р»СЊРЅРѕ СѓРґРѕСЃС‚РѕРІРµСЂРµРЅРЅС‹Рµ РґРѕРєСѓРјРµРЅС‚С‹ РёРјРµСЋС‚ РїРѕРІС‹С€РµРЅРЅСѓСЋ РґРѕРєР°Р·Р°С‚РµР»СЊРЅСѓСЋ СЃРёР»Сѓ Рё Р·Р°С‰РёС‰РµРЅС‹ Р·Р°РєРѕРЅРѕРј.',
  },
  {
    title: 'Р‘РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ СЃРґРµР»РѕРє',
    text: 'РќРѕС‚Р°СЂРёСѓСЃ РїСЂРѕРІРµСЂСЏРµС‚ Р·Р°РєРѕРЅРЅРѕСЃС‚СЊ СЃРґРµР»РєРё, РґРµРµСЃРїРѕСЃРѕР±РЅРѕСЃС‚СЊ СЃС‚РѕСЂРѕРЅ Рё РїРѕРґР»РёРЅРЅРѕСЃС‚СЊ РґРѕРєСѓРјРµРЅС‚РѕРІ.',
  },
  {
    title: 'РџСЂР°РІРѕРІР°СЏ РѕРїСЂРµРґРµР»С‘РЅРЅРѕСЃС‚СЊ',
    text: 'РќРѕС‚Р°СЂРёР°Р»СЊРЅС‹Р№ Р°РєС‚ РѕР±РµСЃРїРµС‡РёРІР°РµС‚ РёСЃРїРѕР»РЅРµРЅРёРµ РѕР±СЏР·Р°С‚РµР»СЊСЃС‚РІ Р±РµР· РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹С… СЃСѓРґРµР±РЅС‹С… РїСЂРѕС†РµРґСѓСЂ.',
  },
]

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Why notary вЂ” compact strip */}
      <section className="bg-navy/5 border-y border-navy/10">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
          {whyItems.map(item => (
            <div key={item.title} className="flex gap-4 items-start">
              <span className="mt-1 w-2 h-2 rounded-full bg-gold flex-shrink-0" />
              <div>
                <p className="font-serif font-semibold text-navy mb-1">{item.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl font-bold text-navy mb-6">
              РќРѕС‚Р°СЂРёР°Р»СЊРЅС‹Рµ СѓСЃР»СѓРіРё
            </h2>
            <ul className="space-y-3 mb-8">
              {servicesPreview.map(service => (
                <li key={service} className="flex items-center gap-3 text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  {service}
                </li>
              ))}
            </ul>
            <Link href="/services" className="text-gold font-semibold hover:underline">
              Р’СЃРµ СѓСЃР»СѓРіРё в†’
            </Link>
          </div>
          <div className="space-y-4">
            <WorkingHours />
            <ContactCard />
          </div>
        </div>
      </section>
    </>
  )
}