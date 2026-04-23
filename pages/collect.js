import Head from 'next/head'
import Link from 'next/link'

const TAG = 'theendurancel-20'
const amz = (asin) => `https://www.amazon.com/dp/${asin}?tag=${TAG}`

const films = [
  {
    id: 'interstellar',
    title: 'INTERSTELLAR',
    year: '2014',
    color: '#4a7c9e',
    glowColor: '#6ab4dc',
    thumbnail: '🌌',
    formats: [
      { label: '4K UHD — 10th Anniversary Collector\'s Edition', ref: amz('B0DJ1NQJ4Z'), note: 'Costume patches, 5 poster reproductions, storyboard archive from Nolan\'s archives' },
      { label: '4K UHD + Blu-ray — Standard',                   ref: amz('B0767FCYDW'), note: null },
      { label: 'Blu-ray',                                        ref: amz('B079G9DKH5'), note: null },
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
      { label: '4K UHD — Ultimate Collector\'s Steelbook', ref: amz('B0F4LYPGKD'), note: 'New key art, theatrical poster, collector\'s cards, 3-disc set' },
      { label: '4K UHD + Blu-ray — Standard',             ref: amz('B078SGL6L7'), note: null },
      { label: 'Blu-ray',                                  ref: amz('B077NZKJLN'), note: null },
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
      { label: '4K UHD + Blu-ray + Digital', ref: amz('B08KQ4D48D'), note: null },
      { label: 'Blu-ray',                    ref: amz('B08GGH9ZFS'), note: null },
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
      { label: 'Blu-ray',                    ref: amz('B000FJGWBM'), note: 'No standalone 4K release — best physical edition available' },
      { label: 'Blu-ray — 10th Anniversary', ref: amz('B004FHCH96'), note: 'Special edition with director commentary' },
    ]
  },
  {
    id: 'batman-begins',
    title: 'BATMAN BEGINS',
    year: '2005',
    color: '#6b6f78',
    glowColor: '#9ca3b0',
    thumbnail: '🦇',
    formats: [
      { label: '4K UHD + Blu-ray — Standard', ref: amz('B07G2CJNHD'), note: null },
      { label: 'Blu-ray', ref: amz('B001DD4B32'), note: 'Included in multiple trilogy box sets' },
    ]
  },
  {
    id: 'the-dark-knight',
    title: 'THE DARK KNIGHT',
    year: '2008',
    color: '#4a5a74',
    glowColor: '#88a9d6',
    thumbnail: '🃏',
    formats: [
      { label: '4K UHD + Blu-ray — Standard', ref: amz('B07G2CFY4P'), note: null },
      { label: 'Blu-ray', ref: amz('B0016F9KQQ'), note: 'Best known for IMAX-expanded sequences' },
    ]
  },
  {
    id: 'the-dark-knight-rises',
    title: 'THE DARK KNIGHT RISES',
    year: '2012',
    color: '#6e5b4a',
    glowColor: '#c9a27f',
    thumbnail: '🔥',
    formats: [
      { label: '4K UHD + Blu-ray — Standard', ref: amz('B07G2CS4GL'), note: null },
      { label: 'Blu-ray', ref: amz('B008R9J5OC'), note: null },
    ]
  },
  {
    id: 'collection',
    title: 'FULL NOLAN COLLECTION',
    year: 'All Films',
    color: '#7a7a9e',
    glowColor: '#aaaacf',
    thumbnail: '◈',
    formats: [
      { label: '8-Film 4K Collection', ref: amz('B0FGWN3ZF3'), note: 'Memento, Insomnia, Batman Begins, The Dark Knight, Inception, The Dark Knight Rises, Interstellar, Dunkirk — best value' },
      { label: '6-Film 4K Collection', ref: amz('B077MYFX8K'), note: 'Christopher Nolan 4K box set' },
    ]
  },
]

export default function CollectPage() {
  return (
    <>
      <Head>
        <title>Acquire the Archive // The Endurance Logs</title>
        <meta name="description" content="Own the Nolan archive in the highest quality available. Physical editions including Interstellar, Inception, Tenet, Memento, and The Dark Knight trilogy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="crt grain" />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(74,124,158,0.04) 0%, transparent 60%), #0a0a0f' }} />

      <main className="fixed inset-0 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-10 md:py-16">

          <div className="mb-8">
            <Link href="/" className="text-[11px] tracking-[0.25em] text-console-muted uppercase hover:text-console-glow transition-colors">
              ← BACK TO ARCHIVE
            </Link>
          </div>

          <div className="mb-10 border-b border-console-border pb-8">
            <p className="text-[10px] tracking-[0.35em] text-console-muted uppercase mb-2">ENDURANCE // ACQUISITION LOG</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.12em] text-console-glow mb-3 neon-text-plasma">
              ACQUIRE THE ARCHIVE
            </h1>
            <p className="text-[13px] md:text-[14px] text-console-text leading-relaxed">
              Own these films in the highest quality available. Physical media preserves the full theatrical experience. Amazon links below support this archive at no extra cost to you.
            </p>
            <p className="text-[12px] md:text-[13px] text-console-muted leading-relaxed mt-3">
              Please support filmmakers by purchasing their work from your favorite retailers.
            </p>
            <p className="text-[11px] text-console-muted mt-3 tracking-wide">
              ◈ Affiliate disclosure — links earn a small commission via the Amazon Associates program.
            </p>
          </div>

          <div className="space-y-8">
            {films.map((film) => (
              <div key={film.id} className="panel p-5">
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

                <div className="space-y-2">
                  {film.formats.map((f, i) => (
                    <a key={i} href={f.ref} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 px-3 py-2.5 border border-console-border hover:border-console-accent transition-all group">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-console-muted">◈</span>
                        <div>
                          <p className="text-[12px] md:text-[13px] text-console-text group-hover:text-white transition-colors">{f.label}</p>
                          {f.note && <p className="text-[10px] text-console-muted mt-0.5">{f.note}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] tracking-wider" style={{ color: film.color }}>Amazon →</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-console-border mt-12 pt-5 flex items-center justify-between">
            <p className="text-[10px] text-console-muted tracking-widest">ENDURANCE LOGS // ACQUISITION</p>
            <Link href="/" className="text-[10px] tracking-[0.2em] text-console-muted uppercase hover:text-console-glow transition-colors">
              RETURN TO ARCHIVE →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
