import Link from 'next/link'
import { notary } from '@/lib/data'

export default function NotFound() {
  return (
    <section className="nf">
      <div className="nf-bg" aria-hidden />
      <div className="nf-inner">
        <div className="nf-mark">404</div>
        <h1 className="nf-title">Страница не <span>найдена</span></h1>
        <p className="nf-text">
          Такой страницы нет — возможно, ссылка устарела или адрес введён неточно.
        </p>
        <div className="nf-actions">
          <Link href="/" className="nf-btn">На главную</Link>
          <a href={notary.phoneHref} className="nf-phone">{notary.phone}</a>
        </div>
      </div>

      <style>{`
        .nf{position:relative;min-height:72vh;display:flex;align-items:center;justify-content:center;
          padding:120px 22px 80px;background:#ffffff;overflow:hidden;text-align:center;}
        .nf-bg{position:absolute;inset:0;pointer-events:none;
          background:
            radial-gradient(60% 60% at 50% 32%, rgba(29,158,117,.12), transparent 70%),
            radial-gradient(circle at 16% 20%, rgba(29,158,117,.07), transparent 38%),
            radial-gradient(circle at 84% 82%, rgba(29,158,117,.07), transparent 40%);}
        .nf-inner{position:relative;max-width:520px;}
        .nf-mark{font-family:var(--font-manrope),system-ui,sans-serif;font-weight:800;line-height:1;
          font-size:clamp(96px,22vw,180px);letter-spacing:-.04em;color:#1D9E75;}
        .nf-title{font-family:var(--font-manrope),system-ui,sans-serif;font-weight:800;color:#2c2c2c;
          letter-spacing:-.02em;font-size:clamp(26px,4vw,40px);margin:6px 0 0;}
        .nf-title span{color:#1D9E75;}
        .nf-text{color:#5d6e67;font-size:16px;line-height:1.7;margin:14px auto 30px;max-width:44ch;}
        .nf-actions{display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap;}
        .nf-btn{display:inline-flex;align-items:center;padding:14px 30px;border-radius:14px;
          font-weight:700;font-size:14px;text-decoration:none;color:#fff;background:#1D9E75;
          box-shadow:0 12px 28px rgba(29,158,117,.35);transition:transform .2s;}
        .nf-btn:hover{transform:translateY(-2px);}
        .nf-phone{color:#1D9E75;font-weight:700;text-decoration:none;}
      `}</style>
    </section>
  )
}
