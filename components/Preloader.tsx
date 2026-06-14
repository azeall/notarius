import { notary } from '@/lib/data'

/** Лёгкий брендовый прелоадер: инициал в печати, пульс, авто-исчезновение (чистый CSS). */
export default function Preloader() {
  return (
    <div className="pl" aria-hidden>
      <div className="pl-seal"><span>{notary.name.trim().charAt(0)}</span></div>
      <style>{`
        .pl{position:fixed;inset:0;z-index:200;display:grid;place-items:center;background:rgb(var(--bg-rgb));
          animation:plOut .55s ease .95s forwards;}
        .pl-seal{width:94px;height:94px;border-radius:50%;display:grid;place-items:center;
          border:2px solid rgba(200,178,126,.6);box-shadow:inset 0 0 0 6px rgba(83,74,183,.08);
          animation:plPulse 1.1s ease-in-out infinite;}
        .pl-seal span{font-family:var(--font-playfair),Georgia,serif;font-size:44px;color:#534AB7;line-height:1;}
        @keyframes plOut{to{opacity:0;visibility:hidden;}}
        @keyframes plPulse{0%,100%{transform:scale(1);box-shadow:inset 0 0 0 6px rgba(83,74,183,.08),0 0 0 0 rgba(83,74,183,.28)}
          50%{transform:scale(1.06);box-shadow:inset 0 0 0 6px rgba(83,74,183,.08),0 0 0 16px rgba(83,74,183,0)}}
        @media (prefers-reduced-motion:reduce){.pl{animation:plOut .3s ease .25s forwards;}.pl-seal{animation:none;}}
      `}</style>
    </div>
  )
}
