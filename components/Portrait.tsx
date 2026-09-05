import Image from 'next/image'
import { notary, photos } from '@/lib/data'

/**
 * Портрет нотариуса в круге.
 *
 * Пока фотографии нет, показывает первую букву фамилии — ровно то, что
 * стояло здесь раньше. Поэтому сайт можно выкладывать до того, как нотариус
 * пришлёт снимок, и ничего не сломается и не поедет: размер круга один и тот
 * же в обоих случаях.
 *
 * Подложка буквы задаётся снаружи: у вариантов оформления фон карточки
 * разный, и общего значения, которое читалось бы на всех, нет.
 */
export default function Portrait({
  size = 80,
  fallbackClass = 'bg-white/10',
}: {
  size?: number
  fallbackClass?: string
}) {
  const common =
    'rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto mb-4 overflow-hidden'

  if (!photos.portrait) {
    return (
      <div className={`${fallbackClass} ${common}`} style={{ width: size, height: size }}>
        <span className="font-serif text-2xl font-bold text-gold-ink">
          {notary.name.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative ${common}`} style={{ width: size, height: size }}>
      <Image
        src={photos.portrait}
        alt={`${notary.name} — ${notary.title}`}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  )
}
