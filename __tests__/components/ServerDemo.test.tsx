import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import BookingButton from '@/components/BookingButton'
import LiveStatus from '@/components/LiveStatus'
import DemoRibbon from '@/components/DemoRibbon'

const widgetWindow = window as unknown as { notarybot?: { open: () => void } }
const originalFetch = global.fetch

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.reject(new Error('Unexpected site API request')))
})

afterEach(() => {
  delete widgetWindow.notarybot
  global.fetch = originalFetch
})

it.each([BookingButton, LiveStatus])('%p opens the server demo without a local form or site API', Component => {
  const open = jest.fn()
  widgetWindow.notarybot = { open }
  render(<Component />)
  const buttons = screen.getAllByRole('button')
  expect(buttons).toHaveLength(1)
  expect(buttons[0]).toHaveTextContent('Записаться на приём')
  fireEvent.click(buttons[0])
  expect(open).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  expect(global.fetch).not.toHaveBeenCalled()
})

it('reports an unavailable widget and allows a retry after the script loads', () => {
  render(<BookingButton />)
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByText(/Онлайн-запись сейчас недоступна/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Открыть серверное демо/ })).toHaveAttribute('href', 'https://app.guidecode.ru/widget/demo')
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  widgetWindow.notarybot = { open: jest.fn() }
  fireEvent.click(screen.getByRole('button'))
  expect(screen.queryByText(/Онлайн-запись сейчас недоступна/)).not.toBeInTheDocument()
  act(() => document.dispatchEvent(new Event('notarybot:unavailable')))
  expect(screen.getByText(/Онлайн-запись сейчас недоступна/)).toBeInTheDocument()
  expect(global.fetch).not.toHaveBeenCalled()
})

it('warns on every page that fake data are submitted to a test cabinet', () => {
  render(<DemoRibbon />)
  expect(screen.getByRole('note')).toHaveTextContent(/используйте вымышленные данные/i)
  expect(screen.getByRole('note')).toHaveTextContent(/тестовый кабинет/i)
})
