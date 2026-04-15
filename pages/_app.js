import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'

// Global audio teardown on route change so nothing bleeds between pages
export default function App({ Component, pageProps }) {
  const router   = useRouter()
  const stopRef  = useRef(null)   // Console registers its stopAll here

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof stopRef.current === 'function') stopRef.current()
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router])

  return <Component {...pageProps} registerStopAll={(fn) => { stopRef.current = fn }} />
}
