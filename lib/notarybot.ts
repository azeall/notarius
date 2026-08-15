/**
 * Настройки сервиса приёма заявок (репозиторий notariusbot).
 *
 * Боевое значение задаётся переменными окружения в Vercel:
 *   NEXT_PUBLIC_NOTARYBOT_URL  — адрес сервиса
 *   NEXT_PUBLIC_NOTARYBOT_SLUG — код нотариуса в сервисе
 *
 * Пока сервис не развёрнут, ниже лежит адрес временного туннеля до машины
 * разработчика — он позволяет посмотреть виджет вживую, но живёт недолго:
 * бесплатный туннель меняет адрес при каждом переподключении. Когда виджет
 * перестанет открываться, замените DEMO_FALLBACK_URL на текущий адрес
 * туннеля либо задайте переменную окружения.
 */
const DEMO_FALLBACK_URL = 'https://3966f6156c3cf3.lhr.life'
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
