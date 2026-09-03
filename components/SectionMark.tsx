/**
 * Метка раздела: короткий номер и название, залипающие у левого края,
 * пока раздел проходит мимо.
 *
 * Это и есть «переход» в смысле повествования: не эффект между экранами,
 * а признак того, что человек перешёл в следующую часть и находится в ней.
 * На узком экране метка превращается в обычную надстрочную строку —
 * залипание там некуда, а место дорогое.
 */
export default function SectionMark({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="sm-mark">
      <span className="sm-n">{n}</span>
      <span className="sm-rule" aria-hidden />
      <span className="sm-t">{children}</span>
      <style dangerouslySetInnerHTML={{ __html: `
        .sm-mark{display:flex;align-items:center;gap:14px;margin-bottom:clamp(26px,3.4vw,40px);}
        .sm-n{font-family:var(--font-mono),monospace;font-size:12px;font-weight:500;
          color:rgb(var(--violet-rgb));letter-spacing:.06em;font-variant-numeric:tabular-nums;}
        /* Линейка дорисовывается при появлении — тем же движением, что под
           заголовком внутренней страницы. Конечное состояние в самом правиле,
           анимация идёт из нуля с backwards: fill-mode forwards оставил бы
           transform навсегда, а этим здесь уже ломало position:fixed. */
        .sm-rule{width:clamp(26px,4vw,54px);height:1px;background:rgb(var(--rule-rgb));flex:none;
          transform:scaleX(1);transform-origin:left;}
        @media (prefers-reduced-motion: no-preference){
          .sm-rule{animation:smRule .8s cubic-bezier(.22,.8,.24,1) .1s backwards;}
        }
        @keyframes smRule{from{transform:scaleX(0);}}
        .sm-t{font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;
          color:rgb(var(--muted-rgb));}
        @media (min-width:1120px){
          .sm-mark{position:sticky;top:120px;}
        }
      ` }} />
    </div>
  )
}
