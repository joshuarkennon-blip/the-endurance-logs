'use client'

import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { acquisitionFilms } from '../lib/acquisitionCatalog'
import { dossierSources } from '../lib/dossierSources'

function StampRow({ label }) {
  return (
    <div className="dossier-stamp-row" aria-hidden>
      <span className="dossier-stamp dossier-stamp--declassified">{label}</span>
      <span className="dossier-stamp dossier-stamp--eyes">NOFORN // EYES ONLY</span>
    </div>
  )
}

function PanelChrome({ id, title, subtitle, stamp, onClose, children }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      className="dossier-panel-shell"
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      <div className="dossier-panel-scan dossier-panel-scan--slow" aria-hidden />
      <div className="dossier-panel-corner dossier-panel-corner--tl" aria-hidden />
      <div className="dossier-panel-corner dossier-panel-corner--tr" aria-hidden />
      <div className="dossier-panel-corner dossier-panel-corner--bl" aria-hidden />
      <div className="dossier-panel-corner dossier-panel-corner--br" aria-hidden />

      <div className="dossier-panel-head">
        <div className="dossier-panel-head-text">
          <p className="dossier-panel-kicker">{subtitle}</p>
          <h2 id={`${id}-title`} className="dossier-panel-title">
            {title}
          </h2>
        </div>
        <button
          type="button"
          className="dossier-panel-close"
          onClick={onClose}
          aria-label="Close dossier layer"
        >
          <span className="dossier-panel-close-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
          <span className="dossier-panel-close-label">SEAL</span>
        </button>
      </div>

      <StampRow label={stamp} />

      <div className="dossier-panel-body custom-scrollbar-dossier">{children}</div>
    </motion.div>
  )
}

