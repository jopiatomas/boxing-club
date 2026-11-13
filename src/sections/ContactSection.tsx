import { useState } from "react";
import { Icon, type IconName } from "../components/ui/Icon";
import { SectionHeading } from "../components/ui/SectionHeading";
import { siteContent } from "../data/siteContent";

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1675.3323569420622!2d-57.569770341474936!3d-38.007323405957486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584df00612b7091%3A0xc8fe06a0130c033b!2sGimnasio%20Pikiteam!5e0!3m2!1ses-419!2sar!4v1775363435721!5m2!1ses-419!2sar";

type ContactRowProps = {
  icon: IconName;
  label: string;
  value: string;
  href?: string;
};

function ContactRow({ icon, label, value, href }: ContactRowProps) {
  const content = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-ink-800 text-celeste transition-colors group-hover:bg-celeste group-hover:text-ink-900">
        <Icon name={icon} size={22} />
      </span>
      <span className="min-w-0">
        <span className="label block text-subtle">{label}</span>
        <span className="mt-1 block text-lg text-paper">{value}</span>
      </span>
      {href ? <Icon name="arrowRight" className="ml-auto shrink-0 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-celeste" /> : null}
    </>
  );

  return (
    <li className="border-t border-ink-700 last:border-b">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-4">
          {content}
          <span className="sr-only">(se abre en otra pestaña)</span>
        </a>
      ) : (
        <div className="flex items-center gap-4 py-4">{content}</div>
      )}
    </li>
  );
}

export function ContactSection() {
  const { contact } = siteContent;
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="contacto" aria-labelledby="titulo-contacto" className="bg-ink-950 py-16 md:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading id="titulo-contacto" eyebrow="Contacto" title="Vení a probar una clase">
            Escribinos por WhatsApp y te contamos cómo arrancar.
          </SectionHeading>

          <ul className="mt-8">
            <ContactRow icon="whatsapp" label="WhatsApp / Teléfono" value={contact.phone} href={contact.phoneHref} />
            <ContactRow icon="instagram" label="Instagram" value={contact.instagram} href={contact.instagramHref} />
            <ContactRow icon="pin" label="Dirección" value={`${contact.address}, ${contact.city}`} href={contact.mapsHref} />
            <ContactRow icon="clock" label="Horarios" value={contact.hours} />
          </ul>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[var(--radius-sm)] bg-ink-800 lg:min-h-full">
          {showMap ? (
            <iframe
              src={MAP_SRC}
              title="Mapa: ubicación del Gimnasio Pikiteam"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center [background-image:radial-gradient(var(--color-ink-700)_1px,transparent_1px)] [background-size:18px_18px]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-glove text-paper">
                <Icon name="pin" size={26} />
              </span>
              <p className="heading text-2xl text-paper">{contact.address}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowMap(true)}>
                  Ver mapa
                </button>
                <a href={contact.mapsHref} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  Cómo llegar
                  <Icon name="external" size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
