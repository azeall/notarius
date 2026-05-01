// ─────────────────────────────────────────────
//  НАСТРОЙКИ НОТАРИУСА — заполните перед деплоем
// ─────────────────────────────────────────────

export const notary = {
  name: 'Гунина Татьяна Петровна',
  title: 'Нотариус города Москвы',
  address: 'Армянский пер., 13, Москва',
  addressParts: {
    streetAddress: 'Армянский переулок, 13',
    addressLocality: 'Москва',
    postalCode: '101000',
    addressCountry: 'RU',
    addressRegion: 'Москва',
  },
  geo: { latitude: 55.7565, longitude: 37.6378 },
  phone: '+7 (495) 624-15-48',
  phoneHref: 'tel:+74956241548',
  phoneE164: '+74956241548',
  email: 'info@notarius.ru',              // Email — уточнить
  foundingDate: '2010-01-01',             // Дата начала деятельности — уточнить
  license: '',
  chamber: 'Московская городская нотариальная палата',
  telegram: '',                           // Telegram — уточнить
  telegramHref: '',
  vk: '',                                 // VK — уточнить
  workingHours: [
    { day: 'Понедельник', hours: '10:00–19:00' },
    { day: 'Вторник',     hours: '10:00–19:00' },
    { day: 'Среда',       hours: '10:00–19:00' },
    { day: 'Четверг',     hours: '10:00–19:00' },
    { day: 'Пятница',     hours: '10:00–19:00' },
    { day: 'Суббота',     hours: 'Выходной' },
    { day: 'Воскресенье', hours: 'Выходной' },
  ],
  openingHoursSpec: [
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '19:00' },
  ],
} as const

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProd) return `https://${vercelProd}`.replace(/\/$/, '')
  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/$/, '')
  return 'https://notarius.ru'            // Домен сайта
}

export const site = {
  url: resolveSiteUrl(),
  name: `Нотариус ${notary.name} · Москва`,
  shortName: 'Нотариус',
  description:
    `Нотариус ${notary.name} в Москве. Онлайн-запись: сделки с недвижимостью, наследство, доверенности, копии. Приём пн–пт, ${notary.phone}.`,
  keywords: [
    'нотариус Москва',
    'нотариальные услуги',
    'удостоверение сделок',
    'оформление наследства',
    'завещание',
    'доверенность',
    'брачный договор',
    'заверение копий',
    'запись к нотариусу онлайн',
  ],
  locale: 'ru_RU',
} as const