function SourcesContent() {
  return (
    <>
      <p className="dossier-lead">
        The Endurance Logs is an independent fan site. All film analysis is original editorial work. Referenced texts and sources are listed below per film.
      </p>
      <p className="dossier-muted">
        Please support filmmakers by purchasing their work from your favorite retailers.
      </p>

      <p className="dossier-section-label">
        <span>REFERENCES</span>
        <span className="dossier-section-line" />
      </p>

      <div className="dossier-stack">
        {dossierSources.map((s) => (
          <div key={s.film} className="dossier-source-block">
            <div className="dossier-source-head">
              <span className="dossier-source-bar" style={{ backgroundColor: s.color }} />
              <h3 className="dossier-source-title" style={{ color: s.color }}>
                {s.film}
              </h3>
            </div>
            <div className="dossier-source-refs">
              {s.refs.map((r, i) => (
                <div key={i} className="dossier-ref">
                  <p className="dossier-ref-label">{r.label}</p>
                  <p className="dossier-ref-detail">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="dossier-callout">
        <p className="dossier-callout-kicker">DISCLAIMER</p>
        <p className="dossier-callout-body">
          The Endurance Logs is an unofficial fan site with no affiliation to Warner Bros. Pictures, Syncopy, Christopher Nolan, or any associated rights holders. Film titles, character names, and all intellectual property remain the property of their respective owners. No copyright infringement is intended. All written analysis is original commentary protected under fair use.
        </p>
      </div>

      <div className="dossier-callout dossier-callout--dim">
        <p className="dossier-callout-kicker">FAIR USE METHOD</p>
        <div className="dossier-callout-stack">
          <p>This project is commentary and criticism. Each film entry is substantially transformative analysis, not a substitute for viewing the original work.</p>
          <p>No screenplay dumps, no full-scene transcripts, and no hosted full-length audiovisual copies are provided. Excerpts are minimal and used only to support analysis.</p>
          <p>Sources are listed per film so claims remain attributable and reviewable. If any rights holder raises a concern, content can be revised or removed promptly.</p>
        </div>
      </div>

      <p className="dossier-section-label">
        <span>PRIVACY</span>
        <span className="dossier-section-line" />
      </p>
      <div className="dossier-privacy">
        <p>This site collects no personal data. There are no accounts, no cookies beyond what Vercel&apos;s infrastructure requires for delivery, and no third-party tracking scripts.</p>
        <p>Audio plays only after your first interaction with the page, in compliance with browser autoplay policies. Volume is kept at ambient levels and can be muted via your device controls at any time.</p>
        <p>
          The site is hosted on Vercel. Their privacy policy applies to infrastructure-level data (server logs, edge network). See{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="dossier-link">
            vercel.com/legal/privacy-policy
          </a>
          .
        </p>
      </div>

      <p className="dossier-section-label">
        <span>CONTACT</span>
        <span className="dossier-section-line" />
      </p>
      <p className="dossier-contact">
        Questions, corrections, or transmissions:{' '}
        <a href="mailto:theendurancelogs@gmail.com" className="dossier-link dossier-link--accent">
          theendurancelogs@gmail.com
        </a>
      </p>

      <div className="dossier-panel-foot">
        <span>ENDURANCE LOGS // {new Date().getFullYear()}</span>
        <span className="dossier-panel-foot-italic">for RK — my reason for existence</span>
      </div>
    </>
  )
}

function AcquireContent({ playUI }) {
  return (
    <>
      <p className="dossier-lead">
        Own these films in the highest quality available. Physical media preserves the full theatrical experience. Amazon links below support this archive at no extra cost to you.
      </p>
      <p className="dossier-muted">
        Please support filmmakers by purchasing their work from your favorite retailers.
      </p>
      <p className="dossier-affiliate">
        ◈ Affiliate disclosure — links earn a small commission via the Amazon Associates program.
      </p>

      <div className="dossier-stack dossier-stack--tight">
        {acquisitionFilms.map((film) => (
          <div key={film.id} className="dossier-acq-card">
            <div className="dossier-acq-card-head" style={{ borderColor: `${film.color}40` }}>
              <span className="dossier-acq-emoji" aria-hidden>{film.thumbnail}</span>
              <div>
                <h3 className="dossier-acq-title" style={{ color: film.glowColor }}>
                  {film.title}
                </h3>
                <p className="dossier-acq-year">{film.year}</p>
              </div>
              <div className="dossier-acq-dot" style={{ backgroundColor: film.color, boxShadow: `0 0 12px ${film.color}` }} />
            </div>
            <div className="dossier-acq-links">
              {film.formats.map((f, i) => (
                <a
                  key={i}
                  href={f.ref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dossier-acq-link"
                  onClick={() => playUI?.('tick')}
                >
                  <span className="dossier-acq-link-glyph" aria-hidden>◇</span>
                  <span className="dossier-acq-link-main">
                    <span className="dossier-acq-link-label">{f.label}</span>
                    {f.note ? <span className="dossier-acq-link-note">{f.note}</span> : null}
                  </span>
                  <span className="dossier-acq-link-cta" style={{ color: film.glowColor }}>
                    Amazon →
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="dossier-panel-foot dossier-panel-foot--single">
        <span>ENDURANCE LOGS // ACQUISITION</span>
      </div>
    </>
  )
}

export default function DossierOverlays({ open, onClose, playUI }) {
  const reduceMotion = useReducedMotion()

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prev
    }
  }, [open, handleKey])

  useEffect(() => {
    if (typeof window === 'undefined' || !open) return
    const hash = open === 'sources' ? 'sources' : 'acquire'
    window.history.replaceState(null, '', `#${hash}`)
    return () => {
      if (window.location.hash === `#${hash}`) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
  }, [open])

  if (typeof document === 'undefined') return null

  const layer = open === 'sources' || open === 'acquire' ? open : null

  return createPortal(
    <AnimatePresence mode="wait">
      {layer ? (
        <div className="dossier-layer-root" key={layer}>
          <motion.div
            className="dossier-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.22 }}
            onClick={() => {
              playUI?.('tick')
              onClose()
            }}
            aria-hidden
          />
          <div className="dossier-portal-wrap">
            {layer === 'sources' ? (
              <PanelChrome
                id="dossier-sources"
                title="SOURCES & METADATA"
                subtitle="ENDURANCE // REFERENCE INDEX"
                stamp="DECLASSIFIED"
                onClose={() => {
                  playUI?.('tick')
                  onClose()
                }}
              >
                <SourcesContent />
              </PanelChrome>
            ) : (
              <PanelChrome
                id="dossier-acquire"
                title="ACQUIRE THE ARCHIVE"
                subtitle="ENDURANCE // ACQUISITION LOG"
                stamp="COMMERCIAL // CHANNEL"
                onClose={() => {
                  playUI?.('tick')
                  onClose()
                }}
              >
                <AcquireContent playUI={playUI} />
              </PanelChrome>
            )}
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
