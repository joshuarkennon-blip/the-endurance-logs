import Head from 'next/head'
import Link from 'next/link'

// Affiliate ref slugs — swap these out when links are live
const films = [
  {
    id: 'interstellar',
    title: 'INTERSTELLAR',
    year: '2014',
    color: '#4a7c9e',
    glowColor: '#6ab4dc',
    thumbnail: '🌌',
    formats: [
      { label: '4K UHD Blu-ray', platform: 'Amazon',       ref: '#',  note: 'Steelbook edition available' },
      { label: 'Blu-ray',        platform: 'Amazon',       ref: '#',  note: null },
      { label: 'Digital HD',     platform: 'Apple TV',     ref: '#',  note: null },
      { label: 'Digital HD',     platform: 'Vudu',         ref: '#',  note: null },
    ]
  },
  {
    id: 'inception',
    title: 'INCEPTION',
    year: '2010',
    color: '#7a5c9e',
    glowColor: '#b08cdc',
    thumbnail: '🌀',
    formats: [
      { label: '4K UHD Blu-ray', platform: 'Amazon',       ref: '#',  note: null },
      { label: 'Blu-ray',        platform: 'Amazon',       ref: '#',  note: null },
      { label: 'Digital HD',     platform: 'Apple TV',     ref: '#',  note: null },
      { label: 'Digital HD',     platform: 'Vudu',         ref: '#',  note: null },
    ]
  },
  {
    id: 'tenet',
    title: 'TENET',
    year: '2020',
    color: '#9e5c4a',
    glowColor: '#dc8c6a',
    thumbnail: '⏳',
    formats: [
      { label: '4K UHD Blu-ray', platform: 'Amazon',       ref: '#',  note: null },
      { label: 'Blu-ray',        platform: 'Amazon',       ref: '#',  note: null },
      { label: 'Digital HD',     platform: 'Apple TV',     ref: '#',  note: null },
      { label: 'Digital HD',     platform: 'Vudu',         ref: '#',  note: null },
    ]
  },
  {
    id: 'memento',
    title: 'MEMENTO',
    year: '2000',
    color: '#4a9e5c',
    glowColor: '#6adc8c',
    thumbnail: '📸',
    formats: [
      { label: '4K UHD Blu-ray', platform: 'Amazon',       ref: '#',  note: 'Limited availability' },
      { label: 'Blu-ray',        platform: 'Amazon',       ref: '#',  note: null },
      { label: 'Digital HD',     platform: 'Apple TV',     ref: '#',  note: null },
      { label: 'Digital HD',     platform: 'Vudu',         ref: '#',  note: null },
    ]
  },
]

export default function CollectPage() {
  return (
    <>
      <Head>
        <title>Acquire the Archive // The Endurance Logs</title>
        <meta name="description" content="Own the Nolan archive in the highest quality available. Physical and digital editions of Interstellar, Inception, Tenet, and Memento." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="crt grain" />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(74,124,158,0.04) 0%, transparent 60%), #0a0a0f' }} />

      <main className="fixed inset-0 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-10 md:py-16">

          {/* Back */}
          <div className="mb-8">
            <Link href="/" className="text-[11px] tracking-[0.25em] text-console-muted uppercase hover:text-console-glow transition-colors">
              ← BACK TO ARCHIVE
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10 border-b border-console-border pb-8">
            <p className="text-[10px] tracking-[0.35em] text-console-muted uppercase mb-2">
              ENDURANCE // ACQUISITION LOG
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.12em] text-console-glow mb-3">
              ACQUIRE THE ARCHIVE
            </h1>
            <p className="text-[13px] md:text-[14px] text-console-text leading-relaxed">
              Own these films in the highest quality available. Physical media preserves the full theatrical experience. Links below support this archive at no extra cost to you.
            </p>
            <p className="text-[11px] text-console-muted mt-3 tracking-wide">
              // AFFILIATE DISCLOSURE — Links marked with ◈ earn a small commission. Price and availability subject to change.
            </p>
          </div>

          {/* Film cards */}
          <div className="space-y-8">
            {films.map((film) => (
              <div key={film.id} className="panel p-5">
                {/* Film header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: `${film.color}30` }}>
                  <span className="text-3xl">{film.thumbnail}</span>
                  <div>
                    <h2 className="text-[14px] md:text-[16px] font-bold tracking-[0.15em]" style={{ color: film.glowColor }}>
                      {film.title}
                    </h2>
                    <p className="text-[10px] text-console-muted">{film.year}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: film.color, boxShadow: `0 0 6px ${film.color}` }} />
                  </div>
                </div>

                {/* Format rows */}
                <div className="space-y-2">
                  {film.formats.map((f, i) => (
                    <a
                      key={i}
                      href={f.ref}
                      className="flex items-center justify-between gap-4 px-3 py-2.5 border border-console-border hover:border-opacity-60 transition-all group"
                      style={{ '--hover-color': film.color }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-console-muted tracking-widest">◈</span>
                        <div>
                          <p className="text-[12px] md:text-[13px] text-console-text group-hover:text-white transition-colors">
                            {f.label}
                          </p>
                          {f.note && (
                            <p className="text-[10px] text-console-muted mt-0.5">{f.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] tracking-wider" style={{ color: film.color }}>
                          {f.platform}
                        </span>
                        <span className="text-[10px] text-console-muted group-hover:text-console-text transition-colors">→</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-console-border mt-12 pt-5 flex items-center justify-between">
            <p className="text-[10px] text-console-muted tracking-widest">
              ENDURANCE LOGS // ACQUISITION
            </p>
            <Link href="/" className="text-[10px] tracking-[0.2em] text-console-muted uppercase hover:text-console-glow transition-colors">
              RETURN TO ARCHIVE →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
