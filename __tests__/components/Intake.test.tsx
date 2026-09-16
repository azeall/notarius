import '@testing-library/jest-dom'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Intake from '@/components/Intake'
import { CASES } from '@/lib/cases'

jest.mock('@/components/BookingInline', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/LiveStatus', () => ({ __esModule: true, default: () => null }))

beforeEach(() => {
  localStorage.clear()
  Element.prototype.scrollIntoView = jest.fn()
})

it('keeps the folder beside the checklist and preserves its document progress', () => {
  render(<Intake />)
  const toggle = screen.getByRole('button', { name: /Папка/ })
  const checklist = toggle.closest('section')!
  expect(within(checklist).getByText('Что взять с собой')).toBeInTheDocument()
  expect(toggle).toHaveAttribute('aria-expanded', 'false')

  fireEvent.click(within(checklist).getByRole('button', { name: /Паспорт/ }))
  expect(toggle).toHaveTextContent(`1/${CASES[0].bring.length}`)
  fireEvent.click(toggle)
  const panel = document.getElementById(toggle.getAttribute('aria-controls')!)!
  expect(panel).toBeVisible()
  expect(within(panel).getByText('Паспорт').closest('li')).toHaveAttribute('data-done', 'true')

  fireEvent.click(screen.getByRole('button', { name: new RegExp(CASES[1].label) }))
  expect(within(panel).getByText(CASES[1].label)).toBeInTheDocument()
  expect(toggle).toHaveTextContent(`0/${CASES[1].bring.length}`)
  fireEvent.click(within(panel).getByRole('button', { name: 'Записаться' }))
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(panel).not.toBeVisible()
  expect(document.getElementById('kogda')!.scrollIntoView).toHaveBeenCalled()
})
