import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import WorkingHours from '@/components/WorkingHours'

describe('WorkingHours', () => {
  it('renders all 7 days', () => {
    render(<WorkingHours />)
    expect(screen.getByText('Понедельник')).toBeInTheDocument()
    expect(screen.getByText('Суббота')).toBeInTheDocument()
    expect(screen.getByText('Воскресенье')).toBeInTheDocument()
  })

  it('shows Выходной for weekend', () => {
    render(<WorkingHours />)
    expect(screen.getAllByText('Выходной')).toHaveLength(2)
  })
})
