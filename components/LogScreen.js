'use client'
import { useState, useEffect, useRef } from 'react'
import { getFilmCreditLines } from '../lib/filmCredits'

// Play the dedicated dream descent cue.
function playDreamDescend() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2.8, ctx.sampleRate)
    const channel = noiseBuffer.getChannelData(0)
    for (let i = 0; i < channel.length; i++) {
      channel[i] = (Math.random() * 2 - 1) * 0.35
    }

    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer

    const lowPass = ctx.createBiquadFilter()
    lowPass.type = 'lowpass'
    lowPass.frequency.setValueAtTime(520, ctx.currentTime)
    lowPass.frequency.linearRampToValueAtTime(220, ctx.currentTime + 2.2)
    lowPass.Q.value = 0.7

    const highPass = ctx.createBiquadFilter()
    highPass.type = 'highpass'
    highPass.frequency.value = 38

    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, ctx.currentTime)
    master.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.45)
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5)

    noise.connect(lowPass)
    lowPass.connect(highPass)
    highPass.connect(master)
    master.connect(ctx.destination)

    noise.start()
    noise.stop(ctx.currentTime + 2.7)
    setTimeout(() => ctx.close(), 3200)
  } catch (_) {}
}

// ── LOADING SEQUENCE ──────────────────────────────────────────────────────────
function LoadingSequence({ film, onComplete, playUI, fxMode = 'full' }) {
  const [progress, setProgress] = useState(0)
  const [lines, setLines]       = useState([])

  const bootLines = [
    `> DISC DETECTED: ${film.code}`,
    `> MOUNTING FILESYSTEM...`,
    `> VERIFYING CHECKSUMS...`,
    `> DECRYPTING LOG ARCHIVE...`,
    `> LOADING TRANSMISSION ${film.transmission}...`,
    `> SIGNAL LOCKED.`,
    `> INITIATING PLAYBACK.`,
  ]

  useEffect(() => {
    let idx = 0
    let completeTimeout = null
    const li = setInterval(() => {
      if (idx < bootLines.length) { setLines(p => [...p, bootLines[idx]]); playUI?.('tick'); idx++ }
      else clearInterval(li)
    }, 320)
    const pi = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(pi)
          completeTimeout = setTimeout(onComplete, 550)
          return 100
        }
        return p + 1.5
      })
    }, 42)
    return () => {
      clearInterval(li)
      clearInterval(pi)
      if (completeTimeout) clearTimeout(completeTimeout)
    }
  }, [onComplete, playUI])

  return (
    <div className="flex flex-col justify-center items-start h-full p-6 md:p-8 gap-4">
      {film.id === 'interstellar' && (
        <div className="pixel-intro-shell section-reveal">
          <img
            src="/animations/interstellar-pixel-scene.svg"
            alt="Pixel-art Interstellar loading scene"
            className={`pixel-intro-scene pixel-art ${fxMode === 'lite' ? 'pixel-intro-scene-lite' : ''}`}
            draggable={false}
          />
          <div className="pixel-intro-vignette" />
          <div className="pixel-intro-scanlines" />
        </div>
      )}
      <div className="mb-2">
        <p className="text-[12px] md:text-[13px] tracking-[0.3em] uppercase mb-1" style={{ color: film.color }}>
          ENDURANCE // FILE SYSTEM SWAP
        </p>
        <p className="text-[26px] md:text-[30px] font-bold tracking-[0.15em]"
          style={{ color: film.glowColor, textShadow: `0 0 20px ${film.glowColor}` }}>
          {film.title}
        </p>
      </div>
      <div className="w-full space-y-1.5 font-mono text-[12px] md:text-[13px] text-console-muted">
        {lines.map((line, i) => <p key={i} className="section-reveal" style={{ animationDelay: `${i * 0.05}s` }}>{line}</p>)}
      </div>
      <div className="w-full mt-4">
        <div className="flex justify-between text-[10px] md:text-[11px] text-console-muted mb-1">
          <span>LOADING</span><span>{progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-console-dim">
          <div className="h-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: film.glowColor, boxShadow: `0 0 6px ${film.glowColor}` }} />
        </div>
      </div>
    </div>
  )
}

