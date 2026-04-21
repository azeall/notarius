/**
 * Shared scheduling primitives used by both API and UI.
 *
 * Working day:
 *   morning:   10:00 – 13:00  (6 × 30-минутных слотов, стартовые 10:00…12:30)
 *   lunch:     13:00 – 14:00  (перерыв, записи не допускаются)
 *   afternoon: 14:00 – 19:00  (10 × 30-минутных слотов, стартовые 14:00…18:30)
 *
 * Запись длительностью D минут, начинающаяся в слоте S, занимает
 *   S, S+30, …, S+D-30  ровно внутри одного блока (утро ИЛИ день) —
 *   пересекать обеденный перерыв нельзя.
 */

export const SLOT_MINUTES = 30

export const MORNING_SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
export const AFTERNOON_SLOTS = [
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30',
]
export const ALL_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS]

export const MORNING_END = '13:00'
export const AFTERNOON_END = '19:00'

export const DURATION_OPTIONS = [30, 60, 90, 120, 150, 180] as const
export const MAX_DURATION = 240

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function blockOfSlot(slot: string): 'morning' | 'afternoon' | null {
  if (MORNING_SLOTS.includes(slot)) return 'morning'
  if (AFTERNOON_SLOTS.includes(slot)) return 'afternoon'
  return null
}

/**
 * Возвращает все 30-минутные слоты, которые занимает запись (start, duration).
 * Возвращает [] если запись невалидна (не помещается в рабочий блок,
 * duration не кратно 30 и т.п.).
 */
export function expandSlots(start: string, duration: number): string[] {
  if (!Number.isFinite(duration) || duration <= 0 || duration % SLOT_MINUTES !== 0) return []
  const block = blockOfSlot(start)
  if (!block) return []

  const blockEndMin = toMinutes(block === 'morning' ? MORNING_END : AFTERNOON_END)
  const startMin = toMinutes(start)
  if (startMin + duration > blockEndMin) return []

  const n = duration / SLOT_MINUTES
  const slots: string[] = []
  for (let i = 0; i < n; i++) {
    slots.push(fromMinutes(startMin + i * SLOT_MINUTES))
  }
  return slots
}

/** Время окончания записи, например 10:00 + 90 = "11:30" */
export function endTime(start: string, duration: number): string {
  return fromMinutes(toMinutes(start) + duration)
}

/**
 * Разворачивает массив записей в плоский Set всех занятых слотов.
 * Игнорирует запись с id === ignoreId (нужно при PATCH).
 */
export function buildBookedSet(
  appointments: Array<{ id?: string; time: string; duration: number }>,
  ignoreId?: string,
): Set<string> {
  const set = new Set<string>()
  for (const a of appointments) {
    if (ignoreId && a.id === ignoreId) continue
    for (const s of expandSlots(a.time, a.duration)) set.add(s)
  }
  return set
}

/** Проверяет, что все слоты записи свободны. */
export function isRangeFree(
  start: string,
  duration: number,
  booked: Set<string>,
): { ok: true } | { ok: false; reason: string } {
  const slots = expandSlots(start, duration)
  if (slots.length === 0) {
    return { ok: false, reason: 'Длительность не помещается в рабочее время' }
  }
  for (const s of slots) {
    if (booked.has(s)) {
      return { ok: false, reason: `Время ${s} уже занято` }
    }
  }
  return { ok: true }
}

/**
 * Человекочитаемый заголовок рабочего времени для админки и подсказки в модалке.
 */
export const WORKING_HOURS_LABEL = 'с 10:00 до 13:00 и с 14:00 до 19:00'
