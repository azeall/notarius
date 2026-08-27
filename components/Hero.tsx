import Link from 'next/link'
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
  const laceOuter = guilloche(cx, cy, 240, 12, 26, 146, 900)
  const laceInner = guilloche(cx, cy, 240, 15, 20, 108, 700)

  // Оттиск одноцветный. Золото на тёмно-синем поле делало из печати брошь:
  // предмет, который носят, а не которым заверяют. Здесь она положена на
  // бумагу и набрана одной краской — так печать и выглядит на документе.
  const ink = 'rgb(var(--violet-rgb))'

  const scales = `
    <g fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round">
      <line x1="${cx}" y1="228" x2="${cx}" y2="326"/>
      <line x1="${cx - 78}" y1="250" x2="${cx + 78}" y2="250"/>
      <line x1="${cx - 34}" y1="326" x2="${cx + 34}" y2="326"/>
      <line x1="${cx - 78}" y1="252" x2="${cx - 78}" y2="276"/>
      <line x1="${cx + 78}" y1="252" x2="${cx + 78}" y2="276"/>
    </g>
    <g fill="none" stroke="${ink}" stroke-width="1.6" opacity=".75">
      <path d="M ${cx - 108} 276 Q ${cx - 78} 300 ${cx - 48} 276 Z"/>
      <path d="M ${cx + 48} 276 Q ${cx + 78} 300 ${cx + 108} 276 Z"/>
    </g>
    <circle cx="${cx}" cy="250" r="7" fill="rgb(var(--bg-rgb))" stroke="${ink}" stroke-width="2.4"/>
    <circle cx="${cx}" cy="222" r="4.5" fill="${ink}"/>`

  const diamond = (x: number, y: number) =>
    `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="none" stroke="${ink}" stroke-width="1.4" transform="rotate(45 ${x} ${y})"/>`

  return `
  <svg class="monogram" viewBox="0 0 560 560" role="img" aria-label="Оттиск нотариальной конторы: ${name}, весы правосудия в центре">
    <defs>
      <path id="ringTop-${sfx}" d="${ringPath(cx, cy, 214, true)}" fill="none"/>
      <path id="ringBottom-${sfx}" d="${ringPath(cx, cy, 202, false)}" fill="none"/>
    </defs>

    <circle class="s1" cx="${cx}" cy="${cy}" r="248" fill="none" stroke="${ink}" stroke-width="2.4"/>

    <g class="s1soft" opacity=".8">
      <circle cx="${cx}" cy="${cy}" r="238" fill="none" stroke="${ink}" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="182" fill="none" stroke="${ink}" stroke-width="1.4"/>
      <circle cx="${cx}" cy="${cy}" r="175" fill="none" stroke="${ink}" stroke-width="0.7" opacity=".6"/>
      ${diamond(cx - 210, cy)}
      ${diamond(cx + 210, cy)}
    </g>

    <g class="fade-fill">
      <path d="${laceOuter}" fill="none" stroke="${ink}" stroke-width="0.5" opacity=".30"/>
      <path d="${laceInner}" fill="none" stroke="${ink}" stroke-width="0.45" opacity=".20"/>
    </g>

    <g class="s3">${scales}</g>

    <g class="s4" fill="${ink}" font-family="var(--font-sans), sans-serif" font-weight="500">
      <text font-size="26" letter-spacing=".1em">
        <textPath href="#ringTop-${sfx}" startOffset="50%" text-anchor="middle" textLength="600" lengthAdjust="spacing">${name}</textPath>
      </text>
      <text font-size="20" letter-spacing=".16em" opacity=".72">
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
    // Водяной знак, а не узор: на бумаге гильош должен угадываться,
    // а не соревноваться с текстом за внимание.
    p += `<path d="${guilloche(cx, cy, r[0], r[1], r[2], r[3], r[4])}" fill="none" stroke="rgb(var(--violet-rgb))" stroke-width="${idx % 2 ? 0.6 : 0.5}" opacity="${idx % 2 ? 0.055 : 0.04}"/>`
  })
  return `<svg viewBox="0 0 1200 1200" preserveAspectRatio="xMidYMid slice">${p}</svg>`
}

const CSS = `
/* Первый экран.
 *
 * Было: имя фиолетовым градиентом по центру левой колонки и медальон
 * во всю правую — композиция витрины, где главный герой оформление.
 *
 * Стало: строгая сетка и типографика (образец — Kononenko Architectural
 * Bureau), а печать убрана в карточку с реквизитами. Украшение стало
 * сведением: рядом с оттиском стоят лицензия и реестровый номер, и правая
 * колонка теперь что-то сообщает, а не просто занимает место. */
