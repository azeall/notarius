'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const el = document.documentElement
    const next = !el.classList.contains('dark')
    el.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
    setDark(next)
  }

  return (
    <button onClick={toggle} className={`tt ${className}`} aria-label="Переключить тему" title="Светлая / тёмная тема">
      <svg viewBox="0 0 24 24" className="tt-ico" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dark
          ? <><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></>
          : <path d="M20 14.5A8 8 0 1 1 9.5 4 6.3 6.3 0 0 0 20 14.5Z" />}
      </svg>
      <style>{`
        .tt{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;cursor:pointer;
          color:var(--violet);background:transparent;border:1px solid rgb(var(--violet-rgb) / 0.28);
          transition:background .2s,transform .2s,color .2s;}
        .tt:hover{background:rgb(var(--violet-rgb) / 0.10);transform:translateY(-1px);}
        .tt-ico{width:19px;height:19px;}
      `}</style>
    </button>
  )
}
