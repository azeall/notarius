import Image from 'next/image'

/**
 * Фотография в оформлении сайта.
 *
 * Сгенерированные снимки уже подобраны под палитру. Лёгкий слой акцентного
 * цвета связывает их с оформлением, сохраняя детали и естественные оттенки.
 *
 * Растровая сетка добавляется поверх повторяющимся градиентом: тот же
 * «отпечатанный» вид, что на первом экране, но без WebGL, поэтому работает
 * и на телефонах.
 *
 * Подпись отмечает ИИ-визуализацию, чтобы не выдавать её за реальную контору.
 */
export default function PhotoPlate({
  src,
  alt,
  caption,
  ratio = '4 / 3',
  priority = false,
}: {
  src: string
  alt: string
  caption?: string
  ratio?: string
  priority?: boolean
}) {
  return (
    <figure className="pplate" style={{ ['--ratio' as string]: ratio }}>
      <div className="pplate-frame">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 92vw, 46vw"
          className="pplate-img"
          priority={priority}
        />
        <span className="pplate-tint" aria-hidden />
        <span className="pplate-screen" aria-hidden />
      </div>
      {caption && <figcaption className="pplate-cap">{caption}</figcaption>}

      <style dangerouslySetInnerHTML={{ __html: `
        .pplate{margin:0;}
        .pplate-frame{position:relative;aspect-ratio:var(--ratio);overflow:hidden;
          border:1px solid rgb(var(--rule-rgb));background:rgb(var(--surface-2-rgb));}
        .pplate-img{object-fit:cover;}
        /* Слой акцента: снимок садится в палитру сайта, а не спорит с ней. */
        .pplate-tint{position:absolute;inset:0;pointer-events:none;
          background:rgb(var(--violet-rgb));mix-blend-mode:color;opacity:.08;}
        /* Растровая сетка — тот же приём, что на первом экране. */
        .pplate-screen{position:absolute;inset:0;pointer-events:none;opacity:.04;
          background-image:radial-gradient(rgb(var(--bg-rgb)) 34%, transparent 36%);
          background-size:4px 4px;}
        .pplate-cap{margin:12px 0 0;font-family:var(--font-mono),monospace;
          font-size:11px;letter-spacing:.16em;text-transform:uppercase;
          color:rgb(var(--muted-rgb));}
        @media (prefers-reduced-motion:reduce){ .pplate-img{transition:none;} }
      ` }} />
    </figure>
  )
}
