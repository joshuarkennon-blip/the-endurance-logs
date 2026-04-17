'use client'

import { useLayoutEffect, useRef } from 'react'
import { ArchiveDisc } from './DiscShelf'

function quadBezier(t, p0, p1, p2) {
  const u = 1 - t
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  }
}

/**
 * Full-screen flying disc: curved path into tray groove or reader drop zone.
 * Uses Web Animations API for GPU-friendly transform + timing.
 */
export default function DiscInsertFlight({ startX, startY, endX, endY, film, onDone }) {
  const innerRef = useRef(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const cancelled = useRef(false)
  const finished = useRef(false)

  useLayoutEffect(() => {
    const safeDone = () => {
      if (finished.current) return
      finished.current = true
      onDoneRef.current()
    }

    finished.current = false
    cancelled.current = false
    const inner = innerRef.current
    if (!inner?.animate) {
      safeDone()
      return undefined
    }

    const p0 = { x: startX, y: startY }
    const p2 = { x: endX, y: endY }
    const dist = Math.hypot(p2.x - p0.x, p2.y - p0.y)
    const lift = Math.min(120, 40 + dist * 0.14)
    const p1 = {
      x: (p0.x + p2.x) / 2,
      y: (p0.y + p2.y) / 2 - lift,
    }

    const times = [0, 0.16, 0.38, 0.62, 0.82, 1]
    const keyframes = times.map((t) => {
      const p = quadBezier(t, p0, p1, p2)
      const x = p.x - startX
      const y = p.y - startY
      const settle = 1 - (1 - t) ** 2.4
      const scl = 1.06 - 0.3 * settle
      const rot = -4.2 + 4.2 * settle
      const shadowY = 14 - 10 * settle
      const shadowBlur = 28 - 14 * settle
      const shadowAlpha = 0.5 - 0.2 * settle
      return {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scl}) rotate(${rot}deg)`,
        filter: `drop-shadow(0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha}))`,
        opacity: t < 0.82 ? 1 : Math.max(0, 1 - (t - 0.82) / 0.18),
        offset: t,
      }
    })

    const duration = Math.min(880, Math.round(540 + dist * 0.42))

    const anim = inner.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(0.17, 0.9, 0.24, 1)',
      fill: 'forwards',
    })

    anim.finished
      .then(() => {
        if (!cancelled.current) safeDone()
      })
      .catch(() => {
        if (!cancelled.current) safeDone()
      })

    return () => {
      cancelled.current = true
      try {
        anim.cancel()
      } catch (_) {}
    }
  }, [startX, startY, endX, endY, film.id])

  return (
    <div
      className="disc-insert-flight-anchor"
      style={{
        position: 'fixed',
        left: startX,
        top: startY,
        transform: 'translate(-50%, -50%)',
        zIndex: 12000,
        pointerEvents: 'none',
        width: 108,
        height: 108,
      }}
    >
      <div ref={innerRef} className="disc-insert-flight-disc will-change-transform">
        <ArchiveDisc film={film} isLoaded={false} locked={false} />
      </div>
    </div>
  )
}
