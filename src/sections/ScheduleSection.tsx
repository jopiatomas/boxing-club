import { SectionHeading } from "../components/ui/SectionHeading";
import { siteContent } from "../data/siteContent";

export function ScheduleSection() {
  const { schedule } = siteContent;

  return (
    <section id="horarios" aria-labelledby="titulo-horarios" className="bg-ink-950 py-16 md:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading id="titulo-horarios" eyebrow="Horarios" title="Elegí tu turno">
          Clases de lunes a viernes, a la mañana, a la tarde y a la noche.
        </SectionHeading>

        <table className="block w-full border-collapse text-left md:table">
          <caption className="sr-only">Turnos de entrenamiento y profesor a cargo</caption>
          <thead className="sr-only md:not-sr-only">
            <tr className="label text-subtle">
              <th scope="col" className="pb-3 font-semibold md:pr-4">Turno</th>
              <th scope="col" className="pb-3 font-semibold md:pr-4">Horario</th>
              <th scope="col" className="pb-3 font-semibold">Profe</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {schedule.map((item, index) => (
              <tr
                key={`${item.shift}-${item.hours}-${index}`}
                className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-ink-700 py-4 md:table-row md:py-0"
              >
                <th scope="row" className="heading row-span-2 w-24 text-2xl font-normal text-paper md:w-auto md:py-5 md:pr-4">
                  {item.shift}
                </th>
                <td className="font-condensed text-xl font-semibold tracking-wide text-celeste md:py-5 md:pr-4">
                  {item.hours}
                </td>
                <td className="text-muted md:py-5">{item.coach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
