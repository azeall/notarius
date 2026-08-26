/**
 * Настройки сервиса приёма заявок (репозиторий notariusbot).
 *
 * Значение можно переопределить переменными окружения в Vercel:
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

export const notarybotUrl = (
  process.env.NEXT_PUBLIC_NOTARYBOT_URL || DEMO_FALLBACK_URL
).replace(/\/+$/, '')

export const notarybotSlug = process.env.NEXT_PUBLIC_NOTARYBOT_SLUG || DEMO_FALLBACK_SLUG

export const notarybotEnabled = Boolean(notarybotUrl && notarybotSlug)

/** Открыть виджет. Возвращает false, если скрипт ещё не загрузился. */
export function openNotarybot(): boolean {
  if (typeof window === 'undefined') return false
  const api = (window as unknown as { notarybot?: { open: () => void } }).notarybot
  if (!api) return false
  api.open()
  return true
}
