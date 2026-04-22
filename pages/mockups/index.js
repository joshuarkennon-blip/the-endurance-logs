import Head from 'next/head'
import Link from 'next/link'

const mockups = [
  {
    id: 'observatory',
    href: '/mockups/observatory',
    title: 'THE TEMPORAL OBSERVATORY',
    kicker: 'OPTION I',
    summary:
      'A cosmic intelligence interface where every Nolan film behaves like a gravity source in a cinematic star map.',
    tags: ['Constellation Grid', 'Temporal Corridor', 'Signal HUD'],
  },
  {
    id: 'cathedral',
    href: '/mockups/cathedral',
    title: 'THE IMAX CATHEDRAL',
    kicker: 'OPTION II',
    summary:
      'A monumental, liturgical archive of cinema with towering typography, editorial rituals, and screening-ritual atmosphere.',
    tags: ['Nave Hero', 'Vault Grid', 'Ritual Calendar'],
  },
]

export default function MockupHubPage() {
  return (
    <>
      <Head>
        <title>Reimagine Mockups // The Endurance Logs</title>
        <meta
          name="description"
          content="Experimental full-page mockups for The Endurance Logs redesign exploration."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="mockup-shell min-h-screen px-6 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 md:mb-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.24em] text-console-muted uppercase transition-colors hover:text-console-glow"
            >
              <span>←</span>
              <span>Back to Current Archive</span>
            </Link>
            <p className="mt-5 text-[11px] tracking-[0.34em] text-console-muted uppercase">
              Reimagination Program
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[0.06em] text-[#e7f0ff] md:text-5xl">
              FULL MOCKUP DEPLOYMENT
            </h1>
            <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-[#9db0d2] md:text-[16px]">
              Two bold, complete alternative structures are live below. Each route is built as a
              full-screen concept pass, including hierarchy, motion language, content containers,
              and conversion architecture.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mockups.map((mockup) => (
              <article key={mockup.id} className="mockup-hub-card">
                <p className="text-[10px] tracking-[0.34em] text-[#8aa0c6] uppercase">{mockup.kicker}</p>
                <h2 className="mt-3 text-xl font-semibold tracking-[0.08em] text-[#f2f6ff] md:text-2xl">
                  {mockup.title}
                </h2>
                <p className="mt-4 text-[14px] leading-relaxed text-[#adc0de]">{mockup.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {mockup.tags.map((tag) => (
                    <span key={tag} className="mockup-hub-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={mockup.href} className="mockup-hub-link mt-8">
                  Open Full Mockup →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
