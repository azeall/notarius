import type { Metadata } from 'next'
import { Inter, EB_Garamond } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const garamond = EB_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-garamond',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Нотариус Быконя Р.Е. | Москва',
  description:
    'Нотариальная контора Быконя Руслана Евгеньевича в Москве. Профессиональные нотариальные услуги.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${garamond.variable} font-sans bg-white text-gray-900 flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
