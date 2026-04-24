'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function CollectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/#acquire')
  }, [router])

  return (
    <>
      <Head>
        <title>Acquire the Archive // The Endurance Logs</title>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="refresh" content="0;url=/#acquire" />
      </Head>
      <p style={{ fontFamily: 'monospace', padding: 24, color: '#7ee8c6', background: '#030508' }}>
        Redirecting to dossier…
      </p>
    </>
  )
}
