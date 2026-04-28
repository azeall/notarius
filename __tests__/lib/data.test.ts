import { notary } from '@/lib/data'

describe('notary data', () => {
  it('has name', () => {
    expect(notary.name).toBe('Иванов Иван Иванович')
  })

  it('has phone href', () => {
    expect(notary.phoneHref).toBe('tel:+74996478877')
  })

  it('has 7 working hours entries', () => {
    expect(notary.workingHours).toHaveLength(7)
  })

  it('saturday is closed', () => {
    const sat = notary.workingHours.find(h => h.day === 'Суббота')
    expect(sat?.hours).toBe('Выходной')
  })
})
