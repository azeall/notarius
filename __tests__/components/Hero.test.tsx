import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero', () => {
  it('displays notary name as heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Горбунов Николай Александрович')
  })

  it('has a CTA link to contacts', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: /записаться/i })
    expect(cta).toHaveAttribute('href', '/contacts')
  })
})
