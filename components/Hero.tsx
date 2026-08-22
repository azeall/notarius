import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'

/**
 * Hero «Герб конторы» — макет Claude Design (Hero нотариус v2, вариант I).
 * Универсальный геральдический герб: щит с гильош-гравировкой, весы
 * правосудия на колонне закона, свиток, лавровые ветви, лента «НОТАРИУС».
 * Герб генерируется на сервере процедурно (гипотрохоиды).
 */

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a }

function guilloche(cx: number, cy: number, R: number, r: number, d: number, amp: number, detail?: number): string {
  const g = gcd(R, r)
  const turns = Math.max(1, r / g)
  // detail задаётся там, где известно, каким размером кривая рисуется:
  // 900 точек по умолчанию для мелкой розетки — заведомый перебор.
  const steps = detail ?? Math.max(900, turns * 160)
  const k = (R - r) / r

  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns
    xs.push((amp * ((R - r) * Math.cos(t) + d * Math.cos(k * t))) / R)
    ys.push((amp * ((R - r) * Math.sin(t) - d * Math.sin(k * t))) / R)
  }

  /* Кривая ставится по своей рамке, а не по началу координат.
     У розетки с нечётным числом лепестков центр формулы и центр рисунка —
     разные точки: при трёх лепестках рисунок уезжает вбок почти на треть
     радиуса. В медальоне это сразу видно, поэтому сдвиг считаем всегда. */
  const dx = cx - (Math.min(...xs) + Math.max(...xs)) / 2
  const dy = cy - (Math.min(...ys) + Math.max(...ys)) / 2

  let s = ''
  for (let i = 0; i <= steps; i++) {
    s += (i ? 'L' : 'M') + (xs[i] + dx).toFixed(2) + ' ' + (ys[i] + dy).toFixed(2) + ' '
  }
  return s + 'Z'
}

/* Медальон конторы.
 *
 * Раньше здесь был универсальный геральдический щит: шесть гильош-розеток,
 * две лавровые ветви с прожилками, корона, лента. Он весил 270 КБ разметки
 * и попадал в страницу дважды — в саму разметку и в данные Next.js, — из-за
 * чего главная отдавала 146 КБ против 19–29 у соседних сайтов. И при всём
 * труде он был одинаковый у любого нотариуса.
 *
 * Медальон складывается из notary.name и notary.title, поэтому у каждой
 * конторы получается свой, без единой правки в вёрстке.
 *
 * Государственный герб намеренно не рисуется. Настоящая нотариальная печать
 * несёт его по закону, и декоративная копия читалась бы как подделка оттиска.
 * Весы — знак ремесла, а не элемент печати.
 *
 * Надписи растянуты по кольцу через textLength: имена у нотариусов разной
 * длины, и без этого у одних текст не дотянет до низа кольца, а у других
 * уедет за него.
 */

