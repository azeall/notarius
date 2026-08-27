import Link from 'next/link'
import { notary, motto } from '@/lib/data'
import BookingButton from '@/components/BookingButton'
import LiveStatus from '@/components/LiveStatus'
import InkField from '@/components/InkField'
import HeroTicker from '@/components/HeroTicker'

/**
 * Первый экран варианта warm.
 *
 * Устроен намеренно не так, как у lavender. Там имя нотариуса во весь экран
 * и под ним крупный перечень услуг, работающий навигацией. Здесь порядок
 * обратный: сначала фраза конторы во весь экран, и только потом, вторым
 * планом, чьё это имя.
 *
 * Ход взят у Lama Lama (Site of the Month, июль 2026): экран занимает одно
 * высказывание, а не перечисление достоинств. Плюс служебная карточка в
 * углу с живыми данными — приём Lando Norris, где в углу всегда висит
 * ближайшая гонка; здесь — работает ли контора прямо сейчас.
 *
 * Фраза берётся из motto в lib/data.ts: у каждой конторы она своя, и
 * вписывать её в вёрстку значит заставлять править вёрстку. Последнее слово
 * выделяется цветом само — так фраза любой длины получает акцент без
 * ручной разметки.
 *
 * Фон — не пустая заливка: во весь экран идёт живая гравюра (EngravedField),
 * гильош на WebGL. Первая версия этого экрана была голой типографикой на
 * ровном фоне, и рядом с работами, на которые равнялись, это выглядело не
 * сдержанно, а недоделанно: у них экран занят плотным визуальным материалом,
 * а сокращение — только в палитре. На телефонах гравюра не запускается.
 */

const AREAS = ['Недвижимость', 'Наследство', 'Доверенности', 'Согласия', 'Копии и переводы']

