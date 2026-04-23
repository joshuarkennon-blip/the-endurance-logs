import { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import films from '../data/logs.json'

const LAYERS = [
  { id: 'dossier',    label: 'LIVE SIGNAL',        num: '01', desc: 'The transmission as received' },
  { id: 'production', label: 'PRODUCTION ARCHIVE', num: '02', desc: 'How it was actually built' },
  { id: 'deepcuts',   label: 'DEEP CUTS',          num: '03', desc: 'Recovered from the frame itself' },
]

function clock() {
  const d = new Date()
  const h = String(d.getUTCHours()).padStart(2, '0')
  const m = String(d.getUTCMinutes()).padStart(2, '0')
  return `${h}:${m} UTC`
}

function seededBars(seedStr, count = 80) {
  let h = 0
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0
  const bars = []
  for (let i = 0; i < count; i++) {
    h = (h * 1664525 + 1013904223) >>> 0
    bars.push(10 + ((h >>> 8) & 0xff) / 255 * 88)
  }
  return bars
}

export default function ArchiveConsole() {
  const [activeFilmId, setActiveFilmId] = useState(
    (films.find(f => f.id === 'interstellar') || films[0]).id
  )
  const [activeLayer, setActiveLayer] = useState('dossier')
  const [sectionIdx, setSectionIdx] = useState(0)
  const [bootOut, setBootOut] = useState(false)
  const [time, setTime] = useState('00:00 UTC')
  const dossierRef = useRef(null)

  const film = useMemo(() => films.find(f => f.id === activeFilmId) || films[0], [activeFilmId])
  const layerData = film[activeLayer]
  const sections = layerData?.sections || []
  const section = sections[sectionIdx] || sections[0]
  const bars = useMemo(() => seededBars(film.id + activeLayer), [film.id, activeLayer])

  // Reset section when film / layer changes
  useEffect(() => { setSectionIdx(0) }, [activeFilmId, activeLayer])

  // Boot sequence
  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ms = reduce ? 0 : 2600
    const t = setTimeout(() => setBootOut(true), ms)
    return () => clearTimeout(t)
  }, [])

  // Clock
  useEffect(() => {
    setTime(clock())
    const id = setInterval(() => setTime(clock()), 30_000)
    return () => clearInterval(id)
  }, [])

  // Scroll dossier to top on switch
  useEffect(() => {
    if (dossierRef.current) dossierRef.current.scrollTop = 0
  }, [activeFilmId, activeLayer, sectionIdx])

  const filmAccent = film.color || '#ff7b2c'
  const filmGlow   = film.glowColor || '#ffa36a'

  return (
    <>
      <Head>
        <title>The Endurance Logs // Archive</title>
        <meta name="description" content="The Endurance Logs — a working archive of Christopher Nolan's film transmissions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="archive" style={{ '--film-accent': filmAccent, '--film-glow': filmGlow }}>
        <div className="ar-haze a" aria-hidden="true" />
        <div className="ar-haze b" aria-hidden="true" />
        <div className="ar-scan" aria-hidden="true" />
        <div className="ar-grain" aria-hidden="true" />
        <div className="ar-vignette" aria-hidden="true" />

        {/* Boot */}
        <div id="ar-boot" className={bootOut ? 'done' : ''} aria-hidden="true" onClick={() => setBootOut(true)}>
          <div className="slate a">CLEARANCE VERIFIED<br/>ENDURANCE LOGS</div>
        </div>

        {/* Chrome */}
        <header className="ar-chrome" role="banner">
          <div className="ar-brand"><span className="ar-dot" />ENDURANCE · LOGS</div>
          <div className="ar-nav">NODE · 07 // ARCHIVE v1.0</div>
          <div className="ar-coord">LAT 34.0194°N · LON 118.4108°W</div>
          <div className="ar-live">LIVE · {time}</div>
          <div className="ar-clearance">CLEARANCE · ORANGE</div>
        </header>

        <main className="ar-page">
          {/* Hero */}
          <section className="ar-hero">
            <div>
              <p className="ar-eyebrow">Deep Field Archive · Nolan Transmissions</p>
              <h1 className="ar-title">
                THE<br/>ENDURANCE<br/><em>LOGS</em>
              </h1>
              <p className="ar-subline">Recovered Transmissions · 1998 – Present · Authorized Personnel Only</p>
              <div className="ar-meta-strip">
                <span>Dossiers <em>{films.length} ACTIVE</em></span>
                <span>Last Ingest <em>{films[films.length - 1].code || '—'}</em></span>
                <span>Archive Signal <em>LOCK</em></span>
                <span>Operator <em>K.</em></span>
              </div>
            </div>
            <div className="ar-coordbox">
              <div className="ar-coord-head">▮ COORDINATE READOUT</div>
              <div className="ar-coord-row"><span className="k">LAT</span><span className="v">34.0194° N</span><span className="bar"><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span/></span></div>
              <div className="ar-coord-row"><span className="k">LON</span><span className="v">118.4108° W</span><span className="bar"><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span/><span/><span/></span></div>
              <div className="ar-coord-row"><span className="k">ALT</span><span className="v">+104.2 M</span><span className="bar"><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span className="on"/><span/></span></div>
              <div className="ar-coord-row"><span className="k">SIG</span><span className="v">ENDURANCE · Ω</span><span className="live">LOCK</span></div>
              <div className="ar-classif">CLASSIFIED</div>
            </div>
          </section>

          {/* Archive browser */}
          <section className="ar-section">
            <div className="ar-section-head">
              <span className="num">01</span>
              <div><h2>Archive <em>Browser</em></h2></div>
              <div className="note">{films.length} FILES · LAYER 01–03<br/>SELECT TO OPEN</div>
            </div>
            <div className="ar-browser">
              <aside className="ar-filmlist">
                <h3>◢ FILM INDEX</h3>
                {films.map(f => {
                  const isActive = f.id === activeFilmId
                  return (
                    <button
                      key={f.id}
                      className={`ar-filmrow${isActive ? ' active' : ''}`}
                      onClick={() => setActiveFilmId(f.id)}
                      style={{ '--row-accent': f.color, '--row-glow': f.glowColor }}
                    >
                      <span className="code">{f.code}</span>
                      <span className="title">
                        {f.title}
                        <em>{f.year} · {f.themes?.[0] || ''}</em>
                      </span>
                      <span className="ind">LYR·{activeLayer === 'deepcuts' ? 3 : activeLayer === 'production' ? 2 : 1}</span>
                    </button>
                  )
                })}
              </aside>

              <article className="ar-dossier" ref={dossierRef}>
                <div className="ar-layer-tabs" role="tablist">
                  {LAYERS.map(L => (
                    <button
                      key={L.id}
                      role="tab"
                      aria-selected={activeLayer === L.id}
                      className={`lpill${activeLayer === L.id ? ' on' : ''}`}
                      onClick={() => setActiveLayer(L.id)}
                      title={L.label}
                    >
                      L{L.num[1]}
                    </button>
                  ))}
                </div>

                <div className="kicker">DOSSIER · {film.code} · CLEARANCE ORANGE</div>
                <h3 className="ar-dossier-title">{film.title}</h3>
                <div className="ar-sub">{film.year} · {film.transmission} · {LAYERS.find(l => l.id === activeLayer)?.label}</div>
                {film.tagline && <p className="quote">"{film.tagline}"</p>}

                <div className="ar-wavebox" aria-hidden="true">
                  {bars.slice(0, 28).map((h, i) => (
                    <span key={i} className={i === 10 ? 'now' : i > 14 ? 'ghost' : ''} style={{ height: `${h}%` }} />
                  ))}
                </div>

                {/* Section pager */}
                {sections.length > 1 && (
                  <div className="ar-pager">
                    {sections.map((s, i) => (
                      <button
                        key={i}
                        className={`ar-page-btn${i === sectionIdx ? ' on' : ''}`}
                        onClick={() => setSectionIdx(i)}
                      >{String(i + 1).padStart(2, '0')}</button>
                    ))}
                  </div>
                )}

                {section && (
                  <div className="ar-body">
                    <h4>{section.heading}</h4>
                    <p>{section.body}</p>
                  </div>
                )}

                {layerData?.closing_transmission || layerData?.closing_note ? (
                  <div className="ar-closing">{layerData.closing_transmission || layerData.closing_note}</div>
                ) : null}

                <div className="ar-tags">
                  {(film.themes || []).slice(0, 4).map(t => (
                    <span key={t} className="ar-tag">{t}</span>
                  ))}
                </div>
              </article>
            </div>
          </section>

          {/* Layer selector band */}
          <section className="ar-section">
            <div className="ar-section-head">
              <span className="num">02</span>
              <div><h2>Transmission <em>Depth</em></h2></div>
              <div className="note">THREE STRATA<br/>SELECT LAYER TO FILTER</div>
            </div>
            <div className="ar-layerband">
              {LAYERS.map(L => (
                <button
                  key={L.id}
                  className={`ar-layer${activeLayer === L.id ? ' active' : ''}`}
                  onClick={() => setActiveLayer(L.id)}
                >
                  <div className="big">{L.num}</div>
                  <div className="lbl">{L.label}</div>
                  <div className="desc">{L.desc}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Stamps */}
          <section className="ar-stamps">
            <div className="ar-stamp" style={{ '--r': '-6deg' }}>CLEARANCE ORANGE</div>
            <div className="ar-stamp mag" style={{ '--r': '3deg' }}>DO NOT DISTRIBUTE</div>
            <div className="ar-stamp" style={{ '--r': '-2deg' }}>EYES ONLY · ARCHIVE</div>
            <div className="ar-stamp cyan" style={{ '--r': '4deg' }}>SIGNAL LOCK</div>
            <div className="ar-stamp" style={{ '--r': '-5deg' }}>LAYER 03 RESTRICTED</div>
          </section>

          <footer className="ar-footer">
            <span>◢ Endurance Logs · Archive v1.0 · Node-07</span>
            <span><Link href="/">← Live Archive</Link></span>
            <span>Operator K. · {new Date().getFullYear()}</span>
          </footer>
        </main>

        {/* Ticker + waveform console */}
        <div className="ar-ticker-wrap" aria-hidden="true">
          <div className="ar-ticker-track">
            • ARCHIVE NODE-07 ONLINE  •  34.0194°N / 118.4108°W  •  ENDURANCE LOGS v1.0  •  TRANSMISSION INTEGRITY 87%  •  DO NOT DISTRIBUTE  •  CLEARANCE · ORANGE  •  NEXT INGEST T-00:14:22  •  LAYER 03 RESTRICTED  •  {films.length} DOSSIERS ACTIVE  •  ARCHIVE NODE-07 ONLINE  •  34.0194°N / 118.4108°W  •
          </div>
        </div>
        <div className="ar-console" aria-hidden="true">
          <button className="play" aria-label="Play waveform">▶</button>
          <div className="bigwave">
            {bars.map((h, i) => (
              <span
                key={i}
                className={i < 24 ? 'past' : i === 24 ? 'now' : ''}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="timecode">{String(sectionIdx + 1).padStart(2, '0')} / {String(sections.length || 1).padStart(2, '0')} <em>{film.title} — {LAYERS.find(l => l.id === activeLayer)?.label}</em></div>
          <div className="sigpct">◉ SIG 87%</div>
        </div>
      </div>
    </>
  )
}
