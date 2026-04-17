'use client'

import { Caveat } from 'next/font/google'

const handwritten = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
})

/** Punchy, saturated CSS variables derived from each film's base hex. */
function discCssVars(hex) {
  const c = hex && /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : '#6ab4dc'
  return {
    '--film-color': c,
    '--disc-label-a': `color-mix(in srgb, ${c} 78%, #ffffff)`,
    '--disc-label-b': `color-mix(in srgb, ${c} 58%, #f2f6ff)`,
    '--disc-label-c': `color-mix(in srgb, ${c} 72%, #1a2230)`,
    '--disc-label-stripe': `color-mix(in srgb, ${c} 35%, rgba(255,255,255,0.5))`,
    '--disc-rim-lit': `color-mix(in srgb, ${c} 62%, #e8f0ff)`,
    '--disc-rim-shade': `color-mix(in srgb, ${c} 28%, #06080c)`,
    '--disc-glass-a': `color-mix(in srgb, ${c} 22%, rgba(130, 170, 220, 0.45))`,
    '--disc-glass-b': `color-mix(in srgb, ${c} 8%, rgba(12, 16, 24, 0.94))`,
    '--disc-glow': `color-mix(in srgb, ${c} 72%, transparent)`,
    '--disc-ink': `color-mix(in srgb, ${c} 6%, #030408)`,
    '--disc-ink-soft': `color-mix(in srgb, ${c} 28%, #12161f)`,
    '--disc-accent': `color-mix(in srgb, ${c} 88%, #fff)`,
  }
}

function ArchiveDisc({ film, isLoaded, locked }) {
  const hex = locked ? '#d4a017' : film.color
  const vars = discCssVars(hex)
  const title = locked ? '?' : film.title
  const code = locked ? '— — —' : film.code
  const emoji = locked ? '?' : film.thumbnail || '◈'

  return (
    <div
      className={`archive-disc ${isLoaded ? 'archive-disc--loaded' : ''} ${locked ? 'archive-disc--locked' : ''}`}
      style={vars}
    >
      <div className="archive-disc-glass" aria-hidden="true">
        <div className="archive-disc-glass-rim" />
        <div className="archive-disc-glass-inner" />
      </div>

      <div className={`archive-disc-tape ${handwritten.className}`}>
        <span className="archive-disc-tape-code">{code}</span>
        <span className="archive-disc-tape-title">{title}</span>
      </div>

      <div className="archive-disc-metal" aria-hidden="true">
        <div className="archive-disc-metal-hub" />
      </div>

      <span className="archive-disc-emoji" aria-hidden="true">
        {emoji}
      </span>

      <div className="archive-disc-shine" aria-hidden="true" />
    </div>
  )
}

export default function DiscShelf({ films, loadedFilm, onDragStart, onDragEnd, draggingId, onTap }) {
  return (
    <div
      className="panel archive-bay-panel flex flex-col flex-1 min-h-0"
      style={{ minWidth: 'clamp(272px, 36vw, 392px)', maxWidth: 'clamp(272px, 36vw, 392px)' }}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-console-border">
        <div className="led amber" />
        <span className="text-[11px] md:text-[12px] tracking-[0.2em] text-console-amber uppercase">
          Archive
        </span>
      </div>

      <div className="px-3 pt-3 pb-1">
        <p className="text-[10px] md:text-[11px] text-console-muted tracking-widest uppercase">
          <span className="hidden md:inline">Film Logs // Drag to Tray</span>
          <span className="md:hidden">Tap to Load</span>
        </p>
      </div>

      <div className="archive-bay-grid px-2 py-2 overflow-y-auto overflow-x-hidden flex-1 min-h-0">
        {films.map((film) => {
          const isLoaded = loadedFilm?.id === film.id
          const isDragging = draggingId === film.id

          return (
            <div
              key={film.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('filmId', film.id)
                onDragStart(film.id)
              }}
              onDragEnd={onDragEnd}
              onClick={() => onTap(film)}
              className={`disc archive-bay-cell group relative flex items-center justify-center border transition-all duration-200 ${
                isLoaded ? 'border-console-border' : 'border-console-border bg-console-dim hover:border-opacity-60'
              } ${isDragging ? 'disc-dragging' : ''}`}
              style={
                isLoaded
                  ? {
                      borderColor: `color-mix(in srgb, ${film.color} 70%, #fff)`,
                      backgroundColor: `color-mix(in srgb, ${film.color} 14%, rgba(12,14,22,0.92))`,
                      boxShadow: `0 0 0 1px color-mix(in srgb, ${film.color} 35%, transparent), inset 0 0 24px color-mix(in srgb, ${film.color} 12%, transparent)`,
                    }
                  : undefined
              }
            >
              <ArchiveDisc film={film} isLoaded={isLoaded} locked={false} />

              {isLoaded && (
                <div className="absolute top-1.5 right-1.5">
                  <div className="led green" style={{ width: 6, height: 6 }} />
                </div>
              )}

              <div className="hidden md:block absolute bottom-1 right-1 opacity-0 group-hover:opacity-40 transition-opacity">
                <svg width="10" height="10" viewBox="0 0 8 8" fill="currentColor" className="text-console-text">
                  <rect x="0" y="0" width="3" height="3" />
                  <rect x="5" y="0" width="3" height="3" />
                  <rect x="0" y="5" width="3" height="3" />
                  <rect x="5" y="5" width="3" height="3" />
                </svg>
              </div>

              <div className="md:hidden absolute bottom-1 right-1 text-[8px] text-console-muted opacity-40">▶</div>
            </div>
          )
        })}

        <div
          aria-label="Locked archive slot teaser"
          className="disc archive-bay-cell archive-bay-cell--locked group relative flex cursor-not-allowed items-center justify-center border border-dashed border-console-amber/55 bg-console-dim/70 opacity-90"
        >
          <ArchiveDisc
            film={{ id: 'locked', title: '?', code: '— — —', color: '#d4a017', thumbnail: '?' }}
            isLoaded={false}
            locked
          />
          <div className="absolute top-1.5 right-1.5 text-[8px] tracking-[0.14em] text-console-amber">LOCK</div>
        </div>
      </div>

      <div className="border-t border-console-border px-3 py-2 shrink-0">
        <p className="text-[10px] text-console-muted tracking-wider">{films.length} LOGS INDEXED // 1 SLOT LOCKED</p>
        <p className="text-[10px] text-console-muted">SYS // READY</p>
      </div>
    </div>
  )
}
