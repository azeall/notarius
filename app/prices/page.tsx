import BookingButton from '@/components/BookingButton'
import PageHero from '@/components/PageHero'
import { notary } from '@/lib/data'
import { priceSections } from '@/lib/prices'


export default function PricesPage() {
  return (
    <>
      {/* Page header */}
      <PageHero
        tag="Тарифы"
        title="Цены и тарифы"
        lead={`Стоимость нотариальных действий складывается из государственной пошлины (нотариального тарифа) и платы за услуги правового и технического характера (УПТХ). Указанные цены ориентировочные — точную стоимость уточняйте при записи.`}
        photo="/ph-docs.jpg"
        photoAlt="Папки с делами на рабочем столе"
      />

      {/* Disclaimer — text-cream/80 for visibility on dark background */}
      <div className="bg-gold/10 border-b border-gold/20">
        <div className="wrap py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-cream/80">
            Тарифы установлены Налоговым кодексом РФ и едины для всех нотариусов. Размер УПТХ утверждается ежегодно Московской городской нотариальной палатой.
          </p>
        </div>
      </div>

      {/* Price tables */}
      <section className="bg-navy-dark">
        <div className="wrap py-16 space-y-10">
          {priceSections.map(section => (
            <div key={section.title} className="rounded-none overflow-hidden" style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.15)' }}>
              <div className="px-6 py-4" style={{ borderBottom: '1px solid rgb(var(--violet-rgb) / 0.12)', background: 'rgb(var(--violet-rgb) / 0.05)' }}>
                <h2 className="font-serif font-bold text-cream text-lg">{section.title}</h2>
                {section.note && <p className="text-slate/70 text-xs mt-1">{section.note}</p>}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgb(var(--violet-rgb) / 0.12)' }}>
                      <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wider w-1/2" style={{ color: 'rgb(var(--violet-rgb) / 0.70)' }}>Действие</th>
                      <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--violet-rgb) / 0.70)' }}>Тариф</th>
                      <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--violet-rgb) / 0.70)' }}>УПТХ</th>
                      <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--violet-rgb) / 0.70)' }}>Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, i) => (
                      <tr key={i} className="transition-colors hover:bg-black/[0.03]" style={{ borderBottom: '1px solid rgb(var(--violet-rgb) / 0.07)' }}>
                        <td className="px-6 py-3.5 text-cream font-medium">{row.name}</td>
                        <td className="px-4 py-3.5 text-slate">{row.tariff}</td>
                        <td className="px-4 py-3.5 text-slate">{row.uptx}</td>
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
      <section className="bg-navy text-cream">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Узнайте точную стоимость</h2>
          <p className="text-slate mb-6 text-sm">
            Позвоните нам или запишитесь на консультацию — мы рассчитаем стоимость конкретно для вашей ситуации
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton className="bg-gold text-white font-semibold px-8 py-3 rounded-none hover:brightness-110 transition-all" />
            <a
              href={notary.phoneHref}
              className="flex items-center gap-2 border border-black/20 text-cream font-semibold px-8 py-3 rounded-none hover:border-gold hover:text-gold transition-all text-sm"
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