// ── DREAM TRANSITION ──────────────────────────────────────────────────────────
function DreamTransition({ onComplete, pulseMs = 1450 }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 80)
    const t2 = setTimeout(() => setPhase(2), Math.round(pulseMs * 0.7))
    const t3 = setTimeout(onComplete, pulseMs)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete, pulseMs])

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 transition-all dream-transition-zoom"
        style={{
          transform: phase >= 1 ? 'scale(1.11)' : 'scale(1)',
          filter: phase >= 1 ? 'blur(10px) brightness(0.82)' : 'blur(0px) brightness(1)',
          opacity: phase >= 2 ? 0.08 : 1,
          transitionDuration: phase === 1 ? `${Math.round(pulseMs * 0.5)}ms` : `${Math.round(pulseMs * 0.25)}ms`,
          transitionTimingFunction: 'cubic-bezier(0.2, 0.7, 0, 1)',
        }} />
      <div className="absolute inset-0 transition-opacity"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.92) 75%, #000 100%)',
          opacity: phase >= 1 ? 1 : 0,
          transitionDuration: `${Math.round(pulseMs * 0.55)}ms`,
          transitionTimingFunction: 'ease-in',
        }} />
    </div>
  )
}

const TERMINAL_GLITCH_FRAGMENTS = [
  'CHK:ERR',
  '0x7F_BAD',
  'SIG_LOST',
  'CRC..??',
  'MEM:LEAK?',
  'IRQ:??',
  'SYNC_FAIL',
  'BAD_SECT',
  'READ_ERR',
  'TIMEOUT',
]

