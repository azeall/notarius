import { notary } from '@/lib/data'

export default function WorkingHours() {
  return (
    <div
      style={{
        background: '#0f1e35',
        border: '1px solid rgba(184,154,90,0.15)',
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
              style={{ borderBottom: '1px solid rgba(184,154,90,0.08)' }}
              className="last:border-0"
            >
              <td className="py-2.5 text-[13px] text-cream font-medium pr-4">{day}</td>
              <td className="py-2.5 text-[13px] text-right" style={{ color: '#8a9ab5' }}>
                {hours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
