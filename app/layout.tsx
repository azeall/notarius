import type { Metadata, Viewport } from 'next'
import { Lora, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'
import Motion from '@/components/Motion'
import { Suspense } from 'react'
import YandexMetrika from '@/components/YandexMetrika'
import CookieNotice from '@/components/CookieNotice'
import DemoRibbon from '@/components/DemoRibbon'
import ScrollProgress from '@/components/ScrollProgress'
import SmoothScroll from '@/components/SmoothScroll'
import ContactFab from '@/components/ContactFab'
import { notary, site } from '@/lib/data'

/* Шрифты.
 *
 * Было: Playfair Display + Manrope. Playfair — дидона с тонкими соединениями:
 * на приглашении она к месту, в заголовке про наследственное дело выглядит
 * нарядно и мелко сыплется на экране. Manrope — геометрический гротеск из
 * стартап-набора, у нотариуса читается как чужая форма одежды.
 *
 * Стало: Lora в заголовках — антиква с каплевидными засечками, спокойная и
 * плотная, хорошо держит кириллицу в крупном кегле. IBM Plex Sans в
 * интерфейсе — гротеск с инженерной, а не рекламной интонацией, и с одной
 * из лучших кириллиц среди бесплатных. Mono берём из того же семейства,
 * чтобы номера и подписи не выпадали из набора. */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Нотариус ${notary.name} в Москве · Онлайн-запись`,
    template: `%s · Нотариус`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.shortName,
  authors: [{ name: notary.name }],
  creator: notary.name,
  publisher: notary.name,
  category: 'Legal services',
  alternates: {
    canonical: '/',
    languages: { 'ru-RU': '/' },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: site.url,
    siteName: site.name,
    title: `Нотариус ${notary.name} в Москве · Онлайн-запись`,
    description:
      'Нотариус в Москве. Онлайн-запись: сделки, наследство, доверенности, копии. ' +
      notary.phone,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Нотариус ${notary.name} в Москве`,
    description:
      'Нотариус в Москве. Онлайн-запись: сделки, наследство, доверенности, копии.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  manifest: '/manifest.webmanifest',
  verification: {
    // Заполнить реальными токенами при подключении вебмастеров:
    // google: 'xxxxxxxxxxxxxxxxxxxxx',
    // yandex: 'xxxxxxxxxxxxxxxxxxxxx',
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  other: {
    'geo.region': 'RU-MOW',
    'geo.placename': 'Москва',
    'geo.position': `${notary.geo.latitude};${notary.geo.longitude}`,
    ICBM: `${notary.geo.latitude}, ${notary.geo.longitude}`,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'rgb(var(--bg-rgb))' },
    { media: '(prefers-color-scheme: dark)', color: '#16151C' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

// JSON-LD: LegalService / LocalBusiness (нотариус) + WebSite
const legalServiceLd = {
  '@context': 'https://schema.org',
  '@type': ['LegalService', 'LocalBusiness'],
  '@id': `${site.url}/#legalservice`,
  name: `Нотариус ${notary.name}`,
  alternateName: site.shortName,
  description: site.description,
  url: site.url,
  telephone: notary.phoneE164,
  email: notary.email,
  priceRange: '₽₽',
  logo: `${site.url}/icon.svg`,
  foundingDate: notary.foundingDate,
  address: {
    '@type': 'PostalAddress',
    streetAddress: notary.addressParts.streetAddress,
    addressLocality: notary.addressParts.addressLocality,
    addressRegion: notary.addressParts.addressRegion,
    postalCode: notary.addressParts.postalCode,
    addressCountry: notary.addressParts.addressCountry,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: notary.geo.latitude,
    longitude: notary.geo.longitude,
  },
  areaServed: {
    '@type': 'City',
    name: 'Москва',
  },
  openingHoursSpecification: notary.openingHoursSpec.map(spec => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: spec.dayOfWeek,
    opens: spec.opens,
    closes: spec.closes,
  })),
  founder: {
    '@type': 'Person',
    name: notary.name,
    jobTitle: 'Нотариус',
    memberOf: {
      '@type': 'Organization',
      name: notary.chamber,
    },
  },
  sameAs: [
    'https://notariat.ru',
    'https://77.notariat.ru',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Нотариальные услуги',
    itemListElement: [
      'Удостоверение сделок с недвижимостью',
      'Оформление наследства и завещаний',
      'Доверенности',
      'Заверение копий документов',
      'Нотариальные согласия',
      'Брачный договор',
      'Корпоративные документы',
      'Нотариальный перевод и апостиль',
    ].map(name => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name },
    })),
  },
}

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: site.url,
  name: site.name,
  inLanguage: 'ru-RU',
  publisher: { '@id': `${site.url}/#legalservice` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()` }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body
        className={`${plexSans.variable} ${lora.variable} ${plexMono.variable} font-sans bg-navy text-cream flex flex-col min-h-screen`}
      >
        {/* Прелоадер убран намеренно: он держал экран фиолетовой заглушкой почти
            секунду до первой отрисовки. На сайте, куда заходят посмотреть адрес
            и телефон, это чистая задержка — красивая ровно один раз. */}
        <a className="skip-link" href="#main">Перейти к содержимому</a>
        <DemoRibbon />
        <ScrollProgress />
        <SmoothScroll />
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <ContactFab />
        <RevealObserver />
        <Motion />
        <CookieNotice />
        <Suspense><YandexMetrika /></Suspense>
      </body>
    </html>
  )
}
