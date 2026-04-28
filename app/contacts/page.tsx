import type { Metadata } from 'next'
import ContactCard from '@/components/ContactCard'
import WorkingHours from '@/components/WorkingHours'
import BookingButton from '@/components/BookingButton'
import { notary } from '@/lib/data'

// notary is typed as const — cast to access optional social fields
const n = notary as typeof notary & { telegramHref?: string; vk?: string }

export const metadata: Metadata = {
  title: 'Контакты нотариуса · Адрес и телефон',
  description: `Адрес: ${notary.address}. Телефон: ${notary.phone}. Часы работы, карта проезда, связь через Telegram и WhatsApp. Запись на приём онлайн.`,
  alternates: { canonical: '/contacts' },
}

export default function ContactsPage() {
  return (
    <>
      {/* Page header */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Нотариальная контора</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Контакты</h1>
          <p className="text-gray-300 max-w-xl">Запишитесь на приём онлайн или позвоните нам — мы ответим на все вопросы</p>
        </div>
      </section>

      {/* Contacts + Hours */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">

            <div className="md:col-span-2 space-y-8">
              {/* Quick contacts */}
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href={notary.phoneHref}
                  className="flex items-center gap-4 bg-navy text-white rounded-xl px-6 py-5 hover:brightness-110 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Телефон</p>
                    <p className="font-semibold">{notary.phone}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${notary.phone.replace(/\D/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-xl px-6 py-5 hover:border-green-300 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">WhatsApp</p>
                    <p className="font-semibold text-green-700">Написать сейчас</p>
                  </div>
                </a>

                <a
                  href={n.telegramHref ?? `https://t.me/+${notary.phone.replace(/\D/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-xl px-6 py-5 hover:border-blue-300 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Telegram</p>
                    <p className="font-semibold text-blue-700">Написать сейчас</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl px-6 py-5">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Адрес</p>
                    <p className="font-semibold text-navy text-sm">{notary.address}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-gray-200 h-72">
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(notary.address)}&z=16`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Карта проезда"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Portrait placeholder */}
              <div
                className="relative flex flex-col items-center justify-center text-center rounded-xl overflow-hidden"
                style={{ padding: '32px 24px', background: '#0f1e35', minHeight: '200px' }}
              >
                {/* Corner brackets */}
                {[
                  { top: 8, left: 8, borderTop: '1px solid #b89a5a', borderLeft: '1px solid #b89a5a' },
                  { top: 8, right: 8, borderTop: '1px solid #b89a5a', borderRight: '1px solid #b89a5a' },
                  { bottom: 8, left: 8, borderBottom: '1px solid #b89a5a', borderLeft: '1px solid #b89a5a' },
                  { bottom: 8, right: 8, borderBottom: '1px solid #b89a5a', borderRight: '1px solid #b89a5a' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{ width: 16, height: 16, position: 'absolute', ...s }}
                    aria-hidden
                  />
                ))}

                {/* Silhouette icon */}
                <div className="mb-3" style={{ color: 'rgba(184,154,90,0.20)' }}>
                  <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                    <circle cx="32" cy="22" r="10" />
                    <path d="M12 54c2.5-10 10-16 20-16s17.5 6 20 16" />
                  </svg>
                </div>

                <p
                  className="font-serif font-medium m-0 mb-1"
                  style={{ fontSize: '17px', lineHeight: '1.2', color: '#c9a84c' }}
                >
                  {notary.name.split(' ')[0]}<br />
                  {notary.name.split(' ').slice(1).join(' ')}
                </p>
                <p
                  className="font-mono text-[10px] tracking-[0.20em] uppercase mb-0"
                  style={{ color: '#6b7895' }}
                >
                  Нотариус · Москва
                </p>

                <div
                  className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] tracking-[0.12em]"
                  style={{ color: 'rgba(184,154,90,0.25)' }}
                >
                  [ фото нотариуса ]
                </div>
              </div>

              <WorkingHours />
              <ContactCard />
              <BookingButton className="w-full" />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
