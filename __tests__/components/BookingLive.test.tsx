import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import BookingButton from '@/components/BookingButton'
import { openNotarybot } from '@/lib/notarybot'

jest.mock('@/components/BookingMode', () => ({ LIVE_BOOKING: true }))
jest.mock('@/lib/notarybot', () => ({ openNotarybot: jest.fn(), onNotarybotUnavailable: () => () => {} }))

afterEach(() => jest.clearAllMocks())
it('opens the external widget in live mode instead of the demo form', () => {
  jest.mocked(openNotarybot).mockReturnValue(true)
  render(<BookingButton />)
  fireEvent.click(screen.getByRole('button', { name: /Записаться на приём/i }))
  expect(openNotarybot).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
})
it('reports unavailable service without claiming a booking', () => {
  jest.mocked(openNotarybot).mockReturnValue(false)
  render(<BookingButton />)
  fireEvent.click(screen.getByRole('button', { name: /Записаться на приём/i }))
  expect(screen.getByText(/Онлайн-запись сейчас недоступна/)).toBeInTheDocument()
  expect(screen.queryByText('Демонстрация завершена')).not.toBeInTheDocument()
})