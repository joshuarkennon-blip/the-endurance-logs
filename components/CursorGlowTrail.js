'use client'

import { useEffect, useRef } from 'react'
import { hexToRgb } from '../lib/cursorFilm'

function trailDisabled() {
  if (typeof document === 'undefined') return true
  return (
    document.body.classList.contains('motion-min') ||
    document.body.classList.contains('fx-off')
  )
}

/**
 * Soft glow trail following the cursor. Tint follows `accentHex` when a film is active.
 */
export default function CursorGlowTrail({ accentHex = null }) {
  const canvasRef = useRef(null)
  const ptsRef = useRef([])
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const accentRef = useRef(accentHex)
  accentRef.current = accentHex

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const MAX_POINTS = 36
    const LIFETIME_MS = 380
    const MIN_DIST = 3

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      sizeRef.current = { w, h, dpr }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      if (trailDisabled()) {
        ptsRef.current = []
        return
      }
      const pts = ptsRef.current
      const last = pts[pts.length - 1]
      if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < MIN_DIST) return
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      while (pts.length > MAX_POINTS) pts.shift()
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      const now = performance.now()
      const { w, h, dpr } = sizeRef.current

      if (trailDisabled()) {
        ptsRef.current = []
      } else {
        ptsRef.current = ptsRef.current.filter((p) => now - p.t < LIFETIME_MS)
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      if (!trailDisabled()) {
        const hex = accentRef.current
        const [r, g, b] = hex ? hexToRgb(hex) : [255, 255, 255]

        for (const p of ptsRef.current) {
          const age = now - p.t
          const a = 1 - age / LIFETIME_MS
          if (a <= 0) continue
          const rad = 10 + (1 - a) * 18
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad)
          if (hex) {
            grad.addColorStop(0, `rgba(${r},${g},${b},${0.26 * a * a})`)
            grad.addColorStop(0.45, `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 45)},${0.08 * a})`)
          } else {
            grad.addColorStop(0, `rgba(255,255,255,${0.12 * a * a})`)
            grad.addColorStop(0.4, `rgba(232,240,255,${0.045 * a})`)
          }
          grad.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="cursor-glow-trail pointer-events-none fixed inset-0 z-[45]"
      aria-hidden
    />
  )
}
