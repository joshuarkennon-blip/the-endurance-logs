'use client'
import { useState, useEffect, useRef } from 'react'

function LoadingSequence({ film, onComplete, playUI }) {
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState([])

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
    let lineIdx = 0
    const lineInterval = setInterval(() => {
      if (lineIdx < bootLines.length) {
        setLines(prev => [...prev, bootLines[lineIdx]])
        playUI?.('tick')
        lineIdx++
      } else {
        clearInterval(lineInterval)
      }
    }, 220)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 36)

    return () => { clearInterval(lineInterval); clearInterval(progressInterval) }
  }, [])

  return (
    <div className="flex flex-col justify-center items-start h-full p-6 md:p-8 gap-4">
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
        {lines.map((line, i) => (
          <p key={i} className="section-reveal" style={{ animationDelay: `${i * 0.05}s` }}>{line}</p>
        ))}
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

// ── DREAM TRANSITION OVERLAY ──────────────────────────────────────────────────
function DreamTransition({ film, onComplete }) {
  const [phase, setPhase] = useState(0)
  // phase 0: zoom+blur in, phase 1: white flash, phase 2: done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 950)
    const t3 = setTimeout(onComplete, 1100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Zoom blur layer */}
      <div
        className="absolute inset-0 transition-all"
        style={{
          transform: phase >= 1 ? 'scale(1.12)' : 'scale(1)',
          filter: phase === 1 ? 'blur(12px) brightness(3)' : phase === 2 ? 'blur(0px) brightness(1)' : 'blur(0px)',
          opacity: phase === 2 ? 0 : 1,
          transitionDuration: phase === 1 ? '350ms' : '200ms',
          background: phase === 1 ? 'rgba(255,255,255,0.9)' : 'transparent',
        }}
      />
      {/* White flash */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'white',
          opacity: phase === 1 ? 0.95 : 0,
          transition: 'opacity 250ms ease',
        }}
      />
    </div>
  )
}

