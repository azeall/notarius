import ContactCard from '@/components/ContactCard'
import WorkingHours from '@/components/WorkingHours'
import { notary } from '@/lib/data'

export default function ContactsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-navy mb-10">Контакты</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <ContactCard />
        <WorkingHours />
      </div>

      <div className="mb-10 text-center">
        <a
          href={notary.phoneHref}
          className="inline-block bg-navy text-white px-10 py-3 font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors rounded-sm"
        >
          Позвонить: {notary.phone}
        </a>
      </div>

      <div className="rounded overflow-hidden shadow-md">
        <iframe
          src="https://yandex.ru/map-widget/v1/?text=%D1%83%D0%BB.%20%D0%90%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%B0%20%D0%A9%D1%83%D1%81%D0%B5%D0%B2%D0%B0%2C%205%D0%BA2%2C%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&z=16"
          width="100%"
          height="420"
          frameBorder="0"
          title="Карта проезда"
          allowFullScreen
        />
      </div>
    </div>
  )
}
