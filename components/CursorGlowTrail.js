'use client'

import { useEffect, useRef } from 'react'
import { hexToRgb } from '../lib/cursorFilm'

function trailDisabled(fxMode = 'full') {
  if (typeof document === 'undefined') return true
  if (fxMode === 'off') return true
  return (
    document.body.classList.contains('motion-min') ||
    document.body.classList.contains('fx-off')
  )
}

/**
 * Soft glow trail following the cursor. Tint follows `accentHex` when a film is active.
 */
export default function CursorGlowTrail({ accentHex = null, fxMode = 'full' }) {
  const canvasRef = useRef(null)
  const ptsRef = useRef([])
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const accentRef = useRef(accentHex)
  const fxModeRef = useRef(fxMode)
  accentRef.current = accentHex
  fxModeRef.current = fxMode

  useEffect(() => {
    if (typeof window === 'undefined') return
    const pointerFine = window.matchMedia('(pointer: fine)').matches
    if (!pointerFine) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
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
      const mode = fxModeRef.current
      const maxPoints = mode === 'lite' ? 18 : 36
      if (trailDisabled(mode)) {
        ptsRef.current = []
        return
      }
      const pts = ptsRef.current
      const last = pts[pts.length - 1]
      if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < MIN_DIST) return
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      while (pts.length > maxPoints) pts.shift()
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(tick)
        return
      }
      const now = performance.now()
      const { w, h, dpr } = sizeRef.current
      const mode = fxModeRef.current
      const lifeMs = mode === 'lite' ? 260 : 380
      const disabled = trailDisabled(mode)

      if (disabled) {
        ptsRef.current = []
      } else {
        ptsRef.current = ptsRef.current.filter((p) => now - p.t < lifeMs)
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      if (!disabled) {
        const hex = accentRef.current
        const [r, g, b] = hex ? hexToRgb(hex) : [255, 255, 255]
        const alphaScale = mode === 'lite' ? 0.68 : 1
        const radiusScale = mode === 'lite' ? 0.78 : 1

        for (const p of ptsRef.current) {
          const age = now - p.t
          const a = 1 - age / lifeMs
          if (a <= 0) continue
          const rad = (10 + (1 - a) * 18) * radiusScale
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad)
          if (hex) {
            grad.addColorStop(0, `rgba(${r},${g},${b},${0.26 * a * a * alphaScale})`)
            grad.addColorStop(0.45, `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 45)},${0.08 * a * alphaScale})`)
          } else {
            grad.addColorStop(0, `rgba(255,255,255,${0.12 * a * a * alphaScale})`)
            grad.addColorStop(0.4, `rgba(232,240,255,${0.045 * a * alphaScale})`)
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
