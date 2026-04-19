import BookingButton from '@/components/BookingButton'

const STEPS = [
  {
    n: '01',
    title: 'Выберите услугу',
    text: 'Ознакомьтесь со списком нотариальных услуг и выберите нужную вам.',
  },
  {
    n: '02',
    title: 'Запишитесь онлайн',
    text: 'Выберите удобную дату и время. Запись занимает не более 2 минут.',
  },
  {
    n: '03',
    title: 'Приходите к нотариусу',
    text: 'Приходите в назначенное время с документами. Мы всё оформим быстро и профессионально.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Left-aligned header */}
        <div className="mb-12">
          <p className="text-gold uppercase tracking-[0.18em] text-xs font-semibold mb-2">Просто и быстро</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">Как записаться на приём</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[4.5rem] right-[-1rem] h-px bg-gradient-to-r from-gold/30 to-transparent" />
              )}

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-gold text-lg font-bold">{step.n}</span>
                </div>
                <div className="h-px flex-1 bg-gray-100 md:hidden" />
              </div>

              <h3 className="font-semibold text-navy text-base mb-2">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.text}</p>
            </div>
          ))}
        </div>

        <div>
          <BookingButton className="bg-gold text-navy font-semibold px-10 py-3.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer" />
        </div>

      </div>
    </section>
  )
}
