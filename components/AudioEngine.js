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
  idle:    0.05,
  ambient: 0.10,
  load:    0.18,
  ui:      0.12,
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

  // Hard-stop a node immediately
  function kill(node) {
    if (!node) return
    try { node.pause() } catch (_) {}
    node.src = ''
  }

  // Smooth fade — returns interval id
  function fadeTo(node, target, durationMs) {
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
        if (target === 0) kill(node)
      }
    }, interval)
    fadersRef.current.push(id)
    return id
  }

  // Initialise idle loop on mount
  useEffect(() => {
    const idle = new Audio(pickSrc(PATHS.idle))
    idle.loop   = true
    idle.volume = 0
    idle.play().catch(() => {})
    idleRef.current = idle
    fadeTo(idle, VOL.idle, 2500)

    // Full teardown on unmount / navigation
    return () => {
      clearAll()
      kill(idleRef.current)
      kill(ambientRef.current)
      kill(loadSfxRef.current)
    }
  }, [])

  // Disc load trigger — stop previous SFX immediately, cap duration to 4 s
  const playLoadTrigger = useCallback((filmId) => {
    // Kill any still-playing load SFX
    kill(loadSfxRef.current)

    const path = PATHS.load[filmId]
    if (!path) return
    const sfx   = new Audio(pickSrc(path))
    sfx.volume  = VOL.load
    sfx.play().catch(() => {})
    loadSfxRef.current = sfx

    // Auto-fade out after 4 s so it never runs into the ambient loop
    const t = setTimeout(() => fadeTo(sfx, 0, 800), 4000)
    timersRef.current.push(t)
  }, [])

  // Start film ambient — crossfade cleanly
  const startAmbient = useCallback((filmId) => {
    clearAll()

    // Fade idle down
    if (idleRef.current) fadeTo(idleRef.current, 0, FADE_MS)

    // Fade out previous ambient and kill it
    if (ambientRef.current) {
      const prev = ambientRef.current
      ambientRef.current = null
      fadeTo(prev, 0, 600)
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
    kill(loadSfxRef.current)

    if (ambientRef.current) {
      const prev = ambientRef.current
      ambientRef.current = null
      fadeTo(prev, 0, FADE_MS)
    }

    // Bring idle back
    if (idleRef.current) {
      idleRef.current.play().catch(() => {})
      fadeTo(idleRef.current, VOL.idle, FADE_MS)
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
    kill(idleRef.current)
    kill(ambientRef.current)
    kill(loadSfxRef.current)
  }, [clearAll])

  return { playLoadTrigger, startAmbient, stopAmbient, playUI, stopAll }
}
