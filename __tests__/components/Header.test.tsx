import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'
import { notary } from '@/lib/data'

describe('Header', () => {
  // В шапке стоит фамилия с инициалами: полное имя обрезалось многоточием.
  it('displays the notary surname', () => {
    render(<Header />)
    const surname = notary.name.trim().split(/\s+/)[0]
    expect(screen.getAllByText(new RegExp(surname))[0]).toBeInTheDocument()
  })

  it('has a link to services', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: /услуги/i }).length).toBeGreaterThan(0)
  })

  it('has a link to contacts', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: /контакты/i }).length).toBeGreaterThan(0)
  })

  it('marks the current section', () => {
    render(<Header />)
    const current = screen.getAllByRole('link', { name: /главная/i })
    expect(current.some(el => el.getAttribute('aria-current') === 'page')).toBe(true)
  })
})
