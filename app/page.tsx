import Hero from '@/components/Hero'
import StatsCounter from '@/components/StatsCounter'
import ServicesGrid from '@/components/ServicesGrid'
import HowItWorks from '@/components/HowItWorks'
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

      {/* Address + hours row */}
      <section
        className="relative"
        style={{ background: '#0f1e35', borderTop: '1px solid rgba(184,154,90,0.10)', padding: '80px 0' }}
      >
        <div className="mx-auto px-10" style={{ maxWidth: '1340px' }}>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-5 reveal">
              <div>
                <div className="inline-flex items-center gap-3.5 mb-4">
                  <span className="block w-6 h-px bg-gold flex-shrink-0" />
                  <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
                    Адрес и время работы
                  </span>
                </div>
                <h2
                  className="font-serif font-medium text-cream mb-6"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: '1.1', letterSpacing: '-0.01em' }}
                >
                  Как нас найти
                </h2>
              </div>
              <div
                className="rounded-xl overflow-hidden"
                style={{ height: '260px', border: '1px solid rgba(184,154,90,0.15)' }}
              >
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ filter: 'invert(0.85) hue-rotate(180deg)' }}
                />
              </div>
              <p className="text-slate text-sm">{notary.address}</p>
            </div>
            <div className="space-y-4 reveal" style={{ animationDelay: '120ms' }}>
              <WorkingHours />
              <ContactCard />
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      {/* Bottom CTA */}
      <section
        className="relative"
        style={{
          background: '#06101f',
          borderTop: '1px solid rgba(184,154,90,0.10)',
          padding: '120px 0',
        }}
      >
        {/* Gold grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(184,154,90,0.04) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(184,154,90,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 80%)',
          }}
          aria-hidden
        />

        <div className="relative mx-auto px-10 text-center" style={{ maxWidth: '780px' }}>
          <div className="inline-flex items-center gap-3.5 mb-6 reveal">
            <span className="block w-6 h-px bg-gold" />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgba(184,154,90,0.70)' }}>
              Готовы помочь
            </span>
            <span className="block w-6 h-px bg-gold" />
          </div>

          <h2
            className="font-serif font-medium text-cream mb-5 reveal"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
          >
            Запишитесь на приём{' '}
            <em className="italic font-normal text-gold">прямо сейчас</em>
          </h2>

          <p className="text-slate mb-12 leading-relaxed reveal" style={{ fontSize: '17px' }}>
            Профессиональная помощь и оформление документов в удобное для вас время.
          </p>

          <div className="flex flex-wrap gap-4 justify-center reveal">
            <BookingButton
              className="relative inline-flex items-center gap-4 font-sans font-bold text-[12px] tracking-[0.22em] uppercase px-9 py-5 cursor-pointer overflow-hidden transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(180deg, #c8a03c 0%, #a07828 100%)',
                color: '#1a1307',
                boxShadow: '0 12px 40px -12px rgba(200,160,60,0.50)',
              }}
            />
            <a
              href={notary.phoneHref}
              className="inline-flex items-center gap-2.5 font-sans font-semibold text-[12px] tracking-[0.22em] uppercase px-8 py-5 text-cream no-underline transition-colors"
              style={{
                border: '1px solid rgba(184,154,90,0.35)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#b89a5a'; (e.currentTarget as HTMLElement).style.color = '#d4b978' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,154,90,0.35)'; (e.currentTarget as HTMLElement).style.color = '#f0ece4' }}
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
