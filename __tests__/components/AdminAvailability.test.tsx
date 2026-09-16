import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import AdminAddForm from '@/components/AdminAddForm'
import AdminAppointmentCard from '@/components/AdminAppointmentCard'

jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh: jest.fn() }) }))

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date(2030, 0, 7, 9))
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ booked: [] }) })
})
afterEach(() => jest.useRealTimers())

it('loads availability for the assigned staff member through the admin endpoint', async () => {
  render(<AdminAddForm defaultStaffId="staff_2" />)
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: '8' })) })
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/admin/appointments?date=2030-01-08&staffId=staff_2'))
})

it('uses the appointment assignee when checking a reschedule', async () => {
  render(<AdminAppointmentCard isAdmin a={{ id: 'demo', name: 'Демо', phone: '0000000000', service: 'Доверенности', date: '2030-01-08', time: '10:00', duration: 30, status: 'new', staffId: 'staff_3' }} />)
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Перенести' })) })
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/admin/appointments?date=2030-01-08&staffId=staff_3'))
})
