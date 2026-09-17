/**
 * Настройки сервиса приёма заявок (репозиторий notariusbot).
 *
 * В live-режиме значения задаются переменными окружения при сборке:
 *   NEXT_PUBLIC_NOTARYBOT_URL  — адрес сервиса
 *   NEXT_PUBLIC_NOTARYBOT_SLUG — код нотариуса в сервисе
 *
 * Здесь больше не адрес туннеля: сервис развёрнут на постоянном сервере
 * и доступен по собственному домену.
 *
 * Прежнее имя `201.34.133.70.sslip.io` пришлось сменить не из-за красоты.
 * Адреса вида <ip>.sslip.io режут по SNI у части российских провайдеров:
 * посетитель сайта получал «не удаётся установить соединение» вместо виджета,
 * а владелец этого не видел, потому что ходил через VPN. Поломка, невидимая
 * тому, кто её чинит, — худший вид поломки, и стоила она недели тишины.
 */
const DEMO_FALLBACK_URL = 'https://app.guidecode.ru'
const DEMO_FALLBACK_SLUG = 'demo'

// BLUE/template uses the server demo without enabling the site's own booking API.
export const serverDemo = process.env.NEXT_PUBLIC_BOOKING_MODE !== 'live'

export const notarybotUrl = (
  serverDemo ? DEMO_FALLBACK_URL : process.env.NEXT_PUBLIC_NOTARYBOT_URL || ''
).replace(/\/+$/, '')

export const notarybotSlug = serverDemo ? DEMO_FALLBACK_SLUG : process.env.NEXT_PUBLIC_NOTARYBOT_SLUG || ''

export const notarybotEnabled = Boolean(
  process.env.NEXT_PUBLIC_NOTARYBOT_URL && process.env.NEXT_PUBLIC_NOTARYBOT_SLUG
)

export const useServerWidget = serverDemo || notarybotEnabled

/** Открыть виджет. Возвращает false, если скрипт ещё не загрузился. */
export function openNotarybot(): boolean {
  if (!useServerWidget || typeof window === 'undefined') return false
  const api = (window as unknown as { notarybot?: { open: () => void } }).notarybot
  if (!api) return false
  api.open()
  return true
}

/**
 * Подписаться на сообщение «виджет не открылся».
 *
 * Мало проверить, что скрипт загрузился: он может загрузиться, открыть окно
 * и упереться в недоступную страницу виджета — посетитель увидит ошибку
 * браузера поверх сайта. Узнать об этом из самого iframe нельзя, домены разные,
 * поэтому скрипт ждёт от виджета приветствия и по таймауту присылает это
 * событие. Тогда сайту есть что показать взамен: телефон конторы.
 *
 * Возвращает функцию отписки.
 */
export function onNotarybotUnavailable(handler: () => void): () => void {
  if (typeof document === 'undefined') return () => {}
  document.addEventListener('notarybot:unavailable', handler)
  return () => document.removeEventListener('notarybot:unavailable', handler)
}
