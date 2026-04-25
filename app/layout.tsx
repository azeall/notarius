import type { Metadata, Viewport } from 'next'
import { Manrope, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'
import { Suspense } from 'react'
import YandexMetrika from '@/components/YandexMetrika'
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
    default: `РќРѕС‚Р°СЂРёСѓСЃ Р‘С‹РєРѕРЅСЏ Р СѓСЃР»Р°РЅ Р•РІРіРµРЅСЊРµРІРёС‡ РІ РњРѕСЃРєРІРµ В· РћРЅР»Р°Р№РЅ-Р·Р°РїРёСЃСЊ`,
    template: `%s В· РќРѕС‚Р°СЂРёСѓСЃ Р‘С‹РєРѕРЅСЏ Р . Р•.`,
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
    title: `РќРѕС‚Р°СЂРёСѓСЃ ${notary.name} РІ РњРѕСЃРєРІРµ В· РћРЅР»Р°Р№РЅ-Р·Р°РїРёСЃСЊ`,
    description:
      'РќРѕС‚Р°СЂРёСѓСЃ РІ РњРѕСЃРєРІРµ СЃ 2008 РіРѕРґР°. РћРЅР»Р°Р№РЅ-Р·Р°РїРёСЃСЊ: СЃРґРµР»РєРё, РЅР°СЃР»РµРґСЃС‚РІРѕ, РґРѕРІРµСЂРµРЅРЅРѕСЃС‚Рё, РєРѕРїРёРё. ' +
      notary.phone,
  },
  twitter: {
    card: 'summary_large_image',
    title: `РќРѕС‚Р°СЂРёСѓСЃ ${notary.name} РІ РњРѕСЃРєРІРµ`,
    description:
      'РќРѕС‚Р°СЂРёСѓСЃ РІ РњРѕСЃРєРІРµ СЃ 2008 РіРѕРґР°. РћРЅР»Р°Р№РЅ-Р·Р°РїРёСЃСЊ: СЃРґРµР»РєРё, РЅР°СЃР»РµРґСЃС‚РІРѕ, РґРѕРІРµСЂРµРЅРЅРѕСЃС‚Рё, РєРѕРїРёРё.',
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
    // Р—Р°РїРѕР»РЅРёС‚СЊ СЂРµР°Р»СЊРЅС‹РјРё С‚РѕРєРµРЅР°РјРё РїСЂРё РїРѕРґРєР»СЋС‡РµРЅРёРё РІРµР±РјР°СЃС‚РµСЂРѕРІ:
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
    'geo.placename': 'РњРѕСЃРєРІР°',
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

// JSON-LD: LegalService / LocalBusiness (РЅРѕС‚Р°СЂРёСѓСЃ) + WebSite
const legalServiceLd = {
  '@context': 'https://schema.org',
  '@type': ['LegalService', 'LocalBusiness'],
  '@id': `${site.url}/#legalservice`,
  name: `РќРѕС‚Р°СЂРёСѓСЃ ${notary.name}`,
  alternateName: site.shortName,
  description: site.description,
  url: site.url,
  telephone: notary.phoneE164,
  email: notary.email,
  priceRange: 'в‚Ѕв‚Ѕ',
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
    name: 'РњРѕСЃРєРІР°',
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
    jobTitle: 'РќРѕС‚Р°СЂРёСѓСЃ',
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
    name: 'РќРѕС‚Р°СЂРёР°Р»СЊРЅС‹Рµ СѓСЃР»СѓРіРё',
    itemListElement: [
      'РЈРґРѕСЃС‚РѕРІРµСЂРµРЅРёРµ СЃРґРµР»РѕРє СЃ РЅРµРґРІРёР¶РёРјРѕСЃС‚СЊСЋ',
      'РћС„РѕСЂРјР»РµРЅРёРµ РЅР°СЃР»РµРґСЃС‚РІР° Рё Р·Р°РІРµС‰Р°РЅРёР№',
      'Р”РѕРІРµСЂРµРЅРЅРѕСЃС‚Рё',
      'Р—Р°РІРµСЂРµРЅРёРµ РєРѕРїРёР№ РґРѕРєСѓРјРµРЅС‚РѕРІ',
      'РќРѕС‚Р°СЂРёР°Р»СЊРЅС‹Рµ СЃРѕРіР»Р°СЃРёСЏ',
      'Р‘СЂР°С‡РЅС‹Р№ РґРѕРіРѕРІРѕСЂ',
      'РљРѕСЂРїРѕСЂР°С‚РёРІРЅС‹Рµ РґРѕРєСѓРјРµРЅС‚С‹',
      'РќРѕС‚Р°СЂРёР°Р»СЊРЅС‹Р№ РїРµСЂРµРІРѕРґ Рё Р°РїРѕСЃС‚РёР»СЊ',
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
        <Suspense><YandexMetrika /></Suspense>
      </body>
    </html>
  )
}
