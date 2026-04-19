import Hero from '@/components/Hero'
import WorkingHours from '@/components/WorkingHours'
import ContactCard from '@/components/ContactCard'
import BookingButton from '@/components/BookingButton'
import Link from 'next/link'

const servicesPreview = [
  'Наследство и завещания',
  'Сделки с недвижимостью',
  'Доверенности',
  'Заверение копий и справок',
]

const whyItems = [
  {
    title: 'Юридическая сила',
    text: 'Нотариально удостоверенные документы имеют повышенную доказательную силу и защищены законом.',
  },
  {
    title: 'Надёжность сделки',
    text: 'Нотариус проверяет законность сделки, обеспечивая защиту прав и интересов сторон.',
  },
  {
    title: 'Правовая определённость',
    text: 'Нотариальное акты обеспечивают исполнение обязательств и надлежащее оформление документов.',
  },
]

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Why notary */}
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
            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/services" className="text-gold font-semibold hover:underline">
                Все услуги →
              </Link>
              <BookingButton className="bg-gold text-navy font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all text-sm" />
            </div>
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
