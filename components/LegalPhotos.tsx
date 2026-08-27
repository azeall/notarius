import Image from 'next/image'
import { photos } from '@/lib/data'

/**
 * Снимки конторы.
 *
 * Раньше здесь стояли три чужие фотографии с Unsplash. На коммерческом сайте
 * нотариуса это и выглядит как чужая контора, и упирается в лицензию, поэтому
 * снимки берутся только свои — из lib/data.ts.
 *
 * Фотографий нет — блок не выводится вовсе. Пустая рамка с подписью «здесь
 * будет фото» хуже, чем её отсутствие.
 */
export default function LegalPhotos() {
  const office = photos.office
  if (office.length === 0) return null

  const [first, ...rest] = office

  return (
    <section className="bg-navy-card px-4 py-6">
      <div className="wrap">
        <div
          className={
            rest.length > 0
              ? 'grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3'
              : 'grid grid-cols-1 gap-3'
          }
        >
          {/* Крупный снимок слева */}
          <div className="relative rounded-2xl overflow-hidden h-64 md:h-72">
            <Image
              src={first.src}
              alt={first.alt}
              fill
              className="object-cover"
              sizes={rest.length > 0 ? '(max-width: 768px) 100vw, 66vw' : '100vw'}
            />
            <div className="absolute inset-0 bg-navy/15" />
          </div>

          {/* Остальные — столбиком справа */}
          {rest.length > 0 && (
            <div className="flex flex-col gap-3">
              {rest.slice(0, 2).map((photo) => (
                <div
                  key={photo.src}
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
          )}
        </div>
      </div>
    </section>
  )
}