.lv-hero{position:relative;z-index:2;min-height:100svh;display:flex;align-items:center;
  padding:clamp(110px,14vh,150px) clamp(22px,6vw,96px) clamp(64px,9vh,96px);
  background:rgb(var(--bg-rgb));overflow:hidden;}
.lv-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.lv-bg svg{position:absolute;top:50%;left:50%;width:170vmax;height:170vmax;transform:translate(-50%,-50%);transform-origin:center;animation:lvdrift 220s linear infinite;opacity:.85;}
@keyframes lvdrift{0%{transform:translate(-50%,-50%) rotate(0deg) scale(1);}50%{transform:translate(-50%,-50%) rotate(180deg) scale(1.05);}100%{transform:translate(-50%,-50%) rotate(360deg) scale(1);}}
.lv-veil{position:absolute;inset:0;z-index:1;pointer-events:none;
  background:radial-gradient(120% 120% at 76% 34%, rgb(var(--bg-rgb) / 0) 38%, rgb(var(--bg-rgb) / .82) 74%, rgb(var(--bg-rgb)) 100%);}

.lv-wrap{position:relative;z-index:2;width:100%;max-width:1240px;margin:0 auto;
  display:grid;align-items:center;gap:clamp(40px,5vw,80px);grid-template-columns:1.15fr .85fr;}

/* Верхняя линейка с округом — задаёт левый край всей сетке. */
.lv-kicker{display:flex;align-items:center;gap:16px;font-size:13px;font-weight:500;
  letter-spacing:.22em;text-transform:uppercase;color:rgb(var(--muted-rgb));
  padding-bottom:18px;margin-bottom:clamp(26px,3.4vw,38px);
  border-bottom:1px solid rgb(var(--rule-rgb));}
.lv-kicker .dot{width:5px;height:5px;background:rgb(var(--violet-rgb));flex:none;transform:rotate(45deg);}
.lv-kicker .sp{margin-left:auto;font-size:12px;letter-spacing:.14em;color:rgb(var(--muted-rgb));}

.lv-name{font-family:var(--font-display),Georgia,serif;font-weight:600;
  color:rgb(var(--text-rgb));line-height:.94;letter-spacing:-.022em;margin:0;}
.lv-name .sur{display:block;font-size:clamp(50px,8.4vw,112px);}
.lv-name .given{display:block;font-size:clamp(23px,3.4vw,42px);font-weight:400;
  color:rgb(var(--muted-e-rgb));margin-top:.18em;letter-spacing:-.005em;}

.lv-role{font-size:clamp(13px,1.2vw,15px);font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;color:rgb(var(--violet-rgb));margin-top:clamp(20px,2.6vw,28px);}

.lv-desc{font-size:clamp(16px,1.3vw,19px);font-weight:400;line-height:1.6;
  color:rgb(var(--muted-e-rgb));max-width:42ch;margin-top:clamp(16px,2vw,22px);}

