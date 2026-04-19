import type { Metadata } from 'next'
import { Manrope, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'

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
  title: 'Нотариус Быконя Р. Е. | Москва',
  description:
    'Нотариальная контора Быконя Руслана Евгеньевича в Москве. Профессиональные нотариальные услуги.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
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
