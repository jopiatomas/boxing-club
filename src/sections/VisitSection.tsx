export function VisitSection() {
  return (
    <section id="visita" className="px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,194,255,0.18),transparent_34%)]" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)]">
                Seguí entrenando
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl uppercase leading-none tracking-[0.08em] text-white md:text-5xl">
                La sección de videos te deja seguir el ritmo del gimnasio.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/78">
                Ahí podés encontrar entrenamientos y guanteos ordenados para que
                sea más fácil volver a una clase, repasar técnica o mirar
                contenido del club.
              </p>

              <a
                href="/videos"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-ink)] transition hover:bg-transparent hover:text-[var(--color-accent)]"
              >
                Ir a sección videos
              </a>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:p-8 lg:p-10">
            <article className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
                Entrenamientos
              </p>
              <p className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-white">
                Repasá técnica y trabajos físicos.
              </p>
              <p className="mt-4 text-sm leading-6 text-white/68">
                Ideal para repetir movimientos, revisar fundamentos o sumar una
                rutina fuera del horario de clase.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
                Guanteos
              </p>
              <p className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-white">
                Mirá rounds reales del club.
              </p>
              <p className="mt-4 text-sm leading-6 text-white/68">
                Una forma simple de ver ritmo, decisiones y trabajo práctico
                dentro de la dinámica del gimnasio.
              </p>
            </article>

            <div className="rounded-[1.75rem] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/8 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                Acceso rápido
              </p>
              <p className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                Todo el material en un solo lugar.
              </p>
              <p className="mt-4 text-sm leading-6 text-white/68">
                Entrá a la sección y filtrá el contenido para encontrar más
                rápido lo que querés ver.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