function DreamLayerGlitches({ level = 1, glowColor = '#8ab4d2', filmId = '', fxMode = 'full' }) {
  const [lineGlitch, setLineGlitch] = useState(null)
  const [staticFlash, setStaticFlash] = useState(false)
  const [shiftBand, setShiftBand] = useState(null)
  const [smileGlitch, setSmileGlitch] = useState(false)
  const [terminalFlash, setTerminalFlash] = useState(null)
  const [cursorBlink, setCursorBlink] = useState(null)
  const [phosphorTick, setPhosphorTick] = useState(false)
  const fxDisabled = fxMode === 'off'

  useEffect(() => {
    if (fxDisabled) return
    if (typeof window === 'undefined') return
    let active = true
    let loopId = null
    const transientIds = []
    const chanceScale = fxMode === 'lite' ? 0.58 : 1
    const delayScale = fxMode === 'lite' ? 1.45 : 1

    const tdk = filmId === 'the-dark-knight'
    const minDelay = Math.max(720, (2800 - level * 380) * delayScale)
    const maxDelay = Math.max(1100, (4200 - level * 480) * delayScale)

    const trigger = () => {
      if (!active) return
      const roll = Math.random()
      const lineChance = (0.12 + level * 0.055) * chanceScale
      const staticChance = (0.04 + level * 0.028) * chanceScale
      const shiftChance = (0.03 + level * 0.025) * chanceScale
      const terminalChance = (0.05 + level * 0.02 + (tdk ? 0.04 : 0)) * chanceScale
      const cursorChance = (0.035 + level * 0.015 + (tdk ? 0.03 : 0)) * chanceScale
      const phosphorChance = (0.06 + level * 0.02) * chanceScale

      if (roll < lineChance) {
        setLineGlitch({
          top: `${8 + Math.random() * 84}%`,
          height: `${1 + Math.random() * 2.2}px`,
          drift: `${(Math.random() * 10 - 5).toFixed(1)}px`,
          opacity: 0.09 + level * 0.038,
        })
        transientIds.push(window.setTimeout(() => setLineGlitch(null), 80 + Math.random() * 100))
      }

      if (Math.random() < staticChance) {
        setStaticFlash(true)
        transientIds.push(window.setTimeout(() => setStaticFlash(false), 48 + Math.random() * 72))
      }

      if (Math.random() < shiftChance) {
        setShiftBand({
          top: `${12 + Math.random() * 70}%`,
          height: `${5 + Math.random() * 10}px`,
          offset: `${(Math.random() * 8 - 4).toFixed(1)}px`,
          opacity: 0.06 + level * 0.025,
        })
        transientIds.push(window.setTimeout(() => setShiftBand(null), 72 + Math.random() * 88))
      }

      if (tdk && Math.random() < (0.028 + level * 0.012) * chanceScale) {
        setSmileGlitch(true)
        transientIds.push(window.setTimeout(() => setSmileGlitch(false), 120 + Math.random() * 160))
      }

      if (Math.random() < terminalChance) {
        const text = TERMINAL_GLITCH_FRAGMENTS[Math.floor(Math.random() * TERMINAL_GLITCH_FRAGMENTS.length)]
        setTerminalFlash({
          text,
          left: `${6 + Math.random() * 58}%`,
          top: `${10 + Math.random() * 72}%`,
        })
        transientIds.push(window.setTimeout(() => setTerminalFlash(null), 95 + Math.random() * 140))
      }

      if (Math.random() < cursorChance) {
        setCursorBlink({
          left: `${4 + Math.random() * 88}%`,
          top: `${14 + Math.random() * 68}%`,
        })
        transientIds.push(window.setTimeout(() => setCursorBlink(null), 55 + Math.random() * 85))
      }

      if (Math.random() < phosphorChance) {
        setPhosphorTick(true)
        transientIds.push(window.setTimeout(() => setPhosphorTick(false), 38 + Math.random() * 55))
      }

      const nextDelay = minDelay + Math.random() * (maxDelay - minDelay)
      loopId = window.setTimeout(trigger, nextDelay)
    }

    loopId = window.setTimeout(trigger, minDelay + Math.random() * 800)

    return () => {
      active = false
      if (loopId) window.clearTimeout(loopId)
      transientIds.forEach((id) => window.clearTimeout(id))
    }
  }, [level, filmId, fxMode, fxDisabled])

  if (fxDisabled) return null

  return (
    <div className="dream-layer-glitch-shell" aria-hidden style={{ '--dream-glitch-color': glowColor, opacity: fxMode === 'lite' ? 0.7 : 1 }}>
      {phosphorTick && <span className="dream-layer-glitch-phosphor" />}
      {lineGlitch && (
        <span
          className="dream-layer-glitch-line"
          style={{
            top: lineGlitch.top,
            height: lineGlitch.height,
            opacity: lineGlitch.opacity,
            transform: `translateX(${lineGlitch.drift})`,
          }}
        />
      )}
      {staticFlash && <span className="dream-layer-glitch-static" />}
      {shiftBand && (
        <span
          className="dream-layer-glitch-shift"
          style={{
            top: shiftBand.top,
            height: shiftBand.height,
            transform: `translateX(${shiftBand.offset})`,
            opacity: shiftBand.opacity,
          }}
        />
      )}
      {terminalFlash && (
        <span
          className="dream-layer-glitch-terminal"
          style={{ left: terminalFlash.left, top: terminalFlash.top }}
        >
          {terminalFlash.text}
        </span>
      )}
      {cursorBlink && (
        <span
          className="dream-layer-glitch-cursor"
          style={{ left: cursorBlink.left, top: cursorBlink.top }}
        />
      )}
      {smileGlitch && <span className="dream-layer-glitch-smile">:)</span>}
    </div>
  )
}

