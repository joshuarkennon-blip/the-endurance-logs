import Head from 'next/head'
import Link from 'next/link'

const premiereRail = [
  { title: 'INTERSTELLAR', year: '2014', format: 'IMAX 70MM', note: 'Celestial Liturgy' },
  { title: 'THE DARK KNIGHT', year: '2008', format: 'IMAX 70MM', note: 'Urban Revelation' },
  { title: 'OPPENHEIMER', year: '2023', format: '65MM IMAX', note: 'Critical Fire' },
]

const vaults = [
  { numeral: 'I', title: 'Celestial Epics', films: '12 transmissions', line: 'Faith, gravity, and inherited hope' },
  { numeral: 'II', title: 'Steel & Prophecy', films: '9 transmissions', line: 'Power systems under pressure' },
  { numeral: 'III', title: 'Fractured Identity', films: '7 transmissions', line: 'Memory, guilt, and self-construction' },
  { numeral: 'IV', title: 'Temporal Warfare', films: '6 transmissions', line: 'Entropy, inversion, and control' },
  { numeral: 'V', title: 'Court of Consequence', films: '5 transmissions', line: 'Institutional theater and truth' },
  { numeral: 'VI', title: 'Legacy Altars', films: '8 transmissions', line: 'What survives the maker' },
]

const screeningCalendar = [
  { date: 'APR 27', film: 'INCEPTION', venue: 'Cathedral Hall A', format: 'IMAX DCP', seats: '18 seats left' },
  { date: 'MAY 02', film: 'INTERSTELLAR', venue: 'Grand Nave Screen', format: '70MM', seats: '7 seats left' },
  { date: 'MAY 05', film: 'THE DARK KNIGHT', venue: 'North Vault Cinema', format: 'IMAX 70MM', seats: '22 seats left' },
  { date: 'MAY 11', film: 'TENET', venue: 'Temporal Chapel', format: 'Dual Projection', seats: '11 seats left' },
  { date: 'MAY 15', film: 'MEMENTO', venue: 'Crypt Theater', format: '35MM', seats: '31 seats left' },
  { date: 'MAY 19', film: 'OPPENHEIMER', venue: 'Grand Nave Screen', format: '65MM', seats: '5 seats left' },
]

const essays = [
  {
    title: 'When Spectacle Becomes Ethics',
    blurb:
      'A long-form essay on Nolan’s recurring thesis: that technical scale is never neutral—it always implies a moral framework.',
    meta: '14 min read // by Archive Curator',
  },
  {
    title: 'The Cathedral of Process',
    blurb: 'How production design, sound, and pacing produce ritual behavior in audiences.',
    meta: '8 min read // Editorial Note',
  },
  {
    title: 'Monumentality and Doubt',
    blurb: 'Why the biggest images in Nolan often carry the smallest certainties.',
    meta: '11 min read // Field Notes',
  },
]

