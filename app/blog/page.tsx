import type { Metadata } from 'next'
import Link from 'next/link'
import { articles } from '@/lib/articles'
import { site } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Блог нотариуса · Полезные статьи',
  description:
    'Полезные материалы о нотариальных действиях: как вступить в наследство, документы для сделки с недвижимостью, доверенности, брачный договор, апостиль и нотариальный перевод.',
  keywords: [
    'наследство как оформить',
    'документы для нотариуса',
    'доверенность нотариус',
    'брачный договор',
    'апостиль перевод',
    'нотариус Москва статьи',
  ],
  alternates: { canonical: '/blog' },
}

const blogLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${site.url}/blog#blog`,
  name: 'Блог нотариуса',
  url: `${site.url}/blog`,
  blogPost: articles.map(a => ({
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.excerpt,
    url: `${site.url}/blog/${a.slug}`,
    dateModified: a.updated,
    articleSection: a.category,
  })),
}

function formatDate(iso: string): string {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ]
  const d = new Date(iso)
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function BlogPage() {
  const [featured, ...rest] = articles

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />

      {/* Page header */}
      <section className="relative bg-navy text-cream overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-blog" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-blog)" />
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Полезные материалы</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Блог нотариуса</h1>
          <p className="text-slate max-w-xl">
            Понятные разборы нотариальных вопросов: наследство, сделки, доверенности и документы для заграницы
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-navy-dark">
        <div className="max-w-6xl mx-auto px-4 py-16">

          {/* Featured */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group block mb-8 rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
            style={{ background: '#ffffff', border: '1px solid rgba(29,158,117,0.18)' }}
          >
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-xs">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-gold font-semibold uppercase tracking-wide" style={{ background: 'rgba(29,158,117,0.12)' }}>
                    {featured.category}
                  </span>
                  <span className="text-slate">{featured.readingTime} мин чтения</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream leading-tight mb-3 group-hover:text-gold transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Читать статью
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
              {/* Decorative panel */}
              <div className="relative min-h-[200px] hidden md:block overflow-hidden" style={{ background: '#ffffff' }}>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(29,158,117,0.10) 1px, transparent 1px),' +
                      'linear-gradient(90deg, rgba(29,158,117,0.10) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                  aria-hidden
                />
                <svg className="absolute inset-0 m-auto w-20 h-20 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Rest grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(a => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid rgba(29,158,117,0.15)' }}
              >
                <div className="flex items-center gap-3 mb-3 text-xs">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-gold font-semibold uppercase tracking-wide" style={{ background: 'rgba(29,158,117,0.12)' }}>
                    {a.category}
                  </span>
                  <span className="text-slate">{a.readingTime} мин</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-cream leading-snug mb-2 group-hover:text-gold transition-colors">
                  {a.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed mb-4 flex-1">{a.excerpt}</p>
                <span className="text-xs text-slate/70 mt-auto">Обновлено {formatDate(a.updated)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
