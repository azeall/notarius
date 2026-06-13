import { notary, motto } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/**
 * Hero «Прошитый документ» — макет Claude Design (Нотариус - Hero v2).
 * Стопка листов, верхний прошит терракотовым шнуром: стежки продеваются,
 * завязывается бант, хвосты уходят вниз к качающейся бирке-заверению.
 */

const ART = `
<svg viewBox="0 0 600 640" role="img" aria-label="Стопка листов, прошитая терракотовым шнуром с узлом и бумажной биркой-заверением">
  <defs>
    <radialGradient id="wglow1" cx="50%" cy="48%" r="55%">
      <stop offset="0%" stop-color="#e8c9a0" stop-opacity="0.6"/>
      <stop offset="70%" stop-color="#e8c9a0" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#e8c9a0" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <ellipse class="wglow" cx="300" cy="330" rx="255" ry="240" fill="url(#wglow1)"/>
  <ellipse class="pop" style="--pl:0.3s;" cx="305" cy="560" rx="180" ry="20" fill="#3d2010" opacity="0.08"/>

  <g transform="translate(312,338) rotate(4)">
    <g class="pop" style="--pl:0.25s;"><g class="floaty" style="--fdu:8s;--fde:1.8s;">
      <rect x="-132" y="-172" width="264" height="344" rx="4" fill="#f0e4cf" stroke="#3d2010" stroke-width="1.4"/>
    </g></g>
  </g>
  <g transform="translate(294,344) rotate(-3.5)">
    <g class="pop" style="--pl:0.4s;"><g class="floaty" style="--fdu:7.4s;--fde:0.9s;">
      <rect x="-132" y="-172" width="264" height="344" rx="4" fill="#f7efdf" stroke="#3d2010" stroke-width="1.4"/>
    </g></g>
  </g>

  <g transform="translate(303,340) rotate(0.5)">
    <g class="floaty" style="--fdu:6.6s;">
      <g class="pop" style="--pl:0.55s;">
        <rect x="-134" y="-176" width="268" height="352" rx="4" fill="#fbf6ea" stroke="#3d2010" stroke-width="1.7"/>
        <path d="M134,-176 L134,-148 L106,-176 Z" fill="#e8c9a0" stroke="#3d2010" stroke-width="1.4" stroke-linejoin="round"/>
      </g>

      <!-- шапка бланка: медальон с весами правосудия и орнаментальные разделители -->
      <g class="pop" style="--pl:0.72s;">
        <!-- фланкирующие линии с ромбами на концах -->
        <line x1="-66" y1="-152" x2="1" y2="-152" stroke="#c05c2e" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="37" y1="-152" x2="104" y2="-152" stroke="#c05c2e" stroke-width="1.4" stroke-linecap="round"/>
        <rect x="-69" y="-155" width="6" height="6" fill="#c05c2e" transform="rotate(45 -66 -152)"/>
        <rect x="101" y="-155" width="6" height="6" fill="#c05c2e" transform="rotate(45 104 -152)"/>
        <circle cx="1" cy="-152" r="1.5" fill="#a84d23"/>
        <circle cx="37" cy="-152" r="1.5" fill="#a84d23"/>
        <!-- медальон: внешнее кольцо, кольцо-насечки, внутренний ободок -->
        <circle cx="19" cy="-152" r="15" fill="#fbf6ea" stroke="#a84d23" stroke-width="1.6"/>
        <circle cx="19" cy="-152" r="15" fill="none" stroke="#7e3617" stroke-width="0.5" opacity="0.45"/>
        <circle cx="19" cy="-152" r="12.4" fill="none" stroke="#e8a07a" stroke-width="0.7" stroke-dasharray="0.8 2.5"/>
        <circle cx="19" cy="-152" r="10.4" fill="none" stroke="#c05c2e" stroke-width="0.7"/>
        <!-- весы правосудия: коромысло, цепи, чаши, основание -->
        <line x1="19" y1="-162" x2="19" y2="-146" stroke="#a84d23" stroke-width="1.4" stroke-linecap="round"/>
        <circle cx="19" cy="-162.6" r="1.5" fill="#a84d23"/>
        <line x1="9" y1="-159" x2="29" y2="-159" stroke="#a84d23" stroke-width="1.3" stroke-linecap="round"/>
        <circle cx="9" cy="-159" r="1" fill="#a84d23"/>
        <circle cx="29" cy="-159" r="1" fill="#a84d23"/>
        <path d="M9,-159 L6.6,-151.6 M9,-159 L11.4,-151.6" stroke="#a84d23" stroke-width="0.55"/>
        <path d="M5,-151.6 a4,2.4 0 0 0 8,0" fill="none" stroke="#c05c2e" stroke-width="1.1"/>
        <path d="M29,-159 L26.6,-151.6 M29,-159 L31.4,-151.6" stroke="#a84d23" stroke-width="0.55"/>
        <path d="M25,-151.6 a4,2.4 0 0 0 8,0" fill="none" stroke="#c05c2e" stroke-width="1.1"/>
        <line x1="14" y1="-145.5" x2="24" y2="-145.5" stroke="#a84d23" stroke-width="1.6" stroke-linecap="round"/>
        <!-- двойной разделитель с центральным ромбом -->
        <line x1="-66" y1="-134" x2="-6" y2="-134" stroke="#3d2010" stroke-width="0.9" opacity="0.4"/>
        <line x1="44" y1="-134" x2="104" y2="-134" stroke="#3d2010" stroke-width="0.9" opacity="0.4"/>
        <rect x="16" y="-137" width="6" height="6" fill="none" stroke="#c05c2e" stroke-width="1" transform="rotate(45 19 -134)"/>
        <line x1="-50" y1="-131" x2="88" y2="-131" stroke="#3d2010" stroke-width="0.55" opacity="0.22"/>
      </g>

      <line class="wstroke thin draw" pathLength="1" style="--dl:1.0s;--dd:0.8s;stroke:rgba(61,32,16,0.35);" x1="-92" y1="-176" x2="-92" y2="176"/>

      <line class="pop" style="--pl:1.2s;" x1="-66" y1="-130" x2="52" y2="-130" stroke="#c05c2e" stroke-width="3" stroke-linecap="round"/>
      <line class="pop" style="--pl:1.3s;" x1="-66" y1="-96" x2="104" y2="-96" stroke="#e8c9a0" stroke-width="2.6" stroke-linecap="round"/>
      <line class="pop" style="--pl:1.36s;" x1="-66" y1="-74" x2="104" y2="-74" stroke="#e8c9a0" stroke-width="2.6" stroke-linecap="round"/>
      <line class="pop" style="--pl:1.42s;" x1="-66" y1="-52" x2="84" y2="-52" stroke="#e8c9a0" stroke-width="2.6" stroke-linecap="round"/>
      <line class="pop" style="--pl:1.48s;" x1="-66" y1="-30" x2="104" y2="-30" stroke="#e8c9a0" stroke-width="2.6" stroke-linecap="round"/>
      <line class="pop" style="--pl:1.54s;" x1="-66" y1="-8" x2="104" y2="-8" stroke="#e8c9a0" stroke-width="2.6" stroke-linecap="round"/>
      <line class="pop" style="--pl:1.6s;" x1="-66" y1="14" x2="64" y2="14" stroke="#e8c9a0" stroke-width="2.6" stroke-linecap="round"/>
      <line class="pop" style="--pl:1.66s;" x1="-66" y1="36" x2="104" y2="36" stroke="#e8c9a0" stroke-width="2.6" stroke-linecap="round"/>
      <line class="pop" style="--pl:1.72s;" x1="-66" y1="58" x2="92" y2="58" stroke="#e8c9a0" stroke-width="2.6" stroke-linecap="round"/>
      <!-- круглая печать нотариуса вместо подписи (оттиск штампа) -->
      <g class="seal" style="--sl:2.0s;" transform="translate(-10,106) rotate(-7)">
        <circle r="31" fill="none" stroke="#a84d23" stroke-width="2.6" stroke-opacity="0.82"/>
        <circle r="26.5" fill="none" stroke="#a84d23" stroke-width="1" stroke-opacity="0.7"/>
        <circle r="13" fill="none" stroke="#a84d23" stroke-width="0.9" stroke-opacity="0.6"/>
        <path id="wmStampRing" d="M-20,0 a20,20 0 1,1 40,0 a20,20 0 1,1 -40,0" fill="none"/>
        <text font-family="Manrope, sans-serif" font-size="5.6" font-weight="700" letter-spacing="1.5" fill="#a84d23" fill-opacity="0.85">
          <textPath href="#wmStampRing" startOffset="0">· НОТАРИУС · ГОРОД МОСКВА · РОССИЙСКАЯ ФЕДЕРАЦИЯ </textPath>
        </text>
        <g stroke="#a84d23" stroke-opacity="0.85">
          <line x1="0" y1="-11" x2="0" y2="7" stroke-width="1.5"/>
          <circle cx="0" cy="-11.6" r="1.6" fill="#a84d23" stroke="none"/>
          <line x1="-9.5" y1="-7.5" x2="9.5" y2="-7.5" stroke-width="1.5"/>
          <path d="M-9.5,-7.5 L-13,-0.5 M-9.5,-7.5 L-6,-0.5" stroke-width="0.6"/>
          <path d="M-13.5,-0.5 a4.4,2.6 0 0 0 8.8,0" fill="none" stroke-width="1.3"/>
          <path d="M9.5,-7.5 L6,-0.5 M9.5,-7.5 L13,-0.5" stroke-width="0.6"/>
          <path d="M5,-0.5 a4.4,2.6 0 0 0 8.8,0" fill="none" stroke-width="1.3"/>
          <line x1="-6" y1="7" x2="6" y2="7" stroke-width="1.7" stroke-linecap="round"/>
        </g>
      </g>

      <g class="pop" style="--pl:2.25s;"><circle cx="-113" cy="-78" r="4.2" fill="#f5ede0" stroke="#3d2010" stroke-width="1.6"/></g>
      <g class="pop" style="--pl:2.33s;"><circle cx="-113" cy="0" r="4.2" fill="#f5ede0" stroke="#3d2010" stroke-width="1.6"/></g>
      <g class="pop" style="--pl:2.41s;"><circle cx="-113" cy="78" r="4.2" fill="#f5ede0" stroke="#3d2010" stroke-width="1.6"/></g>

      <path class="cord draw" pathLength="1" style="--dl:2.55s;--dd:0.55s;" d="M-113,-78 C-110,-52 -110,-26 -113,0"/>
      <path class="cord draw" pathLength="1" style="--dl:3.0s;--dd:0.55s;" d="M-113,0 C-116,26 -116,52 -113,78"/>
      <path class="cord draw" pathLength="1" style="--dl:2.45s;--dd:0.35s;" d="M-134,-92 C-128,-88 -120,-83 -113,-78"/>
      <path class="cord draw" pathLength="1" style="--dl:3.45s;--dd:0.35s;" d="M-113,78 C-120,83 -128,88 -134,92"/>
      <path class="cord draw" pathLength="1" style="--dl:3.6s;--dd:0.6s;" d="M-113,0 C-140,-20 -150,6 -119,5"/>
      <path class="cord draw" pathLength="1" style="--dl:3.75s;--dd:0.6s;" d="M-113,0 C-86,-20 -76,6 -107,5"/>
      <g class="pop" style="--pl:3.95s;"><circle cx="-113" cy="2" r="5" fill="#a84d23"/></g>
      <path class="cord draw" pathLength="1" style="--dl:4.0s;--dd:0.7s;stroke-width:3;" d="M-116,6 C-128,44 -118,84 -130,124 C-134,138 -136,150 -135,162"/>
      <path class="cord draw" pathLength="1" style="--dl:4.1s;--dd:0.7s;stroke-width:3;" d="M-109,7 C-100,46 -110,86 -101,126 C-98,140 -98,152 -101,164"/>

      <g class="swing" style="--so:-118px 130px;">
        <g class="pop" style="--pl:4.55s;">
          <g transform="translate(-118,178) rotate(-7)">
            <rect x="-44" y="-32" width="88" height="64" rx="4" fill="#fbf6ea" stroke="#3d2010" stroke-width="1.6"/>
            <line x1="-28" y1="-14" x2="14" y2="-14" stroke="#c05c2e" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="-28" y1="0" x2="28" y2="0" stroke="#e8c9a0" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="-28" y1="12" x2="28" y2="12" stroke="#e8c9a0" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M2,24 C10,18 18,26 28,22" fill="none" stroke="#c05c2e" stroke-width="1.8" stroke-linecap="round"/>
          </g>
        </g>
      </g>

      <!-- ленты под печатью свисают за край листа -->
      <g class="pop" style="--pl:4.9s;">
        <path d="M56,150 L42,202 L60,192 L66,154 Z" fill="#c05c2e" stroke="#7e3617" stroke-width="1" stroke-linejoin="round"/>
        <path d="M72,150 L92,198 L74,192 L66,154 Z" fill="#a84d23" stroke="#7e3617" stroke-width="1" stroke-linejoin="round"/>
        <path d="M59,154 L51,190" stroke="#fbe6d8" stroke-width="0.7" opacity="0.4"/>
      </g>

      <!-- сургучная печать конторы (прижимается в конце) -->
      <g class="seal" style="--sl:5.1s;" transform="translate(64,132)">
        <ellipse cx="3" cy="6" rx="34" ry="30" fill="#3d2010" opacity="0.14"/>
        <path d="M0,-33 C13,-34 21,-27 26,-18 C34,-20 39,-13 37,-5 C43,-1 43,8 36,12 C39,22 31,31 22,29 C18,37 6,39 0,32 C-6,39 -18,37 -22,29 C-31,31 -39,22 -36,12 C-43,8 -43,-1 -37,-5 C-39,-13 -34,-20 -26,-18 C-21,-27 -13,-34 0,-33 Z" fill="#a84d23"/>
        <circle r="28" fill="#c05c2e"/>
        <circle r="28" fill="none" stroke="#7e3617" stroke-width="2" opacity="0.4"/>
        <circle r="24" fill="none" stroke="#e8a07a" stroke-width="0.9" opacity="0.5"/>
        <path id="wmSealRing" d="M-18,0 a18,18 0 1,1 36,0 a18,18 0 1,1 -36,0" fill="none"/>
        <text font-family="Manrope, sans-serif" font-size="6.2" font-weight="700" letter-spacing="1.8" fill="#fbe6d8">
          <textPath href="#wmSealRing" startOffset="0">НОТАРИУС · МОСКВА · </textPath>
        </text>
        <g stroke="#fbe6d8" stroke-width="1" stroke-linecap="round">
          <line x1="0" y1="-9" x2="0" y2="9"/><line x1="-9" y1="0" x2="9" y2="0"/>
          <line x1="-6.4" y1="-6.4" x2="6.4" y2="6.4"/><line x1="6.4" y1="-6.4" x2="-6.4" y2="6.4"/>
        </g>
        <circle r="4.2" fill="none" stroke="#fbe6d8" stroke-width="1.2"/>
        <ellipse cx="-8" cy="-9" rx="13" ry="8" fill="#ffffff" opacity="0.15"/>
      </g>
    </g>
  </g>

  <rect class="twinkle" style="--tw:4.8s;" x="118" y="148" width="9" height="9" fill="#c05c2e" transform="rotate(45 122.5 152.5)"/>
  <rect class="twinkle" style="--tw:6.2s;" x="478" y="120" width="8" height="8" fill="#e8c9a0" transform="rotate(45 482 124)"/>
  <rect class="twinkle" style="--tw:7.6s;" x="500" y="430" width="8" height="8" fill="#c05c2e" transform="rotate(45 504 434)"/>
  <rect class="twinkle" style="--tw:9s;" x="106" y="470" width="7" height="7" fill="#e8c9a0" transform="rotate(45 109.5 473.5)"/>
</svg>
`

