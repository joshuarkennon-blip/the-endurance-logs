'use client'

export default function DiscShelf({ films, loadedFilm, onDragStart, onDragEnd, draggingId, onTap }) {
  return (
    <div className="panel flex flex-col h-full" style={{ minWidth: 'clamp(160px, 25vw, 220px)', maxWidth: 'clamp(160px, 25vw, 220px)' }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-console-border">
        <div className="led amber" />
        <span className="text-[11px] md:text-[12px] tracking-[0.2em] text-console-amber uppercase">
          Archive
        </span>
      </div>

      {/* Label */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[10px] md:text-[11px] text-console-muted tracking-widest uppercase">
          <span className="hidden md:inline">Film Logs // Drag to Load</span>
          <span className="md:hidden">Tap to Load</span>
        </p>
      </div>

      {/* Disc list */}
      <div className="flex flex-col gap-2 px-3 py-2 overflow-y-auto flex-1">
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
              className={`disc group relative flex flex-col gap-1 p-2 border transition-all duration-200 ${
                isLoaded ? 'border-opacity-80 bg-opacity-20' : 'border-console-border bg-console-dim hover:border-opacity-60'
              } ${isDragging ? 'disc-dragging' : ''}`}
              style={{
                borderColor: isLoaded ? film.color : undefined,
                backgroundColor: isLoaded ? `${film.color}15` : undefined,
              }}
            >
              {/* Spine */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{ backgroundColor: film.color, opacity: isLoaded ? 1 : 0.4 }} />

              {/* Body */}
              <div className="pl-2">
                <div className="text-2xl leading-none mb-1">{film.thumbnail}</div>
                <p className="text-[10px] md:text-[11px] font-bold tracking-widest leading-tight" style={{ color: film.color }}>
                  {film.title}
                </p>
                <p className="text-[9px] md:text-[10px] text-console-muted mt-0.5">
                  {film.year} // {film.code}
                </p>
              </div>

              {/* Active indicator */}
              {isLoaded && (
                <div className="absolute top-1.5 right-1.5">
                  <div className="led green" style={{ width: 6, height: 6 }} />
                </div>
              )}

              {/* Drag hint (desktop) */}
              <div className="hidden md:block absolute bottom-1 right-1 opacity-0 group-hover:opacity-40 transition-opacity">
                <svg width="10" height="10" viewBox="0 0 8 8" fill="currentColor" className="text-console-text">
                  <rect x="0" y="0" width="3" height="3" /><rect x="5" y="0" width="3" height="3" />
                  <rect x="0" y="5" width="3" height="3" /><rect x="5" y="5" width="3" height="3" />
                </svg>
              </div>

              {/* Tap hint (mobile) */}
              <div className="md:hidden absolute bottom-1 right-1 text-[8px] text-console-muted opacity-40">▶</div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-console-border px-3 py-2">
        <p className="text-[10px] text-console-muted tracking-wider">{films.length} LOGS INDEXED</p>
        <p className="text-[10px] text-console-muted">SYS // READY</p>
      </div>
    </div>
  )
}
