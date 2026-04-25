// Unified service list with per-service duration limits (minutes).
// Research-based averages for Russian notary practice:
//   Real estate: 60-90 min | Inheritance: 30-60 | POA: 15-30
//   Copy certification: 10-20 | Consent: 15-30 | Prenuptial: 60-90
//   Corporate: 30-60 | Translation: 30-60

export const SERVICES = [
  'Удостоверение сделок с недвижимостью',
  'Оформление наследства',
  'Доверенности',
  'Заверение копий документов',
  'Нотариальные согласия',
  'Брачный договор',
  'Корпоративные документы',
  'Нотариальный перевод',
  'Другое',
] as const

export type Service = typeof SERVICES[number]

export const SERVICE_MAX_DURATION: Record<string, number> = {
  'Удостоверение сделок с недвижимостью': 120,
  'Оформление наследства': 90,
  'Доверенности': 60,
  'Заверение копий документов': 60,
  'Нотариальные согласия': 60,
  'Брачный договор': 120,
  'Корпоративные документы': 90,
  'Нотариальный перевод': 90,
  'Другое': 180,
}

export const SERVICE_DEFAULT_DURATION: Record<string, number> = {
  'Удостоверение сделок с недвижимостью': 60,
  'Оформление наследства': 30,
  'Доверенности': 30,
  'Заверение копий документов': 30,
  'Нотариальные согласия': 30,
  'Брачный договор': 60,
  'Корпоративные документы': 30,
  'Нотариальный перевод': 30,
  'Другое': 30,
}

export function maxDurationForService(service: string): number {
  return SERVICE_MAX_DURATION[service] ?? 180
}

export function defaultDurationForService(service: string): number {
  return SERVICE_DEFAULT_DURATION[service] ?? 30
}
