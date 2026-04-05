import { SectionIntro } from "../components/SectionIntro";
import { siteContent } from "../data/siteContent";

export function ContactSection() {
  const { contact } = siteContent;

  return (
    <section id="contacto" className="px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
          <SectionIntro
            eyebrow="Contacto"
            title="No dudes en contactarnos!"
            description="El objetivo de esta sección es convertir visitas en consultas. Por eso hay pocos datos, alto contraste y dos columnas muy claras."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                Dirección
              </p>
              <p className="mt-3 text-lg text-white">{contact.address}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                Horarios
              </p>
              <p className="mt-3 text-lg text-white">{contact.hours}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                WhatsApp / Teléfono
              </p>
              <a
                href={contact.phoneHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-lg text-white transition hover:text-[#d4a24c]"
              >
                {contact.phone}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                Instagram
              </p>
              <a
                href={contact.instagramHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-lg text-white transition hover:text-[#d4a24c]"
              >
                {contact.instagram}
              </a>
            </div>
          </div>
        </div>

        <div className="min-h-[320px] flex-1 overflow-hidden rounded-[1.5rem] border border-white/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1675.3323569420622!2d-57.569770341474936!3d-38.007323405957486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584df00612b7091%3A0xc8fe06a0130c033b!2sGimnasio%20Pikiteam!5e0!3m2!1ses-419!2sar!4v1775363435721!5m2!1ses-419!2sar"
            title="Mapa de Gimnasio Pikiteam"
            className="h-full min-h-[320px] w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
