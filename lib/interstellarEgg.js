export function mountInterstellarEgg(containerId, options = {}) {
  const container = document.getElementById(containerId)
  if (!container) return
  const { onOpen, onClose } = options

  if (!document.getElementById('case-egg-styles')) {
    const s = document.createElement('style')
    s.id = 'case-egg-styles'
    s.textContent = `
      #case-egg-outer{background:#0a0810;display:flex;flex-direction:column;align-items:center;padding:16px 0 14px}
      #case-egg-sw{position:relative;width:min(92vw,960px);aspect-ratio:16/9;border:2px solid #2a2040;box-shadow:0 0 24px rgba(80,40,160,0.3)}
      #case-egg-cv{width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;display:block;cursor:pointer}
      #case-egg-sub{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);background:rgba(8,4,20,0.82);color:#f0e8c0;font-family:'Courier New',monospace;font-size:11px;padding:5px 16px 4px;text-align:center;pointer-events:none;border:1px solid rgba(200,160,80,0.3);letter-spacing:0.4px;min-height:22px;max-width:90%;line-height:1.4}
      #case-egg-xbtn{position:absolute;top:7px;right:7px;background:rgba(8,4,20,0.85);border:1px solid #4a3060;color:#a090c0;font-family:monospace;font-size:9px;padding:3px 8px;cursor:pointer;letter-spacing:1px}
      #case-egg-xbtn:hover{border-color:#c8a044;color:#c8a044}
      #case-egg-scn{position:absolute;top:7px;left:7px;background:rgba(8,4,20,0.75);border:1px solid rgba(200,160,80,0.25);color:#c8a044;font-family:monospace;font-size:9px;padding:3px 10px;letter-spacing:1px}
      #case-egg-ui{width:min(92vw,960px);display:flex;align-items:center;gap:8px;margin-top:8px}
      #case-egg-pb{font-family:monospace;font-size:10px;color:#c8a044;background:none;border:1px solid #3a2a50;padding:3px 12px;cursor:pointer;letter-spacing:1px}
      #case-egg-pb:hover{border-color:#c8a044}
      #case-egg-prog{flex:1;height:4px;background:#1a1228;cursor:pointer;border:1px solid #2a1a40}
      #case-egg-bar{height:100%;width:0%;background:linear-gradient(90deg,#8844cc,#c8a044)}
      #case-egg-mb{font-family:monospace;font-size:9px;color:#6a5a80;background:none;border:1px solid #2a1a40;padding:3px 7px;cursor:pointer}
      #case-egg-mb:hover{border-color:#888}
      #case-egg-tl{font-family:monospace;font-size:9px;color:#4a3a60;min-width:80px;text-align:right}
    `
    document.head.appendChild(s)
  }

  container.innerHTML = `
    <div id="case-egg-outer">
      <div id="case-egg-sw">
        <canvas id="case-egg-cv" width="320" height="180"></canvas>
        <div id="case-egg-sub"></div>
        <div id="case-egg-scn"></div>
        <button id="case-egg-xbtn">[ EXIT ]</button>
      </div>
      <div id="case-egg-ui">
        <button id="case-egg-pb">&#9654; PLAY</button>
        <div id="case-egg-prog"><div id="case-egg-bar"></div></div>
        <button id="case-egg-mb">MUTE</button>
        <div id="case-egg-tl">0.0s / 60.0s</div>
      </div>
    </div>
  `

  container.style.display = 'flex'
  container.style.alignItems = 'center'
  container.style.justifyContent = 'center'
  if (typeof onOpen === 'function') onOpen()

  const cv = document.getElementById('case-egg-cv')
  const X = cv.getContext('2d')
  X.imageSmoothingEnabled = false
  const W = 320
  const H = 180

  let AC = null
  let MG = null
  let muted = false
  let playing = false
  let t0 = null
  let raf = null

  function initAudio() {
    if (AC) return
    AC = new (window.AudioContext || window.webkitAudioContext)()
    MG = AC.createGain()
    MG.gain.value = 0.15
    MG.connect(AC.destination)
  }

  function note(freq, st, dur, type = 'sine', vol = 0.4, atk = 0.08, rel = 0.2) {
    if (muted || !AC) return
    const o = AC.createOscillator()
    const g = AC.createGain()
    o.connect(g)
    g.connect(MG)
    o.type = type
    o.frequency.value = freq
    const now = AC.currentTime
    g.gain.setValueAtTime(0, now + st)
    g.gain.linearRampToValueAtTime(vol, now + st + atk)
    g.gain.setValueAtTime(vol, now + st + dur - rel)
    g.gain.linearRampToValueAtTime(0, now + st + dur)
    o.start(now + st)
    o.stop(now + st + dur + 0.1)
  }

  function scheduleScore() {
    if (!AC) return
    // Ambient master bed across entire playback.
    ;[
      [98, 0, 60, 'triangle', 0.05, 2.4, 4.8],
      [130.8, 0, 60, 'sine', 0.04, 2.4, 4.8],
      [65.4, 0, 60, 'sine', 0.03, 3.2, 5.0],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))

    // 0-8s FARM: wistful arpeggio, light pulse.
    ;[
      [261.6, 0.0, 1.2, 'triangle', 0.12, 0.06, 0.3],
      [329.6, 0.6, 1.1, 'triangle', 0.11, 0.06, 0.3],
      [392.0, 1.2, 0.9, 'triangle', 0.1, 0.06, 0.28],
      [349.2, 1.9, 1.0, 'triangle', 0.11, 0.06, 0.3],
      [293.7, 2.6, 1.2, 'triangle', 0.12, 0.06, 0.3],
      [261.6, 3.4, 1.6, 'triangle', 0.12, 0.08, 0.35],
      [246.9, 4.6, 1.2, 'sine', 0.08, 0.08, 0.3],
      [220.0, 5.5, 1.3, 'sine', 0.08, 0.08, 0.32],
      [261.6, 6.5, 1.5, 'triangle', 0.11, 0.08, 0.35],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))

    // 8-15s GOODBYE: sparse low notes and distant pulse.
    ;[
      [164.8, 8.1, 1.7, 'triangle', 0.08, 0.08, 0.35],
      [146.8, 9.5, 1.5, 'triangle', 0.075, 0.08, 0.35],
      [130.8, 10.8, 1.4, 'triangle', 0.07, 0.08, 0.3],
      [110.0, 12.0, 1.8, 'triangle', 0.08, 0.1, 0.35],
      [98.0, 13.6, 1.2, 'triangle', 0.07, 0.08, 0.3],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))

    // 15-22s LAUNCH: pulse train + rising lead.
    ;[
      [196.0, 15.0, 0.22, 'square', 0.15, 0.01, 0.06],
      [196.0, 15.3, 0.22, 'square', 0.15, 0.01, 0.06],
      [220.0, 15.6, 0.22, 'square', 0.15, 0.01, 0.06],
      [246.9, 15.9, 0.22, 'square', 0.16, 0.01, 0.06],
      [261.6, 16.2, 0.30, 'square', 0.18, 0.01, 0.08],
      [293.7, 16.6, 0.32, 'square', 0.19, 0.01, 0.08],
      [329.6, 17.0, 0.36, 'square', 0.2, 0.01, 0.1],
      [392.0, 17.4, 0.45, 'square', 0.21, 0.01, 0.12],
      [523.2, 18.0, 1.2, 'sawtooth', 0.14, 0.05, 0.3],
      [659.2, 19.0, 1.0, 'sawtooth', 0.12, 0.05, 0.28],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))

    // 22-30s SATURN/WORMHOLE: shimmer + rotating motif.
    ;[
      [261.6, 22.2, 0.7, 'sine', 0.07, 0.1, 0.2],
      [329.6, 22.8, 0.7, 'sine', 0.07, 0.1, 0.2],
      [392.0, 23.4, 0.7, 'sine', 0.07, 0.1, 0.2],
      [523.2, 24.0, 1.0, 'sine', 0.08, 0.12, 0.25],
      [392.0, 25.2, 0.7, 'sine', 0.07, 0.1, 0.2],
      [329.6, 25.8, 0.7, 'sine', 0.07, 0.1, 0.2],
      [261.6, 26.4, 0.9, 'sine', 0.075, 0.1, 0.22],
      [196.0, 27.4, 1.2, 'triangle', 0.08, 0.1, 0.3],
      [174.6, 28.5, 1.2, 'triangle', 0.08, 0.1, 0.3],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))

    // 30-38s GARGANTUA: heavy organ-like saw stack.
    ;[
      [65.4, 30.8, 5.8, 'sawtooth', 0.18, 0.7, 1.1],
      [98.0, 31.0, 5.6, 'sawtooth', 0.14, 0.7, 1.1],
      [130.8, 31.2, 5.4, 'sawtooth', 0.11, 0.7, 1.1],
      [82.4, 33.2, 4.4, 'sawtooth', 0.16, 0.6, 1.0],
      [110.0, 33.4, 4.2, 'sawtooth', 0.12, 0.6, 1.0],
      [55.0, 35.0, 2.5, 'triangle', 0.1, 0.2, 0.6],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))

    // 38-44s MILLER: ticking ostinato + broad low tone.
    for (let i = 0; i < 20; i++) {
      note(880, 38 + i * 0.28, 0.08, 'square', 0.06, 0.005, 0.04)
    }
    ;[
      [146.8, 38.0, 5.8, 'triangle', 0.08, 0.12, 0.3],
      [130.8, 40.0, 3.8, 'triangle', 0.08, 0.12, 0.3],
      [98.0, 41.8, 2.0, 'triangle', 0.07, 0.1, 0.25],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))

    // 44-52s TESSERACT: crystalline ascent arpeggios.
    ;[
      [261.6, 44.0, 0.3, 'square', 0.1, 0.02, 0.07],
      [329.6, 44.3, 0.3, 'square', 0.1, 0.02, 0.07],
      [392.0, 44.6, 0.3, 'square', 0.1, 0.02, 0.07],
      [523.2, 44.9, 0.5, 'square', 0.11, 0.02, 0.1],
      [329.6, 45.6, 0.3, 'square', 0.1, 0.02, 0.07],
      [392.0, 45.9, 0.3, 'square', 0.1, 0.02, 0.07],
      [523.2, 46.2, 0.4, 'square', 0.11, 0.02, 0.1],
      [659.2, 46.6, 0.6, 'square', 0.12, 0.02, 0.12],
      [392.0, 47.5, 0.3, 'square', 0.1, 0.02, 0.07],
      [523.2, 47.8, 0.4, 'square', 0.11, 0.02, 0.1],
      [659.2, 48.2, 0.6, 'square', 0.12, 0.02, 0.12],
      [783.9, 48.8, 1.0, 'sine', 0.12, 0.06, 0.25],
      [1046.5, 50.0, 1.6, 'sine', 0.1, 0.08, 0.4],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))

    // 52-60s STATION: resolution motif.
    ;[
      [261.6, 52.4, 0.45, 'sine', 0.1, 0.06, 0.15],
      [329.6, 52.9, 0.45, 'sine', 0.1, 0.06, 0.15],
      [392.0, 53.4, 0.45, 'sine', 0.1, 0.06, 0.15],
      [523.2, 54.0, 1.0, 'sine', 0.12, 0.1, 0.3],
      [659.2, 55.2, 0.8, 'sine', 0.11, 0.08, 0.25],
      [523.2, 56.2, 0.8, 'sine', 0.11, 0.08, 0.25],
      [392.0, 57.1, 0.9, 'sine', 0.1, 0.08, 0.25],
      [329.6, 58.2, 1.4, 'triangle', 0.08, 0.12, 0.35],
    ].forEach(([f, s, d, t, v, a, r]) => note(f, s, d, t, v, a, r))
  }

  const R = (x, y, w, h, c) => { X.fillStyle = c; X.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)) }
  const cls = c => { X.fillStyle = c; X.fillRect(0, 0, W, H) }
  const circ = (cx, cy, r, c) => { X.fillStyle = c; X.beginPath(); X.arc(cx, cy, r, 0, Math.PI * 2); X.fill() }
  const ring = (cx, cy, r, w, c, a = 1) => { X.strokeStyle = c; X.lineWidth = w; X.globalAlpha = a; X.beginPath(); X.arc(cx, cy, r, 0, Math.PI * 2); X.stroke(); X.globalAlpha = 1 }

  function rpgSky(r0, g0, b0, r1, g1, b1, r2, g2, b2) {
    for (let y = 0; y < H; y++) {
      const t = y / H
      let rr, gg, bb
      if (t < 0.5) {
        const u = t * 2
        rr = r0 + (r1 - r0) * u
        gg = g0 + (g1 - g0) * u
        bb = b0 + (b1 - b0) * u
      } else {
        const u = (t - 0.5) * 2
        rr = r1 + (r2 - r1) * u
        gg = g1 + (g2 - g1) * u
        bb = b1 + (b2 - b1) * u
      }
      X.fillStyle = `rgb(${Math.round(rr)},${Math.round(gg)},${Math.round(bb)})`
      X.fillRect(0, y, 1 + W, 1)
    }
  }

  function stars(seed, n, maxY = H, alpha = 1) {
    let s = seed
    for (let i = 0; i < n; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      const sx = s % W
      s = (s * 1103515245 + 12345) & 0x7fffffff
      const sy = s % maxY
      const bright = s % 4
      const cols = ['#fffbe8', '#e8f0ff', '#fff8d0', '#d0e8ff']
      X.fillStyle = cols[bright]
      X.globalAlpha = alpha * (0.5 + bright * 0.15)
      X.fillRect(sx, sy, bright === 3 ? 2 : 1, bright === 3 ? 2 : 1)
    }
    X.globalAlpha = 1
  }

  function cornStalk(x, baseY, h, swing) {
    const cx = x + 2 + swing
    R(cx, baseY - h, 2, h, '#5a7020')
    for (let ly = baseY - h + 6; ly < baseY - 4; ly += 10) {
      const side = ly % 20 < 10 ? 1 : -1
      R(cx + side * 2, ly, side * 4, 2, '#6a8828')
      R(cx + side * 4, ly + 1, side * 3, 1, '#7a9830')
    }
    R(cx - 1, baseY - h - 4, 4, 5, '#c8a840')
    R(cx, baseY - h - 6, 2, 3, '#d4b848')
    R(cx - 2, baseY - h - 3, 6, 2, '#b89830')
  }

  function cornField(off) {
    for (let row = 0; row < 4; row++) {
      const baseY = H * 0.68 - row * 14
      const stalkH = 28 - row * 3
      const spacing = 7 - row
      const alpha = 0.4 + row * 0.2
      X.globalAlpha = alpha
      for (let x = -8; x < W + 8; x += spacing) {
        const swing = Math.sin((x + off * (1 + row * 0.3)) * 0.12) * 2
        cornStalk(x, baseY, stalkH, swing)
      }
    }
    X.globalAlpha = 1
  }

  function farmhouse(hx, hy) {
    R(hx - 2, hy + 68, 102, 6, '#5a4830')
    for (let i = 0; i < 7; i++) R(hx, hy + 10 + i * 8, 96, 7, i % 2 ? '#8b6b40' : '#7a5e38')
    for (let i = 0; i < 7; i++) { R(hx, hy + 10 + i * 8, 96, 1, '#6a4e30'); R(hx, hy + 17 + i * 8, 96, 1, '#9a7848') }
    R(hx, hy + 10, 4, 58, '#6a4e30')
    R(hx + 92, hy + 10, 4, 58, '#6a4e30')
    for (let i = 0; i < 14; i++) R(hx - i * 2, hy + 10 - i * 2, 100 + i * 4, i * 2, '#6a3820')
    R(hx - 28, hy - 18, 156, 4, '#7a4428')
    R(hx - 30, hy - 20, 160, 4, '#5a2e18')
    R(hx + 62, hy - 30, 14, 32, '#7a5a3a')
    R(hx + 61, hy - 32, 16, 4, '#8a6a4a')
    R(hx + 38, hy + 38, 20, 30, '#4a2e10')
    R(hx + 39, hy + 39, 18, 28, '#3a2008')
    R(hx + 8, hy + 22, 24, 20, '#1a2840')
    R(hx + 64, hy + 22, 24, 20, '#1a2840')
    R(hx + 7, hy + 21, 26, 2, '#6a4e30')
    R(hx + 63, hy + 21, 26, 2, '#6a4e30')
    R(hx + 106, hy + 18, 50, 50, '#8a2a1a')
    for (let i = 0; i < 8; i++) R(hx + 106, hy + 18 + i * 6, 50, 5, i % 2 ? '#8a2a1a' : '#7a2218')
  }

  function truck(tx, ty) {
    R(tx, ty + 9, 52, 16, '#4a3c20')
    R(tx + 4, ty + 1, 32, 10, '#5a4c2a')
    R(tx + 8, ty + 2, 12, 8, '#1a2838')
    R(tx + 22, ty + 2, 10, 8, '#1a2838')
    R(tx, ty + 12, 4, 4, '#ffee88')
    R(tx + 4, ty + 22, 12, 8, '#1a1408')
    circ(tx + 10, ty + 26, 5, '#1a1408')
    R(tx + 36, ty + 22, 12, 8, '#1a1408')
    circ(tx + 42, ty + 26, 5, '#1a1408')
  }

  function endurance(cx, cy, sc = 1) {
    const s = sc
    const rr = v => v * s
    R(cx - rr(2), cy - rr(18), rr(4), rr(36), '#aabbcc')
    for (let i = 0; i < 3; i++) {
      const mx = cx - rr(16) + i * rr(14)
      R(mx - rr(5), cy - rr(10), rr(10), rr(8), '#8899aa')
      R(mx - rr(1), cy - rr(2), rr(2), rr(16), '#6677aa')
    }
    R(cx - rr(20), cy - rr(1), rr(40), rr(2), '#99aabb')
  }

  function saturn(cx, cy, sc = 1) {
    const s = sc
    for (let rr = 32; rr < 70; rr += 4) {
      X.strokeStyle = 'rgba(200,170,100,0.22)'
      X.lineWidth = 1
      X.beginPath()
      X.ellipse(cx, cy, rr * s, rr * s * 0.28, 0, 0, Math.PI * 2)
      X.stroke()
    }
    const r2 = Math.round(22 * s)
    for (let dy = -r2; dy <= r2; dy++) {
      const dx = Math.sqrt(Math.max(0, r2 * r2 - dy * dy))
      X.fillStyle = dy < 0 ? '#7f90b3' : '#899ab8'
      X.fillRect(cx - dx, cy + dy, dx * 2, 1)
    }
  }

  function wormhole(cx, cy, r, t2) {
    for (let i = 0; i < 16; i++) {
      const lr = r * (1 + (i / 16) * 0.6)
      X.strokeStyle = `rgba(150,180,255,${0.08 * (1 - i / 16)})`
      X.lineWidth = 2
      X.beginPath()
      X.ellipse(cx, cy, lr, lr * 0.9, t2 * 0.2 + i * 0.3, 0, Math.PI * 2)
      X.stroke()
    }
    X.fillStyle = '#000'
    X.beginPath()
    X.arc(cx, cy, r * 0.18, 0, Math.PI * 2)
    X.fill()
  }

  function gargantua(cx, cy, r) {
    const diskFire = [[255, 240, 100, 0.85], [255, 200, 60, 0.8], [255, 150, 30, 0.75], [240, 100, 15, 0.7]]
    for (let i = diskFire.length - 1; i >= 0; i--) {
      const [dr, dg, db, da] = diskFire[i]
      X.fillStyle = `rgba(${dr},${dg},${db},${da})`
      X.beginPath()
      X.ellipse(cx, cy + r * 0.06, r * (1.1 + i * 0.13), r * (0.13 + i * 0.018), 0, 0, Math.PI * 2)
      X.fill()
    }
    X.fillStyle = '#000'
    X.beginPath()
    X.arc(cx, cy, r, 0, Math.PI * 2)
    X.fill()
  }

  function waveScene(p, t2) {
    rpgSky(20, 60, 110, 14, 40, 80, 8, 22, 45)
    stars(77, 50, H * 0.45, 0.5)
    for (let y = H * 0.45; y < H; y++) {
      const d = (y - H * 0.45) / (H * 0.55)
      X.fillStyle = `rgb(${Math.round(10 + d * 30)},${Math.round(40 + d * 60)},${Math.round(80 + d * 80)})`
      X.fillRect(0, y, W, 1)
    }
    const waveX = W * (0.08 + p * 1.05)
    const waveH = H * 0.72 * Math.sin(Math.min(1, p * 1.4) * Math.PI * 0.75 + 0.05)
    if (waveH > 3) {
      for (let x = 0; x < W; x++) {
        const fo = Math.max(0, 1 - Math.abs(x - waveX) / (W * 0.38))
        const ht = waveH * fo * fo * fo
        if (ht > 1) {
          const bot = H * 0.92
          const top = bot - ht
          X.fillStyle = 'rgba(220,240,255,0.92)'
          X.fillRect(x, top, 1, 4)
        }
      }
    }
  }

  function tesseract(t2) {
    cls('#060410')
    X.strokeStyle = 'rgba(80,50,120,0.15)'
    X.lineWidth = 0.5
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      X.beginPath()
      X.moveTo(W * 0.5, H * 0.5)
      X.lineTo(W * 0.5 + Math.cos(a) * 200, H * 0.5 + Math.sin(a) * 200)
      X.stroke()
    }
    for (const y of [16, 72, 128]) {
      R(10, y + 46, 300, 5, '#5a3a18')
      for (let i = 0; i < 40; i++) {
        const bx = 12 + i * 7
        const bh = 38 + Math.sin(i * 2.3) * 6
        R(bx + 1, y + 47 - bh, 5, bh - 1, i % 2 ? '#8b2a1a' : '#1a4a8b')
      }
    }
    const wx = W * 0.58
    const wy = H * 0.62
    circ(wx, wy, 7, '#d4b870')
    ring(wx, wy, 7, 1, '#8a6030')
    const hand = t2 * 0.7
    X.strokeStyle = '#1a0808'
    X.lineWidth = 1
    X.beginPath()
    X.moveTo(wx, wy)
    X.lineTo(wx + Math.cos(hand) * 4, wy + Math.sin(hand) * 4)
    X.stroke()
  }

  function cooperStation(t2, p) {
    rpgSky(4, 6, 16, 6, 8, 20, 8, 10, 24)
    stars(99, 200, H, 1)
    const cx = W * 0.5
    const cy = H * 0.44
    const rot = t2 * 0.05
    const OR = 62
    X.strokeStyle = '#778899'
    X.lineWidth = 4
    X.beginPath()
    X.arc(cx, cy, OR, 0, Math.PI * 2)
    X.stroke()
    for (let i = 0; i < 32; i++) {
      const a = rot + (i / 32) * Math.PI * 2
      const wx = cx + Math.cos(a) * OR
      const wy = cy + Math.sin(a) * OR
      X.fillStyle = i % 4 === 0 ? '#c8e0f8' : '#334455'
      X.fillRect(wx - 1, wy - 1, 2, 2)
    }
    if (p > 0.72) {
      const fp = (p - 0.72) / 0.28
      X.fillStyle = `rgba(0,0,0,${fp})`
      X.fillRect(0, 0, W, H)
      if (fp > 0.35) {
        const ta = (fp - 0.35) / 0.65
        X.fillStyle = `rgba(200,165,70,${ta})`
        X.font = 'bold 16px monospace'
        X.textAlign = 'center'
        X.fillText('INTERSTELLAR', W * 0.5, H * 0.38)
        X.font = '8px monospace'
        X.fillStyle = `rgba(160,140,80,${ta * 0.9})`
        X.fillText('DO NOT GO GENTLE INTO THAT GOOD NIGHT', W * 0.5, H * 0.52)
        X.textAlign = 'left'
      }
    }
  }

  function doTransition(type, p) {
    if (p <= 0 || p >= 1) return
    if (type === 'fade') {
      X.fillStyle = `rgba(0,0,0,${p < 0.5 ? p * 2 : 2 - p * 2})`
      X.fillRect(0, 0, W, H)
    } else if (type === 'flash') {
      X.fillStyle = `rgba(255,255,255,${p < 0.5 ? p * 2 : 2 - p * 2})`
      X.fillRect(0, 0, W, H)
    }
  }

  const SCENES = [
    { dur: 8, name: "MURPH'S FARM", trans: 'fade', subs: [{ t: 0, tx: 'Once: wonder at the sky.' }, { t: 4, tx: 'Now: survival math on the ground.' }], draw(p, et) {
      const haze = Math.min(1, p * 1.8)
      rpgSky(Math.round(60 + haze * 40), Math.round(50 + haze * 30), Math.round(20 + haze * 10), Math.round(80 + haze * 20), Math.round(55 + haze * 20), 20, Math.round(40 + haze * 10), Math.round(28 + haze * 5), 10)
      for (let tx = 0; tx < W; tx += 16) for (let ty = Math.round(H * 0.72); ty < H; ty += 8) R(tx, ty, 16, 8, ((tx + ty) % 32 < 16) ? '#2a1e08' : '#241a06')
      cornField(et * 18)
      farmhouse(W * 0.52, H * 0.2)
    } },
    { dur: 7, name: 'GOODBYE', trans: 'fade', subs: [{ t: 0, tx: 'Departure hurts more when it is necessary.' }, { t: 5, tx: 'Mission over comfort. Always.' }], draw(p, et) {
      rpgSky(55, 45, 18, 70, 52, 20, 35, 25, 10)
      for (let tx = 0; tx < W; tx += 16) for (let ty = Math.round(H * 0.72); ty < H; ty += 8) R(tx, ty, 16, 8, ((tx + ty) % 32 < 16) ? '#2a1e08' : '#241a06')
      cornField(6)
      farmhouse(W * 0.52, H * 0.18)
      const tx2 = W * (0.5 - p * 0.75)
      if (tx2 > -60) truck(tx2, H * 0.62)
    } },
    { dur: 7, name: 'ENDURANCE LAUNCHES', trans: 'flash', subs: [{ t: 0, tx: 'Origin is not destiny.' }], draw(p, et) {
      for (let y = 0; y < H; y++) {
        const t = y / H
        X.fillStyle = `rgb(${Math.round((1 - t) * 28 + t * 4)},${Math.round((1 - t) * 22 + t * 3)},${Math.round((1 - t) * 40 + t * 6)})`
        X.fillRect(0, y, W, 1)
      }
      stars(7, 120, H, 0.95)
      const shipY = H * (1.12 - p * 1.8)
      endurance(W * 0.5, shipY, 1.0)
    } },
    { dur: 8, name: 'SATURN / WORMHOLE', trans: 'fade', subs: [{ t: 0, tx: 'Artificial anomaly detected near Saturn.' }, { t: 4, tx: 'Transit path committed.' }], draw(p, et) {
      for (let y = 0; y < H; y++) {
        const t = y / H
        X.fillStyle = `rgb(${Math.round(4 + t * 8)},${Math.round(5 + t * 12)},${Math.round(12 + t * 28)})`
        X.fillRect(0, y, W, 1)
      }
      stars(13, 150, H, 1.0)
      if (p < 0.62) saturn(W * (0.7 - (p / 0.62) * 0.1), H * (0.38 + (p / 0.62) * 0.06), 1.0)
      if (p > 0.32) wormhole(W * (0.22 + ((p - 0.32) / 0.68) * 0.3), H * 0.46, 8 + ((p - 0.32) / 0.68) * 34, et)
    } },
    { dur: 8, name: 'GARGANTUA', trans: 'fade', subs: [{ t: 0, tx: 'Awe and dread, same frame.' }, { t: 3, tx: 'Beauty with lethal mass.' }], draw(p, et) {
      for (let y = 0; y < H; y++) {
        const t = y / H
        X.fillStyle = `rgb(${Math.round(2 + t * 8)},${Math.round(2 + t * 5)},${Math.round(4 + t * 14)})`
        X.fillRect(0, y, W, 1)
      }
      stars(21, 90, H, 0.75)
      gargantua(W * 0.52, H * 0.46, 40)
    } },
    { dur: 6, name: "MILLER'S PLANET", trans: 'fade', subs: [{ t: 0, tx: 'Minutes here become years elsewhere.' }], draw(p, et) { waveScene(p, et) } },
    { dur: 8, name: 'THE TESSERACT', trans: 'fade', subs: [{ t: 0, tx: 'Higher-dimensional archive resolves.' }, { t: 6, tx: 'Signal target: Murph.' }], draw(p, et) { tesseract(et) } },
    { dur: 8, name: 'COOPER STATION', trans: 'fade', subs: [{ t: 0, tx: 'Humanity survives by iteration.' }, { t: 6, tx: 'Transmission end-state: unresolved hope.' }], draw(p, et) { cooperStation(et, p) } }
  ]

  const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0)
  const TRANS_DUR = 0.45

  function getState(el) {
    let acc = 0
    for (let i = 0; i < SCENES.length; i++) {
      const sc = SCENES[i]
      if (el < acc + sc.dur) {
        const p = (el - acc) / sc.dur
        let sub = ''
        for (const s of sc.subs) if (p * sc.dur >= s.t) sub = s.tx
        let tover = null
        let tp = 0
        if (el - acc < TRANS_DUR && i > 0) { tover = sc.trans; tp = (el - acc) / TRANS_DUR }
        if (acc + sc.dur - el < TRANS_DUR && i < SCENES.length - 1) { tover = sc.trans; tp = 1 - ((acc + sc.dur - el) / TRANS_DUR) }
        return { sc, p, sub, tover, tp }
      }
      acc += sc.dur
    }
    return { sc: SCENES[SCENES.length - 1], p: 1, sub: '', tover: null, tp: 0 }
  }

  function frame(ts) {
    if (!t0) t0 = ts
    const el = Math.min((ts - t0) / 1000, TOTAL)
    const { sc, p, sub, tover, tp } = getState(el)
    sc.draw(p, el * 10)
    if (tover) doTransition(tover, tp)
    document.getElementById('case-egg-sub').textContent = sub
    document.getElementById('case-egg-bar').style.width = `${(el / TOTAL) * 100}%`
    document.getElementById('case-egg-tl').textContent = `${el.toFixed(1)}s / ${TOTAL.toFixed(1)}s`
    document.getElementById('case-egg-scn').textContent = sc.name
    if (el >= TOTAL) {
      document.getElementById('case-egg-pb').textContent = '↩ REPLAY'
      playing = false
      return
    }
    raf = requestAnimationFrame(frame)
  }

  function play() {
    if (raf) cancelAnimationFrame(raf)
    initAudio()
    if (AC && AC.state === 'suspended') AC.resume()
    t0 = null
    playing = true
    document.getElementById('case-egg-pb').textContent = '▮▮ PLAYING'
    scheduleScore()
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    if (raf) { cancelAnimationFrame(raf); raf = null }
    playing = false
  }

  document.getElementById('case-egg-pb').addEventListener('click', play)
  document.getElementById('case-egg-cv').addEventListener('click', () => { if (!playing) play() })
  document.getElementById('case-egg-xbtn').addEventListener('click', () => {
    stop()
    cls('#000')
    document.getElementById('case-egg-sub').textContent = ''
    document.getElementById('case-egg-bar').style.width = '0%'
    document.getElementById('case-egg-scn').textContent = ''
    document.getElementById('case-egg-tl').textContent = `0.0s / ${TOTAL.toFixed(1)}s`
    document.getElementById('case-egg-pb').textContent = '▶ PLAY'
    if (AC) { AC.close(); AC = null; MG = null }
    container.innerHTML = ''
    container.style.display = 'none'
    if (typeof onClose === 'function') onClose()
  })

  document.getElementById('case-egg-mb').addEventListener('click', () => {
    muted = !muted
    document.getElementById('case-egg-mb').textContent = muted ? 'UNMUTE' : 'MUTE'
    if (MG) MG.gain.value = muted ? 0 : 0.15
  })

  document.getElementById('case-egg-prog').addEventListener('click', (e) => {
    if (!t0 || !playing) return
    const rc = e.currentTarget.getBoundingClientRect()
    t0 = performance.now() - ((e.clientX - rc.left) / rc.width) * TOTAL * 1000
  })

  getState(0).sc.draw(0, 0)
  document.getElementById('case-egg-sub').textContent = 'Loading mission archives...'
  setTimeout(play, 300)
}
