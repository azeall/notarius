'use client'
import { useEffect, useRef } from 'react'

export default function HeroDocumentsCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(max-width: 640px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = el.getContext('2d')
    if (!ctx) return

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const DRIFT = 12
    const DOC_COUNT = 4
    const DOC_W = 160
    const DOC_H = 220
    const TOP_EX = 0.30
    const SYM_COUNT = 8

    let W = 0, H = 0, lastT = performance.now(), rafId = 0

    // Capture el as a non-null reference for use inside closures
    const canvas = el

    function resize() {
      const r = canvas.getBoundingClientRect()
      W = r.width; H = r.height
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const deg = (d: number) => d * Math.PI / 180

    type TextLine = { y: number; w: number; op: number; sig?: boolean }

    function makeLines(): TextLine[] {
      const n = 4 + Math.floor(Math.random() * 2)
      const lines: TextLine[] = Array.from({ length: n }, (_, i) => ({
        y: 40 + i * 22,
        w: rand(DOC_W - 60, DOC_W - 30),
        op: rand(0.12, 0.20),
      }))
      lines.push({ y: 40 + n * 22 + 10, w: 60, op: 0.26, sig: true })
      return lines
    }

    type Doc = {
      x: number; y: number; yBase: number; rot: number
      bobPhase: number; bobFreq: number; sealRot: number
      hasStamp: boolean; lines: TextLine[]
    }

    function makeDoc(i: number): Doc {
      const spacing = (W + DOC_W * 2) / DOC_COUNT
      const x = W - i * spacing + rand(-20, 20)
      const yBand = H * (TOP_EX + 0.05)
      const yRange = H * 0.65 - DOC_H * 0.6
      const y = yBand + Math.random() * Math.max(40, yRange)
      return {
        x, y, yBase: y,
        rot: deg(rand(-3, 3)),
        bobPhase: Math.random() * Math.PI * 2,
        bobFreq: rand(0.4, 0.7),
        sealRot: Math.random() * Math.PI * 2,
        hasStamp: i % 2 === 0,
        lines: makeLines(),
      }
    }

    const docs: Doc[] = Array.from({ length: DOC_COUNT }, (_, i) => makeDoc(i))

    type Sym = { x: number; y: number; vy: number; vx: number; size: number; op: number; phase: number }
    const makeSym = (): Sym => ({
      x: Math.random() * W,
      y: H * TOP_EX + Math.random() * H * 0.70,
      vy: -rand(4, 9), vx: rand(-1.5, 1.5),
      size: rand(10, 14), op: rand(0.04, 0.09),
      phase: Math.random() * Math.PI * 2,
    })
    const syms: Sym[] = Array.from({ length: SYM_COUNT }, makeSym)

    function drawDoc(d: Doc) {
      ctx.save()
      ctx.translate(d.x, d.y); ctx.rotate(d.rot)

      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(10,22,40,0.60)'
      ctx.strokeStyle = 'rgba(184,154,90,0.18)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.rect(0, 0, DOC_W, DOC_H); ctx.fill(); ctx.stroke()

      const fold = 14
      ctx.fillStyle = 'rgba(184,154,90,0.10)'
      ctx.beginPath()
      ctx.moveTo(DOC_W - fold, 0); ctx.lineTo(DOC_W, 0); ctx.lineTo(DOC_W, fold)
      ctx.closePath(); ctx.fill()
      ctx.strokeStyle = 'rgba(184,154,90,0.14)'
      ctx.beginPath(); ctx.moveTo(DOC_W - fold, 0); ctx.lineTo(DOC_W, fold); ctx.stroke()

      for (const ln of d.lines) {
        ctx.globalAlpha = ln.op
        ctx.fillStyle = 'rgba(200,160,60,1)'
        ctx.fillRect(16, ln.y, ln.w, ln.sig ? 2 : 1.5)
      }

      if (d.hasStamp) {
        ctx.globalAlpha = 1
        ctx.strokeStyle = 'rgba(200,160,60,0.22)'; ctx.lineWidth = 1
        const sx = DOC_W - 98, sy = DOC_H - 48, sw = 80, sh = 30, rr = 4
        ctx.beginPath()
        ctx.moveTo(sx + rr, sy); ctx.lineTo(sx + sw - rr, sy)
        ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + rr)
        ctx.lineTo(sx + sw, sy + sh - rr)
        ctx.quadraticCurveTo(sx + sw, sy + sh, sx + sw - rr, sy + sh)
        ctx.lineTo(sx + rr, sy + sh)
        ctx.quadraticCurveTo(sx, sy + sh, sx, sy + sh - rr)
        ctx.lineTo(sx, sy + rr)
        ctx.quadraticCurveTo(sx, sy, sx + rr, sy); ctx.stroke()
        ctx.globalAlpha = 0.18; ctx.fillStyle = 'rgba(200,160,60,1)'
        ctx.fillRect(sx + 8, sy + 9, sw - 16, 1.3)
        ctx.fillRect(sx + 8, sy + 18, sw - 22, 1.3)
      }

      ctx.save()
      ctx.translate(48, DOC_H - 52); ctx.rotate(d.sealRot)
      ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(224,189,95,0.22)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.stroke()
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * 22.5, Math.sin(a) * 22.5)
        ctx.lineTo(Math.cos(a) * 27.5, Math.sin(a) * 27.5); ctx.stroke()
      }
      ctx.rotate(-d.sealRot)
      ctx.globalAlpha = 0.25; ctx.fillStyle = 'rgba(224,189,95,1)'
      ctx.font = '600 16px "Playfair Display", serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('\u0411\u0420', 0, 1)
      ctx.restore()

      ctx.restore()
    }

    function drawSym(s: Sym) {
      ctx.save()
      ctx.globalAlpha = s.op; ctx.fillStyle = 'rgba(184,154,90,1)'
      ctx.font = `${s.size}px "Playfair Display", serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('\u00A7', s.x, s.y)
      ctx.restore()
    }

    function update(dt: number) {
      for (const d of docs) {
        d.x -= DRIFT * dt
        d.bobPhase += d.bobFreq * dt
        d.y = d.yBase + Math.sin(d.bobPhase) * 6
        d.sealRot += deg(0.3) * dt * 60
        if (d.x + DOC_W * 1.2 < 0) {
          d.x = W + rand(20, 120)
          const yBand = H * (TOP_EX + 0.05)
          const yRange = H * 0.65 - DOC_H * 0.6
          d.yBase = yBand + Math.random() * Math.max(40, yRange)
          d.rot = deg(rand(-3, 3))
          d.lines = makeLines()
        }
      }
      for (const s of syms) {
        s.phase += dt * 0.8
        s.x += s.vx * dt + Math.sin(s.phase) * 0.1
        s.y += s.vy * dt
        if (s.y < H * TOP_EX - 20) {
          s.x = Math.random() * W; s.y = H + 20
          s.size = rand(10, 14); s.op = rand(0.04, 0.09)
        }
        if (s.x < -20) s.x = W + 20
        if (s.x > W + 20) s.x = -20
      }
    }

    function render() {
      ctx.clearRect(0, 0, W, H)
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, H * TOP_EX - 60, W, H * (1 - TOP_EX) + 60)
      ctx.clip()
      for (const s of syms) drawSym(s)
      for (const d of docs) drawDoc(d)
      ctx.restore()
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now; update(dt); render()
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(t => { lastT = t; frame(t) })

    return () => { cancelAnimationFrame(rafId); ro.disconnect() }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden />
}
