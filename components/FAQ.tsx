'use client'
import { useState } from 'react'
import { faqs } from '@/lib/faq'


const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-navy-dark py-20 sm:py-24 md:py-[120px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="wrap">

        <div className="mb-10 sm:mb-16 reveal">
          <div className="inline-flex items-center gap-3.5 mb-5">
            <span className="block w-6 h-px bg-gold flex-shrink-0" />
            <span className="text-[11px] tracking-[0.32em] uppercase" style={{ color: 'rgb(var(--violet-rgb) / 0.70)' }}>
              Вопросы и ответы
            </span>
          </div>
          <h2
            className="font-serif font-medium text-cream"
            style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: '1.08', letterSpacing: '-0.01em', margin: 0 }}
          >
            Часто задаваемые <em className="italic font-normal text-gold">вопросы</em>
          </h2>
        </div>

        <div className="max-w-[860px]">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                borderTop: '1px solid rgb(var(--violet-rgb) / 0.10)',
                ...(i === faqs.length - 1 ? { borderBottom: '1px solid rgb(var(--violet-rgb) / 0.10)' } : {}),
              }}
              data-reveal-delay={i * 80}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 sm:gap-6 text-left transition-colors duration-200 py-6 sm:py-7"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                aria-expanded={open === i}
              >
                <span
                  className="font-serif text-cream text-[17px] sm:text-[20px] leading-snug"
                  style={{ color: open === i ? 'rgb(var(--accent-2-rgb))' : 'rgb(var(--text-rgb))', transition: 'color .2s' }}
                >
                  {faq.q}
                </span>
                <span
                  className="w-9 h-9 grid place-items-center flex-shrink-0 rounded-full transition-all duration-300"
                  style={{
                    border: '1px solid rgb(var(--violet-rgb) / 0.30)',
                    color: 'rgb(var(--violet-rgb))',
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    background: open === i ? 'rgb(var(--violet-rgb) / 0.10)' : 'transparent',
                    borderColor: open === i ? 'rgb(var(--violet-rgb))' : 'rgb(var(--violet-rgb) / 0.30)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? '500px' : '0' }}
              >
                <p
                  className="text-slate leading-relaxed pb-6 sm:pb-7 text-[14px] sm:text-[15px]"
                  style={{ lineHeight: '1.75', maxWidth: '820px' }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
