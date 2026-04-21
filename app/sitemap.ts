import type { MetadataRoute } from 'next'
import { site } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '/',          priority: 1.0, changeFrequency: 'weekly'  },
    { path: '/services',  priority: 0.9, changeFrequency: 'monthly' },
    { path: '/prices',    priority: 0.9, changeFrequency: 'monthly' },
    { path: '/about',     priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contacts',  priority: 0.8, changeFrequency: 'monthly' },
  ]
  return routes.map(r => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
