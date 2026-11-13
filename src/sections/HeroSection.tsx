import { AppLink } from "../components/AppLink";
import { Icon } from "../components/ui/Icon";
import { Photo } from "../components/ui/Photo";
import { siteContent } from "../data/siteContent";

type HeroSectionProps = {
  onNavigate: (href: string) => void;
};

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { contact, motto } = siteContent;

  return (
    <section aria-labelledby="titulo-inicio" className="relative isolate overflow-hidden bg-ink-950">
      <Photo
        name="gimnasio"
        priority
        sizes="100vw"
        alt="Interior del gimnasio Piki Team: ring con cuerdas, bolsas colgadas y el mural “Borrá de tu mente el no puedo”"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[30%_center] opacity-70"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/20 md:bg-gradient-to-r md:from-ink-950 md:via-ink-950/75 md:to-transparent"
        aria-hidden="true"
      />

      <div className="container-x flex min-h-[78svh] flex-col justify-end pb-12 pt-32 md:min-h-[86svh] md:justify-center md:pb-20">
        <p className="label text-celeste">
          Gimnasio de boxeo · {contact.city}
        </p>
        <h1 id="titulo-inicio" className="heading mt-3 text-hero text-paper">
          Piki
          <br />
          Team
        </h1>
        <p className="mt-5 max-w-md font-condensed text-2xl font-semibold uppercase leading-tight tracking-wide text-cream">
          {motto}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={contact.phoneHref} target="_blank" rel="noreferrer" className="btn btn-primary">
            <Icon name="whatsapp" size={20} />
            Consultá por WhatsApp
          </a>
          <AppLink href="/videos" onNavigate={onNavigate} className="btn btn-secondary">
            <Icon name="play" size={18} />
            Ver videos del club
          </AppLink>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-muted">
          <li className="inline-flex items-center gap-2">
            <Icon name="clock" size={18} className="text-celeste" />
            Turnos mañana, tarde y noche
          </li>
          <li className="inline-flex items-center gap-2">
            <Icon name="pin" size={18} className="text-celeste" />
            {contact.address}
          </li>
        </ul>
      </div>

      <div className="ropes" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
