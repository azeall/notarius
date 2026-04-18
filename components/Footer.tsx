import { notary } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-400 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p className="font-serif text-white font-semibold">{notary.name}</p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center items-center">
          <span>{notary.address}</span>
          <a href={notary.phoneHref} className="hover:text-gold transition-colors">
            {notary.phone}
          </a>
        </div>
        <p>© {new Date().getFullYear()} Все права защищены</p>
      </div>
    </footer>
  )
}
