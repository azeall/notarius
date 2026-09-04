import { notary } from '@/lib/data'

/**
 * Проверяется согласованность настроек, а не конкретные значения.
 *
 * Раньше здесь стояло `expect(notary.name).toBe('Иванов Иван Иванович')`.
 * Шаблон заводится под нового нотариуса правкой lib/data.ts — и тест падал
 * ровно в тот момент, когда всё сделано правильно. Такой тест ничего не
 * охраняет, зато приучает не смотреть на красное.
 */
describe('notary data', () => {
  it('has name', () => {
    expect(notary.name.trim().length).toBeGreaterThan(0)
  })

  it('phone href matches the displayed phone', () => {
    expect(notary.phoneHref).toBe(`tel:${notary.phoneE164}`)
    expect(notary.phone.replace(/\D/g, '')).toBe(notary.phoneE164.replace(/\D/g, ''))
  })

  it('has 7 working hours entries', () => {
    expect(notary.workingHours).toHaveLength(7)
  })

  it('saturday is closed', () => {
    const sat = notary.workingHours.find(h => h.day === 'Суббота')
    expect(sat?.hours).toBe('Выходной')
  })
})
