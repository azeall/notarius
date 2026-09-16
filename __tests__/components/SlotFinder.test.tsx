import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { hydrateRoot, Root } from 'react-dom/client'
import SlotFinder from '@/components/SlotFinder'

Object.assign(globalThis, { TextEncoder: require('util').TextEncoder, TextDecoder: require('util').TextDecoder })
const { renderToString } = require('react-dom/server.node')
jest.mock('@/components/BookingModal', () => () => null)
jest.mock('@/components/BookingMode', () => ({ LIVE_BOOKING: true }))

describe('SlotFinder', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ booked: [] }) })
  })
  afterEach(() => jest.useRealTimers())

  it('hydrates cached markup on a different day without replacing the server HTML', async () => {
    jest.setSystemTime(new Date('2026-09-14T08:00:00Z'))
    const container = document.createElement('div')
    container.innerHTML = renderToString(<SlotFinder />)
    document.body.appendChild(container)
    jest.setSystemTime(new Date('2026-09-16T08:00:00Z'))
    const onRecoverableError = jest.fn()
    let root: Root
    await act(async () => { root = hydrateRoot(container, <SlotFinder />, { onRecoverableError }) })
    expect(onRecoverableError).not.toHaveBeenCalled()
    await act(async () => root.unmount())
    container.remove()
  })

  it('does not offer unverified appointments when availability fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('offline'))
    await act(async () => { render(<SlotFinder />) })
    expect(screen.queryByRole('button', { name: /записаться на это время/i })).not.toBeInTheDocument()
    expect(screen.getByText(/не удалось проверить/i)).toBeInTheDocument()
  })
})