export default function ImaxCathedralMockupPage() {
  return (
    <>
      <Head>
        <title>Mockup // The IMAX Cathedral</title>
        <meta
          name="description"
          content="The IMAX Cathedral mockup concept for The Endurance Logs."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="cathedral-page">
        <header className="cathedral-chrome">
          <p className="cathedral-brand">IMAX CATHEDRAL</p>
          <nav className="cathedral-nav">
            <a href="#vaults">Vaults</a>
            <a href="#timeline">Chronicle</a>
            <a href="#calendar">Rituals</a>
            <a href="#patron">Patronage</a>
          </nav>
          <div className="cathedral-back-link-wrap">
            <Link href="/mockups" className="cathedral-back-link">
              Compare Concepts
            </Link>
          </div>
        </header>

        <section className="cathedral-hero">
          <div className="cathedral-hero-veil" />
          <p className="cathedral-overline">Nave of Light</p>
          <h1>THE IMAX CATHEDRAL</h1>
          <p className="cathedral-hero-copy">
            A monumental fan-archive of large-format cinema: restored frames, ritual screenings,
            and the directors who built worlds big enough to kneel before.
          </p>
          <div className="cathedral-cta-row">
            <button type="button">Enter the Cathedral</button>
            <button type="button" className="cathedral-cta-secondary">
              Browse by Era
            </button>
          </div>
          <span className="cathedral-scroll-indicator">Scroll Liturgy ↓</span>
        </section>

        <section className="cathedral-section cathedral-premiere">
          <div className="cathedral-section-head">
            <p className="cathedral-overline">Premiere Rail</p>
            <h2>FEATURED RESTORATIONS</h2>
          </div>
          <div className="cathedral-premiere-row">
            {premiereRail.map((item, index) => (
              <article
                key={item.title}
                className={`cathedral-premiere-card ${index === 1 ? 'is-focus' : ''}`}
              >
                <div className="cathedral-premiere-meta">
                  <p>{item.format}</p>
                  <span>{item.year}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="cathedral-premiere-note">{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="vaults" className="cathedral-section">
          <div className="cathedral-section-head">
            <p className="cathedral-overline">The Great Aisle</p>
            <h2>CURATED VAULTS</h2>
          </div>
          <div className="cathedral-vault-grid">
            {vaults.map((vault) => (
              <article key={vault.numeral} className="cathedral-vault-card">
                <span className="cathedral-vault-numeral">{vault.numeral}</span>
                <h3>{vault.title}</h3>
                <p>{vault.line}</p>
                <div className="cathedral-vault-foot">
                  <span>{vault.films}</span>
                  <span>Open Vault →</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="timeline" className="cathedral-section cathedral-timeline">
          <div className="cathedral-section-head">
            <p className="cathedral-overline">Cathedral Timeline</p>
            <h2>DECADES & MOVEMENTS</h2>
          </div>
          <div className="cathedral-timeline-rail">
            <div className="cathedral-timeline-year">2000</div>
            <div className="cathedral-timeline-year">2008</div>
            <div className="cathedral-timeline-year">2014</div>
            <div className="cathedral-timeline-year">2020</div>
            <div className="cathedral-timeline-year">2023</div>
          </div>
          <p className="cathedral-timeline-copy">
            The chronicle is staged as a ceremonial processional: each era reveals a new relationship
            between technical scale and moral consequence.
          </p>
        </section>

        <section id="calendar" className="cathedral-section">
          <div className="cathedral-section-head">
            <p className="cathedral-overline">Ritual Screening Calendar</p>
            <h2>UPCOMING SCREENINGS</h2>
          </div>
          <div className="cathedral-calendar">
            {screeningCalendar.map((event) => (
              <article key={`${event.date}-${event.film}`} className="cathedral-calendar-row">
                <p className="cathedral-calendar-date">{event.date}</p>
                <p className="cathedral-calendar-film">{event.film}</p>
                <p>{event.venue}</p>
                <p>{event.format}</p>
                <p className="cathedral-calendar-seats">{event.seats}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cathedral-section">
          <div className="cathedral-section-head">
            <p className="cathedral-overline">Editorial Pulpit</p>
            <h2>ESSAYS & NOTES</h2>
          </div>
          <div className="cathedral-essay-grid">
            {essays.map((essay, index) => (
              <article
                key={essay.title}
                className={`cathedral-essay-card ${index === 0 ? 'is-lead' : ''}`}
              >
                <h3>{essay.title}</h3>
                <p>{essay.blurb}</p>
                <span>{essay.meta}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="patron" className="cathedral-patron">
          <div>
            <p className="cathedral-overline">Patron Circle</p>
            <h2>KEEP THE CATHEDRAL LIT</h2>
            <p>
              Patronage unlocks restoration dossiers, screening priority windows, and monthly deep
              archive dispatches.
            </p>
          </div>
          <div className="cathedral-patron-actions">
            <button type="button">Become a Patron</button>
            <button type="button" className="cathedral-cta-secondary">
              Gift Membership
            </button>
          </div>
        </section>

        <footer className="cathedral-footer">
          <p>CRYPT INDEX // RIGHTS // FORMAT GLOSSARY // ENDURANCE LOGS</p>
          <Link href="/mockups/observatory">View Temporal Observatory →</Link>
        </footer>
      </main>
    </>
  )
}
