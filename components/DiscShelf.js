'use client'

import { useState, useCallback, useEffect } from 'react'
import { Permanent_Marker } from 'next/font/google'

const tapeMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
})

function discHoverMotionOff() {
  if (typeof document === 'undefined') return true
  if (
    document.body.classList.contains('motion-min') ||
    document.body.classList.contains('fx-off')
  ) {
    return true
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    if (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return true
    }
  }
  return false
}

/** Pointer tilt + lift; pauses while dragging or when motion/FX reduced. */
function HoverReactiveDisc({ children, interactionActive, locked = false }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lift: 0, s: 1 })

  const apply = useCallback((clientX, clientY, el) => {
    if (discHoverMotionOff() || !interactionActive || !el) return
    const r = el.getBoundingClientRect()
    const px = (clientX - r.left) / Math.max(1, r.width) - 0.5
    const py = (clientY - r.top) / Math.max(1, r.height) - 0.5
    const cap = locked ? 0.38 : 1
    const maxRx = 12 * cap
    const maxRy = 14 * cap
    setTilt({
      rx: Math.max(-maxRx, Math.min(maxRx, -py * 2.2 * maxRx)),
      ry: Math.max(-maxRy, Math.min(maxRy, px * 2.2 * maxRy)),
      lift: locked ? -3 : -6,
      s: locked ? 1.03 : 1.05,
    })
  }, [interactionActive, locked])

  const reset = useCallback(() => {
    setTilt({ rx: 0, ry: 0, lift: 0, s: 1 })
  }, [])

  useEffect(() => {
    if (!interactionActive) reset()
  }, [interactionActive, reset])

  const off = discHoverMotionOff() || !interactionActive
  const popped = tilt.lift !== 0 || tilt.rx !== 0 || tilt.ry !== 0

  return (
    <div
      className={`archive-disc-hover-wrap flex items-center justify-center touch-manipulation ${popped ? 'relative z-[4]' : 'relative z-0'}`}
      onMouseEnter={(e) => {
        if (discHoverMotionOff() || !interactionActive) return
        apply(e.clientX, e.clientY, e.currentTarget)
      }}
      onMouseMove={(e) => apply(e.clientX, e.clientY, e.currentTarget)}
      onMouseLeave={reset}
    >
      <div
        className="archive-disc-hover-inner will-change-transform"
        style={{
          transform: off
            ? 'none'
            : `perspective(580px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translate3d(0, ${tilt.lift}px, 14px) scale(${tilt.s})`,
          transition:
            tilt.lift === 0 && tilt.rx === 0 && tilt.ry === 0
              ? 'transform 0.4s cubic-bezier(0.22, 1, 0.32, 1), filter 0.4s ease'
              : 'transform 0.06s ease-out, filter 0.12s ease-out',
          filter: off || !popped ? 'none' : 'drop-shadow(0 14px 26px rgba(0,0,0,0.38))',
        }}
      >
        {children}
      </div>
    </div>
  )
}

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

/** Catalog letters before the year, e.g. INT-2014 → INT */
function catalogPrefixFromCode(code) {
  if (!code || typeof code !== 'string') return ''
  const trimmed = code.trim()
  const m = trimmed.match(/^(.+?)-(\d{4})$/)
  if (m) return m[1].replace(/[^A-Za-z]/g, '').toUpperCase()
  return trimmed.replace(/[^A-Za-z]/g, '').toUpperCase()
}

/**
 * Short hand-written style denominator: INT → I-N-T; TDK / TDKR stay compact blocks.
 */
function tapeLabelAbbrev(code) {
  const prefix = catalogPrefixFromCode(code)
  if (!prefix) return '?'
  if (prefix === 'TDK' || prefix === 'TDKR') return prefix
  return prefix.split('').join('-')
}

/** Slight scale only when hyphenated string gets long (e.g. T-D-K-R). */
function tapeLineScale(abbrev) {
  const n = (abbrev || '').length
  if (n <= 4) return 1
  if (n <= 6) return 0.94
  return 0.88
}