/** Дуга через верх (sweep 1) или через низ (sweep 0) — для надписей по кругу. */
function ringPath(cx: number, cy: number, r: number, overTop: boolean): string {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 ${overTop ? 1 : 0} ${cx + r} ${cy}`
}

function buildSeal(sfx: string): string {
  const cx = 280
  const cy = 280
  const name = notary.name.trim().toUpperCase()
  const title = notary.title.trim().toUpperCase()

  // Две гильош-дорожки: частые лепестки, как в гравюре на бланках.
  // Пара 240/12 даёт 19 лепестков, 240/15 — 15; вместе получается плетение.
  // Точек хватает 900 и 700: отклонение от кривой меньше трети пикселя.
  const laceOuter = guilloche(cx, cy, 240, 12, 26, 146, 900)
  const laceInner = guilloche(cx, cy, 240, 15, 20, 108, 700)

  const gold = `url(#gold-${sfx})`
  const violet = '#534AB7'
  const pale = '#cdc7f3'

  const scales = `
    <g fill="none" stroke="${gold}" stroke-width="3.2" stroke-linecap="round">
      <line x1="${cx}" y1="228" x2="${cx}" y2="326"/>
      <line x1="${cx - 78}" y1="250" x2="${cx + 78}" y2="250"/>
      <line x1="${cx - 34}" y1="326" x2="${cx + 34}" y2="326"/>
    </g>
    <g fill="none" stroke="${pale}" stroke-width="1.6">
      <line x1="${cx - 78}" y1="252" x2="${cx - 78}" y2="276"/>
      <line x1="${cx + 78}" y1="252" x2="${cx + 78}" y2="276"/>
      <path d="M ${cx - 108} 276 Q ${cx - 78} 300 ${cx - 48} 276 Z" fill="rgba(205,199,243,.16)"/>
      <path d="M ${cx + 48} 276 Q ${cx + 78} 300 ${cx + 108} 276 Z" fill="rgba(205,199,243,.16)"/>
    </g>
    <circle cx="${cx}" cy="250" r="7.5" fill="#241f57" stroke="${gold}" stroke-width="2.6"/>
    <circle cx="${cx}" cy="222" r="5" fill="${gold}"/>`

  // Ромбы-разделители на концах кольца с надписью
  const diamond = (x: number, y: number) =>
    `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="none" stroke="${gold}" stroke-width="1.4" transform="rotate(45 ${x} ${y})"/>`

  return `
  <svg class="monogram" viewBox="0 0 560 560" role="img" aria-label="Медальон нотариальной конторы: ${name}, весы правосудия в центре">
    <defs>
      <linearGradient id="gold-${sfx}" gradientUnits="userSpaceOnUse" x1="60" y1="60" x2="500" y2="500">
        <stop offset="0" stop-color="#efe2b6"/><stop offset="0.5" stop-color="#c8b27e"/><stop offset="1" stop-color="#a98f53"/>
      </linearGradient>
      <radialGradient id="field-${sfx}" cx="0.42" cy="0.36" r="0.75">
        <stop offset="0" stop-color="#3a3480"/><stop offset="1" stop-color="#241f57"/>
      </radialGradient>
      <path id="ringTop-${sfx}" d="${ringPath(cx, cy, 214, true)}" fill="none"/>
      <path id="ringBottom-${sfx}" d="${ringPath(cx, cy, 202, false)}" fill="none"/>
    </defs>

    <circle cx="${cx}" cy="${cy}" r="248" fill="url(#field-${sfx})"/>

    <circle class="s1" cx="${cx}" cy="${cy}" r="248" fill="none" stroke="${gold}" stroke-width="3"/>

    <g class="s1soft">
      <circle cx="${cx}" cy="${cy}" r="238" fill="none" stroke="${violet}" stroke-width="1.2" opacity=".9"/>
      <circle cx="${cx}" cy="${cy}" r="182" fill="none" stroke="${violet}" stroke-width="1.6" opacity=".9"/>
      <circle cx="${cx}" cy="${cy}" r="175" fill="none" stroke="${gold}" stroke-width="0.9" opacity=".75"/>
      ${diamond(cx - 210, cy)}
      ${diamond(cx + 210, cy)}
    </g>

    <g class="fade-fill">
      <path d="${laceOuter}" fill="none" stroke="${pale}" stroke-width="0.55" opacity=".34"/>
      <path d="${laceInner}" fill="none" stroke="#dedbf8" stroke-width="0.45" opacity=".22"/>
    </g>

    <g class="s3">${scales}</g>

    <g class="s4" fill="#e9e7fa" font-family="Manrope, sans-serif" font-weight="600">
      <text font-size="27" letter-spacing=".1em">
        <textPath href="#ringTop-${sfx}" startOffset="50%" text-anchor="middle" textLength="600" lengthAdjust="spacing">${name}</textPath>
      </text>
      <text font-size="21" letter-spacing=".16em" fill="#c8b27e">
        <textPath href="#ringBottom-${sfx}" startOffset="50%" text-anchor="middle" textLength="470" lengthAdjust="spacing">${title}</textPath>
      </text>
    </g>
  </svg>`
}

function buildBackground(): string {
  const cx = 600, cy = 600
  let p = ''
  // Пятое число — плотность точек. Подобрана замером: при ней ломаная
  // отходит от кривой меньше чем на треть пикселя. Прежние 900 у всех колец
  // были перебором и стоили около 30 КБ разметки на каждое.
  const rings: [number, number, number, number, number][] = [
    [260, 60, 80, 560, 600],
    [230, 46, 96, 560, 260],
    [300, 100, 70, 540, 150],
    [200, 40, 110, 550, 340],
  ]
  rings.forEach((r, idx) => {
    p += `<path d="${guilloche(cx, cy, r[0], r[1], r[2], r[3], r[4])}" fill="none" stroke="#534AB7" stroke-width="${idx % 2 ? 0.6 : 0.5}" opacity="${idx % 2 ? 0.10 : 0.07}"/>`
  })
  return `<svg viewBox="0 0 1200 1200" preserveAspectRatio="xMidYMid slice">${p}</svg>`
}

const CSS = `
.lv-hero{position:relative;z-index:2;min-height:100vh;min-height:100svh;display:flex;align-items:center;padding:120px clamp(22px,6vw,96px) 80px;background:rgb(var(--bg-rgb));overflow:hidden;}
.lv-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.lv-bg svg{position:absolute;top:50%;left:50%;width:160vmax;height:160vmax;transform:translate(-50%,-50%);transform-origin:center;animation:lvdrift 160s linear infinite;opacity:.5;}
@keyframes lvdrift{0%{transform:translate(-50%,-50%) rotate(0deg) scale(1);}50%{transform:translate(-50%,-50%) rotate(180deg) scale(1.06);}100%{transform:translate(-50%,-50%) rotate(360deg) scale(1);}}
.lv-veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(120% 120% at 78% 30%, rgba(244,243,253,0) 40%, rgba(244,243,253,.85) 78%, rgb(var(--bg-rgb)) 100%);}
.lv-wrap{position:relative;z-index:2;width:100%;max-width:1280px;margin:0 auto;display:grid;align-items:center;gap:clamp(28px,5vw,72px);grid-template-columns:1.05fr .95fr;}
.lv-kicker{display:inline-flex;align-items:center;gap:14px;font-size:clamp(10px,1.1vw,12px);font-weight:600;letter-spacing:.42em;text-transform:uppercase;color:rgb(var(--muted-d-rgb));margin-bottom:clamp(22px,3vw,34px);}
.lv-kicker::before{content:"";width:clamp(26px,4vw,52px);height:1px;background:linear-gradient(90deg,#c0bfcc,transparent);}
.lv-name{font-family:var(--font-playfair),Georgia,serif;font-weight:600;color:#2f2a63;line-height:.98;letter-spacing:-.01em;}
.lv-name .sur{display:block;font-size:clamp(46px,8vw,104px);background:linear-gradient(176deg,#4a4296 0%, #534AB7 55%, #6a60c8 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.lv-name .given{display:block;font-size:clamp(24px,4vw,48px);font-weight:500;font-style:italic;color:rgb(var(--text-c-rgb));margin-top:.12em;letter-spacing:.005em;}
.lv-role{font-family:var(--font-playfair),Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(16px,2vw,22px);color:rgb(var(--muted-e-rgb));margin-top:clamp(16px,2.2vw,22px);display:flex;align-items:center;gap:12px;}
.lv-role::before{content:"";width:7px;height:7px;border:1px solid #c0bfcc;transform:rotate(45deg);flex:none;}
.lv-desc{font-size:clamp(14px,1.25vw,17px);font-weight:400;line-height:1.7;color:rgb(var(--muted-e-rgb));max-width:46ch;margin-top:clamp(20px,2.6vw,28px);}
.lv-actions{display:flex;align-items:center;flex-wrap:wrap;gap:clamp(18px,2.6vw,32px);margin-top:clamp(30px,4vw,44px);}
.lv-phone{display:flex;flex-direction:column;gap:3px;text-decoration:none;}
.lv-phone .lbl{font-size:10px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:rgb(var(--muted-d-rgb));}
.lv-phone .num{font-family:var(--font-playfair),Georgia,serif;font-size:clamp(18px,2.1vw,24px);font-weight:500;color:#534AB7;letter-spacing:.01em;transition:color .3s ease;}
.lv-phone:hover .num{color:rgb(var(--text-c-rgb));}
.lv-textcol{align-self:start;}
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
.s5{opacity:0;transform-origin:280px 130px;animation:lvcrown .85s cubic-bezier(.2,.7,.2,1) forwards 2.55s;}
@keyframes lvcrown{0%{opacity:0;transform:translateY(-12px) scale(.92);}100%{opacity:1;transform:translateY(0) scale(1);}}
.fade-orn{opacity:0;animation:lvfadeorn 1.4s ease forwards 3.1s;}
@keyframes lvfadeorn{0%{opacity:0;}100%{opacity:.9;}}
.glow{transform-origin:center;animation:lvglow 6s ease-in-out infinite;animation-delay:3.3s;}
@keyframes lvglow{0%,100%{opacity:.32;}50%{opacity:.6;}}
.sheen{animation:lvsheen 9s ease-in-out infinite;animation-delay:3.6s;transform-origin:center;}
@keyframes lvsheen{0%,100%{opacity:.18;transform:translate(0,0);}50%{opacity:.4;transform:translate(8px,-6px);}}
@media (max-width:880px){
  .lv-hero{padding:104px clamp(22px,7vw,48px) 64px;}
  .lv-wrap{grid-template-columns:1fr;}
  .lv-mono{order:-1;max-width:480px;margin:0 auto;transform:none;}
  .lv-mono .monogram{max-width:440px;}
}
@media (max-width:430px){
  .lv-hero{padding:96px 22px 56px;}
  .lv-kicker{letter-spacing:.3em;gap:10px;}
  .lv-actions{gap:20px;}
  .lv-actions .lv-btn{width:100%;}
  .lv-mono .monogram{max-width:360px;width:min(360px,92vw);}
}
@media (prefers-reduced-motion:reduce){
  .lv-reveal,.s1,.s1soft,.s2 *,.s3,.s3 .stem,.s4,.s5,.fade-fill,.fade-orn,.glow,.sheen,.lv-bg svg{animation:none !important;}
  .s1,.s2 *,.s3 .stem{stroke-dashoffset:0;}
  .s1soft,.s3,.s4,.s5,.fade-fill{opacity:1;transform:none;}
  .fade-orn{opacity:.9;}
  .glow{opacity:.45;}
  .lv-reveal{opacity:1;transform:none;}
}
`

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')
  const crest = buildSeal('1')
  const bg = buildBackground()

  return (
    <section className="lv-hero" data-hero>
      <style>{CSS}</style>
      <div className="lv-bg" dangerouslySetInnerHTML={{ __html: bg }} aria-hidden />
      <div className="lv-veil" aria-hidden />

      <div className="lv-wrap">
        <div className="lv-textcol">
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
