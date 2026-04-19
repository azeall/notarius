import BookingButton from '@/components/BookingButton'

const STEPS = [
  {
    n: '01',
    title: 'Выберите услугу',
    text: 'Ознакомьтесь со списком нотариальных услуг и выберите нужное действие.',
  },
  {
    n: '02',
    title: 'Запишитесь онлайн',
    text: 'Выберите удобные дату и время. Запись доступна на ближайшие 2 недели.',
  },
  {
    n: '03',
    title: 'Приходите к нотариусу',
    text: 'Приходите в назначённое время с документами. Мы оформим всё профессионально.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-navy relative" style={{ padding: '120px 0' }}>
      <div className="mx-auto px-10" style={{ maxWidth: '1340px' }}>

        <div className="mb-16 reveal">
          <div className="inline-flex items-center gap-3.5 mb-5">
            <span className="block w-6 h-px bg-gold flex-shrink-0" />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
              Шаги к успеху
            </span>
          </div>
          <h2
            className="font-serif font-medium text-cream"
            style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em', margin: 0 }}
          >
            Как проходит <em className="italic font-normal text-gold">приём</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-16">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="relative reveal"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute h-px"
                  style={{
                    top: '28px',
                    left: '4.5rem',
                    right: '-1rem',
                    background: 'linear-gradient(90deg, rgba(184,154,90,0.30), transparent)',
                  }}
                  aria-hidden
                />
              )}

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 grid place-items-center flex-shrink-0"
                  style={{ background: '#0f1e35', border: '1px solid rgba(184,154,90,0.18)', borderRadius: '12px' }}
                >
                  <span className="font-serif text-gold text-lg font-bold">{step.n}</span>
                </div>
              </div>

              <h3 className="font-serif font-medium text-cream text-xl mb-3">{step.title}</h3>
              <p className="text-slate leading-relaxed text-[14px]">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="reveal">
          <BookingButton
            className="relative inline-flex items-center gap-4 font-sans font-bold text-[12px] tracking-[0.22em] uppercase px-9 py-5 cursor-pointer overflow-hidden transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(180deg, #c8a03c 0%, #a07828 100%)',
              color: '#1a1307',
              boxShadow: '0 12px 40px -12px rgba(200,160,60,0.50)',
            }}
          />
        </div>
      </div>
    </section>
  )
}
