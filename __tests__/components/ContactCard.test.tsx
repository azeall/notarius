import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ContactCard from '@/components/ContactCard'

describe('ContactCard', () => {
  it('displays the address', () => {
    render(<ContactCard />)
    expect(screen.getByText('ул. Архитектора Щусева, 5к2, Москва')).toBeInTheDocument()
  })

  it('displays clickable phone number', () => {
    render(<ContactCard />)
    const link = screen.getByRole('link', { name: '+7 (499) 647-88-77' })
    expect(link).toHaveAttribute('href', 'tel:+74996478877')
  })
})
