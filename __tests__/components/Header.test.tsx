import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'
import { notary } from '@/lib/data'

describe('Header', () => {
  it('displays the notary name', () => {
    render(<Header />)
    expect(screen.getAllByText(notary.name)[0]).toBeInTheDocument()
  })

  it('has a link to services', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: /услуги/i }).length).toBeGreaterThan(0)
  })

  it('has a link to contacts', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: /контакты/i }).length).toBeGreaterThan(0)
  })

  // Подсветка текущего раздела — единственный признак того, где человек
  // находится: семь пунктов меню выглядят одинаково на всех страницах.
  it('marks the current section', () => {
    render(<Header />)
    const current = screen.getAllByRole('link', { name: /главная/i })
    expect(current.some(el => el.getAttribute('aria-current') === 'page')).toBe(true)
  })
})
