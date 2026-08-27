import Link from 'next/link'
import { notary } from '@/lib/data'
import BookingButton from '@/components/BookingButton'
import LiveStatus from '@/components/LiveStatus'

/**
 * Первый экран — индекс конторы.
 *
 * Что здесь было раньше: медальон с гильош-гравировкой и весами правосудия,
 * 560 пикселей по правой половине экрана. Он был честно сделан — рисовался
 * процедурно из имени нотариуса, — но оставался украшением: ничего не
 * сообщал, ничего не открывал, и стоял одинаковый на всех четырёх сайтах.
 *
 * Что здесь теперь: строка состояния конторы (открыта ли она сейчас и когда
 * ближайшее свободное окно) и крупный перечень услуг, который одновременно
 * служит навигацией. Ход взят у лучших работ awwwards последнего года —
 * Sharplink и Storey Architecture: смелость там не в количестве украшений, а
 * в их отсутствии. Два цвета, крупный набор, и всё, что видно, работает.
 *
 * Ни одной картинки и ни одного декоративного SVG: на бумаге держат
 * линейка, кегль и воздух.
 */

const INDEX = [
  { n: '01', t: 'Сделки с недвижимостью', d: 'Купля-продажа, дарение, доли' },
  { n: '02', t: 'Наследство', d: 'Завещания, вступление, свидетельства' },
  { n: '03', t: 'Доверенности', d: 'Генеральные, на автомобиль, разовые' },
  { n: '04', t: 'Согласия и договоры', d: 'Супругов, брачные, соглашения' },
  { n: '05', t: 'Копии и переводы', d: 'Верность копий, подпись переводчика' },
]

