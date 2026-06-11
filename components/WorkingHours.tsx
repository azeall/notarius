import { notary } from '@/lib/data'

export default function WorkingHours() {
  return (
    <div
      style={{
        background: '#fdf8ef',
        border: '1px solid rgba(192,92,46,0.15)',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <h3
        className="font-serif font-medium text-cream mb-5"
        style={{ fontSize: '18px' }}
      >
        Часы работы
      </h3>
      <table className="w-full">
        <tbody>
          {notary.workingHours.map(({ day, hours }: { day: string; hours: string }) => (
            <tr
              key={day}
              style={{ borderBottom: '1px solid rgba(192,92,46,0.08)' }}
              className="last:border-0"
            >
              <td className="py-2.5 text-[13px] text-cream font-medium pr-4">{day}</td>
              <td className="py-2.5 text-[13px] text-right" style={{ color: '#7d6a55' }}>
                {hours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
