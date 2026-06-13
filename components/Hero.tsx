import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/**
 * Hero «Герб конторы» — макет Claude Design (Hero нотариус v2, вариант I).
 * Универсальный геральдический герб: щит с гильош-гравировкой, весы
 * правосудия на колонне закона, свиток, лавровые ветви, лента «НОТАРИУС».
 * Герб генерируется на сервере процедурно (гипотрохоиды).
 */

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a }

function guilloche(cx: number, cy: number, R: number, r: number, d: number, amp: number): string {
  const g = gcd(R, r)
  const turns = Math.max(1, r / g)
  const steps = Math.max(900, turns * 160)
  const k = (R - r) / r
  let s = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns
    const x = cx + (amp * ((R - r) * Math.cos(t) + d * Math.cos(k * t))) / R
    const y = cy + (amp * ((R - r) * Math.sin(t) - d * Math.sin(k * t))) / R
    s += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2) + ' '
  }
  return s + 'Z'
}

function laurelBranch(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, flip: number): string {
  const B = (t: number) => { const u = 1 - t; return [u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2] }
  const T = (t: number) => {
    const dx = 2 * (1 - t) * (x1 - x0) + 2 * t * (x2 - x1), dy = 2 * (1 - t) * (y1 - y0) + 2 * t * (y2 - y1)
    const l = Math.hypot(dx, dy); return [dx / l, dy / l]
  }
  let s = `<path class="stem" d="M ${x0} ${y0} Q ${x1} ${y1} ${x2} ${y2}" fill="none" stroke="#534AB7" stroke-width="1.6" stroke-linecap="round"/>`
  const n = 11
  for (let i = 0; i < n; i++) {
    const t = 0.08 + (0.84 * i) / (n - 1)
    const [px, py] = B(t), [tx, ty] = T(t)
    const side = (i % 2 ? 1 : -1) * flip
    const ang = Math.atan2(ty, tx) + side * 0.82
    const len = 30 - 12 * (i / (n - 1))
    const dx = Math.cos(ang), dy = Math.sin(ang)
    const pxp = -dy, pyp = dx
    const w = len * 0.3
    const tipx = px + dx * len, tipy = py + dy * len
    const c1x = px + dx * len * 0.45 + pxp * w, c1y = py + dy * len * 0.45 + pyp * w
    const c2x = px + dx * len * 0.45 - pxp * w, c2y = py + dy * len * 0.45 - pyp * w
    s += `<path d="M ${px.toFixed(1)} ${py.toFixed(1)} Q ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${tipx.toFixed(1)} ${tipy.toFixed(1)} Q ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)} Z" fill="rgba(175,169,236,.3)" stroke="#534AB7" stroke-width="1" stroke-linejoin="round"/>`
    s += `<line x1="${px.toFixed(1)}" y1="${py.toFixed(1)}" x2="${(px + dx * len * 0.78).toFixed(1)}" y2="${(py + dy * len * 0.78).toFixed(1)}" stroke="#534AB7" stroke-width=".6" opacity=".5"/>`
    if (i % 3 === 2) {
      s += `<circle cx="${(px - dx * 6).toFixed(1)}" cy="${(py - dy * 6).toFixed(1)}" r="2" fill="#c8b27e"/>`
    }
  }
  return s
}

