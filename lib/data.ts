// ─────────────────────────────────────────────
//  НАСТРОЙКИ НОТАРИУСА — заполните перед деплоем
// ─────────────────────────────────────────────

export const notary = {
  name: 'Долина Вера Алексеевна',
  title: 'Нотариус города Москвы',
  address: 'Мясницкая ул., 24/7, Москва',
  addressParts: {
    streetAddress: 'Мясницкая улица, 24/7',
    addressLocality: 'Москва',
    postalCode: '101000',
    addressCountry: 'RU',
    addressRegion: 'Москва',
  },
  geo: { latitude: 55.7651, longitude: 37.6369 },
  phone: '+7 (495) 623-00-35',
  phoneHref: 'tel:+74956230035',
  phoneE164: '+74956230035',
  email: 'info@notarius.ru',              // Email — уточнить
  foundingDate: '2010-01-01',             // Дата начала деятельности — уточнить
  license: '',
  chamber: 'Московская городская нотариальная палата',
  telegram: '',
  telegramHref: '',
  vk: '',
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
