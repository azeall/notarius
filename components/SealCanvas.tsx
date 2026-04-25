'use client'
import { useEffect, useRef } from 'react'

export default function SealCanvas({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const elRaw = ref.current
    if (!elRaw) return
    const ctxRaw = elRaw.getContext('2d')
    if (!ctxRaw) return

    const canvas: HTMLCanvasElement = elRaw
    const ctx: CanvasRenderingContext2D = ctxRaw

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const BASE_R = 260

    let W = 0, H = 0, CX = 0, CY = 0
    let scrollProgress = 0
    let easedProgress = 0
    let rafId = 0

    const MAX = {
      l1: -720 * Math.PI / 180,
      l2: 1080 * Math.PI / 180,
      l3b: -540 * Math.PI / 180,
      l4: -540 * Math.PI / 180,
      l4b: 900 * Math.PI / 180,
      l5: 720 * Math.PI / 180,
    }

    function resize() {
      const r = canvas.getBoundingClientRect()
      W = r.width; H = r.height
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      CX = W / 2; CY = H / 2
    }
    resize()
    // Call render() from ResizeObserver so the seal appears on first load
    // without requiring a scroll event. Function declarations are hoisted
    // so render() is always in scope here.
    const ro = new ResizeObserver(() => { resize(); render() })
    ro.observe(canvas)

    function drawStar(r: number) {
      ctx.beginPath()
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2
        const rr = i % 2 === 0 ? r : r * 0.55
        if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
        else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
      ctx.closePath()
    }

    function drawRose(R: number, A: number, k: number, steps: number) {
      ctx.beginPath()
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2
        const r = R + A * Math.sin(k * t)
        if (i === 0) ctx.moveTo(Math.cos(t) * r, Math.sin(t) * r)
        else ctx.lineTo(Math.cos(t) * r, Math.sin(t) * r)
      }
      ctx.closePath()
      ctx.stroke()
    }

    function drawFleur() {
      ctx.fillStyle = 'rgba(184,154,90,0.35)'
      const d = 4.0
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 - Math.PI / 2
        ctx.beginPath()
        ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, Math.PI * 2); ctx.fill()
    }

    function drawTextRing(text: string, radius: number, font: string, color: string, tracking: number, startAngle = -Math.PI / 2) {
      ctx.save()
      ctx.font = font
      ctx.fillStyle = color
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      const circ = 2 * Math.PI * radius
      let s = '', used = 0
      while (used < circ) {
        for (const ch of text) {
          const w = ctx.measureText(ch).width + tracking
          s += ch; used += w
          if (used >= circ) break
        }
      }
      const chars = [...s]
      const widths = chars.map(c => ctx.measureText(c).width + tracking)
      const total = widths.reduce((a, b) => a + b, 0)
      let angle = -Math.PI / 2
      for (let i = 0; i < chars.length; i++) {
        const step = (widths[i] / total) * Math.PI * 2
        const a = angle + step / 2
        ctx.save()
        ctx.translate(Math.cos(a) * radius, Math.sin(a) * radius)
        ctx.rotate(a + Math.PI / 2)
        ctx.fillText(chars[i], 0, 0)
        ctx.restore()
        angle += step
      }
      ctx.restore()
    }

    const OUTER_TEXT = 'НОТАРИУС ГОРОДА МОСКВЫ · БЫКОНЯ Р.Е. · РЕГ. № 77/1842 · '
    const INNER_TEXT = '· УДОСТОВЕРЕНО · ПОДПИСЬ · ПЕЧАТЬ · ЗАКОННО '

    function render() {
      ctx.clearRect(0, 0, W, H)
      const minDim = Math.min(W, H)
      const SCALE = (minDim / 2) / BASE_R * 1.05
      ctx.save()
      ctx.translate(CX, CY)
      ctx.scale(SCALE, SCALE)

      const P = easedProgress

      // L1: outer halo + 72 ticks (CCW)
      ctx.save()
      ctx.rotate(P * MAX.l1)
      ctx.strokeStyle = 'rgba(184,154,90,0.12)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 210, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = 'rgba(184,154,90,0.22)'
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2
        const len = (i % 5 === 0) ? 12 : 5
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * 210, Math.sin(a) * 210)
        ctx.lineTo(Math.cos(a) * (210 + len), Math.sin(a) * (210 + len))
        ctx.stroke()
      }
      ctx.restore()

      // L2: outer guilloche rose (CW)
      ctx.save()
      ctx.rotate(P * MAX.l2)
      ctx.strokeStyle = 'rgba(200,170,80,0.18)'; ctx.lineWidth = 0.8
      drawRose(175, 18, 7, 2000)
      ctx.restore()

      // micro-text band (CCW)
      ctx.save()
      ctx.rotate(P * MAX.l3b)
      drawTextRing(INNER_TEXT, 162, '600 8px "Manrope", sans-serif', 'rgba(184,154,90,0.20)', 1.6)
      ctx.restore()

      // outer text ring (static)
      drawTextRing(OUTER_TEXT, 148, '600 10px "Manrope", sans-serif', 'rgba(184,154,90,0.38)', 2.2, Math.PI / 2)
      ctx.strokeStyle = 'rgba(184,154,90,0.18)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 156, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 140, 0, Math.PI * 2); ctx.stroke()

      // L4: diamonds ring (CCW)
      ctx.save()
      ctx.rotate(P * MAX.l4)
      ctx.fillStyle = 'rgba(184,154,90,0.24)'
      ctx.strokeStyle = 'rgba(184,154,90,0.14)'; ctx.lineWidth = 0.8
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2
        ctx.save()
        ctx.translate(Math.cos(a) * 130, Math.sin(a) * 130)
        ctx.rotate(a + Math.PI / 4); ctx.fillRect(-2.5, -2.5, 5, 5)
        ctx.restore()
      }
      const seg = (Math.PI * 2) / 36
      for (let i = 0; i < 36; i++) {
        ctx.beginPath()
        ctx.arc(0, 0, 130, i * seg + seg * 0.15, (i + 1) * seg - seg * 0.15)
        ctx.stroke()
      }
      ctx.restore()

      // guilloche band 3 (CW)
      ctx.save()
      ctx.rotate(P * MAX.l4b)
      ctx.strokeStyle = 'rgba(200,170,80,0.13)'; ctx.lineWidth = 0.6
      drawRose(125, 8, 11, 1800)
      ctx.restore()

      // L5: inner guilloche (CW)
      ctx.save()
      ctx.rotate(P * MAX.l5)
      ctx.strokeStyle = 'rgba(224,189,95,0.15)'; ctx.lineWidth = 0.7
      drawRose(110, 12, 5, 1500)
      ctx.restore()

      // L6: annulus + 8 dots + 4 fleurs
      const grad = ctx.createRadialGradient(0, 0, 85, 0, 0, 95)
      grad.addColorStop(0, 'rgba(184,154,90,0.00)')
      grad.addColorStop(0.5, 'rgba(184,154,90,0.12)')
      grad.addColorStop(1, 'rgba(184,154,90,0.00)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, 95, 0, Math.PI * 2)
      ctx.arc(0, 0, 85, 0, Math.PI * 2, true)
      ctx.fill('evenodd')
      ctx.strokeStyle = 'rgba(184,154,90,0.22)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 95, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 85, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = 'rgba(184,154,90,0.40)'
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2
        ctx.beginPath(); ctx.arc(Math.cos(a) * 90, Math.sin(a) * 90, 3, 0, Math.PI * 2); ctx.fill()
      }
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2
        ctx.save()
        ctx.translate(Math.cos(a) * 88, Math.sin(a) * 88)
        ctx.rotate(a + Math.PI / 2)
        drawFleur()
        ctx.restore()
      }

      // L7: inner field + radial rays
      ctx.fillStyle = 'rgba(10,22,40,0.88)'
      ctx.beginPath(); ctx.arc(0, 0, 82, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(184,154,90,0.30)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 82, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = 'rgba(184,154,90,0.15)'
      ctx.beginPath(); ctx.arc(0, 0, 74, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = 'rgba(184,154,90,0.08)'; ctx.lineWidth = 0.5
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6)
        ctx.lineTo(Math.cos(a) * 70, Math.sin(a) * 70)
        ctx.stroke()
      }

      // 8-pointed star
      ctx.save()
      ctx.strokeStyle = 'rgba(184,154,90,0.20)'; ctx.lineWidth = 1
      drawStar(30); ctx.stroke()
      ctx.rotate(Math.PI / 8)
      ctx.strokeStyle = 'rgba(184,154,90,0.10)'
      drawStar(24); ctx.stroke()
      ctx.restore()

      // Monogram
      ctx.fillStyle = 'rgba(224,189,95,0.75)'
      ctx.font = 'bold 46px "Playfair Display", Georgia, serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('БР', 0, -4)
      ctx.fillStyle = 'rgba(184,154,90,0.45)'
      ctx.font = '600 9px "Manrope", sans-serif'
      ctx.fillText('EST · 2008', 0, 28)

      ctx.restore()
    }

    function updateScrollProgress() {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight)
      scrollProgress = Math.max(0, Math.min(1, window.scrollY / max))
    }

    if (prefersReduced) {
      render()
      return () => { ro.disconnect() }
    }

    updateScrollProgress()
    window.addEventListener('scroll', updateScrollProgress, { passive: true })

    function tick() {
      const delta = scrollProgress - easedProgress
      if (Math.abs(delta) > 0.00005) {
        easedProgress += delta * 0.06
        render()
      }
      rafId = requestAnimationFrame(tick)
    }
    render()
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updateScrollProgress)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className={className}
      style={style}
      aria-label="Гербовая печать нотариуса"
    />
  )
}
