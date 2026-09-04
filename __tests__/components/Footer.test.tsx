import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'
import { notary } from '@/lib/data'

describe('Footer', () => {
  it('displays the notary name', () => {
    render(<Footer />)
    expect(screen.getAllByText(notary.name)[0]).toBeInTheDocument()
  })

  it('displays the phone number', () => {
    render(<Footer />)
    expect(screen.getAllByText(notary.phone)[0]).toBeInTheDocument()
  })

  it('phone links to tel:', () => {
    render(<Footer />)
    const link = screen.getAllByRole('link', { name: notary.phone })[0]
    expect(link).toHaveAttribute('href', notary.phoneHref)
  })
})
