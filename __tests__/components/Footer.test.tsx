import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

describe('Footer', () => {
  it('displays the notary name', () => {
    render(<Footer />)
    expect(screen.getByText('Быконя Руслан Евгеньевич')).toBeInTheDocument()
  })

  it('displays the phone number', () => {
    render(<Footer />)
    expect(screen.getByText('+7 (499) 647-88-77')).toBeInTheDocument()
  })

  it('phone links to tel:', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: '+7 (499) 647-88-77' })
    expect(link).toHaveAttribute('href', 'tel:+74996478877')
  })
})
