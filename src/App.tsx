import { useEffect, useState } from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { HomePage } from './pages/HomePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { VideosPage } from './pages/VideosPage'

const routes = [
  {
    path: '/',
    title: 'Piki Team · Gimnasio de boxeo en Mar del Plata',
    description:
      'Gimnasio de boxeo Piki Team en Mar del Plata. Horarios, contacto y videos de entrenamiento y guanteo del club.',
  },
  {
    path: '/videos',
    title: 'Videos · Piki Team',
    description:
      'Videos de entrenamiento, guanteo y exhibiciones del gimnasio de boxeo Piki Team en Mar del Plata.',
  },
  {
    path: '/privacidad',
    title: 'Política de privacidad · Piki Team',
    description:
      'Qué datos maneja el sitio de Piki Team, cómo usamos la API de YouTube y cómo ejercer tus derechos según la Ley 25.326.',
  },
]

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

  const activePath = routes.some((route) => route.path === locationState.path)
    ? locationState.path
    : '/'
  const route = routes.find((item) => item.path === activePath) ?? routes[0]

  useEffect(() => {
    document.title = route.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', route.description)
  }, [route])

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader activePath={activePath} onNavigate={handleNavigate} />
      {activePath === '/videos' ? (
        <VideosPage />
      ) : activePath === '/privacidad' ? (
        <PrivacyPage />
      ) : (
        <HomePage onNavigate={handleNavigate} />
      )}
      <SiteFooter onNavigate={handleNavigate} />
    </>
  )
}

export default App