const CSS = `
.wh{position:relative;background:rgb(var(--bg-rgb));overflow:hidden;
  min-height:100svh;display:flex;flex-direction:column;justify-content:center;
  padding:clamp(104px,13vh,150px) 0 clamp(34px,5vh,52px);}
/* Завеса поверх гравюры: к низу и к правому краю рисунок гаснет, иначе
   тонкие линии спорят с текстом за внимание. */
.wh-veil{position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(62% 50% at 20% 40%, rgb(var(--bg-rgb) / .90) 0%, rgb(var(--bg-rgb) / .30) 62%, rgb(var(--bg-rgb) / 0) 100%),
    linear-gradient(180deg, rgb(var(--bg-rgb) / .34) 0%, rgb(var(--bg-rgb) / .12) 46%, rgb(var(--bg-rgb) / .80) 100%);}
.wh-in{position:relative;z-index:1;}

/* Высказывание. Ради него всё и затевалось, поэтому кегль без оглядки. */
.wh-tag{margin:0 0 clamp(18px,2.4vw,28px);font-family:var(--font-mono),monospace;
  font-size:12px;letter-spacing:.16em;text-transform:uppercase;
  color:rgb(var(--violet-rgb));}
.wh-claim{margin:0;font-family:var(--font-display),Georgia,serif;font-weight:600;
  font-size:clamp(40px,7.4vw,108px);line-height:.98;letter-spacing:-.035em;
  color:rgb(var(--text-rgb));max-width:14ch;}
.wh-claim .last{color:rgb(var(--violet-rgb));}

.wh-grid{display:grid;grid-template-columns:1.55fr .45fr;gap:clamp(28px,4vw,64px);
  align-items:end;margin-top:clamp(34px,5vw,64px);
  padding-top:clamp(26px,3.4vw,40px);border-top:1px solid rgb(var(--rule-rgb));}

/* Кто это говорит — вторым планом, но не мелочью. */
.wh-who{margin:0;font-family:var(--font-display),Georgia,serif;font-weight:500;
  font-size:clamp(22px,2.6vw,34px);line-height:1.12;letter-spacing:-.015em;
  color:rgb(var(--text-rgb));}
.wh-role{margin:10px 0 0;font-size:13px;font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;color:rgb(var(--violet-rgb));}
.wh-addr{margin:14px 0 0;font-size:clamp(15px,1.1vw,17px);line-height:1.6;
  color:rgb(var(--muted-e-rgb));max-width:38ch;}

/* Служебная карточка: единственная плоскость на всём экране. */
.wh-card{border:1px solid rgb(var(--rule-rgb));background:rgb(var(--surface-rgb));
  padding:clamp(18px,2vw,24px);}
.wh-card-t{margin:0 0 14px;font-family:var(--font-mono),monospace;font-size:11px;
  letter-spacing:.18em;text-transform:uppercase;color:rgb(var(--muted-rgb));}

.wh-cta{display:flex;align-items:center;flex-wrap:wrap;gap:clamp(14px,2vw,20px);
  margin-top:clamp(32px,4.5vw,52px);}
.wh-phone{display:flex;flex-direction:column;gap:4px;text-decoration:none;margin-left:auto;text-align:right;}
.wh-phone .lbl{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgb(var(--muted-rgb));}
.wh-phone .num{font-family:var(--font-display),Georgia,serif;font-size:clamp(19px,2vw,24px);
  font-weight:500;color:rgb(var(--text-rgb));transition:color .3s ease;}
.wh-phone:hover .num{color:rgb(var(--violet-rgb));}

/* Направления работы — тонкой строкой понизу, а не крупным перечнем:
   крупный перечень уже занят вариантом lavender. */
.wh-areas{display:flex;flex-wrap:wrap;gap:0;margin:clamp(34px,4.5vw,56px) 0 0;
  padding:0;list-style:none;border-top:1px solid rgb(var(--rule-rgb));}
.wh-areas li{flex:1 1 auto;}
.wh-areas a{display:block;padding:16px 0;text-decoration:none;position:relative;
  font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:.1em;
  text-transform:uppercase;color:rgb(var(--muted-rgb));transition:color .3s ease;}
.wh-areas a::after{content:'';position:absolute;left:0;right:12px;top:-1px;height:1px;
  background:rgb(var(--violet-rgb));transform:scaleX(0);transform-origin:left center;
  transition:transform .4s cubic-bezier(.22,.8,.24,1);}
.wh-areas a:hover,.wh-areas a:focus-visible{color:rgb(var(--text-rgb));}
.wh-areas a:hover::after,.wh-areas a:focus-visible::after{transform:scaleX(1);}

@media (max-width:980px){
  .wh-grid{grid-template-columns:1fr;align-items:start;gap:26px;}
  .wh-phone{margin-left:0;text-align:left;}
  .wh-areas{display:grid;grid-template-columns:1fr 1fr;}
}
@media (max-width:430px){
  .wh{padding:92px 0 44px;}
  .wh-cta .lv-btn,.wh-cta .lv-btn2{width:100%;justify-content:center;}
  .wh-areas{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion:reduce){
  .wh-areas a::after{transition:none;}
}
`

export default function Hero() {
  const words = motto.trim().split(/\s+/)
  const head = words.slice(0, -1).join(' ')
  const last = words[words.length - 1]

  return (
    <section className="wh" data-hero>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <InkField />
      <div className="wh-veil" aria-hidden />

      <div className="wrap wh-in">
        <p className="wh-tag" data-tag>[ {notary.title} ]</p>

        <h1 className="wh-claim">
          {head}{head ? ' ' : ''}<span className="last">{last}</span>
        </h1>

        <div className="wh-grid">
          <div>
            <p className="wh-who">{notary.name}</p>
            <p className="wh-role">{notary.title}</p>
            <p className="wh-addr">
              Приём по записи на {notary.addressParts.streetAddress}. Разберём вашу
              ситуацию и назовём точный перечень документов заранее.
            </p>

            <div className="wh-cta">
              <BookingButton />
              {/* Второй вопрос после «сколько стоит» — «что с собой взять». */}
              <Link className="lv-btn2" href="/visit">
                Какие нужны документы
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <a className="wh-phone" href={notary.phoneHref}>
                <span className="lbl">Телефон конторы</span>
                <span className="num">{notary.phone}</span>
              </a>
            </div>
          </div>

          <aside className="wh-card">
            <p className="wh-card-t">Контора сейчас</p>
            <LiveStatus />
          </aside>
        </div>

        <HeroTicker />

        <nav aria-label="Направления работы конторы">
          <ul className="wh-areas">
            {AREAS.map(a => (
              <li key={a}><Link href="/services">{a}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
