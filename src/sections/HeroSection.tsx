import { PlaceholderVisual } from '../components/PlaceholderVisual'
import { siteContent } from '../data/siteContent'

export function HeroSection() {
  const { hero } = siteContent

  return (
    <section id="inicio" className="relative overflow-hidden px-6 pb-20 pt-12 lg:px-10 lg:pb-24 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(143,194,255,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.05),_transparent_28%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,18,38,0.82),rgba(7,18,38,0.46))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)]">
            {hero.eyebrow}
          </p>

          <h1 className="mt-6 max-w-4xl font-display text-5xl uppercase leading-[0.9] tracking-[0.08em] text-white md:text-7xl xl:text-[7rem]">
            {hero.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="#contacto"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-ink)] transition hover:bg-transparent hover:text-[var(--color-accent)]"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#programas"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)]"
            >
              {hero.secondaryCta}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {hero.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <img
              src="/gimnasio.jpeg"
              alt="Foto principal del gimnasio"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,38,0.08),rgba(7,18,38,0.58))]" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PlaceholderVisual
              label="Acá iría el logo"
              description="Podés reemplazar este bloque por tu isotipo, escudo o firma visual."
              className="min-h-[220px]"
            />
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                Mensaje de marca
              </p>
              <p className="mt-6 font-display text-3xl uppercase tracking-[0.12em] text-white">
                Entrenamiento con presencia.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Este bloque replica el estilo de “callout” que suelen usar sitios
                editoriales o deportivos para destacar una idea central.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
