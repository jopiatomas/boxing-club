import { SectionIntro } from "../components/SectionIntro";

export function ExperienceSection() {
  return (
    <section id="espacio" className="bg-black/20 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Espacio y equipo" title="" description="" />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="group relative min-h-[460px] overflow-hidden rounded-[2rem] border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <img
              src="/gimnasio.jpeg"
              alt="Interior del gimnasio Piki Team"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,38,0.06),rgba(7,18,38,0.78))]" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-accent)]">
                Adentro del gimnasio
              </p>
              <p className="mt-3 max-w-lg font-display text-3xl uppercase tracking-[0.1em] text-white sm:text-4xl">
                Ring, bolsas y equipamiento real de entrenamiento.
              </p>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="group relative min-h-[220px] overflow-hidden rounded-[2rem] border border-white/12 bg-white/5 shadow-[0_20px_45px_rgba(0,0,0,0.24)]">
              <img
                src="/Gimnasio-Afuera.jpeg"
                alt="Frente del gimnasio Piki Team"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,38,0.1),rgba(7,18,38,0.74))]" />
            </article>

            <article className="group relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/12 bg-white/5 shadow-[0_20px_45px_rgba(0,0,0,0.24)]">
              <img
                src="/Foto Piki.jpeg"
                alt='Entrenador "Piki" frente al gimnasio'
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,38,0.04),rgba(7,18,38,0.72))]" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-accent)]">
                  Entrenador
                </p>
                <p className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">
                  Piki
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
