import Hero from '@/components/Hero'
import WorkingHours from '@/components/WorkingHours'
import ContactCard from '@/components/ContactCard'
import Link from 'next/link'

const servicesPreview = [
  'Наследство и завещания',
  'Сделки с недвижимостью',
  'Доверенности',
  'Заверение копий и подписей',
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl font-bold text-navy mb-6">
              Нотариальные услуги
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
              Все услуги →
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
