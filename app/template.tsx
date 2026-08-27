'use client'
/**
 * template.tsx пересоздаётся при каждой смене маршрута — даёт плавный
 * переход страниц без сторонних библиотек (чистый CSS).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-tx">
      {children}
      <style>{`
        /* Переход между страницами: содержимое поднимается из-под тонкой
           маски, а не просто выцветает. Сдвиг маленький и быстрый — переход
           должен ощущаться, а не отнимать время у того, кто просто хочет
           открыть страницу с ценами. */
        @media (prefers-reduced-motion: no-preference){
          .page-tx{animation:pageIn .55s cubic-bezier(.22,.8,.24,1) both;}
        }
        @keyframes pageIn{
          from{opacity:0;transform:translateY(18px);clip-path:inset(6% 0 0 0);}
          to{opacity:1;transform:none;clip-path:inset(0 0 0 0);}
        }
      `}</style>
    </div>
  )
}
