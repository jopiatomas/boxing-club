import { SectionIntro } from '../components/SectionIntro'
import { siteContent } from '../data/siteContent'

export function ProgramsSection() {
  const { programs } = siteContent

  return (
    <section id="programas" className="bg-black/20 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Programas"
          title="Servicios separados por objetivo, no en un bloque genérico."
          description="La grilla está hecha para que cada tarjeta se pueda reutilizar después con datos reales, precios o botones propios. En proyectos laborales esto ayuda a mantener consistencia y escalar contenido."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {programs.map((program) => (
            <article
              key={program.name}
              className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 transition hover:-translate-y-1 hover:border-[var(--color-accent)]/45"
            >
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
                {program.level}
              </p>
              <h3 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] text-white">
                {program.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                {program.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