// ── DEEPER BUTTON (reused at bottom of L2 and L1) ────────────────────────────
function DeeperButton({ color, glowColor, label, sublabel, onClick }) {
  return (
    <div className="section-reveal pt-2 pb-4">
      <button
        onClick={onClick}
        className="w-full group relative overflow-hidden border py-4 px-6 transition-all duration-300"
        style={{
          borderColor: `${color}60`,
          background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 70%)` }} />
        <div className="relative flex flex-col items-center gap-1">
          <span className="text-[9px] tracking-[0.4em] text-console-muted uppercase mb-1">{sublabel}</span>
          <span className="text-[13px] md:text-[15px] font-bold tracking-[0.15em] uppercase group-hover:tracking-[0.2em] transition-all duration-300"
            style={{ color: glowColor, textShadow: `0 0 16px ${glowColor}60` }}>
            {label}
          </span>
          <div className="flex gap-1.5 mt-1">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-1 h-1 rounded-full"
                style={{ backgroundColor: color, opacity: 0.3 + i * 0.15 }} />
            ))}
          </div>
        </div>
      </button>
    </div>
  )
}

const FINAL_DREAM_MOTIFS = {
  interstellar: ['🪐', '🕳️', '⌚', '🚀'],
  inception: ['🌀', '🏙️', '🧠', '🧱'],
  tenet: ['⏳', '🔫', '🔁', '🧩'],
  memento: ['📸', '📝', '🩸', '🧠'],
  'batman-begins': ['🦇', '🚆', '🌫️', '⚙️'],
  'the-dark-knight': ['🃏', '🚓', '🏙️', '🦇'],
  'the-dark-knight-rises': ['🔥', '🕳️', '💣', '🦇'],
}

const TDK_FINALE_PALETTE = {
  '.': null,
  H: '#15803d',
  h: '#22c55e',
  f: '#d1fae5',
  e: '#0f172a',
  p: '#4c1d95',
  P: '#7c3aed',
  M: '#991b1b',
  m: '#fca5a5',
}

const TDK_FINALE_PIXEL_ROWS = [
  '....hhhhhh....',
  '...hhhhhhhh...',
  '..hhhhhhhhhh..',
  '.hhffffffffhh.',
  '.hffeeeeeeffh.',
  '.hfePPPPeeefh.',
  '.hfePMMMpeefh.',
  '.hfePMMMpeefh.',
  '.hfeemmmmeeefh.',
  '.hffeeeeeeffh.',
  '..hhppPPpphh..',
  '...hhhhhhhh...',
  '....hhhhhh....',
]

function TdkFinalePixelJoker() {
  const w = TDK_FINALE_PIXEL_ROWS[0].length
  const h = TDK_FINALE_PIXEL_ROWS.length
  const scale = 10
  return (
    <svg
      className="tdk-pixel-joker-svg pixel-art"
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      aria-hidden
    >
      {TDK_FINALE_PIXEL_ROWS.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const fill = TDK_FINALE_PALETTE[ch]
          if (!fill) return null
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
        })
      )}
    </svg>
  )
}

function TdkLayer4Finale() {
  return (
    <div className="tdk-layer4-finale">
      <div className="tdk-pixel-joker-wrap" style={{ '--tdk-laugh-dur': '4.6s' }}>
        <div className="tdk-pixel-joker-glow">
          <TdkFinalePixelJoker />
        </div>
      </div>
    </div>
  )
}

function Layer4View({ film, onSurface, fxMode }) {
  const motifs = FINAL_DREAM_MOTIFS[film.id] || ['◈', '✦', '▦', '⌁']
  const dreamColor = film.deepcuts?.dream_color || film.color
  const dreamGlow = film.deepcuts?.dream_glow || film.glowColor
  const creditLines = getFilmCreditLines(film)
  const rollingCredits = [...creditLines, ...creditLines, ...creditLines]
  const isTdk = film.id === 'the-dark-knight'

  return (
    <div
      className="flex flex-col h-full relative dream-layer-final"
      style={{
        background: `radial-gradient(ellipse at center, ${dreamGlow}24 0%, ${dreamColor}45 35%, #020304 82%)`,
      }}
    >
      <DreamLayerGlitches level={4} glowColor={dreamGlow} filmId={film.id} fxMode={fxMode} />
      <div className="flex items-center justify-between px-4 md:px-5 py-2 md:py-3 border-b shrink-0"
        style={{ borderColor: `${dreamGlow}70`, borderStyle: 'dashed' }}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="dream-core-led" />
          <span className="text-[9px] md:text-[10px] tracking-[0.28em] uppercase font-bold"
            style={{ color: dreamGlow, textShadow: `0 0 12px ${dreamGlow}` }}>
            DREAM LAYER 4 — CORE SIGNAL LOOP
          </span>
        </div>
        <button onClick={onSurface} className="console-btn text-[9px] md:text-[10px] px-2 py-1"
          style={{ borderColor: `${dreamGlow}70`, color: dreamGlow }}>
          ↑↑↑ SURFACE
        </button>
      </div>

      <div className="flex-1 relative px-4 py-6">
        <div className="dream-credits-bg" aria-hidden>
          <div className="dream-credits-roll dream-credits-roll--bg">
            <div className="dream-credits-roll-inner">
              {rollingCredits.map((line, idx) => (
                <p key={`${film.id}-credit-bg-${idx}`} className="dream-credits-line dream-credits-line--bg">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-20 flex h-full flex-col items-center justify-center gap-4">
          {isTdk ? (
            <TdkLayer4Finale />
          ) : (
            <div className="pixel-core-shell">
              <div className="pixel-core-grid pixel-art" />
              <div className="pixel-core-vignette" />
              <div className="pixel-core-scan" />
              {motifs.map((motif, index) => (
                <span
                  key={`${film.id}-motif-${index}`}
                  className={`pixel-core-motif motif-${index + 1}`}
                  style={{ color: index % 2 ? dreamGlow : '#d5edf4' }}
                >
                  {motif}
                </span>
              ))}
            </div>
          )}
          <p className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-console-muted text-center">
            {film.title} // recursive memory fragment // live loop
          </p>
        </div>
      </div>
    </div>
  )
}

// ── LAYER 3: DEEP CUTS ────────────────────────────────────────────────────────
function Layer3View({ film, onSurface, onDeeper, fxMode }) {
  const [visibleSections, setVisibleSections] = useState(0)
  const d = film.deepcuts
  const scrollRef = useRef(null)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisibleSections(prev => {
        if (prev >= d.sections.length + 2) { clearInterval(iv); return prev }
        return prev + 1
      })
    }, 320)
    return () => clearInterval(iv)
  }, [film])

  return (
    <div
      className="flex flex-col h-full relative dream-layer-deep"
      style={{
        background: `radial-gradient(ellipse at 60% 10%, ${d.dream_glow}1f 0%, transparent 42%), radial-gradient(ellipse at 20% 20%, ${d.dream_color}38 0%, #020206 68%)`,
      }}
    >
      <DreamLayerGlitches level={3} glowColor={d.dream_glow} filmId={film.id} fxMode={fxMode} />
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-5 py-2 md:py-3 border-b shrink-0"
        style={{ borderColor: `${d.dream_color}60`, borderStyle: 'dashed' }}>
        <div className="flex items-center gap-2 md:gap-3">
          {/* Triple pulse = layer 3 */}
          <div className="flex gap-0.5">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="w-1 h-3 rounded-sm animate-pulse"
                style={{ backgroundColor: d.dream_glow, opacity: 0.4 + (i % 3) * 0.2, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold"
            style={{ color: d.dream_glow, textShadow: `0 0 16px ${d.dream_glow}` }}>
            {d.layer_label}
          </span>
        </div>
        <button onClick={onSurface} className="console-btn text-[9px] md:text-[10px] px-2 py-1"
          style={{ borderColor: `${d.dream_color}60`, color: d.dream_glow }}>
          ↑↑ SURFACE
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-6">
        {visibleSections >= 1 && (
          <div className="section-reveal pb-4 border-b border-dashed" style={{ borderColor: `${d.dream_color}30` }}>
            <p className="text-[9px] md:text-[10px] tracking-widest uppercase mb-2" style={{ color: d.dream_color }}>
              // LAYER 3 — CLASSIFIED SIGNAL
            </p>
            <p className="text-[13px] md:text-[14px] leading-relaxed italic" style={{ color: `${d.dream_glow}bb` }}>
              {d.opening}
            </p>
          </div>
        )}

        {d.sections.map((s, i) => (
          visibleSections >= i + 2 && (
            <div key={i} className="section-reveal">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-px h-5 shrink-0" style={{ backgroundColor: d.dream_glow, boxShadow: `0 0 8px ${d.dream_glow}` }} />
                <div className="w-px h-3 shrink-0 ml-0.5" style={{ backgroundColor: d.dream_glow, opacity: 0.5 }} />
                <h2 className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] uppercase ml-1"
                  style={{ color: d.dream_glow }}>
                  {s.heading}
                </h2>
              </div>
              <p className="text-[12px] md:text-[14px] leading-relaxed pl-4" style={{ color: '#c0d0d8' }}>
                {s.body}
              </p>
            </div>
          )
        ))}

        {visibleSections >= d.sections.length + 2 && (
          <div className="section-reveal pt-4 border-t border-dashed" style={{ borderColor: `${d.dream_color}30` }}>
            <p className="text-[9px] md:text-[10px] tracking-widest" style={{ color: `${d.dream_color}70` }}>
              {d.closing_note}
            </p>
          </div>
        )}
        {visibleSections >= d.sections.length + 2 && (
          <DeeperButton
            color={d.dream_color}
            glowColor={d.dream_glow}
            label="Descend to final layer..."
            sublabel="LAYER 4 // DREAM CORE LOOP"
            onClick={() => {
              playDreamDescend()
              onDeeper()
            }}
          />
        )}
        <div className="h-8" />
      </div>
    </div>
  )
}

