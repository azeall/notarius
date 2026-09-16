export const LIVE_BOOKING = process.env.NEXT_PUBLIC_BOOKING_MODE === 'live'
export const CONSENT_VERSION = '2026-09-16'

export default function BookingMode() {
  return LIVE_BOOKING ? null : (
    <p className="text-sm leading-relaxed mb-4" role="note">
      Демонстрация: используйте вымышленные данные. Запись не отправляется
    </p>
  )
}