function buildCrest(sfx: string): string {
  const cx = 280, cy = 330
  const shieldD = 'M 130 130 L 430 130 L 430 300 C 430 392 368 446 280 482 C 192 446 130 392 130 300 Z'
  const shieldInnerD = 'M 142 142 L 418 142 L 418 298 C 418 384 362 434 280 468 C 198 434 142 384 142 298 Z'

  const rosettes: [number, number, number, number, string, number, number][] = [
    [222, 55, 58, 150, '#dedbf8', 0.5, 0.34],
    [200, 40, 74, 150, '#c6c0f2', 0.55, 0.28],
    [246, 82, 58, 144, '#d4d0f4', 0.5, 0.26],
    [172, 34, 84, 118, '#ece9fc', 0.45, 0.32],
    [150, 30, 92, 86, '#cdc7f3', 0.5, 0.3],
    [120, 24, 70, 58, '#dedbf8', 0.45, 0.3],
  ]
  let gFill = ''
  rosettes.forEach(p => {
    gFill += `<path d="${guilloche(280, 300, p[0], p[1], p[2], p[3])}" fill="none" stroke="${p[4]}" stroke-width="${p[5]}" opacity="${p[6]}"/>`
  })
  let hatch = ''
  for (let y = 136; y < 480; y += 6) {
    hatch += `<line x1="130" y1="${y}" x2="430" y2="${y}" stroke="#ffffff" stroke-width=".5" opacity=".045"/>`
  }

  let orn = ''
  const rays = [-45, -60, -75, -90, -105, -120, -135]
  rays.forEach(a => {
    const ra = (a * Math.PI) / 180
    const l1 = a === -90 ? 246 : 254, l2 = 276
    orn += `<line x1="${(cx + Math.cos(ra) * l1).toFixed(1)}" y1="${(cy + Math.sin(ra) * l1).toFixed(1)}" x2="${(cx + Math.cos(ra) * l2).toFixed(1)}" y2="${(cy + Math.sin(ra) * l2).toFixed(1)}" stroke="#c0bfcc" stroke-width="1.1" stroke-linecap="round"/>`
  })
  ;[[-90, 290], [-68, 286], [-112, 286]].forEach(d => {
    const ra = (d[0] * Math.PI) / 180
    orn += `<circle cx="${(cx + Math.cos(ra) * d[1]).toFixed(1)}" cy="${(cy + Math.sin(ra) * d[1]).toFixed(1)}" r="1.6" fill="#c8b27e"/>`
  })
  const corners: [number, number, number, number][] = [[64, 86, 1, 1], [496, 86, -1, 1], [64, 604, 1, -1], [496, 604, -1, -1]]
  corners.forEach(c => {
    const [x, y, sx, sy] = c
    orn += `<path d="M ${x} ${y + sy * 46} L ${x} ${y} L ${x + sx * 46} ${y}" fill="none" stroke="#c0bfcc" stroke-width="1.2" opacity=".8"/>`
    orn += `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="none" stroke="#c8b27e" stroke-width="1" transform="rotate(45 ${x} ${y})"/>`
  })
  orn += `<rect x="275" y="51" width="10" height="10" fill="none" stroke="#534AB7" stroke-width="1.2" transform="rotate(45 280 56)"/>`
  orn += `<rect x="275" y="635" width="10" height="10" fill="none" stroke="#534AB7" stroke-width="1.2" transform="rotate(45 280 640)"/>`

  const L = '#e9e7fa'
  const sym = `
    <path d="M 196 170 Q 280 158 364 170" fill="none" stroke="${L}" stroke-width="2.6"/>
    <line x1="280" y1="166" x2="280" y2="182" stroke="${L}" stroke-width="1.4"/>
    <circle cx="280" cy="186" r="4" fill="none" stroke="url(#gold-${sfx})" stroke-width="1.8"/>
    <line x1="280" y1="190" x2="280" y2="198" stroke="${L}" stroke-width="1.4"/>
    <circle cx="196" cy="170" r="2.2" fill="none" stroke="${L}" stroke-width="1.3"/>
    <circle cx="364" cy="170" r="2.2" fill="none" stroke="${L}" stroke-width="1.3"/>
    <line x1="196" y1="172" x2="170" y2="238" stroke="${L}" stroke-width="1"/>
    <line x1="196" y1="172" x2="222" y2="238" stroke="${L}" stroke-width="1"/>
    <line x1="196" y1="172" x2="196" y2="240" stroke="${L}" stroke-width="1"/>
    <line x1="364" y1="172" x2="338" y2="238" stroke="${L}" stroke-width="1"/>
    <line x1="364" y1="172" x2="390" y2="238" stroke="${L}" stroke-width="1"/>
    <line x1="364" y1="172" x2="364" y2="240" stroke="${L}" stroke-width="1"/>
    <path d="M 166 240 Q 196 250 226 240" fill="none" stroke="${L}" stroke-width="1.8"/>
    <path d="M 166 240 Q 196 272 226 240" fill="none" stroke="${L}" stroke-width="2.2"/>
    <path d="M 176 247 Q 196 258 216 247" fill="none" stroke="${L}" stroke-width=".8" opacity=".5"/>
    <path d="M 334 240 Q 364 250 394 240" fill="none" stroke="${L}" stroke-width="1.8"/>
    <path d="M 334 240 Q 364 272 394 240" fill="none" stroke="${L}" stroke-width="2.2"/>
    <path d="M 344 247 Q 364 258 384 247" fill="none" stroke="${L}" stroke-width=".8" opacity=".5"/>
    <path d="M 248 198 L 312 198" fill="none" stroke="${L}" stroke-width="2.8"/>
    <path d="M 252 206 L 308 206" fill="none" stroke="${L}" stroke-width="1.6"/>
    <path d="M 258 206 L 262 218 L 298 218 L 302 206" fill="none" stroke="${L}" stroke-width="1.6"/>
    <line x1="262" y1="218" x2="262" y2="348" stroke="${L}" stroke-width="2"/>
    <line x1="298" y1="218" x2="298" y2="348" stroke="${L}" stroke-width="2"/>
    <line x1="272" y1="224" x2="272" y2="342" stroke="${L}" stroke-width=".9" opacity=".55"/>
    <line x1="280" y1="224" x2="280" y2="342" stroke="${L}" stroke-width=".9" opacity=".55"/>
    <line x1="288" y1="224" x2="288" y2="342" stroke="${L}" stroke-width=".9" opacity=".55"/>
    <line x1="266" y1="224" x2="266" y2="340" stroke="#ffffff" stroke-width=".8" opacity=".4"/>
    <path d="M 256 348 L 304 348" fill="none" stroke="${L}" stroke-width="1.8"/>
    <path d="M 250 357 L 310 357" fill="none" stroke="${L}" stroke-width="2.4"/>
    <path d="M 204 370 Q 280 362 356 370 L 356 410 Q 280 418 204 410 Z" fill="none" stroke="${L}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 204 370 C 188 368 184 382 196 385 C 203 386.5 206 379 200 376" fill="none" stroke="${L}" stroke-width="1.8"/>
    <path d="M 356 410 C 372 412 376 398 364 395 C 357 393.5 354 400.5 360 404" fill="none" stroke="${L}" stroke-width="1.8"/>
    <line x1="222" y1="382" x2="338" y2="382" stroke="${L}" stroke-width="1" opacity=".5"/>
    <line x1="222" y1="390" x2="338" y2="390" stroke="${L}" stroke-width="1" opacity=".5"/>
    <line x1="222" y1="398" x2="338" y2="398" stroke="${L}" stroke-width="1" opacity=".5"/>
  `

  const laurels = laurelBranch(150, 538, 44, 348, 120, 156, 1) + laurelBranch(410, 538, 516, 348, 440, 156, -1)

  const ribbon = `
    <path d="M 150 534 L 96 524 L 114 557 L 96 590 L 150 580 Z" fill="#e9e7fa" stroke="#534AB7" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M 410 534 L 464 524 L 446 557 L 464 590 L 410 580 Z" fill="#e9e7fa" stroke="#534AB7" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M 150 532 Q 280 556 410 532 L 410 580 Q 280 604 150 580 Z" fill="#fbfbff" stroke="#534AB7" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M 157 540 Q 280 562 403 540" fill="none" stroke="url(#gold-${sfx})" stroke-width=".9" opacity=".9"/>
    <path d="M 157 572 Q 280 595 403 572" fill="none" stroke="url(#gold-${sfx})" stroke-width=".9" opacity=".9"/>
    <text font-family="Manrope, sans-serif" font-weight="600" font-size="22" letter-spacing=".38em" fill="#534AB7">
      <textPath href="#rib-${sfx}" startOffset="50%" text-anchor="middle">НОТАРИУС</textPath>
    </text>
  `

  return `
  <svg class="monogram" viewBox="0 0 560 660" role="img" aria-label="Герб нотариальной конторы: щит с весами правосудия, колонной закона и свитком, лавровые ветви, лента «НОТАРИУС»">
    <defs>
      <clipPath id="shieldClip-${sfx}"><path d="${shieldD}"/></clipPath>
      <path id="rib-${sfx}" d="M 150 564 Q 280 588 410 564" fill="none"/>
      <linearGradient id="violetFill-${sfx}" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#6f64d4"/><stop offset="0.5" stop-color="#534AB7"/><stop offset="1" stop-color="#403988"/>
      </linearGradient>
      <linearGradient id="silver-${sfx}" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="0.32" stop-color="#d6d5e2"/><stop offset="0.55" stop-color="#9c9ab0"/><stop offset="0.78" stop-color="#e7e6ef"/><stop offset="1" stop-color="#b3b1c4"/>
      </linearGradient>
      <linearGradient id="gold-${sfx}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#efe2b6"/><stop offset="0.5" stop-color="#c8b27e"/><stop offset="1" stop-color="#a98f53"/>
      </linearGradient>
      <radialGradient id="bloom-${sfx}" cx="0.34" cy="0.3" r="0.7">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="0.45" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow-${sfx}" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#7d72e0" stop-opacity="0.55"/><stop offset="0.6" stop-color="#534AB7" stop-opacity="0.18"/><stop offset="1" stop-color="#534AB7" stop-opacity="0"/>
      </radialGradient>
      <filter id="soft-${sfx}" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#2f2a63" flood-opacity="0.22"/>
      </filter>
    </defs>
    <ellipse class="glow" cx="280" cy="330" rx="260" ry="290" fill="url(#glow-${sfx})"/>
    <g class="fade-orn">${orn}</g>
    <g class="s3">${laurels}</g>
    <g clip-path="url(#shieldClip-${sfx})" filter="url(#soft-${sfx})" class="fade-fill">
      <path d="${shieldD}" fill="url(#violetFill-${sfx})"/>
      <ellipse cx="280" cy="285" rx="130" ry="140" fill="#ffffff" opacity=".07"/>
      ${gFill}
      ${hatch}
      <rect class="sheen" x="120" y="120" width="320" height="372" fill="url(#bloom-${sfx})"/>
    </g>
    <g class="s2">${sym}</g>
    <g>
      <path d="${shieldD}" fill="none" stroke="url(#gold-${sfx})" stroke-width="9" class="s1soft"/>
      <path d="${shieldD}" fill="none" stroke="#3a3480" stroke-width="5.5" class="s1soft"/>
      <path d="${shieldD}" fill="none" stroke="url(#silver-${sfx})" stroke-width="2.5" class="s1"/>
      <path d="${shieldInnerD}" fill="none" stroke="url(#silver-${sfx})" stroke-width="1" class="s1" opacity=".85"/>
    </g>
    <g class="s4">${ribbon}</g>
  </svg>`
}

