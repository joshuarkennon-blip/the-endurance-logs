'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function InfoPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/#sources')
  }, [router])

  return (
    <>
      <Head>
        <title>Sources & Info // The Endurance Logs</title>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="refresh" content="0;url=/#sources" />
      </Head>
      <p style={{ fontFamily: 'monospace', padding: 24, color: '#5ee7ff', background: '#030508' }}>
        Redirecting to dossier…
      </p>
    </>
  )
}
