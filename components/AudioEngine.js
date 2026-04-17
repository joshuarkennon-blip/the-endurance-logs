'use client'
import { useEffect, useRef, useCallback, useState } from 'react'

function pickSrc(base) {
  if (/\.[a-z0-9]+$/i.test(base)) return base
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
    'batman-begins': '/audio/load-batman-begins.wav',
    'the-dark-knight': '/audio/load-the-dark-knight.wav',
    'the-dark-knight-rises': '/audio/load-the-dark-knight-rises.wav',
  },
  ambient: {
    interstellar: '/audio/ambient-interstellar',
    inception:    '/audio/ambient-inception',
    tenet:        '/audio/ambient-tenet',
    memento:      '/audio/ambient-memento',
    'batman-begins': '/audio/ambient-batman-begins.wav',
    'the-dark-knight': '/audio/ambient-the-dark-knight.wav',
    'the-dark-knight-rises': '/audio/ambient-the-dark-knight-rises.wav',
  },
}

const BATMAN_FILMS = new Set()

// Volume ceiling — nothing ever exceeds this
const VOL = {
  idle:    0.065,
  ambient: 0.14,
  load:    0.22,
  ui:      0.11,
}

const AMBIENT_LEVEL_BY_FILM = {}

const LOAD_LEVEL_BY_FILM = {
  'the-dark-knight': 0.72,
}

const FADE_MS = 1200

