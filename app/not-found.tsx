import Link from 'next/link'
import { notary } from '@/lib/data'

export default function NotFound() {
  return (
    <section className="nf">
      <div className="nf-bg" aria-hidden />
      <div className="nf-inner">
        <div className="nf-mark">404</div>
        <div className="nf-seal" aria-hidden>{notary.name.trim().charAt(0)}</div>
        <h1 className="nf-title">Страница не <em>заверена</em></h1>
        <p className="nf-text">
          Такого документа в реестре нет — возможно, ссылка устарела или адрес введён неточно.
        </p>
        <div className="nf-actions">
          <Link href="/" className="nf-btn">На главную</Link>
          <a href={notary.phoneHref} className="nf-phone">{notary.phone}</a>
        </div>
      </div>

      <style>{`
        .nf{position:relative;min-height:72vh;display:flex;align-items:center;justify-content:center;
          padding:120px 22px 80px;background:#f5ede0;overflow:hidden;text-align:center;}
        .nf-bg{position:absolute;inset:0;pointer-events:none;
          background:
            radial-gradient(60% 60% at 50% 30%, rgba(192,92,46,.12), transparent 70%),
            radial-gradient(circle at 18% 22%, rgba(61,32,16,.05), transparent 40%),
            radial-gradient(circle at 82% 80%, rgba(61,32,16,.05), transparent 40%);}
        .nf-inner{position:relative;max-width:520px;}
        .nf-mark{font-family:var(--font-playfair),Georgia,serif;font-weight:700;line-height:1;
          font-size:clamp(96px,22vw,180px);letter-spacing:-.02em;color:#c05c2e;opacity:.92;}
        .nf-seal{position:absolute;top:8%;left:50%;transform:translate(-50%,-30%);
          width:120px;height:120px;border-radius:50%;display:grid;place-items:center;
          font-family:var(--font-playfair),Georgia,serif;font-size:54px;color:#c05c2e;
          border:2px solid rgba(232,201,160,.7);background:rgba(255,255,255,.3);
          box-shadow:inset 0 0 0 6px rgba(192,92,46,.08);opacity:.2;}
        .nf-title{font-family:var(--font-playfair),Georgia,serif;font-weight:600;color:#3d2010;
          font-size:clamp(26px,4vw,40px);margin:6px 0 0;}
        .nf-title em{font-style:italic;font-weight:400;color:#c05c2e;}
        .nf-text{color:#7d6a55;font-size:16px;line-height:1.7;margin:14px auto 30px;max-width:42ch;}
        .nf-actions{display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap;}
        .nf-btn{display:inline-flex;align-items:center;padding:14px 30px;border-radius:14px;
          font-weight:700;font-size:13px;letter-spacing:.04em;text-decoration:none;color:#fff;
          background:linear-gradient(135deg,#d2703f,#c05c2e);box-shadow:0 12px 28px rgba(192,92,46,.35);
          transition:transform .2s;}
        .nf-btn:hover{transform:translateY(-2px);}
        .nf-phone{color:#c05c2e;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(192,92,46,.3);padding-bottom:2px;}
      `}</style>
    </section>
  )
}
