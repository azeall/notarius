import { notary } from '@/lib/data'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-navy mb-10">
        О нотариальной конторе
      </h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-5 text-gray-700 leading-relaxed">
          <p>
            Нотариальная контора {notary.name} осуществляет нотариальную
            деятельность на основании лицензии, выданной Главным управлением
            Министерства юстиции Российской Федерации по городу Москве.
          </p>
          <p>
            Контора предоставляет полный спектр нотариальных услуг физическим
            и юридическим лицам в строгом соответствии с действующим
            законодательством Российской Федерации.
          </p>
          <p>
            Мы гарантируем конфиденциальность, профессионализм и соблюдение
            законных интересов каждого клиента.
          </p>
        </div>
        <div className="bg-offwhite p-6 rounded text-sm space-y-4">
          <div>
            <p className="text-gray-500 uppercase tracking-wider text-xs mb-1">Нотариус</p>
            <p className="font-semibold text-navy">{notary.name}</p>
          </div>
          <div>
            <p className="text-gray-500 uppercase tracking-wider text-xs mb-1">Адрес</p>
            <p className="text-navy">{notary.address}</p>
          </div>
          <div>
            <p className="text-gray-500 uppercase tracking-wider text-xs mb-1">Телефон</p>
            <a href={notary.phoneHref} className="text-navy hover:text-gold transition-colors">
              {notary.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
