export const notary = {
  name: 'Горбунов Николай Александрович',
  title: 'Нотариус города Москвы',
  address: '2-я Новая ул., 23А, д. Саларьево, Москва',
  addressParts: {
    streetAddress: '2-я Новая ул., 23А',
    addressLocality: 'Москва',
    postalCode: '108811',
    addressCountry: 'RU',
    addressRegion: 'Москва',
  },
  geo: { latitude: 55.619, longitude: 37.357 },
  phone: '+7 (977) 252-86-86',
  phoneHref: 'tel:+79772528686',
  phoneE164: '+79772528686',
  email: 'notarius_gorbunov@mail.ru',
  foundingDate: '2020-01-01',
  license: '',
  chamber: 'Московская городская нотариальная палата',
  telegram: '@Notarius_GZ',
  telegramHref: 'https://t.me/Notarius_GZ',
  vk: 'https://vk.com/notarius_gorbunov',
  workingHours: [
    { day: 'Понедельник', hours: '10:00–18:30' },
    { day: 'Вторник',     hours: '10:00–18:30' },
    { day: 'Среда',       hours: '10:00–18:30' },
    { day: 'Четверг',     hours: '10:00–18:30' },
    { day: 'Пятница',     hours: '10:00–18:30' },
    { day: 'Суббота',     hours: 'Выходной' },
    { day: 'Воскресенье', hours: 'Выходной' },
  ],
  openingHoursSpec: [
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '18:30' },
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
  return 'https://notarius-gorbunov.ru'
}

export const site = {
  url: resolveSiteUrl(),
  name: `Нотариус ${notary.name} · Москва`,
  shortName: 'Нотариус Горбунов',
  // Короткий description для превью (~150 символов, помещается в Telegram/Google).
  description:
    'Нотариус Горбунов Николай Александрович в Москве. Онлайн-запись: сделки с недвижимостью, наследство, доверенности, копии. Приём пн–пт, +7 (977) 252-86-86.',
  keywords: [
    'нотариус Москва',
    'нотариус Горбунов',
    'нотариус Саларьево',
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
