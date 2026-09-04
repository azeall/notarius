import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'
import { notary } from '@/lib/data'

/** Имя берётся из lib/data.ts: шаблон заводится под нотариуса правкой данных,
 *  и тест на зашитом имени падал бы именно при верной настройке. */
describe('Header', () => {
  it('displays the notary name', () => {
    render(<Header />)
    expect(screen.getAllByText(notary.name).length).toBeGreaterThan(0)
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
