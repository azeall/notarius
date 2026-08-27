import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import { notary } from '@/lib/data'

describe('Hero', () => {
  // Заголовок первого экрана — то, чем занимается контора, а не фамилия.
  // Прежде здесь стояло имя в 134 пикселя: ответ на вопрос, которого
  // пришедший не задавал. Проверяем именно этот порядок, он и есть замысел.
  it('gives the heading to what the office does', () => {
    render(<Hero />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(/удостоверяем сделки/i)
    expect(h1).not.toHaveTextContent(notary.name)
  })

  it('shows the notary name below the lead', () => {
    render(<Hero />)
    expect(screen.getByText(new RegExp(notary.name))).toBeInTheDocument()
  })

  it('keeps the city title capitalised', () => {
    render(<Hero />)
    expect(screen.getByText(/нотариус города Москвы/)).toBeInTheDocument()
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