.lv-actions{display:flex;align-items:center;flex-wrap:wrap;gap:clamp(16px,2.2vw,26px);margin-top:clamp(30px,4vw,44px);}
.lv-phone{display:flex;flex-direction:column;gap:4px;text-decoration:none;}
.lv-phone .lbl{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgb(var(--muted-rgb));}
.lv-phone .num{font-family:var(--font-display),Georgia,serif;font-size:clamp(19px,2vw,23px);
  font-weight:500;color:rgb(var(--text-rgb));letter-spacing:.01em;transition:color .3s ease;
  border-bottom:1px solid transparent;}
.lv-phone:hover .num{color:rgb(var(--violet-rgb));border-bottom-color:rgb(var(--violet-rgb) / .45);}

.lv-textcol{align-self:center;}

/* Правая колонка — карточка-бланк: оттиск и под ним реквизиты. */
.lv-card{position:relative;background:rgb(var(--surface-rgb));
  border:1px solid rgb(var(--rule-rgb));padding:clamp(26px,3vw,38px);}
.lv-card::before,.lv-card::after{content:"";position:absolute;width:10px;height:10px;}
.lv-card::before{top:-1px;left:-1px;border-top:2px solid rgb(var(--violet-rgb));border-left:2px solid rgb(var(--violet-rgb));}
.lv-card::after{bottom:-1px;right:-1px;border-bottom:2px solid rgb(var(--violet-rgb));border-right:2px solid rgb(var(--violet-rgb));}
.lv-card .monogram{width:100%;max-width:330px;margin:0 auto;height:auto;overflow:visible;display:block;}
.lv-facts{margin:clamp(22px,2.6vw,30px) 0 0;padding:0;list-style:none;}
.lv-facts li{display:flex;justify-content:space-between;align-items:baseline;gap:16px;
  padding:11px 0;border-top:1px solid rgb(var(--rule-rgb));}
.lv-facts dt,.lv-facts .k{font-size:11px;font-weight:500;letter-spacing:.16em;
  text-transform:uppercase;color:rgb(var(--muted-rgb));white-space:nowrap;}
.lv-facts .v{font-family:var(--font-mono),monospace;font-size:13px;color:rgb(var(--text-rgb));
  text-align:right;font-variant-numeric:tabular-nums;}

/* Подсказка «листайте» — тонкая, у нижнего края левой колонки. */
.lv-scroll{display:flex;align-items:center;gap:12px;margin-top:clamp(34px,5vh,56px);
  font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgb(var(--muted-rgb));}
.lv-scroll .bar{width:56px;height:1px;background:rgb(var(--rule-rgb));position:relative;overflow:hidden;}
.lv-scroll .bar::after{content:"";position:absolute;inset:0;background:rgb(var(--violet-rgb));
  animation:lvscan 2.8s cubic-bezier(.6,0,.4,1) infinite;}
@keyframes lvscan{0%{transform:translateX(-100%);}60%,100%{transform:translateX(100%);}}

.lv-reveal{opacity:1;animation:lvrise .9s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0s);}
@keyframes lvrise{0%{opacity:0;transform:translateY(22px);}100%{opacity:1;transform:translateY(0);}}
.s1{stroke-dasharray:1560;stroke-dashoffset:1560;animation:lvdraw 1.6s cubic-bezier(.55,.1,.2,1) forwards .35s;}
@keyframes lvdraw{to{stroke-dashoffset:0;}}
.s1soft{opacity:0;animation:lvfadefill .9s ease forwards 1.2s;}
.fade-fill{opacity:0;animation:lvfadefill 1.4s ease forwards 1.1s;}
@keyframes lvfadefill{to{opacity:1;}}
.s3{opacity:0;animation:lvfadefill .9s ease forwards 1.7s;}
.s4{opacity:0;animation:lvribbon .9s cubic-bezier(.2,.7,.2,1) forwards 2.1s;}
@keyframes lvribbon{0%{opacity:0;transform:translateY(10px);}100%{opacity:1;transform:translateY(0);}}

