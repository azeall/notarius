import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ContactCard from '@/components/ContactCard'
import { notary } from '@/lib/data'

describe('ContactCard', () => {
  it('displays the address', () => {
    render(<ContactCard />)
    expect(screen.getByText(notary.address)).toBeInTheDocument()
  })

  it('displays clickable phone number', () => {
    render(<ContactCard />)
    const link = screen.getByRole('link', { name: notary.phone })
    expect(link).toHaveAttribute('href', notary.phoneHref)
  })
})
