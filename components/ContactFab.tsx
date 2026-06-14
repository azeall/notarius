'use client'
import { useState } from 'react'
import { notary } from '@/lib/data'

const wa = `https://wa.me/${notary.phoneE164.replace(/\D/g, '')}`

export default function ContactFab() {
  const [open, setOpen] = useState(false)

  const items = [
    {
      label: 'Telegram', href: notary.telegramHref, bg: '#229ED9',
      icon: <path d="M21.5 4.3 2.9 11.4c-.9.4-.9 1.6 0 1.9l4.6 1.5 1.8 5.6c.2.7 1.1.9 1.6.3l2.5-2.6 4.7 3.5c.6.4 1.5.1 1.7-.6l3-14.1c.2-.9-.7-1.7-1.6-1.4Z" />,
    },
    {
      label: 'WhatsApp', href: wa, bg: '#25D366',
      icon: <path d="M12 2a10 10 0 0 0-8.6 15l-1 3.6 3.7-1A10 10 0 1 0 12 2Zm5.5 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.8s-3.8-3.4-3.9-3.6c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.9c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.2.6 1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6 0 .8Z" />,
    },
    {
      label: notary.phone, href: notary.phoneHref, bg: '#534AB7',
      icon: <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.5-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2Z" />,
    },
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
          display:flex;flex-direction:column;align-items:flex-end;gap:12px;}
        .cf-items{display:flex;flex-direction:column;align-items:flex-end;gap:12px;
          pointer-events:none;}
        .cf-item{pointer-events:none;opacity:0;transform:translateY(10px) scale(.8);
          width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:#fff;
          box-shadow:0 8px 22px rgba(47,42,99,.28);transition:transform .25s cubic-bezier(.2,.7,.2,1),opacity .25s,filter .2s;
          transition-delay:var(--d);position:relative;text-decoration:none;}
        .cf-item:hover{filter:brightness(1.08);}
        .cf-open .cf-item{pointer-events:auto;opacity:1;transform:translateY(0) scale(1);}
        .cf-ico{width:23px;height:23px;}
        .cf-main .cf-ico{width:26px;height:26px;}
        .cf-tip{position:absolute;right:60px;top:50%;transform:translateY(-50%);
          background:#2f2a63;color:#fff;font-size:12px;font-weight:600;white-space:nowrap;
          padding:6px 11px;border-radius:8px;opacity:0;transition:opacity .2s;pointer-events:none;}
        .cf-item:hover .cf-tip{opacity:1;}
        .cf-main{width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;color:#fff;
          background:linear-gradient(135deg,#6f64d4,#534AB7);
          box-shadow:0 12px 30px rgba(83,74,183,.45);display:grid;place-items:center;
          transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s;}
        .cf-main::after{content:"";position:absolute;inset:0;border-radius:50%;
          border:2px solid rgba(200,178,126,.6);animation:cfpulse 2.4s ease-out infinite;}
        .cf-main:hover{transform:scale(1.06);}
        .cf-active{transform:rotate(90deg);}
        .cf-active::after{display:none;}
        @keyframes cfpulse{0%{transform:scale(1);opacity:.7}70%{transform:scale(1.5);opacity:0}100%{opacity:0}}
        @media (prefers-reduced-motion:reduce){.cf-main::after{animation:none;}}
      `}</style>
    </div>
  )
}
