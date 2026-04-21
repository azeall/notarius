import type { Metadata, Viewport } from 'next'
import { Manrope, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'
import { notary, site } from '@/lib/data'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Нотариус Быконя Р. Е. · Нотариальная контора в Москве`,
    template: `%s · Нотариус Быконя Р. Е.`,
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
    title: `Нотариус ${notary.name} · Москва`,
    description:
      'Нотариус в Москве с 2008 года. Онлайн-запись: сделки с недвижимостью, наследство, доверенности, копии. Приём пн–пт, ' +
      notary.phone + '.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Нотариус ${notary.name}`,
    description:
      'Нотариус в Москве. Онлайн-запись: сделки, наследство, доверенности, копии. ' + notary.phone,
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
    { media: '(prefers-color-scheme: light)', color: '#0a1628' },
    { media: '(prefers-color-scheme: dark)', color: '#040d18' },
  ],
  colorScheme: 'dark',
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
  image: `${site.url}/opengraph-image`,
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body
        className={`${manrope.variable} ${playfair.variable} ${jetbrains.variable} font-sans bg-navy text-cream flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  )
}
