import Image from 'next/image'
import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

const VALUES = [
  {
    title: 'Законность',
    text: 'Каждое нотариальное действие совершается строго в соответствии с Основами законодательства о нотариате и нормами действующего права.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  },
  {
    title: 'Конфиденциальность',
    text: 'Нотариус обязан хранить в тайне сведения, которые стали ему известны в связи с осуществлением профессиональной деятельности.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  },
  {
    title: 'Профессионализм',
    text: 'Более 15 лет практики и постоянное повышение квалификации гарантируют грамотное и качественное оформление любых документов.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
  },
  {
    title: 'Независимость',
    text: 'Нотариус действует независимо от государственных органов, политических партий и иных организаций, защищая права и интересы граждан.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Page header with background photo */}
      <section className="relative bg-navy text-white overflow-hidden">
        {/* Background photo — subtle, 20% opacity */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=60"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden>
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
          <p className="text-gold uppercase tracking-[0.18em] text-xs font-semibold mb-3">О нас</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Нотариальная контора</h1>
          <p className="text-gray-300 max-w-xl leading-relaxed">
            {notary.name} — нотариус города Москвы с многолетним опытом защиты прав граждан и организаций
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-12">

            {/* Text */}
            <div className="md:col-span-2 space-y-6 text-gray-700 leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-navy">О нотариусе</h2>
              <p>
                <strong className="text-navy">{notary.name}</strong> — нотариус города Москвы, назначенный на должность
                Министерством юстиции Российской Федерации. Нотариальная деятельность осуществляется на основании
                лицензии, выданной Главным управлением Министерства юстиции РФ по городу Москве.
              </p>
              <p>
                За более чем 15 лет практики нотариальная контора обслужила свыше 5 000 клиентов — физических лиц,
                предпринимателей и организаций. Каждое нотариальное действие совершается с соблюдением всех
                требований закона, что гарантирует юридическую силу оформленных документов.
              </p>
              <p>
                Нотариус является членом <strong className="text-navy">Московской городской нотариальной палаты</strong> и
                Федеральной нотариальной палаты, регулярно проходит повышение квалификации и следит за
                изменениями в законодательстве.
              </p>

              <h2 className="font-serif text-2xl font-bold text-navy pt-4">Почему нотариус?</h2>
              <p>
                Нотариальное удостоверение — это не формальность, а реальная защита ваших прав. Нотариально
                удостоверенные документы имеют повышенную доказательную силу в суде, а нотариус несёт
                имущественную ответственность за совершённые действия.
              </p>
              <p>
                В отличие от простой письменной формы, нотариальные сделки с недвижимостью регистрируются в
                Росреестре в ускоренном режиме — в течение 1 рабочего дня при электронной подаче. Это
                существенно снижает риски мошенничества и оспаривания сделок в будущем.
              </p>

              <h2 className="font-serif text-2xl font-bold text-navy pt-4">Как мы работаем</h2>
              <p>
                Приём ведётся по предварительной записи. Это позволяет нам уделить каждому клиенту достаточно
                времени, заранее подготовить проекты документов и проверить правовую чистоту предстоящей сделки.
                При записи мы сообщим, какие документы необходимо взять с собой.
              </p>
              <p>
                Нотариальная контора располагается в удобном месте в центре Москвы, вблизи станций метро.
                Мы ценим ваше время и стремимся к тому, чтобы каждое посещение проходило быстро и комфортно.
              </p>

              {/* Office photo */}
              <div className="relative rounded-2xl overflow-hidden h-56 mt-6">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=75"
                  alt="Нотариальный офис"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-navy/10 rounded-2xl" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-navy text-white rounded-xl p-6">
                {/* Portrait placeholder — initials style */}
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-gold/40 flex items-center justify-center mx-auto mb-4">
                  <span className="font-serif text-2xl font-bold text-gold">Б</span>
                </div>
                <div className="text-center mb-5">
                  <p className="font-serif font-bold text-lg">{notary.name}</p>
                  <p className="text-gold text-sm mt-1">{notary.title}</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span className="text-gray-300">{notary.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <a href={notary.phoneHref} className="text-gray-300 hover:text-gold transition-colors">{notary.phone}</a>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Членство</p>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  Московская городская нотариальная палата
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  Федеральная нотариальная палата России
                </div>
              </div>

              <BookingButton className="w-full bg-gold text-navy font-semibold py-3 rounded-lg hover:brightness-110 transition-all text-center cursor-pointer" />
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="mb-10">
            <p className="text-gold uppercase tracking-[0.18em] text-xs font-semibold mb-2">Наши принципы</p>
            <h2 className="font-serif text-3xl font-bold text-navy">На чём строится наша работа</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {v.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-navy mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