@media (max-width:980px){
  .lv-wrap{grid-template-columns:1fr;gap:44px;}
  .lv-card{max-width:460px;}
  .lv-scroll{display:none;}
}
@media (max-width:430px){
  .lv-hero{padding:96px 22px 56px;}
  .lv-kicker{letter-spacing:.16em;gap:10px;font-size:12px;}
  .lv-kicker .sp{display:none;}
  .lv-actions{gap:16px;}
  .lv-actions .lv-btn,.lv-actions .lv-btn2{width:100%;justify-content:center;}
  .lv-card{padding:22px;}
  .lv-facts li{flex-direction:column;align-items:flex-start;gap:3px;}
  .lv-facts .v{text-align:left;}
}
@media (prefers-reduced-motion:reduce){
  .lv-reveal,.s1,.s1soft,.s3,.s4,.fade-fill,.lv-bg svg,.lv-scroll .bar::after{animation:none !important;}
  .s1{stroke-dashoffset:0;}
  .s1soft,.s3,.s4,.fade-fill{opacity:1;transform:none;}
  .lv-reveal{opacity:1;transform:none;}
}
`

export default function Hero() {
  const nameParts = notary.name.trim().split(/\s+/)
  const surname = nameParts[0] ?? notary.name
  const rest = nameParts.slice(1).join(' ')
  const crest = buildSeal('1')
  const bg = buildBackground()
  const city = notary.addressParts.addressLocality

  // Реквизиты под оттиском. Пустое поле пропускается: не у каждой конторы
  // заполнены оба номера, а прочерк в бланке хуже, чем строка меньше.
  const facts = [
    { k: 'Лицензия', v: notary.license },
    ...(notary.registryNumber ? [{ k: 'Реестр', v: notary.registryNumber }] : []),
    ...(notary.practiceSince ? [{ k: 'Практика', v: 'с ' + notary.practiceSince }] : []),
  ]

  return (
    <section className="lv-hero" data-hero>
      <style>{CSS}</style>
      <div className="lv-bg" dangerouslySetInnerHTML={{ __html: bg }} aria-hidden />
      <div className="lv-veil" aria-hidden />

      <div className="lv-wrap">
        <div className="lv-textcol">
          <div className="lv-kicker lv-reveal" style={{ ['--d' as string]: '.05s' }}>
            <span className="dot" aria-hidden />
            Нотариальная контора
            <span className="sp">{city}</span>
          </div>

          <h1 className="lv-name">
            <span className="sur lv-reveal" style={{ ['--d' as string]: '.16s' }}>{surname}</span>
            <span className="given lv-reveal" style={{ ['--d' as string]: '.28s' }}>{rest}</span>
          </h1>

          <p className="lv-role lv-reveal" style={{ ['--d' as string]: '.4s' }}>{notary.title}</p>

          <p className="lv-desc lv-reveal" style={{ ['--d' as string]: '.5s' }}>
            Сделки с недвижимостью, наследство, доверенности и согласия.
            Приём по записи, пн–пт с 10:00 до 19:00.
          </p>

          <div className="lv-actions lv-reveal" style={{ ['--d' as string]: '.62s' }}>
            <BookingButton />
            {/* Вторая кнопка ведёт к перечню документов. Первый вопрос человека
                перед визитом — «что с собой взять», и до этой правки ответ
                лежал в меню под словом «Подготовка». */}
            <Link className="lv-btn2" href="/visit">
              Какие нужны документы
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a className="lv-phone" href={notary.phoneHref}>
              <span className="lbl">Телефон конторы</span>
              <span className="num">{notary.phone}</span>
            </a>
          </div>

          <div className="lv-scroll lv-reveal" style={{ ['--d' as string]: '.9s' }} aria-hidden>
            <span className="bar" />
            Листайте
          </div>
        </div>

        <div className="lv-card lv-reveal" style={{ ['--d' as string]: '.34s' }}>
          <div dangerouslySetInnerHTML={{ __html: crest }} />
          <ul className="lv-facts">
            {facts.map(f => (
              <li key={f.k}>
                <span className="k">{f.k}</span>
                <span className="v">{f.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
