'use client'
import { useEffect, useRef, useCallback } from 'react'

function pickSrc(base) {
  if (typeof Audio === 'undefined') return `${base}.mp3`
  const a = document.createElement('audio')
  return a.canPlayType('audio/ogg') ? `${base}.ogg` : `${base}.mp3`
}

const PATHS = {
  idle:  '/audio/ambient-idle',
  ui: {
    tick:  '/audio/ui-boot-tick',
    eject: '/audio/ui-eject',
  },
  load: {
    interstellar: '/audio/load-interstellar',
    inception:    '/audio/load-inception',
    tenet:        '/audio/load-tenet',
    memento:      '/audio/load-memento',
  },
  ambient: {
    interstellar: '/audio/ambient-interstellar',
    inception:    '/audio/ambient-inception',
    tenet:        '/audio/ambient-tenet',
    memento:      '/audio/ambient-memento',
  },
}

// Volume ceiling — nothing ever exceeds this
const VOL = {
  idle:    0.035,
  ambient: 0.065,
  load:    0.10,
  ui:      0.075,
}

const FADE_MS = 1200

export function useAudioEngine() {
  const idleRef      = useRef(null)
  const ambientRef   = useRef(null)
  const loadSfxRef   = useRef(null)   // track the current one-shot so we can kill it
  const timersRef    = useRef([])     // setTimeout handles
  const fadersRef    = useRef([])     // setInterval handles

  // Safely clear all pending fades and timers
  const clearAll = useCallback(() => {
    fadersRef.current.forEach(clearInterval)
    fadersRef.current = []
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  // Destroy a node completely (for ambient / one-shots — never call on idle)
  function killNode(node) {
    if (!node) return
    try { node.pause() } catch (_) {}
    node.src = ''
  }

  // Fade to target. When target===0: pause only (keep src intact for idle resurrection).
  // Pass destroy:true for nodes that will be garbage-collected at 0.
  function fadeTo(node, target, durationMs, { destroy = false } = {}) {
    if (!node) return
    const steps    = 40
    const interval = durationMs / steps
    const start    = node.volume
    const delta    = (target - start) / steps
    let step = 0
    const id = setInterval(() => {
      step++
      node.volume = Math.max(0, Math.min(1, start + delta * step))
      if (step >= steps) {
        clearInterval(id)
        if (target === 0) {
          try { node.pause() } catch (_) {}
          if (destroy) node.src = ''
        }
      }
    }, interval)
    fadersRef.current.push(id)
    return id
  }

  // Initialise idle loop on mount — never destroyed, only paused/resumed
  useEffect(() => {
    const idle = new Audio(pickSrc(PATHS.idle))
    idle.loop   = true
    idle.volume = 0
    idle.play().catch(() => {})
    idleRef.current = idle
    fadeTo(idle, VOL.idle, 2500)

    return () => {
      clearAll()
      killNode(idleRef.current)
      killNode(ambientRef.current)
      killNode(loadSfxRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Disc load trigger — stop previous SFX immediately, cap duration to 4 s
  const playLoadTrigger = useCallback((filmId) => {
    killNode(loadSfxRef.current)
    loadSfxRef.current = null

    const path = PATHS.load[filmId]
    if (!path) return
    const sfx   = new Audio(pickSrc(path))
    sfx.volume  = VOL.load
    sfx.play().catch(() => {})
    loadSfxRef.current = sfx

    const t = setTimeout(() => fadeTo(sfx, 0, 800, { destroy: true }), 4000)
    timersRef.current.push(t)
  }, [])

  // Start film ambient — crossfade cleanly
  const startAmbient = useCallback((filmId) => {
    clearAll()

    // Fade idle down — just pause, keep node alive for resurrection on eject
    if (idleRef.current) fadeTo(idleRef.current, 0, FADE_MS)

    // Fade out and destroy previous ambient
    if (ambientRef.current) {
      const prev = ambientRef.current
      ambientRef.current = null
      fadeTo(prev, 0, 600, { destroy: true })
    }

    const path = PATHS.ambient[filmId]
    if (!path) return
    const amb  = new Audio(pickSrc(path))
    amb.loop   = true
    amb.volume = 0
    amb.play().catch(() => {})
    ambientRef.current = amb
    fadeTo(amb, VOL.ambient, FADE_MS)
  }, [clearAll])

  // Stop ambient and return to idle
  const stopAmbient = useCallback(() => {
    clearAll()
    killNode(loadSfxRef.current)
    loadSfxRef.current = null

    if (ambientRef.current) {
      const prev = ambientRef.current
      ambientRef.current = null
      fadeTo(prev, 0, FADE_MS, { destroy: true })
    }

    // Resurrect idle — node still exists, just paused at vol 0
    const idle = idleRef.current
    if (idle) {
      idle.volume = 0
      idle.play().catch(() => {})
      fadeTo(idle, VOL.idle, FADE_MS)
    }
  }, [clearAll])

  // One-shot UI sound
  const playUI = useCallback((name) => {
    const path = PATHS.ui[name]
    if (!path) return
    const sfx  = new Audio(pickSrc(path))
    sfx.volume = VOL.ui
    sfx.play().catch(() => {})
  }, [])

  // Stop everything — called on page navigation
  const stopAll = useCallback(() => {
    clearAll()
    killNode(idleRef.current)
    killNode(ambientRef.current)
    killNode(loadSfxRef.current)
  }, [clearAll])

  return { playLoadTrigger, startAmbient, stopAmbient, playUI, stopAll }
}
