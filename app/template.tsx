'use client'
/** template.tsx пересоздаётся при смене маршрута — плавный переход страниц (чистый CSS). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-tx">
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        /* fill-mode backwards, а не both.

           both оставляет конечный кадр применённым навсегда, а в нём есть
           transform — пусть и тождественный, transform:none. Любой transform,
           кроме отсутствующего, делает элемент содержащим блоком для
           position:fixed, и закрепление внутри страницы ломается насовсем.

           На главной от этого не работала панель «Ваша папка»: объявленная
           fixed, она вела себя как absolute и уезжала на тысячи пикселей вниз
           — человек наполнял папку, ни разу её не увидев. Замер показывал
           смещение её верха один в один с прокруткой.

           backwards даёт ту же картинку: до старта — первый кадр, во время —
           анимация, после — собственные стили элемента, а они и есть
           opacity:1 и transform:none. Разница только в том, что после
           окончания анимации transform отпускается. */
        @media (prefers-reduced-motion: no-preference){
          .page-tx{animation:pageIn .5s cubic-bezier(.2,.7,.2,1) backwards;}
        }
        @keyframes pageIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
      ` }} />
    </div>
  )
}
