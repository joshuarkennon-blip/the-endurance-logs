'use client'
import { useState, useEffect, useRef } from 'react'

// Play the dedicated dream descent cue.
function playDreamDescend() {
  try {
    const a = document.createElement('audio')
    const canOgg = a.canPlayType('audio/ogg')
    const sfx = new Audio(canOgg ? '/audio/dream-descent.ogg' : '/audio/dream-descent.mp3')
    sfx.volume = 0.11
    sfx.play().catch(() => {})
  } catch (_) {}
}

// ── LOADING SEQUENCE ──────────────────────────────────────────────────────────
function LoadingSequence({ film, onComplete, playUI }) {
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
    const li = setInterval(() => {
      if (idx < bootLines.length) { setLines(p => [...p, bootLines[idx]]); playUI?.('tick'); idx++ }
      else clearInterval(li)
    }, 220)
    const pi = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(pi); setTimeout(onComplete, 300); return 100 }
        return p + 2
      })
    }, 36)
    return () => { clearInterval(li); clearInterval(pi) }
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
function DreamTransition({ onComplete }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500)
    const t2 = setTimeout(() => setPhase(2), 850)
    const t3 = setTimeout(onComplete, 1050)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 transition-all"
        style={{
          transform: phase >= 1 ? 'scale(1.10)' : 'scale(1)',
          filter: phase === 1 ? 'blur(10px) brightness(2.5)' : 'blur(0px)',
          transitionDuration: phase === 1 ? '350ms' : '150ms',
        }} />
      <div className="absolute inset-0 transition-opacity"
        style={{ backgroundColor: 'white', opacity: phase === 1 ? 0.92 : 0, transitionDuration: '200ms' }} />
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

// ── LAYER 3: DEEP CUTS ────────────────────────────────────────────────────────
function Layer3View({ film, onSurface }) {
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
    <div className="flex flex-col h-full" style={{
      background: `radial-gradient(ellipse at center top, ${d.dream_color}18 0%, #020205 70%)`,
    }}>
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
        <div className="h-8" />
      </div>
    </div>
  )
}

// ── LAYER 2: PRODUCTION ───────────────────────────────────────────────────────
function Layer2View({ film, onSurface, onDeeper }) {
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
    <div className="flex flex-col h-full relative"
      style={{ background: `radial-gradient(ellipse at center top, ${p.dream_color}08 0%, #050508 60%)` }}>

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
function DossierView({ film, onClose, onGoToShelf }) {
  const [visibleSections, setVisibleSections] = useState(0)
  const [layer, setLayer]                     = useState(1) // 1 | '1to2' | 2 | 3
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

  if (layer === 3) {
    return <Layer3View film={film} onSurface={() => setLayer(2)} />
  }

  if (layer === 2) {
    return (
      <Layer2View
        film={film}
        onSurface={() => setLayer(1)}
        onDeeper={() => setLayer(3)}
      />
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      {layer === '1to2' && <DreamTransition onComplete={() => setLayer(2)} />}

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
