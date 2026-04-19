import BookingButton from '@/components/BookingButton'
import { notary } from '@/lib/data'

const PRICE_SECTIONS = [
  {
    title: 'Наследство и завещания',
    note: 'Тарифы установлены НК РФ. Стоимость УПТХ зависит от вида действия.',
    rows: [
      { name: 'Удостоверение завещания', tariff: '100 руб.', uptx: 'от 2 400 руб.', total: 'от 2 500 руб.' },
      { name: 'Свидетельство о праве на наследство (недвижимость)', tariff: '0,3–0,6% от стоимости', uptx: 'от 6 000 руб.', total: 'индивидуально' },
      { name: 'Свидетельство о праве на наследство (иное имущество)', tariff: '0,3–0,6% от стоимости', uptx: 'от 3 500 руб.', total: 'индивидуально' },
      { name: 'Отказ от наследства', tariff: '100 руб.', uptx: 'от 1 000 руб.', total: 'от 1 100 руб.' },
    ],
  },
  {
    title: 'Сделки с недвижимостью',
    note: 'Тариф зависит от цены договора и степени родства сторон.',
    rows: [
      { name: 'Договор купли-продажи недвижимости', tariff: '0,5% от суммы', uptx: 'от 8 000 руб.', total: 'индивидуально' },
      { name: 'Договор дарения недвижимости', tariff: '0,5% от стоимости', uptx: 'от 8 000 руб.', total: 'индивидуально' },
      { name: 'Договор ренты', tariff: '0,5% от стоимости', uptx: 'от 5 000 руб.', total: 'индивидуально' },
      { name: 'Ипотечный договор', tariff: '200 руб.', uptx: 'от 5 000 руб.', total: 'от 5 200 руб.' },
    ],
  },
  {
    title: 'Доверенности',
    note: 'Стоимость включает тариф и плату за УПТХ.',
    rows: [
      { name: 'Генеральная доверенность', tariff: '500 руб.', uptx: 'от 2 000 руб.', total: 'от 2 500 руб.' },
      { name: 'Доверенность на автомобиль', tariff: '500 руб.', uptx: 'от 1 500 руб.', total: 'от 2 000 руб.' },
      { name: 'Доверенность для действий за рубежом', tariff: '500 руб.', uptx: 'от 2 400 руб.', total: 'от 2 900 руб.' },
      { name: 'Отмена доверенности', tariff: '500 руб.', uptx: 'от 500 руб.', total: 'от 1 000 руб.' },
    ],
  },
  {
    title: 'Заверение копий и подписей',
    note: 'Цена указана за 1 страницу / 1 подпись.',
    rows: [
      { name: 'Верность копии документа', tariff: '10 руб./стр.', uptx: 'от 80 руб./стр.', total: 'от 90 руб./стр.' },
      { name: 'Верность выписки из документа', tariff: '25 руб./стр.', uptx: 'от 80 руб./стр.', total: 'от 105 руб./стр.' },
      { name: 'Подлинность подписи', tariff: '100 руб.', uptx: 'от 1 200 руб.', total: 'от 1 300 руб.' },
      { name: 'Подпись на банковской карточке', tariff: '200 руб.', uptx: 'от 1 200 руб.', total: 'от 1 400 руб.' },
    ],
  },
  {
    title: 'Семейные договоры и согласия',
    note: null,
    rows: [
      { name: 'Брачный договор', tariff: '500 руб.', uptx: 'от 10 000 руб.', total: 'от 10 500 руб.' },
      { name: 'Соглашение о разделе имущества', tariff: '0,5% от стоимости', uptx: 'от 8 000 руб.', total: 'индивидуально' },
      { name: 'Согласие супруга на сделку', tariff: '500 руб.', uptx: 'от 1 500 руб.', total: 'от 2 000 руб.' },
      { name: 'Согласие на выезд ребёнка', tariff: '100 руб.', uptx: 'от 1 200 руб.', total: 'от 1 300 руб.' },
      { name: 'Соглашение об уплате алиментов', tariff: '250 руб.', uptx: 'от 8 000 руб.', total: 'от 8 250 руб.' },
    ],
  },
  {
    title: 'Нотариальный перевод и апостиль',
    note: 'Стоимость перевода зависит от языка и объёма документа.',
    rows: [
      { name: 'Верность перевода (1 стр.)', tariff: '100 руб./стр.', uptx: 'от 800 руб./стр.', total: 'от 900 руб./стр.' },
      { name: 'Апостиль на документ', tariff: 'по тарифу', uptx: 'от 2 500 руб.', total: 'от 2 500 руб.' },
    ],
  },
]

export default function PricesPage() {
  return (
    <>
      {/* Page header */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Нотариальная контора</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Тарифы и цены</h1>
          <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
            Стоимость нотариальных действий складывается из государственной пошлины (нотариального тарифа) и платы за услуги правового и технического характера (УПТХ). Указанные цены ориентировочные — точную стоимость уточняйте при записи.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-gold/10 border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-navy/80">
            Тарифы установлены Налоговым кодексом РФ и едины для всех нотариусов. Размер УПТХ утверждается ежегодно Московской городской нотариальной палатой.
          </p>
        </div>
      </div>

      {/* Price tables */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-10">
          {PRICE_SECTIONS.map(section => (
            <div key={section.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-navy/[0.02]">
                <h2 className="font-serif font-bold text-navy text-lg">{section.title}</h2>
                {section.note && <p className="text-gray-400 text-xs mt-1">{section.note}</p>}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider w-1/2">Действие</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Тариф</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">УПТХ</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5 text-navy font-medium">{row.name}</td>
                        <td className="px-4 py-3.5 text-gray-600">{row.tariff}</td>
                        <td className="px-4 py-3.5 text-gray-600">{row.uptx}</td>
                        <td className="px-4 py-3.5 font-semibold text-gold">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Узнайте точную стоимость</h2>
          <p className="text-gray-300 mb-6 text-sm">
            Позвоните нам или запишитесь на консультацию — мы рассчитаем стоимость конкретно для вашей ситуации
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton className="bg-gold text-navy font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all" />
            <a
              href={notary.phoneHref}
              className="flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-3 rounded-lg hover:border-gold hover:text-gold transition-all text-sm"
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
