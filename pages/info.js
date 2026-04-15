import Head from 'next/head'
import Link from 'next/link'

const sources = [
  {
    film: 'INTERSTELLAR (2014)',
    color: '#4a7c9e',
    refs: [
      { label: 'Thorne, K. (2014). The Science of Interstellar.', detail: 'W. W. Norton & Company. Primary scientific consultant for the film. Basis for time dilation, Gargantua rendering, and the gravity equation narrative.' },
      { label: 'Nolan, C. (Director). (2014). Interstellar.', detail: 'Warner Bros. Pictures / Paramount Pictures. All thematic analysis derived from direct viewing of the theatrical release.' },
      { label: 'James, O. et al. (2015). Gravitational lensing by spinning black holes.', detail: 'Classical and Quantum Gravity, 32(6). The physics paper published as a result of the Gargantua rendering work.' },
    ]
  },
  {
    film: 'INCEPTION (2010)',
    color: '#7a5c9e',
    refs: [
      { label: 'Nolan, C. (Director). (2010). Inception.', detail: 'Warner Bros. Pictures. All thematic analysis derived from direct viewing of the theatrical release and supplementary materials.' },
      { label: 'Nolan, C. (2010). Inception: The Shooting Script.', detail: 'Insight Editions. Referenced for character intent and structural analysis, particularly the Mal sequences.' },
    ]
  },
  {
    film: 'TENET (2020)',
    color: '#9e5c4a',
    refs: [
      { label: 'Nolan, C. (Director). (2020). Tenet.', detail: 'Warner Bros. Pictures. All thematic analysis derived from direct viewing of the theatrical release.' },
      { label: 'Penrose, R. (1989). The Emperor\'s New Mind.', detail: 'Oxford University Press. Background reading on entropy and time asymmetry, informing the inversion analysis.' },
    ]
  },
  {
    film: 'MEMENTO (2000)',
    color: '#4a9e5c',
    refs: [
      { label: 'Nolan, C. (Director). (2000). Memento.', detail: 'Summit Entertainment. All thematic analysis derived from direct viewing of the theatrical release.' },
      { label: 'Nolan, J. (2001). Memento Mori.', detail: 'Esquire. The short story by Jonathan Nolan that served as the source material for the film.' },
      { label: 'Sacks, O. (1985). The Man Who Mistook His Wife for a Hat.', detail: 'Summit Books. Referenced for background on anterograde amnesia and clinical memory disorders.' },
    ]
  },
]

export default function InfoPage() {
  return (
    <>
      <Head>
        <title>Sources & Info // The Endurance Logs</title>
        <meta name="description" content="Sources, references, and privacy information for The Endurance Logs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* CRT overlay */}
      <div className="crt grain" />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(74,124,158,0.04) 0%, transparent 60%), #0a0a0f' }}
      />

      <main className="fixed inset-0 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-10 md:py-16">

          {/* Back nav */}
          <div className="mb-8">
            <Link href="/"
              className="text-[11px] tracking-[0.25em] text-console-muted uppercase hover:text-console-glow transition-colors">
              ← BACK TO ARCHIVE
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10 border-b border-console-border pb-8">
            <p className="text-[10px] tracking-[0.35em] text-console-muted uppercase mb-2">
              ENDURANCE // METADATA
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.12em] text-console-glow mb-3">
              SOURCES & INFO
            </h1>
            <p className="text-[13px] md:text-[14px] text-console-text leading-relaxed">
              The Endurance Logs is an independent fan project. All film analysis is original editorial work. Referenced texts and sources are listed below per film.
            </p>
          </div>

          {/* Sources */}
          <section className="mb-12">
            <p className="text-[10px] tracking-[0.35em] text-console-muted uppercase mb-6 flex items-center gap-3">
              REFERENCES
              <span className="flex-1 h-px bg-console-border" />
            </p>

            <div className="space-y-8">
              {sources.map((s) => (
                <div key={s.film}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 shrink-0" style={{ backgroundColor: s.color }} />
                    <h2 className="text-[11px] md:text-[12px] font-bold tracking-[0.2em]" style={{ color: s.color }}>
                      {s.film}
                    </h2>
                  </div>
                  <div className="pl-3 space-y-4">
                    {s.refs.map((r, i) => (
                      <div key={i} className="border-l border-console-border pl-3">
                        <p className="text-[12px] md:text-[13px] text-console-text leading-snug">{r.label}</p>
                        <p className="text-[11px] md:text-[12px] text-console-muted leading-relaxed mt-1">{r.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-12 border border-console-border p-4 md:p-5">
            <p className="text-[10px] tracking-[0.35em] text-console-muted uppercase mb-3">
              DISCLAIMER
            </p>
            <p className="text-[12px] md:text-[13px] text-console-text leading-relaxed">
              The Endurance Logs is an unofficial fan project with no affiliation to Warner Bros. Pictures, Syncopy, Christopher Nolan, or any associated rights holders. Film titles, character names, and all intellectual property remain the property of their respective owners. No copyright infringement is intended. All written analysis is original commentary protected under fair use.
            </p>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <p className="text-[10px] tracking-[0.35em] text-console-muted uppercase mb-4 flex items-center gap-3">
              PRIVACY
              <span className="flex-1 h-px bg-console-border" />
            </p>
            <div className="space-y-3 text-[12px] md:text-[13px] text-console-text leading-relaxed">
              <p>This site collects no personal data. There are no accounts, no cookies beyond what Vercel's infrastructure requires for delivery, and no third-party tracking scripts.</p>
              <p>Audio plays only after your first interaction with the page, in compliance with browser autoplay policies. Volume is kept at ambient levels and can be muted via your device controls at any time.</p>
              <p>The site is hosted on Vercel. Their privacy policy applies to infrastructure-level data (server logs, edge network). See <span className="text-console-glow">vercel.com/legal/privacy-policy</span>.</p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <p className="text-[10px] tracking-[0.35em] text-console-muted uppercase mb-4 flex items-center gap-3">
              CONTACT
              <span className="flex-1 h-px bg-console-border" />
            </p>
            <p className="text-[12px] md:text-[13px] text-console-text leading-relaxed">
              Questions, corrections, or transmissions:{' '}
              <a href="mailto:theendurancelogs@gmail.com"
                className="text-console-glow hover:underline tracking-wide">
                theendurancelogs@gmail.com
              </a>
            </p>
          </section>

          {/* Footer */}
          <div className="border-t border-console-border pt-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-console-muted tracking-widest">
                ENDURANCE LOGS // {new Date().getFullYear()}
              </p>
              <p className="text-[10px] text-console-muted italic mt-1 opacity-60">
                for RK — my reason for existence
              </p>
            </div>
            <Link href="/"
              className="text-[10px] tracking-[0.2em] text-console-muted uppercase hover:text-console-glow transition-colors">
              RETURN TO ARCHIVE →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
