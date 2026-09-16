import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import BookingModal from '@/components/BookingModal'
import { SERVICES } from '@/lib/services'

jest.mock('@/components/BookingMode', () => ({ __esModule: true, default: () => null, LIVE_BOOKING: true, CONSENT_VERSION: '2026-09-16' }))

it('sends explicit versioned consent in configured live mode', async () => {
  const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ booked: [] }) })
  global.fetch = fetchMock
  render(<BookingModal onClose={() => {}} initialDate={{year: 2030, month: 0, day: 7}} initialTime="10:00" />)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: SERVICES[0] } })
  fireEvent.click(screen.getByRole('button', { name: /Далее/ }))
  fireEvent.change(screen.getByPlaceholderText('Иванов Иван Иванович'), { target: { value: 'Демо Тестовый' } })
  fireEvent.change(screen.getByPlaceholderText('+7 (999) 000-00-00'), { target: { value: '+7 (000) 000-00-00' } })
  expect(screen.getByRole('button', { name: 'Записаться' })).toBeDisabled()
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByRole('button', { name: 'Записаться' }))
  await waitFor(() => expect(screen.getByText('Заявка отправлена')).toBeInTheDocument())
  const [, options] = fetchMock.mock.calls.find(([, init]) => init?.method === 'POST')!
  expect(JSON.parse(options.body)).toMatchObject({ consent: true, consentVersion: '2026-09-16' })
})
