import Head from 'next/head'
import Console from '../components/Console'
import DossierShell from '../components/DossierShell'
import films from '../data/logs.json'

export default function Home() {
  return (
    <>
      <Head>
        <title>The Endurance Logs // Declassified Terminal</title>
        <meta name="description" content="An immersive digital museum dedicated to the filmography of Christopher Nolan — dossier terminal interface." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-endurance-build" content="2026-04-25-dossier-neon-v2-console-reskin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="crt grain" />

      <DossierShell>
        <main className="dossier-main fixed inset-0 flex items-center justify-center p-4 md:p-6">
          <div className="dossier-frame relative w-full h-full max-w-[min(1400px,100%)] max-h-[min(860px,100%)] flex flex-col overflow-hidden">
            <div className="dossier-frame-glint" aria-hidden />
            <div className="dossier-frame-bezel" aria-hidden />
            <Console films={films} />
          </div>
        </main>
      </DossierShell>
    </>
  )
}