export function useAudioEngine() {
  const [isMuted, setIsMuted] = useState(false)
  const isMutedRef = useRef(isMuted)
  const idleRef      = useRef(null)
  const ambientRef   = useRef(null)
  const loadSfxRef   = useRef(null)   // track the current one-shot so we can kill it
  const ambientSynthRef = useRef(null)
  const loadSynthRef = useRef(null)
  const currentAmbientFilmIdRef = useRef(null)
  const ambientTargetRef = useRef(VOL.ambient)
  const timersRef    = useRef([])     // setTimeout handles
  const fadersRef    = useRef([])     // setInterval handles

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  const targetVolume = useCallback((value) => (isMuted ? 0 : value), [isMuted])

  const ambientLevelFor = useCallback((filmId) => AMBIENT_LEVEL_BY_FILM[filmId] ?? 1, [])
  const loadLevelFor = useCallback((filmId) => LOAD_LEVEL_BY_FILM[filmId] ?? 1, [])

  function ensureCtxRunning(ctx) {
    if (!ctx || typeof ctx.resume !== 'function') return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
  }

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

  function rampGain(node, to, ms) {
    if (!node?.master?.gain || !node?.ctx) return
    const now = node.ctx.currentTime
    const end = now + Math.max(ms, 1) / 1000
    node.master.gain.cancelScheduledValues(now)
    node.master.gain.setValueAtTime(node.master.gain.value, now)
    node.master.gain.linearRampToValueAtTime(Math.max(0, to), end)
    node.currentGain = Math.max(0, to)
  }

  function stopSynth(ref, fadeMs = 0) {
    const node = ref.current
    if (!node) return
    ref.current = null
    try {
      if (fadeMs > 0) {
        rampGain(node, 0, fadeMs)
        window.setTimeout(() => node.stop?.(), fadeMs + 20)
      } else {
        node.stop?.()
      }
    } catch (_) {}
  }

  function makeNoiseNode(ctx) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const channel = buffer.getChannelData(0)
    for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    return src
  }

  function createBatmanLoadCue(filmId, muted) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      const ctx = new Ctx()
      const master = ctx.createGain()
      master.gain.value = 0.0001
      master.connect(ctx.destination)

      const stop = () => {
        try { ctx.close() } catch (_) {}
      }
      const cue = { ctx, master, currentGain: muted ? 0 : VOL.load * 0.95, stop }
      ensureCtxRunning(ctx)
      const target = cue.currentGain
      master.gain.exponentialRampToValueAtTime(Math.max(target, 0.0001), ctx.currentTime + 0.18)

      const addBraam = (freq, toFreq, dur, type = 'sawtooth', gain = 0.08) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(Math.max(12, toFreq), ctx.currentTime + dur)
        g.gain.setValueAtTime(0.0001, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.06)
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
        osc.connect(g)
        g.connect(master)
        osc.start()
        osc.stop(ctx.currentTime + dur + 0.02)
      }

      if (filmId === 'batman-begins') {
        addBraam(92, 48, 1.9, 'triangle', 0.11)
        const noise = makeNoiseNode(ctx)
        const hp = ctx.createBiquadFilter()
        hp.type = 'highpass'
        hp.frequency.value = 180
        const ng = ctx.createGain()
        ng.gain.setValueAtTime(0.0001, ctx.currentTime)
        ng.gain.exponentialRampToValueAtTime(0.042, ctx.currentTime + 0.12)
        ng.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.3)
        noise.connect(hp)
        hp.connect(ng)
        ng.connect(master)
        noise.start()
        noise.stop(ctx.currentTime + 1.32)
      } else if (filmId === 'the-dark-knight') {
        addBraam(140, 62, 2.4, 'sawtooth', 0.11)
        addBraam(144, 66, 2.4, 'sawtooth', 0.09)
      } else {
        addBraam(76, 32, 2.5, 'square', 0.13)
        addBraam(114, 48, 2.2, 'triangle', 0.08)
      }

      window.setTimeout(() => stop(), 2800)
      return cue
    } catch (_) {
      return null
    }
  }

  function createBatmanAmbient(filmId, muted) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      const ctx = new Ctx()
      const master = ctx.createGain()
      master.gain.value = 0.0001
      master.connect(ctx.destination)

      const nodes = []
      const timers = []
      const currentGain = muted ? 0 : VOL.ambient
      ensureCtxRunning(ctx)

      const addDrone = (freq, type, gain, detune = 0) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = type
        osc.frequency.value = freq
        osc.detune.value = detune
        g.gain.value = gain
        osc.connect(g)
        g.connect(master)
        osc.start()
        nodes.push(osc)
      }

      const pulse = (freq, dur, gain) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        g.gain.setValueAtTime(0.0001, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.04)
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
        osc.connect(g)
        g.connect(master)
        osc.start()
        osc.stop(ctx.currentTime + dur + 0.02)
      }

      if (filmId === 'batman-begins') {
        addDrone(48, 'triangle', 0.058)
        addDrone(96, 'sine', 0.03, -8)
        const noise = makeNoiseNode(ctx)
        const lp = ctx.createBiquadFilter()
        lp.type = 'lowpass'
        lp.frequency.value = 260
        const ng = ctx.createGain()
        ng.gain.value = 0.015
        noise.connect(lp)
        lp.connect(ng)
        ng.connect(master)
        noise.start()
        nodes.push(noise)
        timers.push(window.setInterval(() => pulse(86, 0.45, 0.032), 5200))
      } else if (filmId === 'the-dark-knight') {
        addDrone(82, 'sawtooth', 0.04)
        addDrone(83.6, 'sawtooth', 0.03)
        addDrone(620, 'sine', 0.008)
        timers.push(window.setInterval(() => pulse(176 + Math.random() * 60, 0.28, 0.005), 8800))
      } else {
        addDrone(55, 'square', 0.048)
        addDrone(110, 'triangle', 0.026)
        timers.push(window.setInterval(() => {
          pulse(73, 0.28, 0.034)
          window.setTimeout(() => pulse(73, 0.26, 0.03), 280)
          window.setTimeout(() => pulse(73, 0.26, 0.028), 560)
        }, 4600))
      }

      master.gain.exponentialRampToValueAtTime(Math.max(currentGain, 0.0001), ctx.currentTime + 1.1)

      return {
        ctx,
        master,
        currentGain,
        stop: () => {
          timers.forEach((t) => clearInterval(t))
          try { nodes.forEach((n) => n.stop?.()) } catch (_) {}
          try { ctx.close() } catch (_) {}
        },
      }
    } catch (_) {
      return null
    }
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
    fadeTo(idle, targetVolume(VOL.idle), 2500)

    return () => {
      clearAll()
      killNode(idleRef.current)
      killNode(ambientRef.current)
      killNode(loadSfxRef.current)
      stopSynth(ambientSynthRef, 0)
      stopSynth(loadSynthRef, 0)
    }
  }, [targetVolume]) // eslint-disable-line react-hooks/exhaustive-deps

  // Ensure browser audio unlock on first user gesture.
  useEffect(() => {
    const unlock = () => {
      const idle = idleRef.current
      if (idle) {
        idle.play().catch(() => {})
      }
      if (ambientSynthRef.current?.ctx) ensureCtxRunning(ambientSynthRef.current.ctx)
      if (loadSynthRef.current?.ctx) ensureCtxRunning(loadSynthRef.current.ctx)
    }
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  // Disc load trigger — stop previous SFX immediately, cap duration to 4 s
  const playLoadTrigger = useCallback((filmId) => {
    killNode(loadSfxRef.current)
    loadSfxRef.current = null
    stopSynth(loadSynthRef, 0)

    if (BATMAN_FILMS.has(filmId)) {
      loadSynthRef.current = createBatmanLoadCue(filmId, isMuted)
      return
    }

    const path = PATHS.load[filmId]
    if (!path) return
    const sfx   = new Audio(pickSrc(path))
    sfx.volume  = targetVolume(VOL.load * loadLevelFor(filmId))
    sfx.play().catch(() => {})
    loadSfxRef.current = sfx

    const t = setTimeout(() => fadeTo(sfx, 0, 800, { destroy: true }), 4000)
    timersRef.current.push(t)
  }, [targetVolume, isMuted, loadLevelFor])

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
    stopSynth(ambientSynthRef, 250)

    if (BATMAN_FILMS.has(filmId)) {
      ambientSynthRef.current = createBatmanAmbient(filmId, isMuted)
      currentAmbientFilmIdRef.current = filmId
      return
    }

    const path = PATHS.ambient[filmId]
    if (!path) return
    const ambientTarget = VOL.ambient * ambientLevelFor(filmId)
    ambientTargetRef.current = ambientTarget
    currentAmbientFilmIdRef.current = filmId
    const amb  = new Audio(pickSrc(path))
    amb.loop   = true
    amb.volume = 0
    amb.play().catch(() => {})
    ambientRef.current = amb
    fadeTo(amb, targetVolume(ambientTarget), FADE_MS)
  }, [clearAll, targetVolume, isMuted, ambientLevelFor])

  // Stop ambient and return to idle
  const stopAmbient = useCallback(() => {
    clearAll()
    killNode(loadSfxRef.current)
    loadSfxRef.current = null
    currentAmbientFilmIdRef.current = null

    if (ambientRef.current) {
      const prev = ambientRef.current
      ambientRef.current = null
      fadeTo(prev, 0, FADE_MS, { destroy: true })
    }
    stopSynth(ambientSynthRef, FADE_MS)

    // Resurrect idle — node still exists, just paused at vol 0
    const idle = idleRef.current
    if (idle) {
      idle.volume = 0
      idle.play().catch(() => {})
      fadeTo(idle, targetVolume(VOL.idle), FADE_MS)
    }
  }, [clearAll, targetVolume])

  // One-shot UI sound
  const playUI = useCallback((name) => {
    const path = PATHS.ui[name]
    if (!path) return
    const sfx  = new Audio(pickSrc(path))
    sfx.volume = targetVolume(VOL.ui)
    sfx.play().catch(() => {})
  }, [targetVolume])

  // Stop everything — called on page navigation
  const stopAll = useCallback(() => {
    clearAll()
    currentAmbientFilmIdRef.current = null
    killNode(idleRef.current)
    killNode(ambientRef.current)
    killNode(loadSfxRef.current)
    stopSynth(ambientSynthRef, 0)
    stopSynth(loadSynthRef, 0)
  }, [clearAll])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  useEffect(() => {
    if (isMuted) {
      if (idleRef.current) fadeTo(idleRef.current, 0, 180)
      if (ambientRef.current) fadeTo(ambientRef.current, 0, 180)
      if (loadSfxRef.current) fadeTo(loadSfxRef.current, 0, 180, { destroy: true })
      if (ambientSynthRef.current) rampGain(ambientSynthRef.current, 0, 180)
      if (loadSynthRef.current) rampGain(loadSynthRef.current, 0, 180)
      return
    }

    const ambient = ambientRef.current
    const idle = idleRef.current
    if (ambient && ambient.src) {
      ambient.play().catch(() => {})
      fadeTo(ambient, ambientTargetRef.current, 260)
      if (idle) fadeTo(idle, 0, 220)
      return
    }
    if (ambientSynthRef.current) {
      rampGain(ambientSynthRef.current, ambientTargetRef.current, 260)
      if (idle) fadeTo(idle, 0, 220)
      return
    }

    if (idle && idle.src) {
      idle.play().catch(() => {})
      fadeTo(idle, VOL.idle, 260)
    }
  }, [isMuted])

  return { playLoadTrigger, startAmbient, stopAmbient, playUI, stopAll, isMuted, toggleMute }
}
