import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import { notary } from '@/lib/data'

/**
 * Проверяется, что первый экран показывает имя нотариуса и что форма записи
 * не отправится без согласия на обработку данных.
 *
 * Раньше здесь было зашито «Иванов Иван Иванович». Шаблон заводится под нового
 * нотариуса правкой lib/data.ts — и тест падал ровно тогда, когда всё сделано
 * правильно. Такой тест ничего не охраняет, зато приучает не смотреть
 * на красное: к этой проверке набор пришёл с падениями подряд.
 *
 * Имя в заголовке разбито переносом на фамилию и остальное, поэтому сверяются
 * части, а не строка целиком.
 */
describe('Hero', () => {
  it('displays notary name as heading', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    for (const part of notary.name.trim().split(/\s+/)) {
      expect(heading).toHaveTextContent(part)
    }
  })

  it('does not let the form be sent without consent', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: /записаться/i })).toBeDisabled()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('links the consent checkbox to the published policy', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /политика/i })).toHaveAttribute('href', '/privacy')
  })
})
