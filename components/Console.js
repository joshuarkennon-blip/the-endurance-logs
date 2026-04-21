'use client'
import { useState, useCallback, useEffect, useRef, useId } from 'react'
import Link from 'next/link'
import DiscShelf from './DiscShelf'
import DiscInsertFlight from './DiscInsertFlight'
import LogScreen from './LogScreen'
import CaseChat from './CaseChat'
import CursorGlowTrail from './CursorGlowTrail'
import { useAudioEngine } from './AudioEngine'
import { filmCursorCssValue } from '../lib/cursorFilm'

function ConsoleAudioControls({ masterVolume, setMasterVolume, isMuted, toggleMute, playUI }) {
  const id = useId()
  const pct = Math.round(Math.min(100, Math.max(0, masterVolume * 100)))
  const outputOff = isMuted || masterVolume <= 0.0005

  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      <div className="flex flex-col gap-1 w-full min-w-0">
        <label htmlFor={`${id}-master-vol`} className="text-[8px] md:text-[9px] tracking-[0.14em] text-console-muted uppercase">
          Master gain
        </label>
        <input
          id={`${id}-master-vol`}
          type="range"
          min={0}
          max={100}
          step={1}
          value={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-valuetext={`${pct} percent`}
          aria-label="Master volume; zero is silent, one hundred is full mix level"
          onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
          className="console-master-vol w-full min-w-0 min-h-[44px] md:min-h-[36px] py-2 md:py-1 touch-manipulation"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          playUI('tick')
          toggleMute()
        }}
        className="console-btn w-full px-2 py-1.5 md:py-1 text-[9px] shrink-0"
        style={{
          borderColor: outputOff ? '#9e5c4a' : '#4a7c9e',
          color: outputOff ? '#dc8c6a' : '#9ecad8',
        }}
      >
        AUDIO: {outputOff ? 'MUTED' : 'LIVE'}
      </button>
    </div>
  )
}

