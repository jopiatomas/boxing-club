import { useCallback, useEffect, useRef, useState } from 'react'
import { listVideos, type ApiVideo } from '../lib/api'
import { friendlyLoadError } from '../lib/errors'

type Status = 'loading' | 'ready' | 'error'

/** Tiempo tras el cual avisamos que el servidor (Render) puede estar despertando. */
const SLOW_AFTER_MS = 6000

// Caché simple en memoria para no volver a mostrar skeletons al navegar entre páginas
let cachedVideos: ApiVideo[] | null = null

function sortVideos(videos: ApiVideo[]) {
  return [...videos].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.createdAt.localeCompare(a.createdAt),
  )
}

export function useVideos() {
  const [videos, setVideosState] = useState<ApiVideo[]>(() => cachedVideos ?? [])
  const [status, setStatus] = useState<Status>(cachedVideos ? 'ready' : 'loading')
  const [error, setError] = useState<string | null>(null)
  const [isSlow, setIsSlow] = useState(false)
  const requestId = useRef(0)

  const setVideos = useCallback((updater: (current: ApiVideo[]) => ApiVideo[]) => {
    setVideosState((current) => {
      const next = sortVideos(updater(current))
      cachedVideos = next
      return next
    })
  }, [])

  const load = useCallback(async (options: { silent?: boolean } = {}) => {
    const id = ++requestId.current
    if (!options.silent) {
      setStatus('loading')
      setError(null)
    }
    setIsSlow(false)
    const slowTimer = window.setTimeout(() => {
      if (id === requestId.current) setIsSlow(true)
    }, SLOW_AFTER_MS)

    try {
      const response = await listVideos()
      if (id !== requestId.current) return
      const sorted = sortVideos(response.videos)
      cachedVideos = sorted
      setVideosState(sorted)
      setStatus('ready')
      setError(null)
    } catch (loadError) {
      if (id !== requestId.current) return
      // Si ya teníamos videos, una recarga silenciosa fallida no rompe la pantalla
      if (!options.silent || !cachedVideos) {
        setStatus('error')
        setError(friendlyLoadError(loadError))
      }
    } finally {
      window.clearTimeout(slowTimer)
      if (id === requestId.current) setIsSlow(false)
    }
  }, [])

  useEffect(() => {
    void load({ silent: Boolean(cachedVideos) })
    return () => {
      requestId.current += 1
    }
  }, [load])

  return { videos, status, error, isSlow, reload: load, setVideos }
}
