import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles, getArticle, type Block } from '@/lib/articles'
import { notary, site } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

export function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Статья не найдена' }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `${site.url}/blog/${article.slug}`,
      modifiedTime: article.updated,
    },
  }
}

function formatDate(iso: string): string {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ]
  const d = new Date(iso)
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="font-serif text-2xl font-bold text-cream mt-10 mb-4 scroll-mt-24">
          {block.text}
        </h2>
      )
    case 'p':
      return (
        <p key={i} className="text-slate leading-relaxed mb-5" style={{ lineHeight: '1.8' }}>
          {block.text}
        </p>
      )
    case 'ul':
      return (
        <ul key={i} className="space-y-2.5 mb-6">
          {block.items.map(item => (
            <li key={item} className="flex items-start gap-3 text-slate leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={i} className="space-y-3 mb-6 counter-reset-list">
          {block.items.map((item, idx) => (
            <li key={item} className="flex items-start gap-3.5 text-slate leading-relaxed">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold text-white text-xs font-semibold grid place-items-center mt-0.5">
                {idx + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      )
    case 'callout':
      return (
        <div
          key={i}
          className="my-7 rounded-xl border-l-2 border-gold p-5 sm:p-6"
          style={{ background: 'rgb(var(--surface-rgb))' }}
        >
          <p className="font-serif font-bold text-cream text-base mb-1.5 flex items-center gap-2">
            <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {block.title}
          </p>
          <p className="text-slate text-sm leading-relaxed">{block.text}</p>
        </div>
      )
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const related = articles.filter(a => a.slug !== article.slug).slice(0, 2)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    dateModified: article.updated,
    inLanguage: 'ru-RU',
    author: { '@type': 'Person', name: notary.name, jobTitle: 'Нотариус' },
    publisher: { '@type': 'Organization', name: notary.chamber },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/blog/${article.slug}` },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: `${site.url}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${site.url}/blog/${article.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Header */}
      <section className="relative bg-navy text-cream overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate/80 mb-6 flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gold transition-colors">Блог</Link>
            <span>/</span>
            <span className="text-slate">{article.category}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4 text-xs">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gold/15 text-gold font-semibold uppercase tracking-wide">
              {article.category}
            </span>
            <span className="text-slate/80">{article.readingTime} мин чтения</span>
            <span className="text-slate/70">·</span>
            <span className="text-slate/80">Обновлено {formatDate(article.updated)}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight">{article.title}</h1>
        </div>
      </section>

      {/* Body */}
      <article className="bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <p className="text-lg text-cream leading-relaxed mb-8 font-medium">{article.excerpt}</p>
          {article.content.map(renderBlock)}

          {/* Disclaimer */}
          <div className="mt-10 pt-6 border-t" style={{ borderColor: 'rgb(var(--violet-rgb) / 0.12)' }}>
            <p className="text-xs text-slate/70 leading-relaxed">
              Материал носит справочный характер и не заменяет консультацию. Точный перечень документов и стоимость
              зависят от конкретной ситуации — уточняйте при записи на приём.
            </p>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-navy-dark border-t" style={{ borderColor: 'rgb(var(--violet-rgb) / 0.12)' }}>
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-cream mb-3">Нужна консультация по вашему вопросу?</h2>
          <p className="text-slate mb-6 text-sm">Запишитесь на приём — подскажем точный список документов и порядок действий</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <BookingButton />
            <a
              href={notary.phoneHref}
              className="border text-cream font-semibold px-8 py-3 rounded-lg hover:border-gold hover:text-gold transition-all text-sm"
              style={{ borderColor: 'rgb(var(--violet-rgb) / 0.35)' }}
            >
              {notary.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-navy border-t" style={{ borderColor: 'rgb(var(--violet-rgb) / 0.12)' }}>
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="font-serif text-xl font-bold text-cream mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map(a => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5"
                style={{ background: 'rgb(var(--surface-rgb))', border: '1px solid rgb(var(--violet-rgb) / 0.15)' }}
              >
                <div className="flex items-center gap-3 mb-2 text-xs">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-gold font-semibold uppercase tracking-wide" style={{ background: 'rgb(var(--violet-rgb) / 0.12)' }}>
                    {a.category}
                  </span>
                  <span className="text-slate">{a.readingTime} мин</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-cream leading-snug mb-2 group-hover:text-gold transition-colors">
                  {a.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">{a.excerpt}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Все статьи блога
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
