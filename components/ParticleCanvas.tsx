'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  r: number; vy: number; vx: number
  baseAlpha: number; alpha: number
  phase: number; freq: number; driftAmp: number
}

export default function ParticleCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(max-width: 640px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')!
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let W = 0, H = 0
    const mouse = { x: -9999, y: -9999, active: false }

    function resize() {
      const r = canvas!.getBoundingClientRect()
      W = r.width; H = r.height
      canvas!.width = W * DPR
      canvas!.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: rand(1, 3),
      vy: -rand(0.08, 0.30), vx: rand(-0.06, 0.06),
      baseAlpha: rand(0.15, 0.40), alpha: 0,
      phase: Math.random() * Math.PI * 2,
      freq: rand(0.004, 0.012), driftAmp: rand(0.15, 0.40),
    }))

    const parent = canvas.parentElement!
    const onMove = (e: MouseEvent) => {
      const r = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true
    }
    const onLeave = () => { mouse.active = false }
    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)

    let rafId: number
    function step() {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.phase += p.freq
        const sway = Math.sin(p.phase) * p.driftAmp
        p.x += p.vx + sway * 0.04
        p.y += p.vy

        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy, R = 80
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const force = (1 - d / R) * 0.85
            p.x += (dx / d) * force
            p.y += (dy / d) * force
          }
        }

        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W }
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10

        const tw = 0.7 + 0.3 * Math.sin(p.phase * 1.2)
        p.alpha = p.baseAlpha * tw

        const rad = p.r * 4
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad)
        g.addColorStop(0, `rgba(224,189,95,${p.alpha})`)
        g.addColorStop(0.45, `rgba(200,160,60,${p.alpha * 0.45})`)
        g.addColorStop(1, 'rgba(200,160,60,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill()

        ctx.fillStyle = `rgba(232,200,110,${Math.min(1, p.alpha * 1.5)})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      }
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
