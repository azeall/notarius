import { notary } from '@/lib/data'

export default function WorkingHours() {
  return (
    <div className="bg-offwhite p-6 rounded">
      <h3 className="font-serif text-xl font-bold text-navy mb-4">Режим работы</h3>
      <table className="w-full text-sm">
        <tbody>
          {notary.workingHours.map(({ day, hours }) => (
            <tr key={day} className="border-b border-gray-200 last:border-0">
              <td className="py-2 font-medium text-navy pr-4">{day}</td>
              <td className="py-2 text-right text-gray-600">{hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
