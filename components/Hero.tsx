import Link from 'next/link'
import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'
import LiveStatus from '@/components/LiveStatus'
import InkField from '@/components/InkField'
import HeroTicker from '@/components/HeroTicker'

/**
 * Первый экран варианта lavender.
 *
 * Что было и чем не годилось. Экран открывался фамилией в 134 пикселя, а под
 * ней шёл перечень услуг. Замечание было точным: «огромные буквы и ничего не
 * понятно». Фамилия — ответ на вопрос, которого пришедший не задавал. Он не
 * знает эту контору; он пришёл выяснить, туда ли попал и что тут можно
 * сделать. Имя нотариуса важно, но вторым ходом, а не первым.
 *
 * Что теперь. Первым читается, что здесь происходит: удостоверяют сделки,
 * оформляют наследство, заверяют документы. Дальше — чья это контора и где.
 * Дальше — перечень, он же навигация. Кегль остался крупным, но крупным
 * стало осмысленное.
 *
 * Отличие от warm сохранено намеренно. Там тёмная глина и краска терракотой,
 * здесь светлая бумага и чернила тёмным по светлому: то же средство,
 * обратная полярность. Один сайт не спутать с другим.
 */

const INDEX = [
  { n: '01', t: 'Сделки с недвижимостью', d: 'Купля-продажа, дарение, доли' },
  { n: '02', t: 'Наследство', d: 'Завещания, вступление, свидетельства' },
  { n: '03', t: 'Доверенности', d: 'Генеральные, на автомобиль, разовые' },
  { n: '04', t: 'Согласия и договоры', d: 'Супругов, брачные, соглашения' },
  { n: '05', t: 'Копии и переводы', d: 'Верность копий, подпись переводчика' },
]

