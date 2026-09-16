import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import BookingModal from '@/components/BookingModal'
import { SERVICES } from '@/lib/services'

it('completes a browser-only demo with consent without any network requests', async () => {
  const fetchMock = jest.fn(() => Promise.reject(new Error('Unexpected network request')))
  global.fetch = fetchMock
  render(<BookingModal onClose={() => {}} initialDate={{year: 2030, month: 0, day: 7}} initialTime="10:00" />)
  expect(screen.getByText(/Демонстрация: используйте вымышленные данные/)).toBeInTheDocument()
  fireEvent.change(screen.getByRole('combobox'), { target: { value: SERVICES[0] } })
  fireEvent.click(screen.getByRole('button', { name: /Далее/ }))
  fireEvent.change(screen.getByPlaceholderText('Иванов Иван Иванович'), { target: { value: 'Демо Тестовый' } })
  fireEvent.change(screen.getByPlaceholderText('+7 (999) 000-00-00'), { target: { value: '+7 (000) 000-00-00' } })
  expect(screen.getByRole('button', { name: 'Записаться' })).toBeDisabled()
  expect(screen.getByRole('link', { name: 'текст согласия' })).toHaveAttribute('href', '/consent')
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByRole('button', { name: 'Записаться' }))
  await waitFor(() => expect(screen.getByText('Демонстрация завершена')).toBeInTheDocument())
  expect(fetchMock).not.toHaveBeenCalled()
})
