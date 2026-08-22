// ─────────────────────────────────────────────
//  НАСТРОЙКИ НОТАРИУСА — заполните перед деплоем
// ─────────────────────────────────────────────

export const notary = {
  name: 'Петрова Анна Владимировна',
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
  practiceSince: '2009',
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

export const siteUrl: string = 'https://notarius-warm.vercel.app'

// Идентификатор организации в Яндекс.Картах.
//
// В этом оформлении не работает: отзывы здесь берутся из reviews выше,
// а врезка Яндекса есть только в базовом шаблоне (ветка template).
// Оставлено, чтобы настройки у всех вариантов совпадали.
export const yandexOrgId: string = ''

// Сколько документов оформлено — число для полосы счётчиков.
// Это утверждение о делах нотариуса, а не оформление: его называет он сам.
// 0 — счётчик не показывается.
export const documentsDone: number = 0

// Отзывы клиентов — только настоящие, с их согласия.
// Выдуманный отзыв на сайте нотариуса — это недостоверная реклама,
// и отвечать за неё придётся ему, а не тому, кто делал сайт.
// Пусто — блок отзывов не выводится.
export const reviews: { name: string; service: string; text: string }[] = []

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

// ─── Девиз для hero (заглушка) ───
export const motto = 'Закон на вашей стороне'
