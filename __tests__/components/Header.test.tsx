import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

describe('Header', () => {
  it('displays the notary name', () => {
    render(<Header />)
    expect(screen.getAllByText('Иванов Иван Иванович')[0]).toBeInTheDocument()
  })

  it('has a link to services', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: /услуги/i }).length).toBeGreaterThan(0)
  })

  it('has a link to contacts', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: /контакты/i }).length).toBeGreaterThan(0)
  })
})