const CSS = `
.wm-hero{min-height:100vh;min-height:100svh;display:grid;grid-template-columns:1fr 1.04fr;align-items:center;gap:clamp(24px,4vw,64px);max-width:1440px;margin:0 auto;padding:clamp(28px,6vw,90px);position:relative;background:#f5ede0;}
.wm-text{max-width:620px;}
.wm-art{position:relative;}
.wm-art svg{display:block;width:100%;max-width:660px;height:auto;margin-inline:auto;overflow:visible;}
.wm-eyebrow{font-size:12px;font-weight:600;letter-spacing:0.24em;color:rgba(61,32,16,0.62);text-transform:uppercase;}
.wm-eyebrow .dot{color:#c05c2e;}
.wm-h1{font-family:var(--font-playfair),Georgia,serif;font-weight:600;font-size:clamp(40px,5.6vw,76px);line-height:1.06;margin-top:clamp(14px,2vw,22px);color:#3d2010;}
.wm-motto{font-family:var(--font-playfair),Georgia,serif;font-style:italic;font-weight:500;font-size:clamp(20px,2.1vw,28px);color:#c05c2e;margin-top:clamp(12px,1.6vw,18px);}
.wm-desc{font-size:clamp(15px,1.25vw,17.5px);line-height:1.65;color:rgba(61,32,16,0.78);margin-top:clamp(18px,2.2vw,26px);max-width:50ch;}
.wm-cta{display:flex;align-items:center;flex-wrap:wrap;gap:clamp(16px,2vw,28px);margin-top:clamp(24px,3vw,38px);}
.wm-phone{font-weight:700;font-size:17px;color:#3d2010;text-decoration:none;border-bottom:2px solid rgba(192,92,46,0);transition:border-color 0.25s ease;white-space:nowrap;}
.wm-phone:hover{border-color:#c05c2e;}
@media (prefers-reduced-motion: no-preference){
  .cas{opacity:0;animation:wmrise 0.8s cubic-bezier(0.2,0.7,0.2,1) var(--cl,0s) forwards;}
}
@keyframes wmrise{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
svg .wstroke{fill:none;stroke:#3d2010;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
svg .wstroke.thin{stroke-width:1.5;}
svg .wstroke.terra{stroke:#c05c2e;}
svg .cord{fill:none;stroke:#c05c2e;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round;}
@media (prefers-reduced-motion: no-preference){
  .draw{stroke-dasharray:1 1;stroke-dashoffset:1;animation:wmdraw var(--dd,1.2s) cubic-bezier(0.45,0,0.2,1) var(--dl,0s) forwards;}
}
@keyframes wmdraw{to{stroke-dashoffset:0;}}
svg .pop, svg .floaty, svg .swing{transform-box:fill-box;transform-origin:center;}
@media (prefers-reduced-motion: no-preference){
  .pop{opacity:0;animation:wmpop 0.9s cubic-bezier(0.2,0.8,0.3,1.05) var(--pl,0s) forwards;}
  .floaty{animation:wmfloat var(--fdu,7s) ease-in-out var(--fde,0s) infinite;}
  .swing{transform-box:view-box;transform-origin:var(--so);animation:wmswing 6.5s ease-in-out infinite;}
  .wglow{animation:wmglow 7s ease-in-out infinite;}
  .twinkle{transform-box:fill-box;transform-origin:center;opacity:0;animation:wmtwinkle 6s ease-in-out var(--tw,0s) infinite;}
  .seal{transform-box:fill-box;transform-origin:center;opacity:0;animation:wmstamp 0.5s cubic-bezier(0.34,1.45,0.5,1) var(--sl,0s) forwards;}
}
@keyframes wmpop{from{opacity:0;transform:translateY(12px) scale(0.85);}to{opacity:1;transform:none;}}
@keyframes wmfloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
@keyframes wmswing{0%,100%{transform:rotate(2deg);}50%{transform:rotate(-2deg);}}
@keyframes wmglow{0%,100%{opacity:0.55;}50%{opacity:0.85;}}
@keyframes wmtwinkle{0%,18%,100%{opacity:0;transform:scale(0.2) rotate(45deg);}9%{opacity:0.9;transform:scale(1) rotate(45deg);}}
@keyframes wmstamp{0%{opacity:0;transform:scale(1.55);}55%{opacity:1;}100%{opacity:1;transform:scale(1);}}
@media (max-width: 940px){
  .wm-hero{grid-template-columns:1fr;gap:8px;padding:clamp(24px,6vw,48px);text-align:center;}
  .wm-text{max-width:560px;margin-inline:auto;}
  .wm-desc{margin-inline:auto;}
  .wm-cta{justify-content:center;}
  .wm-art svg{max-width:420px;margin-top:16px;}
}
@media (max-width: 420px){
  .wm-cta{gap:14px;}
  .wm-cta .booking-cta{width:100%;}
}
`

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')

  return (
    <section className="wm-hero" data-hero>
      <style>{CSS}</style>
      <div className="wm-text">
        <p className="wm-eyebrow cas" style={{ ['--cl' as string]: '0.1s' }}>
          Нотариальная контора <span className="dot">·</span> Москва
        </p>
        <h1 className="wm-h1 cas" style={{ ['--cl' as string]: '0.22s' }}>
          {surname}
          <br />
          {rest}
        </h1>
        <p className="wm-motto cas" style={{ ['--cl' as string]: '0.36s' }}>{motto}</p>
        <p className="wm-desc cas" style={{ ['--cl' as string]: '0.5s' }}>
          Веду нотариальную практику с {notary.practiceSince} года: наследственные дела, семейные
          соглашения, сделки с недвижимостью и доверенности. Каждый документ проверяю,
          заверяю и прошиваю лично — спокойно, грамотно и с вниманием к деталям.
        </p>
        <div className="wm-cta cas" style={{ ['--cl' as string]: '0.64s' }}>
          <BookingButton />
          <a className="wm-phone" href={notary.phoneHref}>{notary.phone}</a>
        </div>
      </div>

      <div className="wm-art" dangerouslySetInnerHTML={{ __html: ART }} />
    </section>
  )
}
