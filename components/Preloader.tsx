import { notary } from '@/lib/data'

/** Лёгкий брендовый прелоадер: инициал в печати, пульс, авто-исчезновение (чистый CSS). */
export default function Preloader() {
  return (
    <div className="pl" aria-hidden>
      <div className="pl-seal"><span>{notary.name.trim().charAt(0)}</span></div>
      <style>{`
        .pl{position:fixed;inset:0;z-index:200;display:grid;place-items:center;background:#ffffff;
          animation:plOut .55s ease .95s forwards;}
        .pl-seal{width:92px;height:92px;border-radius:22px;display:grid;place-items:center;
          background:#e8f5f0;animation:plPulse 1.1s ease-in-out infinite;}
        .pl-seal span{font-family:var(--font-manrope),system-ui,sans-serif;font-weight:800;font-size:46px;color:#1D9E75;line-height:1;}
        @keyframes plOut{to{opacity:0;visibility:hidden;}}
        @keyframes plPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(29,158,117,.28)}
          50%{transform:scale(1.06);box-shadow:0 0 0 16px rgba(29,158,117,0)}}
        @media (prefers-reduced-motion:reduce){.pl{animation:plOut .3s ease .25s forwards;}.pl-seal{animation:none;}}
      `}</style>
    </div>
  )
}
