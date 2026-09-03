import Image from 'next/image'
import ReadingRail from './ReadingRail'

/**
 * Шапка внутренней страницы.
 *
 * До этого все шесть внутренних страниц открывались одинаково: мелкая
 * надпись капслоком, заголовок в 4xl и абзац — набор из другой эпохи, чем
 * главная. Контейнер у них тоже был свой (max-w-6xl px-4), поэтому левый
 * край страницы прыгал при переходе с главной.
 *
 * Здесь тот же язык, что на главной: подпись в скобках моноширинным,
 * крупная антиква, линейка снизу. Плюс снимок справа — из тех трёх, что уже
 * лежат в public: новых генерировать не нужно, а страница перестаёт быть
 * голым текстом.
 *
 * Снимок необязателен: без него шапка просто занимает всю ширину.
 */
export default function PageHero({
  tag,
  title,
  lead,
  photo,
  photoAlt,
}: {
  tag: string
  title: string
  lead?: string
  photo?: string
  photoAlt?: string
}) {
  return (
    <>
      <ReadingRail />
      <section className="pghero">
      <div className={`wrap pghero-in${photo ? ' has-photo' : ''}`}>
        <div>
          <p className="pghero-tag">[ {tag} ]</p>
          <h1 className="pghero-title">{title}</h1>
          {lead && <p className="pghero-lead">{lead}</p>}
        </div>

        {photo && (
          <div className="pghero-photo">
            <Image
              src={photo}
              alt={photoAlt || ''}
              fill
              sizes="(max-width: 900px) 92vw, 38vw"
              className="pghero-img"
              priority
            />
            <span className="pghero-tint" aria-hidden />
            <span className="pghero-screen" aria-hidden />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .pghero{position:relative;background:rgb(var(--bg-rgb));
          padding:clamp(92px,10vh,120px) 0 clamp(40px,5vh,60px);
          border-bottom:1px solid rgb(var(--rule-rgb));}
        /* Линейка дорисовывается — то же движение, что у меток разделов на
           главной: внутренние страницы не должны выглядеть другим сайтом.

           Конечное состояние задано в самом правиле (scaleX(1)), а анимация
           идёт из нуля с fill-mode backwards. forwards здесь тоже сработал бы,
           но оставил бы transform применённым навсегда — а именно этим на
           этой ветке уже ломало position:fixed (коммит f839f5c). */
        .pghero::after{content:"";position:absolute;left:0;bottom:-1px;height:2px;
          width:min(260px,34%);background:rgb(var(--violet-rgb));
          transform:scaleX(1);transform-origin:left;}
        @media (prefers-reduced-motion: no-preference){
          .pghero::after{animation:pgRule .9s cubic-bezier(.22,.8,.24,1) .12s backwards;}
        }
        @keyframes pgRule{from{transform:scaleX(0);}}
        /* По центру, а не по нижнему краю: при выравнивании по низу над
           заголовком зияла пустота почти в треть экрана. */
        .pghero-in{display:grid;gap:clamp(24px,4vw,56px);align-items:center;}
        .pghero-in.has-photo{grid-template-columns:1.25fr .75fr;}
        .pghero-tag{margin:0 0 clamp(14px,2vw,20px);font-family:var(--font-mono),monospace;
          font-size:12px;letter-spacing:.16em;text-transform:uppercase;
          color:rgb(var(--violet-rgb));}
        .pghero-title{margin:0;font-family:var(--font-display),Georgia,serif;
          font-weight:600;font-size:clamp(34px,5vw,68px);line-height:1.02;
          letter-spacing:-.028em;color:rgb(var(--text-rgb));}
        .pghero-lead{margin:clamp(14px,2vw,20px) 0 0;font-size:clamp(15px,1.15vw,17px);
          line-height:1.65;color:rgb(var(--muted-rgb));max-width:52ch;}

        /* Снимок обрабатывается так же, как в секциях главной: обесцвечен,
           подкрашен акцентом и накрыт растровой сеткой. Иначе он выпал бы из
           палитры и читался вставленной картинкой. */
        .pghero-photo{position:relative;aspect-ratio:16/10;overflow:hidden;
          border:1px solid rgb(var(--rule-rgb));background:rgb(var(--surface-2-rgb));}
        .pghero-img{object-fit:cover;filter:grayscale(1) contrast(1.18) brightness(.98);}
        .pghero-tint{position:absolute;inset:0;background:rgb(var(--violet-rgb));
          mix-blend-mode:color;opacity:.55;}
        .pghero-screen{position:absolute;inset:0;opacity:.26;
          background-image:radial-gradient(rgb(var(--bg-rgb)) 34%, transparent 36%);
          background-size:4px 4px;}

        @media (max-width:900px){
          .pghero-in.has-photo{grid-template-columns:1fr;align-items:start;}
          .pghero-photo{aspect-ratio:16/9;}
        }
      ` }} />
      </section>
    </>
  )
}
