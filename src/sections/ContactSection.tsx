import { PlaceholderVisual } from '../components/PlaceholderVisual'
import { SectionIntro } from '../components/SectionIntro'
import { siteContent } from '../data/siteContent'

export function ContactSection() {
  const { contact } = siteContent

  return (
    <section id="contacto" className="px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
          <SectionIntro
            eyebrow="Contacto"
            title="Dejá un cierre simple, directo y accionable."
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
              <p className="mt-3 text-lg text-white">{contact.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                Email
              </p>
              <p className="mt-3 text-lg text-white">{contact.email}</p>
            </div>
          </div>
        </div>

        <PlaceholderVisual
          label="Acá iría un mapa, una foto de fachada o el logo"
          description="Podés reemplazar este bloque por un mapa embebido, una imagen real o un formulario simple cuando quieras avanzar a una segunda versión."
          className="min-h-full"
        />
      </div>
    </section>
  )
}