// ── LAYER 2: PRODUCTION ───────────────────────────────────────────────────────
function Layer2View({ film, onSurface, onDeeper, fxMode }) {
  const [visibleSections, setVisibleSections] = useState(0)
  const p = film.production
  const scrollRef = useRef(null)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisibleSections(prev => {
        if (prev >= p.sections.length + 3) { clearInterval(iv); return prev }
        return prev + 1
      })
    }, 350)
    return () => clearInterval(iv)
  }, [film])

  const handleDeeper = () => {
    playDreamDescend()
    onDeeper()
  }

  return (
    <div
      className="flex flex-col h-full relative dream-layer-mid"
      style={{ background: `radial-gradient(ellipse at 70% 0%, ${p.dream_glow}18 0%, transparent 44%), radial-gradient(ellipse at 30% 15%, ${p.dream_color}24 0%, #050509 66%)` }}
    >
      <DreamLayerGlitches level={2} glowColor={p.dream_glow} filmId={film.id} fxMode={fxMode} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-5 py-2 md:py-3 border-b shrink-0"
        style={{ borderColor: `${p.dream_color}50` }}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: p.dream_glow, opacity: 0.6 + i * 0.2, animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
          <span className="text-[9px] md:text-[11px] tracking-[0.3em] uppercase font-bold"
            style={{ color: p.dream_glow, textShadow: `0 0 12px ${p.dream_glow}` }}>
            {p.layer_label}
          </span>
        </div>
        <button onClick={onSurface} className="console-btn text-[10px] md:text-[11px] px-2 md:px-3 py-1"
          style={{ borderColor: `${p.dream_color}60`, color: p.dream_glow }}>
          ↑ SURFACE
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-6">
        {visibleSections >= 1 && (
          <div className="section-reveal pb-4 border-b" style={{ borderColor: `${p.dream_color}25` }}>
            <p className="text-[10px] md:text-[11px] tracking-widest uppercase mb-2" style={{ color: p.dream_color }}>
              // PRODUCTION ARCHIVE
            </p>
            <p className="text-[13px] md:text-[15px] leading-relaxed italic" style={{ color: `${p.dream_glow}cc` }}>
              {p.opening}
            </p>
          </div>
        )}

        {p.sections.map((s, i) => (
          visibleSections >= i + 2 && (
            <div key={i} className="section-reveal">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-1 h-5 shrink-0 rounded-sm"
                  style={{ backgroundColor: p.dream_glow, boxShadow: `0 0 6px ${p.dream_glow}` }} />
                <h2 className="text-[11px] md:text-[13px] font-bold tracking-[0.15em] uppercase"
                  style={{ color: p.dream_glow }}>{s.heading}</h2>
              </div>
              <p className="text-[13px] md:text-[14px] leading-relaxed pl-3 md:pl-4" style={{ color: '#c8d8e0' }}>
                {s.body}
              </p>
            </div>
          )
        ))}

        {visibleSections >= p.sections.length + 2 && (
          <div className="section-reveal pt-4 border-t" style={{ borderColor: `${p.dream_color}25` }}>
            <p className="text-[9px] md:text-[10px] tracking-widest" style={{ color: `${p.dream_color}80` }}>
              {p.closing_note}
            </p>
          </div>
        )}

        {/* Layer 3 button */}
        {visibleSections >= p.sections.length + 3 && film.deepcuts && (
          <DeeperButton
            color={film.deepcuts.dream_color}
            glowColor={film.deepcuts.dream_glow}
            label="We need to go deeper..."
            sublabel="LAYER 3 // DEEP SIGNAL ARCHIVE"
            onClick={handleDeeper}
          />
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}

// ── LAYER 1: DOSSIER ──────────────────────────────────────────────────────────
function DossierView({ film, onClose, onGoToShelf, fxMode }) {
  const [visibleSections, setVisibleSections] = useState(0)
  const [layer, setLayer]                     = useState(1) // 1 | '1to2' | 2 | '2to3' | 3 | '3to4' | 4
  const scrollRef = useRef(null)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisibleSections(prev => {
        if (prev >= film.dossier.sections.length + 3) { clearInterval(iv); return prev }
        return prev + 1
      })
    }, 400)
    return () => clearInterval(iv)
  }, [film])

  const handleGoDeeper = () => {
    playDreamDescend()
    setLayer('1to2')
  }

  if (layer === 4) {
    return <Layer4View film={film} onSurface={() => setLayer(3)} fxMode={fxMode} />
  }

  if (layer === 3 || layer === '3to4') {
    return (
      <div className="relative h-full">
        <Layer3View
          film={film}
          onSurface={() => setLayer(2)}
          onDeeper={() => setLayer('3to4')}
          fxMode={fxMode}
        />
        {layer === '3to4' && (
          <DreamTransition
            pulseMs={1850}
            onComplete={() => setLayer(4)}
          />
        )}
      </div>
    )
  }

  if (layer === 2 || layer === '2to3') {
    return (
      <div className="relative h-full">
        <Layer2View
          film={film}
          onSurface={() => setLayer(1)}
          onDeeper={() => setLayer('2to3')}
          fxMode={fxMode}
        />
        {layer === '2to3' && (
          <DreamTransition
            pulseMs={1680}
            onComplete={() => setLayer(3)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <DreamLayerGlitches level={1} glowColor={film.glowColor} filmId={film.id} fxMode={fxMode} />
      {layer === '1to2' && (
        <DreamTransition
          pulseMs={1540}
          onComplete={() => setLayer(2)}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-5 py-2 md:py-3 border-b shrink-0"
        style={{ borderColor: `${film.color}40` }}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="led green" />
          <span className="text-[10px] md:text-[12px] tracking-[0.2em] uppercase" style={{ color: film.color }}>
            {film.transmission}
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex gap-1 flex-wrap">
            {film.themes.map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 border tracking-wider"
                style={{ borderColor: `${film.color}50`, color: `${film.color}cc` }}>
                {t.toUpperCase()}
              </span>
            ))}
          </div>
          <button onClick={onGoToShelf} className="console-btn md:hidden text-[10px] px-2 py-1">← BACK</button>
          <button onClick={onClose} className="console-btn text-[10px] md:text-[11px] px-2 md:px-3 py-1 md:py-1.5">
            EJECT ✕
          </button>
        </div>
      </div>

      {visibleSections >= 1 && (
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-3 border-b border-console-border shrink-0 section-reveal">
          <div className="flex items-baseline gap-3 md:gap-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-[0.08em]"
              style={{ color: film.glowColor, textShadow: `0 0 30px ${film.glowColor}60` }}>
              {film.title}
            </h1>
            <span className="text-console-muted text-sm md:text-base">{film.year}</span>
          </div>
          <p className="text-console-text text-[12px] md:text-[14px] mt-1 tracking-wider italic">
            "{film.tagline}"
          </p>
          <div className="flex md:hidden gap-1 flex-wrap mt-2">
            {film.themes.map(t => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 border tracking-wider"
                style={{ borderColor: `${film.color}50`, color: `${film.color}cc` }}>
                {t.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {visibleSections >= 2 && (
        <div className="px-4 md:px-6 pt-3 md:pt-4 pb-3 border-b border-console-border shrink-0 section-reveal">
          <p className="text-[10px] md:text-[11px] text-console-muted tracking-widest uppercase mb-2">
            // TRANSMISSION OPENING
          </p>
          <p className="text-[13px] md:text-[15px] text-console-text leading-relaxed">
            {film.dossier.opening}
          </p>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-5 md:space-y-6">
        {film.dossier.sections.map((s, i) => (
          visibleSections >= i + 3 && (
            <div key={i} className="section-reveal">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-1 h-4 md:h-5 shrink-0" style={{ backgroundColor: film.color }} />
                <h2 className="text-[11px] md:text-[13px] font-bold tracking-[0.15em] uppercase"
                  style={{ color: film.color }}>{s.heading}</h2>
              </div>
              <p className="text-[13px] md:text-[14px] text-console-text leading-relaxed pl-3 md:pl-4">
                {s.body}
              </p>
            </div>
          )
        ))}

        {visibleSections >= film.dossier.sections.length + 3 && (
          <div className="section-reveal pt-4 border-t border-console-border">
            <p className="text-[10px] md:text-[11px] text-console-muted tracking-widest">
              {film.dossier.closing_transmission}
            </p>
          </div>
        )}

        {visibleSections >= film.dossier.sections.length + 3 && film.production && (
          <DeeperButton
            color={film.color}
            glowColor={film.glowColor}
            label="We need to go deeper..."
            sublabel="LAYER 2 // PRODUCTION ARCHIVE"
            onClick={handleGoDeeper}
          />
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function LogScreen({ film, isLoading, onLoadComplete, onEject, playUI, onGoToShelf, jokerGlitchTick = 0, fxMode = 'full' }) {
  const [showJokerGlitch, setShowJokerGlitch] = useState(false)

  useEffect(() => {
    if (!film || film.id !== 'the-dark-knight' || !jokerGlitchTick || fxMode === 'off') return
    setShowJokerGlitch(true)
    const id = window.setTimeout(() => setShowJokerGlitch(false), fxMode === 'lite' ? 140 : 220)
    return () => window.clearTimeout(id)
  }, [film, jokerGlitchTick, fxMode])

  return (
    <div className="console-screen flex-1 h-full relative">
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)' }} />
      {showJokerGlitch && fxMode !== 'off' && (
        <div className="joker-glitch-overlay" aria-hidden>
          <span className="joker-glitch-text">HA</span>
        </div>
      )}

      {!film ? (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
          <div>
            <div className="text-5xl md:text-6xl mb-4 opacity-30">◈</div>
            <p className="text-[13px] md:text-[14px] tracking-[0.3em] text-console-muted uppercase">No Disc Loaded</p>
            <p className="text-[11px] md:text-[12px] text-console-muted mt-2 tracking-wider">
              <span className="hidden md:inline">Select a log from the archive and drag to this console</span>
              <span className="md:hidden">Tap a disc in the Archive to load a log</span>
            </p>
          </div>
          <div className="max-w-xl space-y-2 border-t border-console-border pt-4">
            <p className="text-[10px] md:text-[11px] tracking-[0.24em] text-console-muted uppercase">Nolan Throughline</p>
            <p className="text-[12px] md:text-[13px] text-console-text leading-relaxed">
              These films run as systems under pressure: time distortion, memory failure, institutional decay, and moral trade-offs made under constraint.
            </p>
            <p className="text-[12px] md:text-[13px] text-console-text leading-relaxed">
              Different genre wrappers, same core engine: build a framework to survive uncertainty, then pay the hidden cost that framework creates.
            </p>
            <p className="text-[12px] md:text-[13px] text-console-text leading-relaxed">
              Recurring signal: structure is argument.
            </p>
          </div>
          <div className="w-2 h-3 bg-console-muted animate-pulse mt-2" />
          <div className="absolute bottom-4 left-0 right-0 px-4 md:px-6">
            <div className="flex justify-between text-[10px] md:text-[11px] text-console-muted">
              <span>ENDURANCE // STANDBY</span>
              <span>SIG: NOMINAL</span>
              <span className="hidden md:inline">PWR: ONLINE</span>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <LoadingSequence film={film} onComplete={onLoadComplete} playUI={playUI} fxMode={fxMode} />
      ) : (
        <DossierView film={film} onClose={onEject} onGoToShelf={onGoToShelf} fxMode={fxMode} />
      )}
    </div>
  )
}
