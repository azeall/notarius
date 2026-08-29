/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable client-side router cache for dynamic pages so that navigating
    // back to /staff always makes a fresh server request (with cookie) instead
    // of serving a cached redirect from a previous unauthenticated visit.
    staleTimes: {
      dynamic: 0,
    },
  },
  // Страницы не кешируются браузером.
  //
  // Каждый выкат заканчивался тем, что человек открывал сайт и видел
  // вчерашнюю версию: HTML лежал в браузерном кеше, и без Ctrl+F5 обновление
  // не приезжало. Просить читателя жать Ctrl+F5 — не решение.
  //
  // Правило только для страниц. Файлы из /_next/static именованы по хешу
  // содержимого, их кеш трогать нельзя: он и держит скорость.
  async headers() {
    return [
      {
        source: '/:path((?!_next/static|_next/image).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