/** Deterministic micro-variation on the tape strip only (rotate, skew, size, padding). */
function tapeStripVars(seedId) {
  const id = seedId || 'slot'
  let h = 0
  for (let i = 0; i < id.length; i += 1) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  }
  const u = (k) => ((h >>> k) & 0x7fff) / 0x7fff
  const rot = (u(3) - 0.5) * 1.75
  const skew = (u(7) - 0.5) * 1.1
  const top = 7.8 + u(11) * 2.4
  const widthPct = 74.5 + u(15) * 7.5
  const maxW = 78 + Math.round(u(19) * 10)
  const padY = 0.26 + u(23) * 0.14
  const padX = 0.36 + u(27) * 0.14
  const br = 2.2 + u(31) * 3.8
  const borderA = 0.14 + u(35) * 0.1

  return {
    '--tape-rot': `${rot.toFixed(2)}deg`,
    '--tape-skew': `${skew.toFixed(2)}deg`,
    '--tape-top': `${top.toFixed(2)}%`,
    '--tape-width-pct': `${widthPct.toFixed(1)}%`,
    '--tape-max-w': `${maxW}px`,
    '--tape-pad-y': `${padY.toFixed(3)}em`,
    '--tape-pad-x': `${padX.toFixed(3)}em`,
    '--tape-br': `${br.toFixed(2)}px`,
    '--tape-border-a': borderA.toFixed(3),
  }
}

/** FNV-1a-ish mix for stable glyph jitter from seed + index + character. */
function mixGlyphSeed(seedId, index, ch) {
  const s = `${seedId}\0${index}\0${ch}`
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function nextUnit(ref) {
  let x = ref.h
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  ref.h = x >>> 0
  return (x >>> 0) / 0xffffffff
}

/** Per-glyph Sharpie-style wobble: rotation, nudge, size, side-bearing (deterministic). */
function tapeGlyphVars(seedId, index, ch) {
  const h = mixGlyphSeed(seedId, index, ch)
  const ref = { h }
  const r1 = nextUnit(ref)
  const r2 = nextUnit(ref)
  const r3 = nextUnit(ref)
  const r4 = nextUnit(ref)
  const r5 = nextUnit(ref)
  const r6 = nextUnit(ref)

  const rot = (r1 - 0.5) * 6.2
  const ty = (r2 - 0.5) * 0.13
  const tx = (r3 - 0.5) * 0.09
  const sc = 0.9 + r4 * 0.18
  const mr = (ch === '-' ? 0.04 : 0.01) + (r5 - 0.5) * 0.07
  const skew = (r6 - 0.5) * 2.8

  return {
    '--tg-rot': `${rot.toFixed(2)}deg`,
    '--tg-skew': `${skew.toFixed(2)}deg`,
    '--tg-tx': `${tx.toFixed(4)}em`,
    '--tg-ty': `${ty.toFixed(4)}em`,
    '--tg-sc': sc.toFixed(4),
    '--tg-mr': `${mr.toFixed(4)}em`,
  }
}

export function ArchiveDisc({ film, isLoaded, locked }) {
  const hex = locked ? '#f0b429' : film.color
  const vars = discCssVars(hex)
  const emoji = locked ? '?' : film.thumbnail || '◈'
  const abbrev = locked ? '?' : tapeLabelAbbrev(film.code)
  const lineScale = tapeLineScale(abbrev)
  const stripVars = tapeStripVars(locked ? 'locked-slot' : film.id)

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

      <div
        className={`archive-disc-tape ${tapeMarker.className}`}
        style={stripVars}
        aria-label={locked ? 'Locked slot' : `${film.title} ${film.code}`}
      >
        <div className="archive-disc-tape-line-outer" aria-hidden="true">
          <span className="archive-disc-tape-line" style={{ transform: `scale(${lineScale})` }}>
            {locked ? (
              <span
                className="archive-disc-tape-glyph archive-disc-tape-locked-char"
                style={tapeGlyphVars('locked-slot', 0, '?')}
              >
                ?
              </span>
            ) : (
              <span className="archive-disc-tape-abbrev">
                {abbrev.split('').map((ch, i) => (
                  <span
                    key={`${film.id}-g-${i}`}
                    className="archive-disc-tape-glyph"
                    style={tapeGlyphVars(film.id, i, ch)}
                  >
                    {ch}
                  </span>
                ))}
              </span>
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
              <HoverReactiveDisc interactionActive={!isDragging}>
                <ArchiveDisc film={film} isLoaded={isLoaded} locked={false} />
              </HoverReactiveDisc>

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
          <HoverReactiveDisc interactionActive locked>
            <ArchiveDisc
              film={{ id: 'locked', title: '?', code: '· · ·', color: '#f0b429', thumbnail: '?' }}
              isLoaded={false}
              locked
            />
          </HoverReactiveDisc>
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
