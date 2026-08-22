// ─────────────────────────────────────────────
//  НАСТРОЙКИ НОТАРИУСА — заполните перед деплоем
// ─────────────────────────────────────────────

export const notary = {
  name: 'Фамилия Имя Отчество',            // ФИО нотариуса
  title: 'Нотариус города Москвы',
  address: 'ул. Примерная, 1, Москва',    // Полный адрес
  addressParts: {
    streetAddress: 'ул. Примерная, 1',
    addressLocality: 'Москва',
    postalCode: '000000',                  // Почтовый индекс
    addressCountry: 'RU',
    addressRegion: 'Москва',
  },
  geo: { latitude: 55.751, longitude: 37.618 }, // Координаты офиса
  phone: '+7 (999) 999-99-99',            // Телефон
  phoneHref: 'tel:+79999999999',
  phoneE164: '+79999999999',
  email: 'info@notarius.ru',              // Email
  foundingDate: '2020-01-01',             // Дата начала деятельности (для разметки)
  practiceSince: '',                      // Год начала практики, напр. '2014' (пусто — не показывать)
  license: '',                            // Номер лицензии, напр. '№ 77/123'
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

// ─────────────────────────────────────────────
//  Постоянный адрес сайта
//
//  Отсюда берутся canonical, sitemap и разметка для поисковиков. Адрес
//  обязан быть постоянным: пока он пуст, страницы уезжают на адрес
//  конкретной сборки (notarius-abc123-...vercel.app), который живёт до
//  следующего деплоя. Поисковик по такому адресу ничего не закрепит.
//
//  Появился домен нотариуса — впишите его сюда, и больше ничего править
//  не нужно.
// ─────────────────────────────────────────────

export const siteUrl: string = 'https://notarius-wn4h.vercel.app'

// Идентификатор организации в Яндекс.Картах — отсюда подтягиваются отзывы.
// Взять из адреса карточки: yandex.ru/maps/org/…/<цифры>/
// Пусто — блок отзывов не показывается.
export const yandexOrgId: string = ''

// Фотографии. Пусто — вместо портрета выводится буква фамилии, а блок
// со снимками конторы не выводится вовсе. Файлы кладутся в public/.
export const photos: {
  portrait: string
  office: { src: string; alt: string }[]
} = {
  portrait: '',
  office: [],
}

function resolveSiteUrl(): string {
  if (siteUrl) return siteUrl.replace(/\/$/, '')
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProd) return `https://${vercelProd}`.replace(/\/$/, '')
  // VERCEL_URL намеренно не используем: он свой у каждой сборки, и canonical
  // с ним указывает на адрес, которого завтра не будет.
  return 'https://notarius.ru'
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
