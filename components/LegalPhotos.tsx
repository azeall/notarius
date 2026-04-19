import Image from 'next/image'

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=900&q=75',
    alt: 'Юридическая литература',
  },
  {
    src: 'https://images.unsplash.com/photo-1505664194779-8beaceb5af26?auto=format&fit=crop&w=500&q=75',
    alt: 'Судебный молоток',
  },
  {
    src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=75',
    alt: 'Подписание документов',
  },
]

export default function LegalPhotos() {
  return (
    <section className="bg-white px-4 py-6">
      <div className="max-w-6xl mx-auto">

        {/* Asymmetric 2/3 + 1/3 grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">

          {/* Large photo — left */}
          <div className="relative rounded-2xl overflow-hidden h-64 md:h-72">
            <Image
              src={PHOTOS[0].src}
              alt={PHOTOS[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-navy/15" />
          </div>

          {/* Two stacked photos — right */}
          <div className="flex flex-col gap-3">
            {PHOTOS.slice(1).map((photo) => (
              <div
                key={photo.alt}
                className="relative rounded-2xl overflow-hidden h-32 md:flex-1"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-navy/15" />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
