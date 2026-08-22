// ─────────────────────────────────────────────
//  НАСТРОЙКИ НОТАРИУСА — заполните перед деплоем
// ─────────────────────────────────────────────

export const notary = {
  name: 'Смирнова Елена Викторовна',
  title: 'Нотариус города Москвы',
  address: 'ул. Тверская, 18к1, Москва',
  addressParts: {
    streetAddress: 'ул. Тверская, 18к1',
    addressLocality: 'Москва',
    postalCode: '125009',                  // Почтовый индекс
    addressCountry: 'RU',
    addressRegion: 'Москва',
  },
  geo: { latitude: 55.751, longitude: 37.618 }, // Координаты офиса
  phone: '+7 (495) 000-00-00',
  phoneHref: 'tel:+74950000000',
  phoneE164: '+74950000000',
  email: 'priem@example.ru',              // Email
  foundingDate: '2020-01-01',             // Дата начала деятельности (для разметки)
  practiceSince: '2011',
  license: '№ 77/318-н',
  registryNumber: '77/1201-н/77',                     // Реестровый номер нотариуса (пусто — не показывать)
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
// Витрина или боевой сайт.
//
// true — сверху висит полоса «демонстрация, нотариус вымышлен».
// Заводите сайт настоящему нотариусу — ставьте false вместе с его данными.
//
// Пока данные вымышленные, полоса обязательна: нотариат — профессия,
// где выдавать вымышленное лицо за действующее нельзя.
export const demoMode: boolean = true

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

export const siteUrl: string = 'https://notarius-lavender.vercel.app'

// Идентификатор организации в Яндекс.Картах.
//
// В этом оформлении не работает: отзывы здесь берутся из reviews выше,
// а врезка Яндекса есть только в базовом шаблоне (ветка template).
// Оставлено, чтобы настройки у всех вариантов совпадали.
export const yandexOrgId: string = ''

// Сколько документов оформлено — число для полосы счётчиков.
// Это утверждение о делах нотариуса, а не оформление: его называет он сам.
// 0 — счётчик не показывается.
export const documentsDone: number = 5000


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
