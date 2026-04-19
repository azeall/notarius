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
        <div className="text-center mb-12">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Просто и быстро</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">Как записаться на приём</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative flex flex-col items-center text-center md:items-start md:text-left">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-[-2rem] h-px bg-gold/20" />
              )}
              <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mb-5 flex-shrink-0">
                <span className="font-serif text-gold text-xl font-bold">{step.n}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-navy mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <BookingButton className="bg-gold text-navy font-semibold px-10 py-3.5 rounded-lg hover:brightness-110 transition-all" />
        </div>
      </div>
    </section>
  )
}