const CSS = `
.lv{position:relative;background:rgb(var(--bg-rgb));overflow:hidden;
  padding:clamp(100px,12vh,140px) 0 clamp(40px,6vh,64px);}
/* Завеса: чернила видны, но текст всегда впереди. */
.lv-veil{position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(62% 50% at 20% 40%, rgb(var(--bg-rgb) / .90) 0%, rgb(var(--bg-rgb) / .30) 62%, rgb(var(--bg-rgb) / 0) 100%),
    linear-gradient(180deg, rgb(var(--bg-rgb) / .34) 0%, rgb(var(--bg-rgb) / .12) 46%, rgb(var(--bg-rgb) / .80) 100%);}
.lv-in{position:relative;z-index:1;}

.lv-tag{margin:0 0 clamp(16px,2.2vw,24px);font-family:var(--font-mono),monospace;
  font-size:12px;letter-spacing:.16em;text-transform:uppercase;
  color:rgb(var(--violet-rgb));}

/* Главное — что здесь делают, а не чья фамилия. */
.lv-lead{margin:0;font-family:var(--font-display),Georgia,serif;font-weight:600;
  font-size:clamp(34px,5.4vw,76px);line-height:1.02;letter-spacing:-.028em;
  color:rgb(var(--text-rgb));max-width:19ch;}
.lv-lead .ac{color:rgb(var(--violet-rgb));}

.lv-row{display:grid;grid-template-columns:1.5fr .5fr;gap:clamp(24px,4vw,56px);
  align-items:end;margin-top:clamp(28px,4vw,48px);
  padding-top:clamp(22px,3vw,32px);border-top:1px solid rgb(var(--rule-rgb));}

.lv-who{margin:0;font-family:var(--font-display),Georgia,serif;font-weight:500;
  font-size:clamp(20px,2.3vw,30px);line-height:1.14;letter-spacing:-.012em;
  color:rgb(var(--text-rgb));}
.lv-where{margin:8px 0 0;font-size:clamp(15px,1.1vw,17px);line-height:1.6;
  color:rgb(var(--muted-rgb));max-width:40ch;}

.lv-card{border:1px solid rgb(var(--rule-rgb));background:rgb(var(--surface-rgb));
  padding:clamp(16px,1.8vw,22px);}
.lv-card-t{margin:0 0 12px;font-family:var(--font-mono),monospace;font-size:11px;
  letter-spacing:.18em;text-transform:uppercase;color:rgb(var(--muted-rgb));}

.lv-cta{display:flex;align-items:center;flex-wrap:wrap;gap:clamp(14px,2vw,20px);
  margin-top:clamp(26px,3.6vw,40px);}
.lv-phone{display:flex;flex-direction:column;gap:4px;text-decoration:none;margin-left:auto;text-align:right;}
.lv-phone .lbl{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgb(var(--muted-rgb));}
.lv-phone .num{font-family:var(--font-display),Georgia,serif;font-size:clamp(19px,2vw,24px);
  font-weight:500;color:rgb(var(--text-rgb));transition:color .3s ease;}
.lv-phone:hover .num{color:rgb(var(--violet-rgb));}

/* Перечень — он же навигация. Строка целиком ссылка. */
.lv-idx{list-style:none;margin:clamp(30px,4vw,48px) 0 0;padding:0;
  border-top:1px solid rgb(var(--rule-rgb));}
.lv-row-a{position:relative;display:block;text-decoration:none;overflow:hidden;
  border-bottom:1px solid rgb(var(--rule-rgb));}
.lv-row-a::before{content:'';position:absolute;inset:0;background:rgb(var(--text-rgb));
  transform:scaleX(0);transform-origin:left center;
  transition:transform .5s cubic-bezier(.22,.8,.24,1);}
.lv-row-a:hover::before,.lv-row-a:focus-visible::before{transform:scaleX(1);}
.lv-line{position:relative;z-index:1;display:grid;
  grid-template-columns:clamp(40px,4.4vw,62px) 1fr auto;align-items:baseline;
  gap:clamp(12px,2.2vw,28px);padding:clamp(13px,1.7vw,20px) 0;
  transition:padding-left .5s cubic-bezier(.22,.8,.24,1);}
.lv-row-a:hover .lv-line,.lv-row-a:focus-visible .lv-line{padding-left:clamp(12px,1.8vw,24px);}
.lv-n{font-family:var(--font-mono),monospace;font-size:12px;color:rgb(var(--violet-rgb));transition:color .35s ease;}
.lv-t{font-family:var(--font-display),Georgia,serif;font-weight:500;
  font-size:clamp(20px,3vw,38px);line-height:1.05;letter-spacing:-.018em;
  color:rgb(var(--text-rgb));transition:color .35s ease;}
.lv-d{font-size:14px;color:rgb(var(--muted-rgb));text-align:right;white-space:nowrap;transition:color .35s ease;}
.lv-row-a:hover .lv-t,.lv-row-a:hover .lv-d,.lv-row-a:hover .lv-n,
.lv-row-a:focus-visible .lv-t,.lv-row-a:focus-visible .lv-d,.lv-row-a:focus-visible .lv-n{color:rgb(var(--bg-rgb));}

@media (max-width:980px){
  .lv-row{grid-template-columns:1fr;align-items:start;gap:24px;}
  .lv-phone{margin-left:0;text-align:left;}
  .lv-d{display:none;}
  .lv-line{grid-template-columns:clamp(34px,6vw,50px) 1fr;}
}
@media (max-width:430px){
  .lv{padding:88px 0 40px;}
  .lv-cta .lv-btn,.lv-cta .lv-btn2{width:100%;justify-content:center;}
}
@media (prefers-reduced-motion:reduce){
  .lv-row-a::before,.lv-line{transition:none;}
  .lv-row-a:hover .lv-line{padding-left:0;}
}
`

/** Строчная только первая буква: toLowerCase() на весь титул превращал
 *  «нотариус города Москвы» в «москвы». */
function lowerFirst(s: string): string {
  return s ? s[0].toLowerCase() + s.slice(1) : s
}

export default function Hero() {
  const city = notary.addressParts.addressLocality

  return (
    <section className="lv" data-hero>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <InkField />
      <div className="lv-veil" aria-hidden />

      <div className="wrap lv-in">
        <p className="lv-tag" data-tag>[ Нотариальная контора · {city} ]</p>

        <h1 className="lv-lead">
          Удостоверяем сделки, оформляем наследство и <span className="ac">заверяем документы</span>
        </h1>

        <div className="lv-row">
          <div>
            <p className="lv-who">{notary.name} — {lowerFirst(notary.title)}</p>
            <p className="lv-where">
              Приём по записи на {notary.addressParts.streetAddress}. Разберём вашу
              ситуацию и назовём точный перечень документов заранее.
            </p>

            <div className="lv-cta">
              <BookingButton />
              {/* Второй вопрос после «сколько стоит» — «что с собой взять». */}
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
          </div>

          <aside className="lv-card">
            <p className="lv-card-t">Контора сейчас</p>
            <LiveStatus />
          </aside>
        </div>

        <nav aria-label="Направления работы конторы">
          <ul className="lv-idx">
            {INDEX.map(row => (
              <li key={row.n}>
                <Link className="lv-row-a" href="/services">
                  <span className="lv-line">
                    <span className="lv-n">{row.n}</span>
                    <span className="lv-t">{row.t}</span>
                    <span className="lv-d">{row.d}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <HeroTicker />
      </div>
    </section>
  )
}
