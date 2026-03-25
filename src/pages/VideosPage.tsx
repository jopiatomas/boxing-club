import { useState } from 'react'
import { siteContent } from '../data/siteContent'

function formatVideoDate(dateString: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${dateString}T12:00:00`))
}

function getThumbnailUrl(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
}

export function VideosPage() {
  const { trainingVideos, videosPage } = siteContent
  const [selectedMonth, setSelectedMonth] = useState('')

  const availableMonths = Array.from(
    new Set(trainingVideos.map((video) => video.publishedAt.slice(0, 7))),
  ).sort((a, b) => b.localeCompare(a))

  const visibleVideos = trainingVideos.filter((video) =>
    selectedMonth ? video.publishedAt.startsWith(selectedMonth) : true,
  )

  return (
    <main className="px-6 pb-24 pt-12 lg:px-10 lg:pb-28 lg:pt-16">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(143,194,255,0.12),rgba(255,255,255,0.03))] p-8 md:p-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)]">
              {videosPage.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[0.92] tracking-[0.08em] text-white md:text-6xl">
              {videosPage.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
              {videosPage.description}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--color-accent)]/20 bg-[rgba(9,20,37,0.55)] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/50">
              Criterio recomendado
            </p>
            <p className="mt-5 font-display text-3xl uppercase tracking-[0.1em] text-white">
              YouTube para publicar, tu app para ordenar.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/70">
              {videosPage.helper}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl">
        <div className="flex flex-col gap-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/50">
              Filtrar por fecha
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
              Videos publicados
            </h2>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <label className="text-xs uppercase tracking-[0.22em] text-white/60" htmlFor="month-filter">
              Mes de publicación
            </label>
            <div className="flex flex-wrap gap-3">
              <input
                id="month-filter"
                type="month"
                value={selectedMonth}
                min={availableMonths[availableMonths.length - 1]}
                max={availableMonths[0]}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="rounded-full border border-white/15 bg-[var(--color-ink-soft)] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--color-accent)]"
              />
              <button
                type="button"
                onClick={() => setSelectedMonth('')}
                className="rounded-full border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Ver todos
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm uppercase tracking-[0.22em] text-white/55">
          {visibleVideos.length} videos {selectedMonth ? 'en el mes seleccionado' : 'disponibles'}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleVideos.map((video) => (
            <article
              key={`${video.youtubeId}-${video.publishedAt}`}
              className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))]"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <img
                  src={getThumbnailUrl(video.youtubeId)}
                  alt={video.title}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
              </a>

              <div className="p-6">
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-white/55">
                  <span>{video.category}</span>
                  <span>{video.duration}</span>
                  <span>{formatVideoDate(video.publishedAt)}</span>
                </div>

                <h3 className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-white">
                  {video.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  {video.description}
                </p>

                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink)] transition hover:bg-transparent hover:text-[var(--color-accent)]"
                >
                  Ver en YouTube
                </a>
              </div>
            </article>
          ))}
        </div>

        {!visibleVideos.length ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
            <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">
              No hay videos para esa fecha.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Podés dejar el filtro vacío o cargar nuevos videos con la fecha de publicación correcta.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  )
}
