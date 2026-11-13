import { Photo } from "../components/ui/Photo";
import { SectionHeading } from "../components/ui/SectionHeading";

export function SpaceSection() {
  return (
    <section id="espacio" aria-labelledby="titulo-espacio" className="py-16 md:py-24">
      <div className="container-x">
        <SectionHeading id="titulo-espacio" eyebrow="Espacio y equipo" title="Un gimnasio de boxeo de verdad">
          Ring, bolsas y equipamiento real de entrenamiento.
        </SectionHeading>

        <div className="mt-10 grid gap-4 md:grid-cols-[1.5fr_1fr] md:gap-5">
          <figure className="relative overflow-hidden rounded-[var(--radius-sm)] bg-ink-800">
            <Photo
              name="fachada"
              sizes="(min-width: 768px) 60vw, 100vw"
              alt="Frente del gimnasio: portón pintado con el logo Gimnasio Pikiteam Boxeo y guantes rojos colgados"
              className="aspect-[4/3] h-full w-full object-cover md:aspect-auto"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-5 pt-16">
              <p className="label text-celeste">La puerta</p>
              <p className="heading mt-1 text-2xl text-paper">Rodriguez Peña 3755</p>
            </figcaption>
          </figure>

          <figure className="relative overflow-hidden rounded-[var(--radius-sm)] bg-ink-800">
            <Photo
              name="piki"
              sizes="(min-width: 768px) 40vw, 100vw"
              alt="El entrenador “Piki” Delacroix sentado en un banco frente al gimnasio"
              className="aspect-[4/5] h-full w-full object-cover object-[center_70%]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-5 pt-16">
              <p className="label text-celeste">Entrenador</p>
              <p className="heading mt-1 text-[2.5rem] leading-none text-paper">“Piki” Delacroix</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
