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
  async headers() {
    return [
      // Заголовки безопасности. До этой правки сайт отдавал только HSTS
      // (умолчание Vercel) и ничего больше.
      //
      // CSP здесь намеренно нет. Строгая политика потребовала бы перечислить
      // Яндекс.Карты, Яндекс.Метрику и скрипт виджета заявок, а ошибка
      // в перечне ломает страницу молча — это хуже, чем отсутствие политики.
      // Её стоит вводить отдельно и с проверкой каждой внешней врезки.
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Сайт нотариуса встраивать в чужие страницы незачем. Виджет заявок
          // это не затрагивает: он встраивается в сайт, а не сайт в кого-то.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
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
