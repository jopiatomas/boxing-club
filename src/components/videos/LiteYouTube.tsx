import { useState } from 'react'
import { resolveMediaUrl, type ApiVideo } from '../../lib/api'
import { Icon } from '../ui/Icon'

type LiteYouTubeProps = {
  video: ApiVideo
  /** Si está activo se muestra el iframe; si no, solo la miniatura. */
  active: boolean
  onActivate: () => void
  priority?: boolean
  size?: 'md' | 'lg'
}

function buildPlayerUrl(embedUrl: string) {
  const base = resolveMediaUrl(embedUrl)
  return `${base}${base.includes('?') ? '&' : '?'}autoplay=1&playsinline=1`
}

/**
 * "Lite embed": muestra la miniatura de YouTube y recién al tocar Play carga el
 * iframe real (que pesa ~1 MB). Así la biblioteca carga rápido aunque tenga
 * muchos videos.
 */
export function LiteYouTube({ video, active, onActivate, priority = false, size = 'md' }: LiteYouTubeProps) {
  const [thumbFailed, setThumbFailed] = useState(false)
  const playable = video.provider === 'youtube' && Boolean(video.embedUrl)

  if (!playable) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-ink-950 text-center text-muted">
        <Icon name="video" size={28} />
        <span className="label">Video no disponible</span>
      </div>
    )
  }

  if (active) {
    return (
      <div className="aspect-video w-full bg-black">
        <iframe
          src={buildPlayerUrl(video.embedUrl as string)}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onActivate}
      className="group relative block aspect-video w-full overflow-hidden bg-ink-950 focus-visible:outline-offset-[-3px]"
      aria-label={`Reproducir: ${video.title}`}
    >
      {video.thumbnailUrl && !thumbFailed ? (
        <img
          src={video.thumbnailUrl}
          alt=""
          width={480}
          height={360}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setThumbFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-ink-800">
          <span className="label text-subtle">Procesando en YouTube…</span>
        </span>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" aria-hidden="true" />
      <span
        className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-celeste text-ink-900 shadow-[0_8px_30px_rgb(0_0_0/0.45)] transition-transform duration-200 group-hover:scale-110 ${
          size === 'lg' ? 'h-20 w-20' : 'h-14 w-14'
        }`}
        aria-hidden="true"
      >
        <Icon name="play" size={size === 'lg' ? 34 : 24} className="ml-1" />
      </span>
      {video.durationLabel ? (
        <span className="label absolute bottom-2 right-2 rounded-[var(--radius-xs)] bg-ink-950/85 px-2 py-1 text-paper">
          {video.durationLabel}
        </span>
      ) : null}
    </button>
  )
}
