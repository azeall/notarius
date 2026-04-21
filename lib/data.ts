export const notary = {
  name: 'Быконя Руслан Евгеньевич',
  title: 'Нотариус города Москвы',
  address: 'ул. Архитектора Щусева, 5к2, Москва',
  addressParts: {
    streetAddress: 'ул. Архитектора Щусева, д. 5, корп. 2',
    addressLocality: 'Москва',
    postalCode: '123103',
    addressCountry: 'RU',
    addressRegion: 'Москва',
  },
  geo: { latitude: 55.774, longitude: 37.457 },
  phone: '+7 (499) 647-88-77',
  phoneHref: 'tel:+74996478877',
  phoneE164: '+74996478877',
  email: 'info@notarius-bykonya.ru',
  foundingDate: '2008-03-14',
  license: '77/1842',
  chamber: 'Московская городская нотариальная палата',
  workingHours: [
    { day: 'Понедельник', hours: '10:00–19:00' },
    { day: 'Вторник',     hours: '10:00–19:00' },
    { day: 'Среда',       hours: '10:00–19:00' },
    { day: 'Четверг',     hours: '10:00–19:00' },
    { day: 'Пятница',     hours: '10:00–13:00 / 14:00–18:00' },
    { day: 'Суббота',     hours: 'Выходной' },
    { day: 'Воскресенье', hours: 'Выходной' },
  ],
  openingHoursSpec: [
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '10:00', closes: '19:00' },
    { dayOfWeek: 'Friday', opens: '10:00', closes: '18:00' },
  ],
} as const

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  // На Vercel используем собственный домен проекта (стабильный в проде,
  // либо текущий deployment URL на preview-деплое).
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProd) return `https://${vercelProd}`.replace(/\/$/, '')
  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/$/, '')
  return 'https://notarius-bykonya.ru'
}

export const site = {
  url: resolveSiteUrl(),
  name: `Нотариус ${notary.name} · Москва`,
  shortName: 'Нотариус Быконя',
  // Короткий description для превью (~150 символов, помещается в Telegram/Google).
  description:
    'Нотариус Быконя Руслан Евгеньевич в Москве. Онлайн-запись: сделки с недвижимостью, наследство, доверенности, копии. Приём пн–пт, +7 (499) 647-88-77.',
  keywords: [
    'нотариус Москва',
    'нотариус Быконя',
    'нотариальные услуги',
    'удостоверение сделок',
    'оформление наследства',
    'завещание',
    'доверенность',
    'брачный договор',
    'заверение копий',
    'нотариус ЗАО',
    'запись к нотариусу онлайн',
  ],
  locale: 'ru_RU',
} as const
