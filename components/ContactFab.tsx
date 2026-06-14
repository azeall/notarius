'use client'
import { useState } from 'react'
import { notary } from '@/lib/data'

const wa = `https://wa.me/${notary.phoneE164.replace(/\D/g, '')}`

// Иконки центрированы в viewBox 24×24.
const ICON = {
  tg: <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.27 1.37.18 1.09 1.3l-2.72 12.81c-.19.92-.74 1.14-1.5.71l-4.14-3.05-1.99 1.93c-.22.22-.41.41-.83.41z" />,
  wa: <path d="M12 2a10 10 0 0 0-8.52 15.27L2 22l4.86-1.43A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-2.88.85.86-2.8-.19-.3A8 8 0 1 1 12 20Zm4.4-5.6c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.5 6.5 0 0 1-1.92-1.18 7.2 7.2 0 0 1-1.33-1.65c-.14-.24 0-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2t.86 2.36c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />,
  ph: <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.5-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2Z" />,
}

export default function ContactFab() {
  const [open, setOpen] = useState(false)

  const items = [
    { label: notary.phone, href: notary.phoneHref, bg: 'rgb(var(--violet-rgb))', icon: ICON.ph },
    { label: 'WhatsApp', href: wa, bg: '#25D366', icon: ICON.wa },
    { label: 'Telegram', href: notary.telegramHref, bg: '#229ED9', icon: ICON.tg },
  ]

  return (
    <div className="cf-wrap">
      <div className={`cf-items ${open ? 'cf-open' : ''}`}>
        {items.map((it, i) => (
          <a
            key={it.label}
            href={it.href}
            target={it.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="cf-item"
            style={{ ['--d' as string]: `${i * 45}ms`, background: it.bg }}
            aria-label={it.label}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="cf-ico">{it.icon}</svg>
            <span className="cf-tip">{it.label}</span>
          </a>
        ))}
      </div>

      <button
        className={`cf-main ${open ? 'cf-active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Закрыть' : 'Связаться'}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" className="cf-ico" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open
            ? <path d="M18 6 6 18M6 6l12 12" />
            : <path d="M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-5.7A8.4 8.4 0 1 1 21 11.5Z" />}
        </svg>
      </button>

      <style>{`
        .cf-wrap{position:fixed;right:clamp(16px,3vw,28px);bottom:clamp(16px,3vw,28px);z-index:60;
          display:flex;flex-direction:column;align-items:center;gap:14px;}
        .cf-items{display:flex;flex-direction:column;align-items:center;gap:14px;}
        .cf-item{opacity:0;visibility:hidden;transform:translateY(12px) scale(.6);
          width:50px;height:50px;border-radius:50%;display:grid;place-items:center;color:#fff;
          box-shadow:0 8px 20px rgba(47,42,99,.30);text-decoration:none;position:relative;
          transition:transform .28s cubic-bezier(.2,.7,.2,1),opacity .28s,visibility .28s,filter .2s;
          transition-delay:var(--d);}
        .cf-item:hover{filter:brightness(1.08);}
        .cf-open .cf-item{opacity:1;visibility:visible;transform:translateY(0) scale(1);}
        .cf-ico{width:24px;height:24px;display:block;}
        .cf-main .cf-ico{width:26px;height:26px;}
        .cf-tip{position:absolute;right:62px;top:50%;transform:translateY(-50%);
          background:#2f2a63;color:#fff;font-size:12px;font-weight:600;white-space:nowrap;
          padding:6px 11px;border-radius:8px;opacity:0;transition:opacity .2s;pointer-events:none;}
        .cf-item:hover .cf-tip{opacity:1;}
        .cf-main{position:relative;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;color:#fff;
          background:linear-gradient(135deg,#6f64d4,#534AB7);
          box-shadow:0 12px 30px rgba(83,74,183,.45);display:grid;place-items:center;
          transition:transform .25s cubic-bezier(.2,.7,.2,1);}
        .cf-main::after{content:"";position:absolute;inset:0;border-radius:50%;
          border:2px solid rgba(200,178,126,.65);animation:cfpulse 2.4s ease-out infinite;}
        .cf-main:hover{transform:scale(1.06);}
        .cf-active{transform:rotate(90deg);}
        .cf-active::after{display:none;}
        @keyframes cfpulse{0%{transform:scale(1);opacity:.7}70%{transform:scale(1.45);opacity:0}100%{opacity:0}}
        @media (prefers-reduced-motion:reduce){.cf-main::after{animation:none;}}
      `}</style>
    </div>
  )
}
