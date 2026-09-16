import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import { notary } from '@/lib/data'

/**
 * Шаблон заводится под нового нотариуса правкой lib/data.ts. Раньше здесь
 * стояло зашитое «Иванов Иван Иванович» — тест падал ровно в тот момент,
 * когда шаблон настроен правильно, и приучал не смотреть на красное.
 *
 * Имя в заголовке разбито переносом на фамилию и остальное, поэтому
 * сверяются части, а не строка целиком.
 */
describe('Hero', () => {
  it('displays notary name as heading', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    for (const part of notary.name.trim().split(/\s+/)) {
      expect(heading).toHaveTextContent(part)
    }
  })

  it('opens booking from the hero', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: /записаться/i })).toBeInTheDocument()
  })

  it('shows the office phone', () => {
    render(<Hero />)
    expect(screen.getByText(notary.phone).closest('a')).toHaveAttribute('href', notary.phoneHref)
  })
})
