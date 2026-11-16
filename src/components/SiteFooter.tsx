import { siteContent } from "../data/siteContent";
import { AppLink } from "./AppLink";
import { Logo } from "./Logo";
import { Icon } from "./ui/Icon";

type SiteFooterProps = {
  onNavigate: (href: string) => void;
};

export function SiteFooter({ onNavigate }: SiteFooterProps) {
  const { contact, navigation } = siteContent;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink-950">
      <div className="ropes" aria-hidden="true">
        <span />
      </div>
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex items-start gap-4">
          <Logo size={64} className="h-16 w-auto" />
          <div>
            <p className="heading text-3xl text-paper">Piki Team</p>
            <p className="mt-1 text-muted">
              Gimnasio de boxeo · {contact.city}
            </p>
            <p className="label mt-4 text-cream">{siteContent.motto}</p>
          </div>
        </div>

        <nav aria-label="Pie de página">
          <p className="label text-subtle">Secciones</p>
          <ul className="mt-3 grid gap-2">
            {[...navigation, { label: "Videos", href: "/videos" }].map((item) => (
              <li key={item.href}>
                <AppLink href={item.href} onNavigate={onNavigate} className="text-muted transition-colors hover:text-celeste">
                  {item.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label text-subtle">Contacto</p>
          <ul className="mt-3 grid gap-2 text-muted">
            <li>
              <a href={contact.phoneHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-celeste">
                <Icon name="whatsapp" size={18} /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.instagramHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-celeste">
                <Icon name="instagram" size={18} /> {contact.instagram}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Icon name="pin" size={18} /> {contact.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <div className="container-x flex flex-col gap-2 py-5 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Piki Team. Todos los derechos reservados.</p>
          <AppLink href="/privacidad" onNavigate={onNavigate} className="underline-offset-4 transition-colors hover:text-celeste hover:underline">
            Política de privacidad
          </AppLink>
        </div>
      </div>
    </footer>
  );
}
