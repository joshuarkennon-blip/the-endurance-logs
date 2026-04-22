import Head from 'next/head'
import Link from 'next/link'
import films from '../../data/logs.json'

const timeline = [
  { year: '2000', label: 'Memory Fracture', code: 'MEM-2000' },
  { year: '2008', label: 'Moral Contagion', code: 'TDK-2008' },
  { year: '2010', label: 'Dream Architecture', code: 'INC-2010' },
  { year: '2014', label: 'Relativistic Grief', code: 'INT-2014' },
  { year: '2020', label: 'Entropy Warfare', code: 'TEN-2020' },
  { year: '2023', label: 'Critical Mass', code: 'OPP-2023' },
]

const spotlight = {
  title: 'Transmission of the Cycle',
  code: 'INT-2014',
  heading: 'Gravity Liturgy // Interstellar',
  excerpt:
    'The archive classifies Interstellar as a structural breakthrough: physics becomes emotion delivery, and grief becomes measurable in elapsed years.',
}

function ObservatoryCard({ film }) {
  return (
    <article className="observatory-card group">
      <span className="observatory-card-line" style={{ backgroundColor: film.color }} />
      <p className="observatory-meta">
        {film.code} // {film.year}
      </p>
      <h3 className="observatory-card-title">{film.title}</h3>
      <p className="observatory-card-tagline">{film.tagline}</p>
      <div className="observatory-tags">
        {film.themes.slice(0, 3).map((theme) => (
          <span key={theme} className="observatory-tag">
            {theme}
          </span>
        ))}
      </div>
      <button className="observatory-card-cta">Open Dossier</button>
    </article>
  )
}

export default function ObservatoryMockupPage() {
  const leadFilms = films.slice(0, 6)

  return (
    <>
      <Head>
        <title>Temporal Observatory Mockup // The Endurance Logs</title>
        <meta
          name="description"
          content="Alternative site mockup concept: The Temporal Observatory."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="observatory-page">
        <header className="observatory-header">
          <div className="observatory-header-inner">
            <p className="observatory-wordmark">THE TEMPORAL OBSERVATORY</p>
            <nav className="observatory-nav">
              {[
                { label: 'Constellation', href: '#constellation' },
                { label: 'Timeline', href: '#timeline' },
                { label: 'Deep Cuts', href: '#deep-cuts' },
                { label: 'Access', href: '#access' },
              ].map((item) => (
                <a key={item.label} href={item.href} className="observatory-nav-chip">
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="observatory-status">
              <span>SIG // NOMINAL</span>
              <span>UTC {new Date().getUTCFullYear()}</span>
            </div>
          </div>
        </header>

        <main className="observatory-main">
          <section className="observatory-hero">
            <div className="observatory-hero-noise" />
            <div className="observatory-hero-content">
              <p className="observatory-meta">ORBITAL NODE // NOLAN ARCHIVE</p>
              <h1>THE TEMPORAL OBSERVATORY</h1>
              <p className="observatory-hero-copy">
                Cinema mapped as astrophysics: each film a gravity well, each cut a measurable
                distortion in narrative spacetime.
              </p>
              <div className="observatory-hero-actions">
                <a href="#constellation" className="observatory-btn observatory-btn-primary">
                  Enter the Constellation
                </a>
                <a href="#timeline" className="observatory-btn observatory-btn-ghost">
                  Scan Temporal Corridor
                </a>
              </div>
              <div className="observatory-hero-links">
                <Link href="/mockups" className="observatory-inline-link">
                  ← Back to mockup selector
                </Link>
                <Link href="/" className="observatory-inline-link">
                  Return to live archive
                </Link>
              </div>
            </div>
            <div className="observatory-orbit">
              <div className="observatory-orbit-ring observatory-orbit-ring-a" />
              <div className="observatory-orbit-ring observatory-orbit-ring-b" />
              <div className="observatory-orbit-core" />
            </div>
          </section>

          <section id="constellation" className="observatory-section">
            <div className="observatory-section-head">
              <p className="observatory-meta">CONSTELLATION GRID</p>
              <h2>Film Bodies and Signal Clusters</h2>
            </div>
            <div className="observatory-grid">
              {leadFilms.map((film) => (
                <ObservatoryCard key={film.id} film={film} />
              ))}
            </div>
          </section>

          <section id="timeline" className="observatory-section">
            <div className="observatory-section-head">
              <p className="observatory-meta">TEMPORAL CORRIDOR</p>
              <h2>Chronology as a Pressure System</h2>
            </div>
            <div className="observatory-timeline">
              {timeline.map((entry) => (
                <div key={entry.code} className="observatory-timeline-row">
                  <div className="observatory-timeline-year">{entry.year}</div>
                  <div className="observatory-timeline-node" />
                  <div className="observatory-timeline-body">
                    <p className="observatory-timeline-label">{entry.label}</p>
                    <p className="observatory-meta">{entry.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="deep-cuts" className="observatory-spotlight">
            <div className="observatory-spotlight-frame">
              <p className="observatory-meta">{spotlight.title}</p>
              <h2>{spotlight.heading}</h2>
              <p>{spotlight.excerpt}</p>
              <div className="observatory-spotlight-actions">
                <button className="observatory-btn observatory-btn-primary">Enter Layer 2</button>
                <button className="observatory-btn observatory-btn-ghost">Enter Layer 3</button>
              </div>
            </div>
          </section>

          <section id="access" className="observatory-access">
            <div>
              <p className="observatory-meta">OBSERVER ACCESS</p>
              <h3>Join weekly transmissions from the archive core.</h3>
            </div>
            <form className="observatory-access-form">
              <input type="email" placeholder="observer@signal.net" aria-label="Email" />
              <button type="button">Receive Signal</button>
            </form>
          </section>
        </main>
      </div>
    </>
  )
}
