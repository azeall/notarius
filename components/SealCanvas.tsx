'use client'
import { useEffect, useRef } from 'react'
import { notary } from '@/lib/data'

// Автоматически формируем монограмму и текст печати из данных нотариуса
function getMonogram(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

function getSealText(name: string) {
  const parts = name.trim().split(/\s+/)
  const surname = parts[0] ?? ''
  const initials = parts.slice(1).map(p => p[0] + '.').join('')
  return `НОТАРИУС ГОРОДА МОСКВЫ · ${surname.toUpperCase()} ${initials} · МОСКОВСКАЯ ГОРОДСКАЯ НОТ. ПАЛАТА · `
}

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

    // Год основания для центральной надписи — из данных, не хардкод
    const estYear = (() => {
      const ps = (notary as { practiceSince?: string }).practiceSince
      if (ps && /^\d{4}$/.test(ps)) return ps
      const fd = notary.foundingDate
      if (fd && /^\d{4}/.test(fd)) return fd.slice(0, 4)
      return ''
    })()

    function easeOutBack(x: number) {
      const c1 = 1.70158, c3 = c1 + 1
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
    }

    // Появление («оттиск»)
    const ENTRANCE_MS = 780
    let entranceT0 = 0
    let entranceDone = prefersReduced
    let eScale = 1, eRot = 0, eAlpha = prefersReduced ? 1 : 0

    // Параллакс от курсора
    let tgX = 0, tgY = 0, curX = 0, curY = 0

    // Блик-проблеск («металл») — раз в несколько секунд
    const SHIMMER_CYCLE = 6500
    const SHIMMER_DUR = 1300
    let shimStart = 0
    let shimmerActive = false
    let shimmerP = 0

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
      ctx.fillStyle = 'rgba(192,92,46,0.35)'
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
      let angle = startAngle
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

    const OUTER_TEXT = getSealText(notary.name)
    const INNER_TEXT = '· УДОСТОВЕРЕНО · ПОДПИСЬ · ПЕЧАТЬ · ЗАКОННО '

    function render() {
      ctx.clearRect(0, 0, W, H)
      const minDim = Math.min(W, H)
      const SCALE = (minDim / 2) / BASE_R * 1.05
      ctx.save()
      ctx.globalAlpha = eAlpha
      ctx.translate(CX, CY)
      ctx.rotate(eRot)
      ctx.scale(SCALE * eScale, SCALE * eScale)

      const P = easedProgress

      // Золотой ореол вокруг печати (мягкое свечение по ободу)
      ctx.save()
      ctx.shadowColor = 'rgba(192,92,46,0.45)'
      ctx.shadowBlur = 26
      ctx.strokeStyle = 'rgba(192,92,46,0.16)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(0, 0, 206, 0, Math.PI * 2); ctx.stroke()
      ctx.restore()

      // L1: outer halo + 72 ticks (CCW)
      ctx.save()
      ctx.rotate(P * MAX.l1)
      ctx.strokeStyle = 'rgba(192,92,46,0.12)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 210, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = 'rgba(192,92,46,0.22)'
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
      ctx.strokeStyle = 'rgba(192,92,46,0.18)'; ctx.lineWidth = 0.8
      drawRose(175, 18, 7, 2000)
      ctx.restore()

      // micro-text band (CCW)
      ctx.save()
      ctx.rotate(P * MAX.l3b)
      drawTextRing(INNER_TEXT, 162, '600 8px "Manrope", sans-serif', 'rgba(192,92,46,0.20)', 1.6)
      ctx.restore()

      // outer text ring (static)
      drawTextRing(OUTER_TEXT, 148, '600 10px "Manrope", sans-serif', 'rgba(192,92,46,0.38)', 2.2, Math.PI / 2)
      ctx.strokeStyle = 'rgba(192,92,46,0.18)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 156, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 140, 0, Math.PI * 2); ctx.stroke()

      // L4: diamonds ring (CCW)
      ctx.save()
      ctx.rotate(P * MAX.l4)
      ctx.fillStyle = 'rgba(192,92,46,0.24)'
      ctx.strokeStyle = 'rgba(192,92,46,0.14)'; ctx.lineWidth = 0.8
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
      ctx.strokeStyle = 'rgba(192,92,46,0.13)'; ctx.lineWidth = 0.6
      drawRose(125, 8, 11, 1800)
      ctx.restore()

      // L5: inner guilloche (CW)
      ctx.save()
      ctx.rotate(P * MAX.l5)
      ctx.strokeStyle = 'rgba(212,118,63,0.15)'; ctx.lineWidth = 0.7
      drawRose(110, 12, 5, 1500)
      ctx.restore()

      // L6: annulus + 8 dots + 4 fleurs
      const grad = ctx.createRadialGradient(0, 0, 85, 0, 0, 95)
      grad.addColorStop(0, 'rgba(192,92,46,0.00)')
      grad.addColorStop(0.5, 'rgba(192,92,46,0.12)')
      grad.addColorStop(1, 'rgba(192,92,46,0.00)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, 95, 0, Math.PI * 2)
      ctx.arc(0, 0, 85, 0, Math.PI * 2, true)
      ctx.fill('evenodd')
      ctx.strokeStyle = 'rgba(192,92,46,0.22)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 95, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 85, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = 'rgba(192,92,46,0.40)'
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
      ctx.fillStyle = 'rgba(233,220,198,0.88)'
      ctx.beginPath(); ctx.arc(0, 0, 82, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(192,92,46,0.30)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, 82, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = 'rgba(192,92,46,0.15)'
      ctx.beginPath(); ctx.arc(0, 0, 74, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = 'rgba(192,92,46,0.08)'; ctx.lineWidth = 0.5
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6)
        ctx.lineTo(Math.cos(a) * 70, Math.sin(a) * 70)
        ctx.stroke()
      }

      // 8-pointed star
      ctx.save()
      ctx.strokeStyle = 'rgba(192,92,46,0.20)'; ctx.lineWidth = 1
      drawStar(30); ctx.stroke()
      ctx.rotate(Math.PI / 8)
      ctx.strokeStyle = 'rgba(192,92,46,0.10)'
      drawStar(24); ctx.stroke()
      ctx.restore()

      // Monogram
      ctx.fillStyle = 'rgba(212,118,63,0.75)'
      ctx.font = 'bold 46px "Playfair Display", Georgia, serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(getMonogram(notary.name), 0, -4)
      if (estYear) {
        ctx.fillStyle = 'rgba(192,92,46,0.50)'
        ctx.font = 'italic 13px "Playfair Display", Georgia, serif'
        ctx.fillText(`EST · ${estYear}`, 0, 30)
      }

      // Блик-проблеск («металл»): диагональная световая полоса проходит по печати
      if (shimmerActive) {
        ctx.save()
        ctx.beginPath(); ctx.arc(0, 0, 208, 0, Math.PI * 2); ctx.clip()
        ctx.rotate(-0.5)
        ctx.globalCompositeOperation = 'lighter'
        const sx = -300 + shimmerP * 600
        const band = ctx.createLinearGradient(sx - 70, 0, sx + 70, 0)
        band.addColorStop(0, 'rgba(212,118,63,0)')
        band.addColorStop(0.5, 'rgba(212,118,63,0.13)')
        band.addColorStop(1, 'rgba(212,118,63,0)')
        ctx.fillStyle = band
        ctx.fillRect(-320, -320, 640, 640)
        ctx.restore()
      }

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

    // Параллакс реагирует только когда курсор над печатью
    function onPointer(e: PointerEvent) {
      const r = canvas.getBoundingClientRect()
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      tgX = Math.max(-1, Math.min(1, nx))
      tgY = Math.max(-1, Math.min(1, ny))
    }
    function onLeave() { tgX = 0; tgY = 0 }
    canvas.addEventListener('pointermove', onPointer, { passive: true })
    canvas.addEventListener('pointerleave', onLeave, { passive: true })

    function applyParallax() {
      curX += (tgX - curX) * 0.06
      curY += (tgY - curY) * 0.06
      const rotY = curX * 5
      const rotX = -curY * 5
      const tx = curX * 7, ty = curY * 7
      canvas.style.transform =
        `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`
    }

    entranceT0 = performance.now()

    function tick(now: number) {
      if (!entranceDone) {
        // Оттиск: «нажим» с лёгкой осадкой (easeOutBack) + проявление
        const e = Math.min(1, (now - entranceT0) / ENTRANCE_MS)
        const k = easeOutBack(e)
        eScale = 1 + (1 - k) * 0.14
        eRot = (1 - k) * 0.10
        eAlpha = Math.min(1, e * 1.5)
        render()
        if (e >= 1) { entranceDone = true; eScale = 1; eRot = 0; eAlpha = 1; shimStart = now; render() }
      } else {
        // Проблеск раз в SHIMMER_CYCLE, длится SHIMMER_DUR
        const cyc = (now - shimStart) % SHIMMER_CYCLE
        const active = cyc < SHIMMER_DUR
        shimmerP = active ? cyc / SHIMMER_DUR : 0
        const wasActive = shimmerActive
        shimmerActive = active
        const delta = scrollProgress - easedProgress
        const scrollMoving = Math.abs(delta) > 0.00005
        if (scrollMoving) easedProgress += delta * 0.06
        if (active || scrollMoving || wasActive) render()
      }
      applyParallax()
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updateScrollProgress)
      canvas.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerleave', onLeave)
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
