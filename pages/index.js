import Head from 'next/head'
import Console from '../components/Console'
import films from '../data/logs.json'

export default function Home() {
  return (
    <>
      <Head>
        <title>The Endurance Logs // Nolan Archive</title>
        <meta name="description" content="An immersive digital museum dedicated to the filmography of Christopher Nolan." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-endurance-build" content="2026-04-21-tablet-safe-v2" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* CRT + grain effects */}
      <div className="crt grain" />

      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(74, 124, 158, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(74, 124, 158, 0.03) 0%, transparent 60%),
            #0a0a0f
          `
        }}
      />

      {/* Main layout: desk perspective */}
      <main className="fixed inset-0 flex items-center justify-center p-6">
        {/* Outer desk frame */}
        <div
          className="relative w-full h-full"
          style={{
            maxWidth: 1400,
            maxHeight: 860,
            background: '#0d0d15',
            border: '1px solid #1e1e2e',
            boxShadow: '0 0 80px rgba(0,0,0,0.9), 0 0 30px rgba(74,124,158,0.04) inset',
          }}
        >
          {/* Corner bolts */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-3 h-3 rounded-full`}
              style={{
                background: 'radial-gradient(circle, #2a2a3a 30%, #1a1a25 100%)',
                border: '1px solid #333344',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.05)'
              }}
            />
          ))}

          <Console films={films} />
        </div>
      </main>
    </>
  )
}
