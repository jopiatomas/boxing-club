import { SectionIntro } from '../components/SectionIntro'
import { siteContent } from '../data/siteContent'

export function StorySection() {
  const { stats, story } = siteContent

  return (
    <section id="metodo" className="px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Manifiesto
          </p>
          <p className="mt-6 font-display text-4xl uppercase leading-tight tracking-[0.08em] text-white">
            {story.quote}
          </p>
        </div>

        <div>
          <SectionIntro
            eyebrow={story.eyebrow}
            title={story.title}
            description={story.description}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <article
                key={stat.value}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="font-display text-5xl uppercase tracking-[0.12em] text-white">
                  {stat.value}
                </p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                  {stat.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {stat.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
