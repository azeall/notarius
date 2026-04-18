import { notary } from '@/lib/data'

export default function ContactCard() {
  return (
    <div className="bg-offwhite p-6 rounded">
      <h3 className="font-serif text-xl font-bold text-navy mb-4">Контакты</h3>
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-500 uppercase tracking-wider text-xs mb-1">Адрес</p>
          <p className="text-navy font-medium">{notary.address}</p>
        </div>
        <div>
          <p className="text-gray-500 uppercase tracking-wider text-xs mb-1">Телефон</p>
          <a
            href={notary.phoneHref}
            className="text-navy font-medium hover:text-gold transition-colors"
          >
            {notary.phone}
          </a>
        </div>
      </div>
    </div>
  )
}
