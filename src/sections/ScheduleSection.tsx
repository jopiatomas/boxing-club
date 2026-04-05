import { SectionIntro } from "../components/SectionIntro";
import { siteContent } from "../data/siteContent";

export function ScheduleSection() {
  const { schedule } = siteContent;

  return (
    <section id="horarios" className="px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionIntro
            eyebrow="Horarios"
            title="Contamos con variedad de horarios."
            description="En lugar de una tabla HTML pesada, usé filas visuales con grid. Para una landing es más flexible y más fácil de estilizar con Tailwind."
          />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 md:p-6">
          {schedule.map((item) => (
            <div
              key={item.shift}
              className="grid gap-3 border-b border-white/10 px-4 py-5 last:border-b-0 md:grid-cols-[0.8fr_1fr_1.2fr] md:items-center"
            >
              <p className="font-display text-2xl uppercase tracking-[0.1em] text-white">
                {item.shift}
              </p>
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-accent)]">
                {item.hours}
              </p>
              <p className="text-sm leading-7 text-white/70 font-bold">
                {item.coach}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