export default function Console({ films, registerStopAll }) {
  const [loadedFilm, setLoadedFilm]   = useState(null)
  const [isLoading, setIsLoading]     = useState(false)
  const [isZoomed, setIsZoomed]       = useState(false)
  const [draggingId, setDraggingId]   = useState(null)
  const [dropActive, setDropActive]   = useState(false)
  const [trayClosing, setTrayClosing] = useState(false)
  const [mobileView, setMobileView]   = useState('shelf') // 'shelf' | 'screen'
  const [audioReady, setAudioReady]   = useState(false)
  const [jokerGlitchTick, setJokerGlitchTick] = useState(0)
  const [insertFlight, setInsertFlight] = useState(null)
  const [trayIngest, setTrayIngest]     = useState(false)
  const [isDesktop, setIsDesktop]       = useState(null)
  const [performanceConstrained, setPerformanceConstrained] = useState(false)
  const [settings, setSettings]       = useState({
    fxMode: 'full',       // full | lite | off
    motionMode: 'full',   // full | reduced
    contrastMode: 'normal', // normal | high
  })

  const {
    playLoadTrigger,
    startAmbient,
    stopAmbient,
    playUI,
    stopAll,
    isMuted,
    toggleMute,
    masterVolume,
    setMasterVolume,
  } = useAudioEngine()
  const trayCloseTimer = useRef(null)
  const lastJokerGlitchAt = useRef(0)
  const hasStoredSettings = useRef(false)
  const hasAppliedAutoProfile = useRef(false)

  // Register stopAll with _app so navigation kills audio cleanly
  useEffect(() => {
    if (registerStopAll) registerStopAll(stopAll)
  }, [stopAll, registerStopAll])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsDesktop(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const lowThreadBudget =
      typeof navigator.hardwareConcurrency === 'number' &&
      navigator.hardwareConcurrency > 0 &&
      navigator.hardwareConcurrency <= 4
    const lowMemoryBudget =
      typeof navigator.deviceMemory === 'number' &&
      navigator.deviceMemory > 0 &&
      navigator.deviceMemory <= 4
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    setPerformanceConstrained(coarsePointer && (lowThreadBudget || lowMemoryBudget))
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('endurance-console-settings')
      if (!raw) return
      hasStoredSettings.current = true
      const parsed = JSON.parse(raw)
      setSettings(prev => ({
        fxMode: parsed.fxMode || prev.fxMode,
        motionMode: parsed.motionMode || prev.motionMode,
        contrastMode: parsed.contrastMode || prev.contrastMode,
      }))
    } catch (_) {}
  }, [])

  useEffect(() => {
    if (!performanceConstrained || hasStoredSettings.current || hasAppliedAutoProfile.current) return
    hasAppliedAutoProfile.current = true
    setSettings((prev) => ({
      ...prev,
      fxMode: prev.fxMode === 'full' ? 'lite' : prev.fxMode,
      motionMode: 'reduced',
    }))
  }, [performanceConstrained])

  useEffect(() => {
    try {
      localStorage.setItem('endurance-console-settings', JSON.stringify(settings))
    } catch (_) {}

    document.body.classList.remove('fx-lite', 'fx-off', 'motion-min', 'contrast-high', 'perf-constrained')
    if (settings.fxMode === 'lite') document.body.classList.add('fx-lite')
    if (settings.fxMode === 'off') document.body.classList.add('fx-off')
    if (settings.motionMode === 'reduced') document.body.classList.add('motion-min')
    if (settings.contrastMode === 'high') document.body.classList.add('contrast-high')
    if (performanceConstrained) document.body.classList.add('perf-constrained')

    return () => {
      document.body.classList.remove('fx-lite', 'fx-off', 'motion-min', 'contrast-high', 'perf-constrained')
    }
  }, [settings, performanceConstrained])

  // Unlock audio on first user gesture
  const unlockAudio = useCallback(() => {
    if (!audioReady) setAudioReady(true)
    if (loadedFilm?.id === 'the-dark-knight') {
      const now = Date.now()
      if (now - lastJokerGlitchAt.current > 2800 && Math.random() < 0.18) {
        lastJokerGlitchAt.current = now
        setJokerGlitchTick(now)
      }
    }
  }, [audioReady, loadedFilm?.id])

  const handleDragStart = useCallback((filmId) => {
    if (trayCloseTimer.current) {
      clearTimeout(trayCloseTimer.current)
      trayCloseTimer.current = null
    }
    setTrayClosing(false)
    setDraggingId(filmId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setTrayClosing(true)
    if (trayCloseTimer.current) clearTimeout(trayCloseTimer.current)
    trayCloseTimer.current = setTimeout(() => {
      setTrayClosing(false)
      trayCloseTimer.current = null
    }, 260)
    setDraggingId(null)
    setDropActive(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropActive(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    const next = e.relatedTarget
    if (next instanceof Node && e.currentTarget.contains(next)) return
    setDropActive(false)
  }, [])

  const loadFilm = useCallback((film, options = {}) => {
    if (!film) return
    const forceReload = Boolean(options.forceReload)
    if (!forceReload && film.id === loadedFilm?.id) return
    setLoadedFilm(film)
    setIsLoading(true)
    setIsZoomed(true)
    setMobileView('screen')
    playLoadTrigger(film.id)
  }, [loadedFilm, playLoadTrigger])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDropActive(false)
      setDraggingId(null)
      setTrayClosing(true)
      if (trayCloseTimer.current) clearTimeout(trayCloseTimer.current)
      trayCloseTimer.current = setTimeout(() => {
        setTrayClosing(false)
        trayCloseTimer.current = null
      }, 260)

      const filmId = e.dataTransfer.getData('filmId')
      const film = films.find((f) => f.id === filmId)
      if (!film) return

      if (film.id === loadedFilm?.id) return

      const reduceMotion =
        typeof window !== 'undefined' &&
        (document.body.classList.contains('motion-min') ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches)

      if (reduceMotion) {
        loadFilm(film)
        return
      }

      const dropEl = e.currentTarget
      const groove = dropEl.querySelector?.('.disc-tray-groove')
      let endX
      let endY
      if (groove) {
        const r = groove.getBoundingClientRect()
        endX = r.left + r.width / 2
        endY = r.top + r.height / 2
      } else {
        const r = dropEl.getBoundingClientRect()
        endX = r.left + r.width / 2
        endY = r.top + r.height * 0.38
      }

      playUI('tick')
      setInsertFlight({
        key: Date.now(),
        film,
        startX: e.clientX,
        startY: e.clientY,
        endX,
        endY,
      })
    },
    [films, loadedFilm?.id, loadFilm, playUI],
  )

  useEffect(() => {
    return () => {
      if (trayCloseTimer.current) clearTimeout(trayCloseTimer.current)
    }
  }, [])

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
    if (loadedFilm) startAmbient(loadedFilm.id)
  }, [loadedFilm, startAmbient])

  const handleEject = useCallback(() => {
    playUI('eject')
    stopAmbient()
    setIsZoomed(false)
    setMobileView('shelf')
    setTimeout(() => {
      setLoadedFilm(null)
      setIsLoading(false)
    }, 600)
  }, [playUI, stopAmbient])

  const handleEggOpen = useCallback(() => {
    stopAmbient()
  }, [stopAmbient])

  const handleEggClose = useCallback(() => {
    if (loadedFilm && !isLoading) startAmbient(loadedFilm.id)
  }, [loadedFilm, isLoading, startAmbient])

  const filmCursorAccent = loadedFilm ? loadedFilm.glowColor || loadedFilm.color : null
  const fxMode = settings.fxMode === 'full' && performanceConstrained ? 'lite' : settings.fxMode
  const canUseMotion = settings.motionMode === 'full' && !performanceConstrained
  const caseChatProps = {
    films,
    playUI,
    onLoadFilm: loadFilm,
    onEggOpen: handleEggOpen,
    onEggClose: handleEggClose,
  }

  return (
    <div
      className={`relative w-full h-full flex flex-col${filmCursorAccent ? ' console-film-cursor' : ''}`}
      onClick={unlockAudio}
      style={filmCursorAccent ? { cursor: filmCursorCssValue(filmCursorAccent) } : undefined}
    >
      <CursorGlowTrail accentHex={filmCursorAccent} fxMode={fxMode} />
      {insertFlight ? (
        <DiscInsertFlight
          key={insertFlight.key}
          film={insertFlight.film}
          startX={insertFlight.startX}
          startY={insertFlight.startY}
          endX={insertFlight.endX}
          endY={insertFlight.endY}
          onDone={() => {
            const f = insertFlight.film
            setInsertFlight(null)
            setTrayIngest(true)
            window.setTimeout(() => setTrayIngest(false), 480)
            loadFilm(f)
          }}
        />
      ) : null}

      <div id="case-easter-egg" />

      {/* ── TOP BAR ── */}
      <div className="panel border-b-0 px-4 md:px-6 py-2 md:py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex gap-1.5">
            <div className="led" />
            <div className="led amber" style={{ animationDelay: '1s' }} />
            <div className="led green" style={{ animationDelay: '2s' }} />
          </div>
          <div>
            <p className="text-[13px] md:text-[15px] tracking-[0.25em] md:tracking-[0.3em] text-console-glow uppercase font-bold">
              THE ENDURANCE
            </p>
            <p className="hidden md:block text-[11px] text-console-muted tracking-widest">
              FILM ARCHIVE // DOSSIER TERMINAL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-[11px] text-console-muted">
          {/* Mobile nav toggle */}
          <div className="flex md:hidden gap-0">
            <button
              onClick={() => setMobileView('shelf')}
              className={`console-btn px-3 py-1 text-[10px] ${mobileView === 'shelf' ? 'border-console-accent text-console-glow' : ''}`}
            >
              ARCHIVE
            </button>
            <button
              onClick={() => setMobileView('screen')}
              className={`console-btn px-3 py-1 text-[10px] ${mobileView === 'screen' ? 'border-console-accent text-console-glow' : ''}`}
            >
              LOG
            </button>
          </div>

          <div className="hidden md:block text-right">
            <p className="tracking-widest">LOADED: <span className="text-console-text">{loadedFilm?.code || '—'}</span></p>
            <p className="tracking-widest">STATUS: <span className={loadedFilm ? 'text-green-400' : 'text-console-muted'}>
              {isLoading ? 'MOUNTING' : loadedFilm ? 'ACTIVE' : 'STANDBY'}
            </span></p>
          </div>
          <div className="hidden md:block text-right">
            <p>SIG: NOMINAL</p>
            <p>LAT: 124.7°</p>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div
        className="flex flex-1 overflow-hidden panel"
        style={{
          transition: canUseMotion ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          transform: isZoomed && canUseMotion ? 'scale(1.015)' : 'scale(1)',
        }}
      >
        {/* ── DISC SHELF — hidden on mobile when viewing screen ── */}
        <div className={`${mobileView === 'screen' ? 'hidden' : 'flex'} md:flex shrink-0 flex-col`}>
          <DiscShelf
            films={films}
            loadedFilm={loadedFilm}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggingId={draggingId}
            onTap={loadFilm}
          />
          <div
            className="shelf-disc-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div
              className={`disc-tray shelf-disc-tray ${draggingId ? 'open' : ''} ${dropActive ? 'disc-tray-ready' : ''} ${trayClosing ? 'closing' : ''}`}
            >
              <div className="disc-tray-slot" data-ingest={trayIngest ? '1' : undefined}>
                <div className="disc-tray-groove" />
              </div>
              <p className="disc-tray-label">
                {trayClosing ? 'LOCKING TRAY' : dropActive ? 'RELEASE TO LOAD' : draggingId ? 'TRAY OPEN' : 'DISC TRAY STANDBY'}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px bg-console-border shrink-0" />

        {/* ── LOG SCREEN — full width on mobile when viewing screen ── */}
        <div
          className={`${mobileView === 'shelf' ? 'hidden' : 'flex'} md:flex flex-1 flex-col transition-all duration-300 ${dropActive ? 'drop-active' : ''}`}
          style={dropActive ? { borderColor: '#6ab4dc', boxShadow: '0 0 30px rgba(106,180,220,0.2) inset' } : {}}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <LogScreen
            film={loadedFilm}
            isLoading={isLoading}
            onLoadComplete={handleLoadComplete}
            onEject={handleEject}
            playUI={playUI}
            onGoToShelf={() => setMobileView('shelf')}
            jokerGlitchTick={jokerGlitchTick}
            fxMode={fxMode}
          />
        </div>

        {/* ── RIGHT INSTRUMENTS — desktop only ── */}
        <div className="hidden md:block w-px bg-console-border shrink-0" />
        <div className="hidden md:flex panel flex-col gap-3 p-3 shrink-0 min-w-0" style={{ width: 124, maxWidth: 'min(124px, 22vw)' }}>
          <div className="border-b border-console-border pb-2">
            <p className="text-[10px] tracking-widest text-console-muted uppercase">Instruments</p>
          </div>
          <div>
            <p className="text-[10px] text-console-muted mb-1 tracking-wider">SIG STR</p>
            <div className="space-y-0.5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[3px] w-full rounded-sm"
                  style={{ backgroundColor: i < 6 ? '#4a7c9e' : '#1a1a25', opacity: i < 6 ? (1 - i * 0.08) : 0.3 }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-console-muted mb-1 tracking-wider">PWR CELL</p>
            <div className="grid grid-cols-2 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 w-full"
                  style={{ backgroundColor: i < 5 ? '#c8922a30' : '#1a1a25', border: '1px solid #2a2a3a' }}
                />
              ))}
            </div>
          </div>
          <div className="mt-auto space-y-3">
            <div>
            <p className="text-[10px] text-console-muted mb-1">COORD</p>
            <p className="text-[11px] text-console-glow font-mono">{loadedFilm ? '124.7°' : '---.-°'}</p>
            <p className="text-[11px] text-console-glow font-mono">{loadedFilm ? '89.2°' : '---.-°'}</p>
            </div>
            <ConsoleAudioControls
              masterVolume={masterVolume}
              setMasterVolume={setMasterVolume}
              isMuted={isMuted}
              toggleMute={toggleMute}
              playUI={playUI}
            />
            <button
              type="button"
              onClick={() => {
                playUI('tick')
                setSettings(prev => ({
                  ...prev,
                  fxMode: prev.fxMode === 'full' ? 'lite' : prev.fxMode === 'lite' ? 'off' : 'full',
                }))
              }}
              className="console-btn w-full px-2 py-1 text-[9px]"
            >
              FX: {settings.fxMode.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={() => {
                playUI('tick')
                setSettings(prev => ({
                  ...prev,
                  motionMode: prev.motionMode === 'full' ? 'reduced' : 'full',
                }))
              }}
              className="console-btn w-full px-2 py-1 text-[9px]"
            >
              MOTION: {settings.motionMode === 'full' ? 'FULL' : 'REDUCED'}
            </button>
            <button
              type="button"
              onClick={() => {
                playUI('tick')
                setSettings(prev => ({
                  ...prev,
                  contrastMode: prev.contrastMode === 'normal' ? 'high' : 'normal',
                }))
              }}
              className="console-btn w-full px-2 py-1 text-[9px]"
            >
              CONTRAST: {settings.contrastMode === 'high' ? 'HIGH' : 'NORMAL'}
            </button>
            <button
              type="button"
              onClick={() => {
                playUI('tick')
                setSettings({
                  fxMode: 'full',
                  motionMode: 'full',
                  contrastMode: 'normal',
                })
              }}
              className="console-btn w-full px-2 py-1 text-[9px]"
              style={{ borderColor: '#6e5b4a', color: '#c9a27f' }}
            >
              RESET SETTINGS
            </button>
            {isDesktop === true ? <CaseChat {...caseChatProps} /> : null}
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      <div className="md:hidden border-t border-console-border bg-[rgba(10,12,18,0.92)] px-3 py-2 shrink-0">
        <ConsoleAudioControls
          masterVolume={masterVolume}
          setMasterVolume={setMasterVolume}
          isMuted={isMuted}
          toggleMute={toggleMute}
          playUI={playUI}
        />
      </div>
      {isDesktop === false ? (
        <div className="md:hidden">
          <CaseChat {...caseChatProps} />
        </div>
      ) : null}

      <div className="panel border-t-0 px-4 md:px-6 py-2 flex items-center justify-between shrink-0">
        <div className="flex gap-3 md:gap-6 text-[10px] md:text-[11px] text-console-muted">
          <span className="hidden md:inline">ENDURANCE // ARCHIVAL TERMINAL</span>
          <span className="hidden md:inline italic text-console-muted opacity-60">for RK — my reason for existence</span>
          <span className="md:hidden">NOLAN // PHASE I</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] text-console-muted">
          <span className="hidden md:inline">DRAG DISC TO LOAD</span>
          <span className="md:hidden">TAP DISC TO LOAD</span>
          <Link href="/info" className="hover:text-console-glow transition-colors tracking-widest">
            SOURCES & INFO
          </Link>
          <Link href="/collect" className="hover:text-console-amber transition-colors tracking-widest text-console-amber opacity-60 hover:opacity-100">
            ACQUIRE ◈
          </Link>
          <span className="text-console-glow">◈ NOMINAL</span>
        </div>
      </div>
    </div>
  )
}
