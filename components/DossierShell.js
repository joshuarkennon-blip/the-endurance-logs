'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function DossierShell({ children }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="dossier-root relative min-h-full">
      {!reduceMotion ? (
        <>
          <div className="dossier-ambient-glow dossier-ambient-glow--cyan" aria-hidden />
          <div className="dossier-ambient-glow dossier-ambient-glow--magenta" aria-hidden />
          <div className="dossier-vignette" aria-hidden />
          <motion.div
            className="dossier-noise-fine"
            aria-hidden
            animate={{ opacity: [0.12, 0.2, 0.14] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        <div className="dossier-vignette dossier-vignette--static" aria-hidden />
      )}

      <div className="dossier-room-edge dossier-room-edge--tl" aria-hidden />
      <div className="dossier-room-edge dossier-room-edge--tr" aria-hidden />
      <div className="dossier-room-edge dossier-room-edge--bl" aria-hidden />
      <div className="dossier-room-edge dossier-room-edge--br" aria-hidden />

      {children}
    </div>
  )
}
