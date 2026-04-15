'use client'
import { useEffect, useRef, useCallback } from 'react'

// Central audio engine — mounts once at app level.
// Exposes: playLoadTrigger(filmId), startAmbient(filmId), stopAmbient(), playUI(name)
// Each path has MP3 + OGG; browser picks best supported format.

function src(base) {
  // Returns the best supported format path
  if (typeof Audio === 'undefined') return `${base}.mp3`
  const a = document.createElement('audio')
  return a.canPlayType('audio/ogg') ? `${base}.ogg` : `${base}.mp3`
}

const AUDIO = {
  idle:  () => src('/audio/ambient-idle'),
  ui: {
    tick:  () => src('/audio/ui-boot-tick'),
    eject: () => src('/audio/ui-eject'),
  },
  load: {
    interstellar: () => src('/audio/load-interstellar'),
    inception:    () => src('/audio/load-inception'),
    tenet:        () => src('/audio/load-tenet'),
    memento:      () => src('/audio/load-memento'),
  },
  ambient: {
    interstellar: () => src('/audio/ambient-interstellar'),
    inception:    () => src('/audio/ambient-inception'),
    tenet:        () => src('/audio/ambient-tenet'),
    memento:      () => src('/audio/ambient-memento'),
  },
}

const FADE_DURATION = 1500 // ms

export function useAudioEngine() {
  const idleRef    = useRef(null)
  const ambientRef = useRef(null)
  const fadersRef  = useRef([])

  // Initialise idle loop
  useEffect(() => {
    const idle = new Audio(AUDIO.idle())
    idle.loop = true
    idle.volume = 0
    idle.play().catch(() => {}) // browsers require user gesture; will start after first interaction
    idleRef.current = idle

    // Fade idle in
    fadeTo(idle, 0.18, 2000)

    return () => {
      idle.pause()
      idle.src = ''
    }
  }, [])

  // Crossfade helper
  function fadeTo(audio, targetVol, duration) {
    const steps = 60
    const interval = duration / steps
    const startVol = audio.volume
    const delta = (targetVol - startVol) / steps
    let step = 0
    const id = setInterval(() => {
      step++
      audio.volume = Math.max(0, Math.min(1, startVol + delta * step))
      if (step >= steps) clearInterval(id)
    }, interval)
    fadersRef.current.push(id)
    return id
  }

  const playLoadTrigger = useCallback((filmId) => {
    const getter = AUDIO.load[filmId]
    if (!getter) return
    const sfx = new Audio(getter())
    sfx.volume = 0.7
    sfx.play().catch(() => {})
  }, [])

  const startAmbient = useCallback((filmId) => {
    if (idleRef.current) fadeTo(idleRef.current, 0, FADE_DURATION)

    if (ambientRef.current) {
      fadeTo(ambientRef.current, 0, 800)
      const prev = ambientRef.current
      setTimeout(() => { prev.pause(); prev.src = '' }, 900)
    }

    const getter = AUDIO.ambient[filmId]
    if (!getter) return
    const amb = new Audio(getter())
    amb.loop = true
    amb.volume = 0
    amb.play().catch(() => {})
    fadeTo(amb, 0.28, FADE_DURATION)
    ambientRef.current = amb
  }, [])

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      fadeTo(ambientRef.current, 0, FADE_DURATION)
      const prev = ambientRef.current
      setTimeout(() => { prev.pause(); prev.src = '' }, FADE_DURATION + 100)
      ambientRef.current = null
    }
    // Fade idle back in
    if (idleRef.current) {
      idleRef.current.play().catch(() => {})
      fadeTo(idleRef.current, 0.18, FADE_DURATION)
    }
  }, [])

  const playUI = useCallback((name) => {
    const getter = AUDIO.ui[name]
    if (!getter) return
    const sfx = new Audio(getter())
    sfx.volume = 0.4
    sfx.play().catch(() => {})
  }, [])

  return { playLoadTrigger, startAmbient, stopAmbient, playUI }
}
