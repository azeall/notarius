'use client'
/** template.tsx пересоздаётся при смене маршрута — плавный переход страниц (чистый CSS). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-tx">
      {children}
      <style>{`
        /* fill-mode backwards, а не both.

           both оставляет конечный кадр применённым навсегда, а в нём есть
           transform:none — и это всё равно transform. Любой transform, кроме
           отсутствующего, делает элемент содержащим блоком для position:fixed,
           и закрепление внутри страницы ломается насовсем.

           На site-warm это уже стоило сломанной панели «Ваша папка»: она
           уезжала на тысячи пикселей вниз. Здесь пока не стреляет, но любой
           будущий fixed внутри страницы сломался бы так же и так же молча. */
        @media (prefers-reduced-motion: no-preference){
          .page-tx{animation:pageIn .5s cubic-bezier(.2,.7,.2,1) backwards;}
        }
        @keyframes pageIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
      `}</style>
    </div>
  )
}
