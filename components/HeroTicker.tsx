'use client'
import { useEffect, useState } from 'react'
import { notary } from '@/lib/data'

/**
 * Нижняя строка первого экрана: реквизиты конторы и идущие часы.
 *
 * Ход прямо от образца — у Lama Lama внизу экрана всё время стоит полоса
 * «20+ DIGITAL FREAKS · AMSTERDAM BASED · [15:19:42] · FOLLOW US». Она
 * ничего не продаёт и не является навигацией, но именно она даёт ощущение,
 * что страница живая, а не отпечатанная: секунды идут.
 *
 * Здесь то же, но своими данными: год начала практики, адрес, московское
 * время и ссылка на реестр. Часы считаются по Москве независимо от того,
 * из какого часового пояса смотрят: нотариус принимает по своему времени,
 * и «сейчас 9 утра» у посетителя из Владивостока значило бы неверное.
 *
 * Время рисуется только после монтирования: отрисовать часы на сервере
 * значит разойтись с разметкой при гидратации.
 */

const MSK_OFFSET = 3

function mskClock(): string {
  const now = new Date()
  const msk = new Date(now.getTime() + (now.getTimezoneOffset() + MSK_OFFSET * 60) * 60_000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(msk.getHours())} : ${p(msk.getMinutes())} : ${p(msk.getSeconds())}`
}

export default function HeroTicker() {
  const [clock, setClock] = useState('')

  useEffect(() => {
    setClock(mskClock())
    const t = setInterval(() => setClock(mskClock()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="hticker">
      <span>Практика с {notary.practiceSince}</span>
      <span className="hticker-sep" aria-hidden />
      <span>{notary.addressParts.streetAddress}</span>
      <span className="hticker-clock" aria-label="Московское время">
        [ <span className="hticker-dot" aria-hidden />{clock || '—— : —— : ——'} ]
      </span>
      <a href={notary.fnpVerifyUrl} target="_blank" rel="noopener noreferrer" className="hticker-link">
        Реестр ФНП +
      </a>
      <a href={notary.telegramHref} target="_blank" rel="noopener noreferrer" className="hticker-link">
        Telegram +
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        .hticker{display:flex;align-items:center;gap:clamp(14px,2.4vw,34px);flex-wrap:wrap;
          padding-top:16px;margin-top:clamp(28px,4vw,48px);
          border-top:1px solid rgb(var(--rule-rgb));
          font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:.14em;
          text-transform:uppercase;color:rgb(var(--muted-rgb));}
        .hticker-sep{width:1px;height:11px;background:rgb(var(--rule-rgb));flex:none;}
        .hticker-clock{display:inline-flex;align-items:center;gap:8px;
          margin-left:auto;color:rgb(var(--text-rgb));font-variant-numeric:tabular-nums;}
        .hticker-dot{width:5px;height:5px;border-radius:50%;background:rgb(var(--violet-rgb));
          animation:htick 1s steps(2,end) infinite;}
        @keyframes htick{0%,49%{opacity:1}50%,100%{opacity:.15}}
        .hticker-link{color:rgb(var(--muted-rgb));text-decoration:none;transition:color .25s ease;}
        .hticker-link:hover{color:rgb(var(--violet-rgb));}
        @media (prefers-reduced-motion:reduce){.hticker-dot{animation:none;}}
        @media (max-width:980px){
          .hticker{font-size:10px;gap:12px;}
          .hticker-clock{margin-left:0;}
          .hticker-sep{display:none;}
        }
      ` }} />
    </div>
  )
}
