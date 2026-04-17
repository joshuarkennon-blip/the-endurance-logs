'use client'

import { Permanent_Marker } from 'next/font/google'

const tapeMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
})

function hexToRgb(hex) {
  const h = (hex || '#6ab4dc').replace('#', '')
  if (h.length !== 6 || Number.isNaN(parseInt(h, 16))) return [106, 180, 220]
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      default:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return [h, s, l]
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }
  const hue2rgb = (p, q, t) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ]
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('')}`
}

/** Amped saturation / mid luminance for a flat tape swatch. */
function punchFaceRgb(hex) {
  const [r, g, b] = hexToRgb(hex)
  let [h, s, l] = rgbToHsl(r, g, b)
  s = Math.min(0.98, s * 1.72 + 0.16)
  l = Math.min(0.66, Math.max(0.36, l * 1.1 + 0.06))
  return hslToRgb(h, s, l)
}

function tapeEdgeRgb(faceR, faceG, faceB) {
  let [h, s, l] = rgbToHsl(faceR, faceG, faceB)
  l = Math.max(0.18, l - 0.16)
  s = Math.min(1, s * 1.08)
  return hslToRgb(h, s, l)
}

function linearLum(r, g, b) {
  const R = (r / 255) ** 2.2
  const G = (g / 255) ** 2.2
  const B = (b / 255) ** 2.2
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function discCssVars(hex) {
  const base = hex && /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : '#6ab4dc'
  const [fr, fg, fb] = punchFaceRgb(base)
  const [er, eg, eb] = tapeEdgeRgb(fr, fg, fb)
  const face = rgbToHex(fr, fg, fb)
  const edge = rgbToHex(er, eg, eb)
  const lum = linearLum(fr, fg, fb)
  const darkInk = lum > 0.38
  const ink = darkInk ? '#0c0614' : '#faf7ff'
  const inkMuted = darkInk ? '#1a1424' : '#e6e2ef'
  const lineShadow = darkInk
    ? '0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 4px rgba(0, 0, 0, 0.25)'
    : '0 1px 0 rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.35)'

  return {
    '--film-color': base,
    '--disc-tape-face': face,
    '--disc-tape-edge': edge,
    '--disc-ink': ink,
    '--disc-ink-muted': inkMuted,
    '--disc-line-shadow': lineShadow,
    '--disc-rim-lit': `color-mix(in srgb, ${face} 72%, #ffffff)`,
    '--disc-glass-a': `color-mix(in srgb, ${face} 38%, rgba(90, 140, 220, 0.42))`,
    '--disc-glass-b': `color-mix(in srgb, ${face} 12%, rgba(8, 10, 16, 0.95))`,
    '--disc-glow': `color-mix(in srgb, ${face} 78%, transparent)`,
    '--disc-accent': `color-mix(in srgb, ${face} 55%, #ffffff)`,
  }
}

/** Shrink one-line tape copy so long titles stay inside the torn strip. */
function tapeLineScale(fullText) {
  const n = (fullText || '').length
  if (n <= 17) return 1
  if (n <= 22) return 0.9
  if (n <= 28) return 0.78
  if (n <= 34) return 0.68
  if (n <= 40) return 0.6
  return 0.52
}

export function ArchiveDisc({ film, isLoaded, locked }) {
  const hex = locked ? '#f0b429' : film.color
  const vars = discCssVars(hex)
  const title = locked ? '?' : film.title
  const code = locked ? '· · ·' : film.code
  const emoji = locked ? '?' : film.thumbnail || '◈'
  const oneLine = locked ? '?' : `${code}  ${title}`
  const lineScale = tapeLineScale(oneLine)

  return (
    <div
      className={`archive-disc ${isLoaded ? 'archive-disc--loaded' : ''} ${locked ? 'archive-disc--locked' : ''}`}
      style={vars}
    >
      {/* Bottom → top: tinted platter, centered hub, tape sticker, motif, gloss */}
      <div className="archive-disc-platter" aria-hidden="true" />

      <div className="archive-disc-metal" aria-hidden="true">
        <div className="archive-disc-metal-hub" />
      </div>

      <div className={`archive-disc-tape ${tapeMarker.className}`} aria-label={locked ? 'Locked slot' : `${film.title} ${film.code}`}>
        <div className="archive-disc-tape-line-outer">
          <span className="archive-disc-tape-line" style={{ transform: `scale(${lineScale})` }}>
            {locked ? (
              <span className="archive-disc-tape-locked-char">?</span>
            ) : (
              <>
                <span className="archive-disc-tape-code">{code}</span>
                <span className="archive-disc-tape-sep" aria-hidden="true">
                  {' '}
                </span>
                <span className="archive-disc-tape-title">{title}</span>
              </>
            )}
          </span>
        </div>
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
            film={{ id: 'locked', title: '?', code: '· · ·', color: '#f0b429', thumbnail: '?' }}
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
