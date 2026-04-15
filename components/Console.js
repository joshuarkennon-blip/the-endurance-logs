'use client'
import { useState, useCallback } from 'react'
import DiscShelf from './DiscShelf'
import LogScreen from './LogScreen'

export default function Console({ films }) {
  const [loadedFilm, setLoadedFilm] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [dropActive, setDropActive] = useState(false)

  const handleDragStart = useCallback((filmId) => {
    setDraggingId(filmId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggingId(null)
    setDropActive(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropActive(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDropActive(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDropActive(false)
    setDraggingId(null)
    const filmId = e.dataTransfer.getData('filmId')
    const film = films.find(f => f.id === filmId)
    if (!film || film.id === loadedFilm?.id) return

    // Start load sequence with zoom
    setLoadedFilm(film)
    setIsLoading(true)
    setIsZoomed(true)
  }, [films, loadedFilm])

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleEject = useCallback(() => {
    setIsZoomed(false)
    setTimeout(() => {
      setLoadedFilm(null)
      setIsLoading(false)
    }, 600)
  }, [])

  return (
    <div
      className="relative w-full h-full flex flex-col"
      style={{
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isZoomed ? 'scale(1.015)' : 'scale(1)',
      }}
    >
      {/* Console frame top */}
      <div className="panel border-b-0 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="led" />
            <div className="led amber" style={{ animationDelay: '1s' }} />
            <div className="led green" style={{ animationDelay: '2s' }} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.3em] text-console-glow uppercase font-bold">
              THE ENDURANCE
            </p>
            <p className="text-[8px] text-console-muted tracking-widest">
              FILM ARCHIVE // DOSSIER TERMINAL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[8px] text-console-muted">
          <div className="text-right">
            <p className="tracking-widest">LOADED: <span className="text-console-text">{loadedFilm?.code || '—'}</span></p>
            <p className="tracking-widest">STATUS: <span className={loadedFilm ? 'text-green-400' : 'text-console-muted'}>
              {isLoading ? 'MOUNTING' : loadedFilm ? 'ACTIVE' : 'STANDBY'}
            </span></p>
          </div>
          <div className="text-right">
            <p>SIG: NOMINAL</p>
            <p>LAT: 124.7°</p>
          </div>
        </div>
      </div>

      {/* Main console body */}
      <div className="flex flex-1 overflow-hidden panel">
        {/* Left shelf */}
        <DiscShelf
          films={films}
          loadedFilm={loadedFilm}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggingId={draggingId}
        />

        {/* Center divider */}
        <div className="w-px bg-console-border shrink-0" />

        {/* Drop zone + screen */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${dropActive ? 'drop-active' : ''}`}
          style={dropActive ? { borderColor: '#6ab4dc', boxShadow: '0 0 30px rgba(106,180,220,0.2) inset' } : {}}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drop zone hint (only when dragging and nothing loaded) */}
          {draggingId && !loadedFilm && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div
                className="border-2 border-dashed rounded px-8 py-4 text-center transition-all"
                style={{ borderColor: dropActive ? '#6ab4dc' : '#2a2a3a' }}
              >
                <p className="text-[11px] tracking-[0.2em] text-console-text">
                  LOAD DISC
                </p>
              </div>
            </div>
          )}

          <LogScreen
            film={loadedFilm}
            isLoading={isLoading}
            onLoadComplete={handleLoadComplete}
            onEject={handleEject}
          />
        </div>

        {/* Right panel: misc instruments */}
        <div className="w-px bg-console-border shrink-0" />
        <div className="panel flex flex-col gap-3 p-3 shrink-0" style={{ width: 100 }}>
          <div className="border-b border-console-border pb-2">
            <p className="text-[7px] tracking-widest text-console-muted uppercase">Instruments</p>
          </div>

          {/* Signal meter */}
          <div>
            <p className="text-[7px] text-console-muted mb-1 tracking-wider">SIG STR</p>
            <div className="space-y-0.5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-[3px] w-full rounded-sm"
                  style={{
                    backgroundColor: i < 6 ? '#4a7c9e' : '#1a1a25',
                    opacity: i < 6 ? (1 - i * 0.08) : 0.3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Power cells */}
          <div>
            <p className="text-[7px] text-console-muted mb-1 tracking-wider">PWR CELL</p>
            <div className="grid grid-cols-2 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-full"
                  style={{ backgroundColor: i < 5 ? '#c8922a30' : '#1a1a25', border: '1px solid #2a2a3a' }}
                />
              ))}
            </div>
          </div>

          {/* Coordinate display */}
          <div className="mt-auto">
            <p className="text-[7px] text-console-muted mb-1">COORD</p>
            <p className="text-[8px] text-console-glow font-mono">
              {loadedFilm ? '124.7°' : '---.-°'}
            </p>
            <p className="text-[8px] text-console-glow font-mono">
              {loadedFilm ? '89.2°' : '---.-°'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="panel border-t-0 px-6 py-2 flex items-center justify-between shrink-0">
        <div className="flex gap-6 text-[8px] text-console-muted">
          <span>ENDURANCE // ARCHIVAL TERMINAL</span>
          <span>NOLAN FILMOGRAPHY // PHASE I</span>
        </div>
        <div className="flex gap-4 text-[8px] text-console-muted">
          <span>DRAG DISC TO LOAD</span>
          <span className="text-console-glow">◈ SYSTEM NOMINAL</span>
        </div>
      </div>
    </div>
  )
}
