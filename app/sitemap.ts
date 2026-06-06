import type { MetadataRoute } from 'next'
import { site } from '@/lib/data'
import { articles } from '@/lib/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '/',          priority: 1.0, changeFrequency: 'weekly'  },
    { path: '/services',  priority: 0.9, changeFrequency: 'monthly' },
    { path: '/prices',    priority: 0.9, changeFrequency: 'monthly' },
    { path: '/visit',     priority: 0.8, changeFrequency: 'monthly' },
    { path: '/blog',      priority: 0.8, changeFrequency: 'weekly'  },
    { path: '/about',     priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contacts',  priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy',   priority: 0.3, changeFrequency: 'monthly' },
  ]

  const staticRoutes = routes.map(r => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const articleRoutes = articles.map(a => ({
    url: `${site.url}/blog/${a.slug}`,
    lastModified: new Date(a.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...articleRoutes]
}
