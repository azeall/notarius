// ─────────────────────────────────────────────
//  НАСТРОЙКИ НОТАРИУСА — заполните перед деплоем
// ─────────────────────────────────────────────

export const notary = {
  name: 'Смирнова Елена Викторовна',
  title: 'Нотариус города Москвы',
  address: 'ул. Примерная, д. 1, Москва',
  addressParts: {
    streetAddress: 'ул. Примерная, д. 1',
    addressLocality: 'Москва',
    postalCode: '000000',                  // Почтовый индекс
    addressCountry: 'RU',
    addressRegion: 'Москва',
  },
  geo: { latitude: 55.751, longitude: 37.618 }, // Координаты офиса
  phone: '+7 (000) 000-00-00',
  phoneHref: 'tel:+70000000000',
  phoneE164: '+70000000000',
  email: 'info@notarius.ru',              // Email
  foundingDate: '2020-01-01',             // Дата начала деятельности (для разметки)
  practiceSince: '2010',
  license: '№ 77/000-н/77',
  registryNumber: '',                     // Реестровый номер нотариуса (пусто — не показывать)
  insuranceSum: '5 000 000 ₽',            // Страховая сумма проф. ответственности
  fnpVerifyUrl: 'https://notariat.ru/ru-ru/help/probate-cases/',  // Ссылка на проверку в реестре ФНП
  chamber: 'Московская городская нотариальная палата',
  telegram: '@notarius',                  // Telegram-ник (с @)
  telegramHref: 'https://t.me/notarius',  // Ссылка на Telegram
  vk: 'https://vk.com/notarius',         // Ссылка на VK
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

// ─── Калькулятор стоимости услуг (тарифы-заглушки) ───
export interface CalcService {
  id: string
  label: string
  tariff?: number        // фикс. нотариальный тариф, ₽
  tariffPercent?: number // % от суммы сделки
  uptx?: number          // УПТХ, ₽
  perPage?: number       // ₽ за страницу
  needsSum?: boolean
  needsPages?: boolean
}

export const calcServices: CalcService[] = [
  { id: 'will', label: 'Завещание', tariff: 100, uptx: 2400 },
  { id: 'poa', label: 'Доверенность', tariff: 500, uptx: 2000 },
  { id: 'sale', label: 'Купля-продажа', tariffPercent: 0.5, uptx: 8000, needsSum: true },
  { id: 'consent', label: 'Согласие супруга', tariff: 500, uptx: 1500 },
  { id: 'copy', label: 'Заверение копий', perPage: 90, needsPages: true },
  { id: 'translate', label: 'Перевод документов', tariff: 100, perPage: 900, needsPages: true },
]