const CSS = `
.hr{position:relative;background:rgb(var(--bg-rgb));
  padding:clamp(104px,13vh,140px) clamp(22px,6vw,96px) clamp(56px,8vh,88px);}
.hr-in{max-width:1240px;margin:0 auto;}

/* Верхняя строка: состояние конторы прямо сейчас. */
.hr-top{padding-bottom:18px;border-bottom:1px solid rgb(var(--rule-rgb));
  margin-bottom:clamp(30px,4.4vw,54px);}

.hr-head{display:grid;grid-template-columns:1.35fr .65fr;gap:clamp(24px,4vw,64px);
  align-items:end;margin-bottom:clamp(40px,6vw,84px);}

.hr-name{margin:0;font-family:var(--font-display),Georgia,serif;font-weight:600;
  color:rgb(var(--text-rgb));line-height:.9;letter-spacing:-.03em;}
.hr-sur{display:block;font-size:clamp(54px,10.5vw,148px);}
.hr-given{display:block;font-size:clamp(20px,2.8vw,36px);font-weight:400;
  color:rgb(var(--muted-e-rgb));letter-spacing:-.01em;margin-top:.24em;}

.hr-aside{padding-bottom:.6em;}
.hr-role{margin:0 0 14px;font-size:13px;font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;color:rgb(var(--violet-rgb));}
.hr-desc{margin:0;font-size:clamp(15px,1.15vw,17px);line-height:1.6;
  color:rgb(var(--muted-e-rgb));max-width:34ch;}

.hr-cta{display:flex;align-items:center;flex-wrap:wrap;gap:clamp(14px,2vw,22px);
  margin-bottom:clamp(48px,7vw,96px);}
.hr-phone{display:flex;flex-direction:column;gap:4px;text-decoration:none;margin-left:auto;text-align:right;}
.hr-phone .lbl{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgb(var(--muted-rgb));}
.hr-phone .num{font-family:var(--font-display),Georgia,serif;font-size:clamp(19px,2vw,24px);
  font-weight:500;color:rgb(var(--text-rgb));transition:color .3s ease;}
.hr-phone:hover .num{color:rgb(var(--violet-rgb));}

/* Перечень услуг. Он же навигация: строка целиком — ссылка. */
.hr-idx{list-style:none;margin:0;padding:0;border-top:1px solid rgb(var(--rule-rgb));}
.hr-row{position:relative;display:block;text-decoration:none;overflow:hidden;
  border-bottom:1px solid rgb(var(--rule-rgb));}
/* Заливка выезжает слева и уносит за собой цвет текста. */
.hr-row::before{content:'';position:absolute;inset:0;background:rgb(var(--text-rgb));
  transform:scaleX(0);transform-origin:left center;
  transition:transform .5s cubic-bezier(.22,.8,.24,1);}
.hr-row:hover::before,.hr-row:focus-visible::before{transform:scaleX(1);}
.hr-line{position:relative;z-index:1;display:grid;
  grid-template-columns:clamp(44px,5vw,72px) 1fr auto;align-items:baseline;
  gap:clamp(12px,2.4vw,32px);padding:clamp(16px,2.2vw,26px) 0;
  transition:padding-left .5s cubic-bezier(.22,.8,.24,1);}
.hr-row:hover .hr-line,.hr-row:focus-visible .hr-line{padding-left:clamp(14px,2vw,28px);}
.hr-n{font-family:var(--font-mono),monospace;font-size:12px;color:rgb(var(--violet-rgb));
  transition:color .35s ease;}
.hr-t{font-family:var(--font-display),Georgia,serif;font-weight:500;
  font-size:clamp(24px,4.2vw,54px);line-height:1.02;letter-spacing:-.02em;
  color:rgb(var(--text-rgb));transition:color .35s ease;}
.hr-d{font-size:14px;color:rgb(var(--muted-rgb));text-align:right;
  transition:color .35s ease;white-space:nowrap;}
.hr-row:hover .hr-t,.hr-row:hover .hr-d,.hr-row:hover .hr-n,
.hr-row:focus-visible .hr-t,.hr-row:focus-visible .hr-d,.hr-row:focus-visible .hr-n{
  color:rgb(var(--bg-rgb));}

@media (max-width:980px){
  .hr-head{grid-template-columns:1fr;align-items:start;gap:26px;}
  .hr-aside{padding-bottom:0;}
  .hr-desc{max-width:46ch;}
  .hr-phone{margin-left:0;text-align:left;}
  .hr-d{display:none;}
  .hr-line{grid-template-columns:clamp(38px,7vw,56px) 1fr;}
}
@media (max-width:430px){
  .hr{padding:92px 22px 48px;}
  .hr-cta .lv-btn,.hr-cta .lv-btn2{width:100%;justify-content:center;}
}
@media (prefers-reduced-motion:reduce){
  .hr-row::before{transition:none;}
  .hr-line{transition:none;}
  .hr-row:hover .hr-line{padding-left:0;}
}
`

export default function Hero() {
  const parts = notary.name.trim().split(/\s+/)
  const surname = parts[0] ?? notary.name
  const rest = parts.slice(1).join(' ')

  return (
    <section className="hr" data-hero>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="hr-in">
        <div className="hr-top">
          <LiveStatus />
        </div>

        <div className="hr-head">
          <h1 className="hr-name">
            <span className="hr-sur">{surname}</span>
            <span className="hr-given">{rest}</span>
          </h1>
          <div className="hr-aside">
            <p className="hr-role">{notary.title}</p>
            <p className="hr-desc">
              Приём по записи на {notary.addressParts.streetAddress}.
              Разберём вашу ситуацию и назовём точный перечень документов заранее.
            </p>
          </div>
        </div>

        <div className="hr-cta">
          <BookingButton />
          {/* Второй вопрос после «сколько стоит» — «что с собой взять». */}
          <Link className="lv-btn2" href="/visit">
            Какие нужны документы
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a className="hr-phone" href={notary.phoneHref}>
            <span className="lbl">Телефон конторы</span>
            <span className="num">{notary.phone}</span>
          </a>
        </div>

        <nav aria-label="Направления работы конторы">
          <ul className="hr-idx">
            {INDEX.map(row => (
              <li key={row.n}>
                <Link className="hr-row" href="/services">
                  <span className="hr-line">
                    <span className="hr-n">{row.n}</span>
                    <span className="hr-t">{row.t}</span>
                    <span className="hr-d">{row.d}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
