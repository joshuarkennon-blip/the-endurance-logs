/** Normalize to #RRGGBB for SVG / canvas use. */
export function normalizeFilmHex(hex) {
  if (typeof hex !== 'string') return '#6ab4dc'
  const h = hex.trim()
  if (/^#[0-9A-Fa-f]{6}$/.test(h)) return h
  if (/^#[0-9A-Fa-f]{3}$/.test(h)) {
    const r = h[1]
    const g = h[2]
    const b = h[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return '#6ab4dc'
}

export function hexToRgb(hex) {
  const h = normalizeFilmHex(hex).slice(1)
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/**
 * CSS cursor value: small reticle tinted to the film, white ring for contrast.
 * Fallback `crosshair` keeps tooling usable if data-URL cursor is blocked.
 */
export function filmCursorCssValue(hex) {
  const c = normalizeFilmHex(hex)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="9" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="2"/><circle cx="16" cy="16" r="3.5" fill="${c}" stroke="rgba(255,255,255,0.95)" stroke-width="1"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 16 16, crosshair`
}
