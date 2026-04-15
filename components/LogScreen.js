'use client'
import { useState, useEffect, useRef } from 'react'

function LoadingSequence({ film, onComplete }) {
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

    return () => {
      clearInterval(lineInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="flex flex-col justify-center items-start h-full p-8 gap-4">
      <div className="mb-2">
        <p className="text-[13px] tracking-[0.3em] uppercase mb-1" style={{ color: film.color }}>
          ENDURANCE // FILE SYSTEM SWAP
        </p>
        <p className="text-[30px] font-bold tracking-[0.15em]" style={{ color: film.glowColor, textShadow: `0 0 20px ${film.glowColor}` }}>
          {film.title}
        </p>
      </div>

      <div className="w-full space-y-1.5 font-mono text-[13px] text-console-muted">
        {lines.map((line, i) => (
          <p key={i} className="section-reveal" style={{ animationDelay: `${i * 0.05}s` }}>
            {line}
          </p>
        ))}
      </div>

      <div className="w-full mt-4">
        <div className="flex justify-between text-[11px] text-console-muted mb-1">
          <span>LOADING</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-console-dim">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              backgroundColor: film.glowColor,
              boxShadow: `0 0 6px ${film.glowColor}`
            }}
          />
        </div>
      </div>
    </div>
  )
}

function DossierView({ film, onClose }) {
  const [visibleSections, setVisibleSections] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSections(prev => {
        if (prev >= film.dossier.sections.length + 2) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 400)
    return () => clearInterval(interval)
  }, [film])

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: `${film.color}40` }}
      >
        <div className="flex items-center gap-3">
          <div className="led green" />
          <span className="text-[12px] tracking-[0.25em] uppercase" style={{ color: film.color }}>
            {film.transmission}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 flex-wrap">
            {film.themes.map(t => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 border tracking-wider"
                style={{ borderColor: `${film.color}50`, color: `${film.color}cc` }}
              >
                {t.toUpperCase()}
              </span>
            ))}
          </div>
          <button onClick={onClose} className="console-btn text-[11px] px-3 py-1.5">
            EJECT ✕
          </button>
        </div>
      </div>

      {/* Title block */}
      {visibleSections >= 1 && (
        <div className="px-6 pt-5 pb-3 border-b border-console-border shrink-0 section-reveal">
          <div className="flex items-baseline gap-4">
            <h1
              className="text-5xl font-bold tracking-[0.1em]"
              style={{ color: film.glowColor, textShadow: `0 0 30px ${film.glowColor}60` }}
            >
              {film.title}
            </h1>
            <span className="text-console-muted text-base">{film.year}</span>
          </div>
          <p className="text-console-text text-[14px] mt-1 tracking-wider italic">
            "{film.tagline}"
          </p>
        </div>
      )}

      {/* Opening */}
      {visibleSections >= 2 && (
        <div className="px-6 pt-4 pb-3 border-b border-console-border shrink-0 section-reveal">
          <p className="text-[11px] text-console-muted tracking-widest uppercase mb-2">
            // TRANSMISSION OPENING
          </p>
          <p className="text-[15px] text-console-text leading-relaxed">
            {film.dossier.opening}
          </p>
        </div>
      )}

      {/* Sections */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {film.dossier.sections.map((section, i) => (
          visibleSections >= i + 3 && (
            <div key={i} className="section-reveal">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-1 h-5 shrink-0"
                  style={{ backgroundColor: film.color }}
                />
                <h2
                  className="text-[13px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: film.color }}
                >
                  {section.heading}
                </h2>
              </div>
              <p className="text-[14px] text-console-text leading-relaxed pl-4">
                {section.body}
              </p>
            </div>
          )
        ))}

        {/* Closing transmission */}
        {visibleSections >= film.dossier.sections.length + 3 && (
          <div className="section-reveal pt-4 border-t border-console-border">
            <p className="text-[11px] text-console-muted tracking-widest">
              {film.dossier.closing_transmission}
            </p>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}

export default function LogScreen({ film, isLoading, onLoadComplete, onEject }) {
  return (
    <div className="console-screen flex-1 h-full relative">
      {/* Screen vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)'
        }}
      />

      {!film ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-center">
            <div className="text-6xl mb-4 pixel-art opacity-30">◈</div>
            <p className="text-[14px] tracking-[0.3em] text-console-muted uppercase">
              No Disc Loaded
            </p>
            <p className="text-[12px] text-console-muted mt-2 tracking-wider">
              Select a log from the archive and drag to this console
            </p>
          </div>

          <div className="flex items-center gap-1 mt-4">
            <div className="w-2 h-3 bg-console-muted animate-pulse" />
          </div>

          <div className="absolute bottom-4 left-0 right-0 px-6">
            <div className="flex justify-between text-[11px] text-console-muted">
              <span>ENDURANCE // STANDBY</span>
              <span>SIG: NOMINAL</span>
              <span>PWR: ONLINE</span>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <LoadingSequence film={film} onComplete={onLoadComplete} />
      ) : (
        <DossierView film={film} onClose={onEject} />
      )}
    </div>
  )
}
