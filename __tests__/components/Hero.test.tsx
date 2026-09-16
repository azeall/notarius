import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import { notary } from '@/lib/data'

describe('Hero', () => {
  it('has one primary heading', () => {
    render(<Hero />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
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
