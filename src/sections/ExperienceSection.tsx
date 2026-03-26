import { PlaceholderVisual } from "../components/PlaceholderVisual";
import { SectionIntro } from "../components/SectionIntro";
import { siteContent } from "../data/siteContent";

export function ExperienceSection() {
  const { experience } = siteContent;

  return (
    <section id="espacio" className="bg-black/20 px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Espacio y marca"
          title="Bloques listos para fotos, logo y material real."
          description="En vez de dejar divs vacíos, armé placeholders con el mismo peso visual que tendrían los contenidos reales. Eso te permite maquetar ahora y reemplazar después sin romper el diseño."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <PlaceholderVisual
            label={experience[0].title}
            description={experience[0].description}
            tone={experience[0].tone}
            className="min-h-[420px]"
          />

          <div className="grid gap-6">
            {experience.slice(1).map((item) => (
              <PlaceholderVisual
                key={item.title}
                label={item.title}
                description={item.description}
                tone={item.tone}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