function buildBackground(): string {
  const cx = 600, cy = 600
  let p = ''
  const rings: [number, number, number, number][] = [[260, 60, 80, 560], [230, 46, 96, 560], [300, 100, 70, 540], [200, 40, 110, 550]]
  rings.forEach((r, idx) => {
    p += `<path d="${guilloche(cx, cy, r[0], r[1], r[2], r[3])}" fill="none" stroke="#534AB7" stroke-width="${idx % 2 ? 0.6 : 0.5}" opacity="${idx % 2 ? 0.10 : 0.07}"/>`
  })
  return `<svg viewBox="0 0 1200 1200" preserveAspectRatio="xMidYMid slice">${p}</svg>`
}

const CSS = `
.lv-hero{position:relative;z-index:2;min-height:100vh;min-height:100svh;display:flex;align-items:center;padding:120px clamp(22px,6vw,96px) 80px;background:#f4f3fd;overflow:hidden;}
.lv-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.lv-bg svg{position:absolute;top:50%;left:50%;width:160vmax;height:160vmax;transform:translate(-50%,-50%);transform-origin:center;animation:lvdrift 160s linear infinite;opacity:.5;}
@keyframes lvdrift{0%{transform:translate(-50%,-50%) rotate(0deg) scale(1);}50%{transform:translate(-50%,-50%) rotate(180deg) scale(1.06);}100%{transform:translate(-50%,-50%) rotate(360deg) scale(1);}}
.lv-veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(120% 120% at 78% 30%, rgba(244,243,253,0) 40%, rgba(244,243,253,.85) 78%, #f4f3fd 100%);}
.lv-wrap{position:relative;z-index:2;width:100%;max-width:1280px;margin:0 auto;display:grid;align-items:center;gap:clamp(28px,5vw,72px);grid-template-columns:1.05fr .95fr;}
.lv-kicker{display:inline-flex;align-items:center;gap:14px;font-size:clamp(10px,1.1vw,12px);font-weight:600;letter-spacing:.42em;text-transform:uppercase;color:#8e89ad;margin-bottom:clamp(22px,3vw,34px);}
.lv-kicker::before{content:"";width:clamp(26px,4vw,52px);height:1px;background:linear-gradient(90deg,#c0bfcc,transparent);}
.lv-name{font-family:var(--font-playfair),Georgia,serif;font-weight:600;color:#2f2a63;line-height:.98;letter-spacing:-.01em;}
.lv-name .sur{display:block;font-size:clamp(46px,8vw,104px);background:linear-gradient(176deg,#4a4296 0%, #534AB7 55%, #6a60c8 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.lv-name .given{display:block;font-size:clamp(24px,4vw,48px);font-weight:500;font-style:italic;color:#3a3480;margin-top:.12em;letter-spacing:.005em;}
.lv-role{font-family:var(--font-playfair),Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(16px,2vw,22px);color:#6c6890;margin-top:clamp(16px,2.2vw,22px);display:flex;align-items:center;gap:12px;}
.lv-role::before{content:"";width:7px;height:7px;border:1px solid #c0bfcc;transform:rotate(45deg);flex:none;}
.lv-desc{font-size:clamp(14px,1.25vw,17px);font-weight:400;line-height:1.7;color:#6c6890;max-width:46ch;margin-top:clamp(20px,2.6vw,28px);}
.lv-actions{display:flex;align-items:center;flex-wrap:wrap;gap:clamp(18px,2.6vw,32px);margin-top:clamp(30px,4vw,44px);}
.lv-phone{display:flex;flex-direction:column;gap:3px;text-decoration:none;}
.lv-phone .lbl{font-size:10px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#8e89ad;}
.lv-phone .num{font-family:var(--font-playfair),Georgia,serif;font-size:clamp(18px,2.1vw,24px);font-weight:500;color:#534AB7;letter-spacing:.01em;transition:color .3s ease;}
.lv-phone:hover .num{color:#3a3480;}
.lv-mono{position:relative;display:flex;align-items:center;justify-content:center;}
.lv-mono .monogram{width:100%;max-width:560px;height:auto;overflow:visible;display:block;}
.lv-reveal{opacity:1;animation:lvrise .95s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0s);}
@keyframes lvrise{0%{opacity:0;transform:translateY(26px);}100%{opacity:1;transform:translateY(0);}}
.s1{stroke-dasharray:2600;stroke-dashoffset:2600;animation:lvdraw 1.5s cubic-bezier(.55,.1,.2,1) forwards .3s;}
@keyframes lvdraw{to{stroke-dashoffset:0;}}
.s1soft{opacity:0;animation:lvfadefill .9s ease forwards 1.15s;}
.fade-fill{opacity:0;animation:lvfadefill 1.4s ease forwards;animation-delay:1.05s;}
@keyframes lvfadefill{to{opacity:1;}}
.s2 *{stroke-dasharray:760;stroke-dashoffset:760;animation:lvdraw 1.25s cubic-bezier(.55,.1,.2,1) forwards 1.6s;}
.s3{opacity:0;animation:lvfadefill .9s ease forwards 2.3s;}
.s3 .stem{stroke-dasharray:480;stroke-dashoffset:480;animation:lvdraw 1.1s ease forwards 2.3s;}
.s4{opacity:0;animation:lvribbon .9s cubic-bezier(.2,.7,.2,1) forwards 2.9s;}
@keyframes lvribbon{0%{opacity:0;transform:translateY(14px);}100%{opacity:1;transform:translateY(0);}}
.fade-orn{opacity:0;animation:lvfadeorn 1.4s ease forwards 3.1s;}
@keyframes lvfadeorn{0%{opacity:0;}100%{opacity:.9;}}
.glow{transform-origin:center;animation:lvglow 6s ease-in-out infinite;animation-delay:3.3s;}
@keyframes lvglow{0%,100%{opacity:.32;}50%{opacity:.6;}}
.sheen{animation:lvsheen 9s ease-in-out infinite;animation-delay:3.6s;transform-origin:center;}
@keyframes lvsheen{0%,100%{opacity:.18;transform:translate(0,0);}50%{opacity:.4;transform:translate(8px,-6px);}}
@media (max-width:880px){
  .lv-hero{padding:104px clamp(22px,7vw,48px) 64px;}
  .lv-wrap{grid-template-columns:1fr;}
  .lv-mono{order:-1;max-width:420px;margin:0 auto;}
  .lv-mono .monogram{max-width:380px;}
}
@media (max-width:430px){
  .lv-hero{padding:96px 22px 56px;}
  .lv-kicker{letter-spacing:.3em;gap:10px;}
  .lv-actions{gap:20px;}
  .lv-actions .lv-btn{width:100%;}
  .lv-mono .monogram{max-width:300px;width:min(300px,82vw);}
}
@media (prefers-reduced-motion:reduce){
  .lv-reveal,.s1,.s1soft,.s2 *,.s3,.s3 .stem,.s4,.fade-fill,.fade-orn,.glow,.sheen,.lv-bg svg{animation:none !important;}
  .s1,.s2 *,.s3 .stem{stroke-dashoffset:0;}
  .s1soft,.s3,.s4,.fade-fill{opacity:1;}
  .fade-orn{opacity:.9;}
  .glow{opacity:.45;}
  .lv-reveal{opacity:1;transform:none;}
}
`

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')
  const crest = buildCrest('1')
  const bg = buildBackground()

  return (
    <section className="lv-hero" data-hero>
      <style>{CSS}</style>
      <div className="lv-bg" dangerouslySetInnerHTML={{ __html: bg }} aria-hidden />
      <div className="lv-veil" aria-hidden />

      <div className="lv-wrap">
        <div>
          <span className="lv-kicker lv-reveal" style={{ ['--d' as string]: '.05s' }}>
            Нотариальная контора · Москва
          </span>
          <h1 className="lv-name">
            <span className="sur lv-reveal" style={{ ['--d' as string]: '.18s' }}>{surname}</span>
            <span className="given lv-reveal" style={{ ['--d' as string]: '.34s' }}>{rest}</span>
          </h1>
          <p className="lv-role lv-reveal" style={{ ['--d' as string]: '.5s' }}>нотариус города Москвы</p>
          <p className="lv-desc lv-reveal" style={{ ['--d' as string]: '.64s' }}>
            Удостоверение сделок, наследственные дела, доверенности и согласия.
            Безупречная точность, конфиденциальность и внимание к каждому обращению —
            многолетняя нотариальная практика в самом сердце столицы.
          </p>
          <div className="lv-actions lv-reveal" style={{ ['--d' as string]: '.82s' }}>
            <BookingButton />
            <a className="lv-phone" href={notary.phoneHref}>
              <span className="lbl">Телефон конторы</span>
              <span className="num">{notary.phone}</span>
            </a>
          </div>
        </div>
        <div className="lv-mono" dangerouslySetInnerHTML={{ __html: crest }} />
      </div>
    </section>
  )
}