// ── DREAM LAYER VIEW ─────────────────────────────────────────────────────────
function DreamLayerView({ film, onSurface }) {
  const [visibleSections, setVisibleSections] = useState(0)
  const p = film.production
  const scrollRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSections(prev => {
        if (prev >= p.sections.length + 2) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 350)
    return () => clearInterval(interval)
  }, [film])

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: `radial-gradient(ellipse at center top, ${p.dream_color}08 0%, #050508 60%)`,
      }}
    >
      {/* Dream layer top bar */}
      <div
        className="flex items-center justify-between px-4 md:px-5 py-2 md:py-3 border-b shrink-0"
        style={{ borderColor: `${p.dream_color}50` }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          {/* Pulsing dream indicator */}
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
        <button
          onClick={onSurface}
          className="console-btn text-[10px] md:text-[11px] px-2 md:px-3 py-1 md:py-1.5"
          style={{ borderColor: `${p.dream_color}60`, color: p.dream_glow }}
        >
          ↑ SURFACE
        </button>
      </div>

      {/* Dream layer content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-6">

        {/* Opening */}
        {visibleSections >= 1 && (
          <div className="section-reveal pb-4 border-b" style={{ borderColor: `${p.dream_color}25` }}>
            <p className="text-[10px] md:text-[11px] tracking-widest uppercase mb-2"
              style={{ color: p.dream_color }}>
              // PRODUCTION ARCHIVE
            </p>
            <p className="text-[13px] md:text-[15px] leading-relaxed italic"
              style={{ color: `${p.dream_glow}cc` }}>
              {p.opening}
            </p>
          </div>
        )}

        {/* Sections */}
        {p.sections.map((section, i) => (
          visibleSections >= i + 2 && (
            <div key={i} className="section-reveal">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-1 h-5 shrink-0 rounded-sm"
                  style={{ backgroundColor: p.dream_glow, boxShadow: `0 0 6px ${p.dream_glow}` }} />
                <h2 className="text-[11px] md:text-[13px] font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase"
                  style={{ color: p.dream_glow }}>
                  {section.heading}
                </h2>
              </div>
              <p className="text-[13px] md:text-[14px] leading-relaxed pl-3 md:pl-4"
                style={{ color: '#c8d8e0' }}>
                {section.body}
              </p>
            </div>
          )
        ))}

        {/* Closing note */}
        {visibleSections >= p.sections.length + 2 && (
          <div className="section-reveal pt-4 border-t" style={{ borderColor: `${p.dream_color}25` }}>
            <p className="text-[9px] md:text-[10px] tracking-widest" style={{ color: `${p.dream_color}80` }}>
              {p.closing_note}
            </p>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}

// ── DOSSIER VIEW (LAYER 1) ────────────────────────────────────────────────────
function DossierView({ film, onClose, onGoToShelf }) {
  const [visibleSections, setVisibleSections] = useState(0)
  const [dreamPhase, setDreamPhase]           = useState('idle') // 'idle' | 'transitioning' | 'dream'
  const scrollRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSections(prev => {
        if (prev >= film.dossier.sections.length + 2) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 400)
    return () => clearInterval(interval)
  }, [film])

  const enterDream = () => setDreamPhase('transitioning')

  if (dreamPhase === 'dream') {
    return (
      <DreamLayerView
        film={film}
        onSurface={() => setDreamPhase('idle')}
      />
    )
  }

  return (
    <div className="flex flex-col h-full relative">

      {/* Dream transition overlay */}
      {dreamPhase === 'transitioning' && (
        <DreamTransition film={film} onComplete={() => setDreamPhase('dream')} />
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

      {/* Title block */}
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

      {/* Opening */}
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

      {/* Dossier sections */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-5 md:space-y-6">
        {film.dossier.sections.map((section, i) => (
          visibleSections >= i + 3 && (
            <div key={i} className="section-reveal">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-1 h-4 md:h-5 shrink-0" style={{ backgroundColor: film.color }} />
                <h2 className="text-[11px] md:text-[13px] font-bold tracking-[0.15em] uppercase" style={{ color: film.color }}>
                  {section.heading}
                </h2>
              </div>
              <p className="text-[13px] md:text-[14px] text-console-text leading-relaxed pl-3 md:pl-4">
                {section.body}
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

        {/* WE NEED TO GO DEEPER button */}
        {visibleSections >= film.dossier.sections.length + 3 && film.production && (
          <div className="section-reveal pt-2 pb-4">
            <button
              onClick={enterDream}
              className="w-full group relative overflow-hidden border py-4 px-6 transition-all duration-300"
              style={{
                borderColor: `${film.color}60`,
                background: `linear-gradient(135deg, ${film.color}08 0%, transparent 60%)`,
              }}
            >
              {/* Animated background on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at center, ${film.color}15 0%, transparent 70%)` }}
              />
              <div className="relative flex flex-col items-center gap-1">
                <span className="text-[9px] tracking-[0.4em] text-console-muted uppercase mb-1">
                  LAYER 2 // PRODUCTION ARCHIVE
                </span>
                <span
                  className="text-[13px] md:text-[15px] font-bold tracking-[0.15em] uppercase group-hover:tracking-[0.2em] transition-all duration-300"
                  style={{ color: film.glowColor, textShadow: `0 0 16px ${film.glowColor}60` }}
                >
                  We need to go deeper...
                </span>
                <div className="flex gap-1.5 mt-1">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: film.color, opacity: 0.3 + i * 0.15 }} />
                  ))}
                </div>
              </div>
            </button>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}

// ── ROOT EXPORT ───────────────────────────────────────────────────────────────
export default function LogScreen({ film, isLoading, onLoadComplete, onEject, playUI, onGoToShelf }) {
  return (
    <div className="console-screen flex-1 h-full relative">
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)' }} />

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
        <LoadingSequence film={film} onComplete={onLoadComplete} playUI={playUI} />
      ) : (
        <DossierView film={film} onClose={onEject} onGoToShelf={onGoToShelf} />
      )}
    </div>
  )
}
