import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

export default function Hero() {
  return (
    <section className="bg-navy text-white py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gold uppercase tracking-widest text-sm mb-4 font-medium">
          Нотариальная контора
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {notary.name}
        </h1>
        <p className="text-gray-300 text-lg mb-10">{notary.title}</p>
        <BookingButton className="inline-block bg-gold text-white px-10 py-3 font-semibold uppercase tracking-wider hover:bg-amber-600 transition-colors rounded-sm" />
      </div>
    </section>
  )
}