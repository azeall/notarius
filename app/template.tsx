'use client'
/**
 * template.tsx пересоздаётся при каждой смене маршрута — даёт плавный
 * переход страниц без сторонних библиотек (чистый CSS).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-tx">
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Переход между страницами: содержимое поднимается из-под тонкой
           маски, а не просто выцветает. Сдвиг маленький и быстрый — переход
           должен ощущаться, а не отнимать время у того, кто просто хочет
           открыть страницу с ценами. */
        /* fill-mode backwards, а не both.

           both оставляет конечный кадр применённым навсегда. Здесь в нём
           transform:none и clip-path:inset(0 0 0 0) — оба «пустые» на вид,
           но transform, отличный от отсутствующего, делает элемент содержащим
           блоком для position:fixed, а clip-path обрезает потомков, включая
           закреплённых. Любой будущий fixed внутри страницы сломается молча.

           На site-warm это уже выстрелило: панель «Ваша папка» вела себя как
           absolute и уезжала на тысячи пикселей вниз. Здесь пока не стреляет
           — окно записи вынесено из дерева страницы, — но ловушка лежала
           заряженной.

           backwards даёт ту же картинку и отпускает свойства по окончании. */
        @media (prefers-reduced-motion: no-preference){
          .page-tx{animation:pageIn .55s cubic-bezier(.22,.8,.24,1) backwards;}
        }
        @keyframes pageIn{
          from{opacity:0;transform:translateY(18px);clip-path:inset(6% 0 0 0);}
          to{opacity:1;transform:none;clip-path:inset(0 0 0 0);}
        }
      ` }} />
    </div>
  )
}
