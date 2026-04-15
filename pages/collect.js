import Head from 'next/head'
import Link from 'next/link'

const films = [
  {
    id: 'interstellar',
    title: 'INTERSTELLAR',
    year: '2014',
    color: '#4a7c9e',
    glowColor: '#6ab4dc',
    thumbnail: '🌌',
    formats: [
      { label: '4K UHD Blu-ray — 10th Anniversary Edition', platform: 'Amazon', ref: 'https://www.amazon.com/Interstellar-Anniversary-Collectors-Blu-Ray-Digital/dp/B0DJ1NQJ4Z', note: 'Collector\'s cards, poster reproductions, storyboard archive' },
      { label: '4K UHD Blu-ray — Standard',                 platform: 'Amazon', ref: 'https://www.amazon.com/InterStellar-4K-UltraHD-Blu-ray-Interstellar/dp/B0767FCYDW', note: null },
      { label: 'Digital HD',                                platform: 'Apple TV', ref: 'https://tv.apple.com/us/movie/interstellar/umc.cmc.6ts7bslmcnugzn5fyyaewn5oc', note: null },
      { label: 'Digital HD',                                platform: 'Vudu',     ref: 'https://www.vudu.com/content/movies/details/Interstellar/608646', note: null },
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
      { label: '4K UHD Blu-ray — Ultimate Collector\'s Steelbook', platform: 'Amazon', ref: 'https://www.amazon.com/Inception-Ultimate-Collectors-Steelbook-Blu-ray/dp/B0F4LYPGKD', note: 'New key art, theatrical poster, collector\'s cards' },
      { label: '4K UHD Blu-ray — Standard',                        platform: 'Amazon', ref: 'https://www.amazon.com/Inception-UHD-Blu-ray-Leonardo-DiCaprio/dp/B078SGL6L7', note: null },
      { label: 'Digital HD',                                        platform: 'Apple TV', ref: 'https://tv.apple.com/us/movie/inception/umc.cmc.3y3mqkrq3u4g65dbtfq9yxfn4', note: null },
      { label: 'Digital HD',                                        platform: 'Vudu',     ref: 'https://www.vudu.com/content/movies/details/Inception/182168', note: null },
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
      { label: '4K UHD Blu-ray', platform: 'Amazon', ref: 'https://www.amazon.com/Tenet-4K-Ultra-HD-Blu-ray/dp/B08KQ4D48D', note: null },
      { label: 'Blu-ray',        platform: 'Amazon', ref: 'https://www.amazon.com/Tenet-Blu-ray-John-David-Washington/dp/B08GGH9ZFS', note: null },
      { label: 'Digital HD',     platform: 'Apple TV', ref: 'https://tv.apple.com/us/movie/tenet/umc.cmc.2cmyxhdjpn6axdolyxmdh8j15', note: null },
      { label: 'Digital HD',     platform: 'Vudu',     ref: 'https://www.vudu.com/content/movies/details/Tenet/1493460', note: null },
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
      { label: '8-Film Nolan 4K Collection (incl. Memento)', platform: 'Amazon', ref: 'https://www.amazon.com/Christopher-Nolan-Collection-Features-Included/dp/B0FGWN3ZF3', note: 'Best value — includes Interstellar, Inception, Tenet & more' },
      { label: 'Blu-ray',    platform: 'Amazon',   ref: 'https://www.amazon.com/Memento-Blu-ray-Guy-Pearce/dp/B000FJGWBM', note: 'Standalone edition' },
      { label: 'Digital HD', platform: 'Apple TV', ref: 'https://tv.apple.com/us/movie/memento/umc.cmc.4y8yz38e4ycn0o8jfyxf5uhs', note: null },
      { label: 'Digital HD', platform: 'Vudu',     ref: 'https://www.vudu.com/content/movies/', note: 'Search "Memento" on Vudu' },
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
      { label: '8-Film 4K Collection', platform: 'Amazon', ref: 'https://www.amazon.com/Christopher-Nolan-Collection-Features-Included/dp/B0FGWN3ZF3', note: 'Memento, Insomnia, Batman Begins, The Dark Knight, Inception, The Dark Knight Rises, Interstellar, Dunkirk' },
      { label: '6-Film Digital Bundle', platform: 'Vudu',  ref: 'https://www.vudu.com/content/browse/details/title/2548787', note: 'Best digital value for the full archive' },
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

          <div className="mb-8">
            <Link href="/" className="text-[11px] tracking-[0.25em] text-console-muted uppercase hover:text-console-glow transition-colors">
              ← BACK TO ARCHIVE
            </Link>
          </div>

          <div className="mb-10 border-b border-console-border pb-8">
            <p className="text-[10px] tracking-[0.35em] text-console-muted uppercase mb-2">ENDURANCE // ACQUISITION LOG</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.12em] text-console-glow mb-3">
              ACQUIRE THE ARCHIVE
            </h1>
            <p className="text-[13px] md:text-[14px] text-console-text leading-relaxed">
              Own these films in the highest quality available. Physical media preserves the full theatrical experience. Links below support this archive at no extra cost to you.
            </p>
            <p className="text-[11px] text-console-muted mt-3 tracking-wide">
              ◈ Affiliate disclosure — marked links earn a small commission. Price and availability subject to change.
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
                        <span className="text-[10px] text-console-muted tracking-widest">◈</span>
                        <div>
                          <p className="text-[12px] md:text-[13px] text-console-text group-hover:text-white transition-colors">
                            {f.label}
                          </p>
                          {f.note && <p className="text-[10px] text-console-muted mt-0.5">{f.note}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] tracking-wider" style={{ color: film.color }}>{f.platform}</span>
                        <span className="text-[10px] text-console-muted group-hover:text-console-text transition-colors">→</span>
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
