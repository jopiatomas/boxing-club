import type { ApiVideo } from '../../lib/api'
import { resolveMediaUrl } from '../../lib/api'
import { formatLongDate, formatShortDate, isRecent } from '../../lib/dates'
import { Icon } from '../ui/Icon'
import { LiteYouTube } from './LiteYouTube'
import { NewBadge, TypeBadge } from './TypeBadge'

type VideoCardProps = {
  video: ApiVideo
  active: boolean
  onPlay: () => void
  onDelete?: () => void
  featured?: boolean
  headingLevel?: 'h2' | 'h3'
}

function Meta({ video, long }: { video: ApiVideo; long?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <TypeBadge type={video.trainingType} />
      <time dateTime={video.publishedAt} className="label text-muted">
        {long ? formatLongDate(video.publishedAt) : formatShortDate(video.publishedAt)}
      </time>
      {video.category ? <span className="label text-subtle">{video.category}</span> : null}
    </div>
  )
}

function Actions({ video, onDelete }: { video: ApiVideo; onDelete?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <a
        href={resolveMediaUrl(video.watchUrl)}
        target="_blank"
        rel="noreferrer"
        className="btn btn-ghost btn-sm -ml-3"
      >
        <Icon name="external" size={16} />
        YouTube
        <span className="sr-only">(se abre en otra pestaña)</span>
      </a>
      {onDelete ? (
        <button type="button" onClick={onDelete} className="btn btn-ghost btn-sm text-glove-soft hover:text-glove-soft">
          <Icon name="trash" size={16} />
          Borrar
          <span className="sr-only">{video.title}</span>
        </button>
      ) : null}
    </div>
  )
}

export function VideoCard({ video, active, onPlay, onDelete, featured = false, headingLevel = 'h3' }: VideoCardProps) {
  const Heading = headingLevel

  if (featured) {
    return (
      <article className="grid overflow-hidden rounded-[var(--radius-sm)] bg-ink-800 lg:grid-cols-[1.7fr_1fr]">
        <LiteYouTube video={video} active={active} onActivate={onPlay} priority size="lg" />
        <div className="flex flex-col gap-4 border-t-4 border-celeste p-5 sm:p-7 lg:border-l-4 lg:border-t-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="label text-celeste">Lo último</span>
            {isRecent(video.publishedAt) ? <NewBadge /> : null}
          </div>
          <Heading className="heading text-subtitle text-paper sm:text-[2.5rem]">{video.title}</Heading>
          <Meta video={video} long />
          {video.description ? <p className="line-clamp-4 text-muted">{video.description}</p> : null}
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            {!active ? (
              <button type="button" onClick={onPlay} className="btn btn-primary">
                <Icon name="play" size={18} />
                Ver ahora
              </button>
            ) : null}
            <Actions video={video} onDelete={onDelete} />
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-sm)] bg-ink-800 transition-colors hover:bg-ink-700/70">
      <LiteYouTube video={video} active={active} onActivate={onPlay} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Meta video={video} />
        <Heading className="heading text-[1.5rem] leading-tight text-paper">{video.title}</Heading>
        {video.description ? <p className="line-clamp-2 text-[0.9375rem] text-muted">{video.description}</p> : null}
        <div className="mt-auto pt-1">
          <Actions video={video} onDelete={onDelete} />
        </div>
      </div>
    </article>
  )
}

export function VideoCardSkeleton({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="grid overflow-hidden rounded-[var(--radius-sm)] bg-ink-800 lg:grid-cols-[1.7fr_1fr]" aria-hidden="true">
        <div className="skeleton aspect-video rounded-none" />
        <div className="flex flex-col gap-4 p-5 sm:p-7">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-10 w-4/5" />
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton mt-4 h-12 w-36" />
        </div>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-[var(--radius-sm)] bg-ink-800" aria-hidden="true">
      <div className="skeleton aspect-video rounded-none bg-ink-700" />
      <div className="flex flex-col gap-3 p-4">
        <div className="skeleton h-5 w-2/5 bg-ink-700" />
        <div className="skeleton h-7 w-3/4 bg-ink-700" />
      </div>
    </div>
  )
}
