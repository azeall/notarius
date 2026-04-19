import Hero from '@/components/Hero'
import StatsCounter from '@/components/StatsCounter'
import ServicesGrid from '@/components/ServicesGrid'
import HowItWorks from '@/components/HowItWorks'
import LegalPhotos from '@/components/LegalPhotos'
import FAQ from '@/components/FAQ'
import WorkingHours from '@/components/WorkingHours'
import ContactCard from '@/components/ContactCard'
import BookingButton from '@/components/BookingButton'
import { notary } from '@/lib/data'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <ServicesGrid />
      <HowItWorks />
      <LegalPhotos />

      {/* Info sidebar + map row */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Адрес и время работы</p>
                <h2 className="font-serif text-3xl font-bold text-navy mb-6">Как нас найти</h2>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 h-64 bg-gray-100 flex items-center justify-center">
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="text-gray-500 text-sm">{notary.address}</p>
            </div>
            <div className="space-y-4">
              <WorkingHours />
              <ContactCard />
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      {/* Bottom CTA */}
      <section className="bg-navy text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-4">Готовы помочь</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Запишитесь на приём прямо сейчас</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Профессиональная юридическая помощь и оформление документов в удобное для вас время.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <BookingButton className="bg-gold text-navy font-semibold px-10 py-3.5 rounded-lg hover:brightness-110 transition-all" />
            <a
              href={notary.phoneHref}
              className="flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-lg hover:border-gold hover:text-gold transition-all"
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
