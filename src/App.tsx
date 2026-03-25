import { useEffect, useState } from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { HomePage } from './pages/HomePage'
import { VideosPage } from './pages/VideosPage'

type LocationState = {
  path: string
  hash: string
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function getLocationState(): LocationState {
  return {
    path: normalizePath(window.location.pathname),
    hash: window.location.hash,
  }
}

function scrollToHash(hash: string, smooth = true) {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
    return
  }

  const target = document.querySelector(hash)

  if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    return
  }

  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}

function App() {
  const [locationState, setLocationState] = useState<LocationState>(getLocationState)

  useEffect(() => {
    function handleLocationChange() {
      setLocationState(getLocationState())
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('locationchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('locationchange', handleLocationChange)
    }
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (locationState.path === '/') {
        scrollToHash(locationState.hash, false)
        return
      }

      window.scrollTo({ top: 0, behavior: 'auto' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [locationState.hash, locationState.path])

  function handleNavigate(href: string) {
    const url = new URL(href, window.location.origin)
    const nextPath = normalizePath(url.pathname)
    const nextHash = url.hash
    const currentUrl = `${locationState.path}${locationState.hash}`
    const targetUrl = `${nextPath}${nextHash}`

    if (currentUrl === targetUrl) {
      if (nextPath === '/') {
        scrollToHash(nextHash)
      }

      return
    }

    window.history.pushState({}, '', targetUrl)
    window.dispatchEvent(new Event('locationchange'))
  }

  const activePath = locationState.path === '/videos' ? '/videos' : '/'

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
      <SiteHeader onNavigate={handleNavigate} />
      {activePath === '/videos' ? <VideosPage /> : <HomePage />}
      <SiteFooter onNavigate={handleNavigate} />
    </div>
  )
}

export default App
