'use client'
/** template.tsx пересоздаётся при смене маршрута — плавный переход страниц (чистый CSS). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-tx">
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: no-preference){
          .page-tx{animation:pageIn .5s cubic-bezier(.2,.7,.2,1) both;}
        }
        @keyframes pageIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
      ` }} />
    </div>
  )
}
