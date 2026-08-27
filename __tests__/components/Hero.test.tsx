import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import { notary, motto } from '@/lib/data'

describe('Hero', () => {
  // У варианта warm первый экран занимает фраза конторы, а не имя: имя
  // стоит вторым планом. Проверяем именно этот порядок — он и есть замысел.
  it('gives the heading to the office motto', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(motto)
  })

  it('shows the notary name below the claim', () => {
    render(<Hero />)
    expect(screen.getByText(notary.name)).toBeInTheDocument()
  })

  it('opens booking from the hero', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: /записаться/i })).toBeInTheDocument()
  })

  it('links to the document checklist', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /какие нужны документы/i })).toHaveAttribute('href', '/visit')
  })

  it('shows the office phone', () => {
    render(<Hero />)
    expect(screen.getByText(notary.phone).closest('a')).toHaveAttribute('href', notary.phoneHref)
  })
})
