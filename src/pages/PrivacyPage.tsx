import type { ReactNode } from "react";

const CONTACT_EMAIL = "tomasjopiaf@gmail.com";
const LAST_UPDATED = "16 de noviembre de 2026";
const LAST_UPDATED_ISO = "2026-11-16";

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="break-words text-celeste underline decoration-celeste/40 underline-offset-4 transition-colors hover:decoration-celeste"
    >
      {children}
    </a>
  );
}

function MailLink() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="break-words text-celeste underline decoration-celeste/40 underline-offset-4 transition-colors hover:decoration-celeste"
    >
      {CONTACT_EMAIL}
    </a>
  );
}

type PolicySectionProps = {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
};

function PolicySection({ id, number, title, children }: PolicySectionProps) {
  return (
    <section aria-labelledby={id} className="border-t border-ink-700 pt-10">
      <h2 id={id} className="heading flex items-baseline gap-3 text-subtitle text-paper">
        <span className="label text-base text-celeste" aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
        {title}
      </h2>
      <div className="policy-body mt-5">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <main id="contenido" className="flex-1">
      <article className="container-x max-w-3xl py-14 md:py-20">
        <header>
          <p className="label text-celeste">Piki Team · Legal</p>
          <h1 className="heading mt-3 text-title text-paper">Política de privacidad</h1>
          <div className="ropes mt-5 w-20" aria-hidden="true">
            <span />
          </div>
          <p className="mt-5 text-muted">
            Última actualización: <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED}</time>
          </p>
          <p className="mt-5 text-lg text-muted">
            Esta política explica qué datos personales maneja el sitio pikiteam.com.ar, para qué los usamos, con quién
            los compartimos y cómo podés ejercer tus derechos. Tratamos de que sea corta y clara: el sitio guarda muy
            pocos datos, y acá están todos.
          </p>
        </header>

        <div className="mt-12 grid gap-10">
          <PolicySection id="quienes-somos" number={1} title="Quiénes somos y cómo contactarnos">
            <p>
              Piki Team es un gimnasio de boxeo ubicado en Rodriguez Peña 3755, Mar del Plata, Argentina. El
              responsable del sitio y de los datos que se tratan en él es <strong>Tomás Jopia</strong>.
            </p>
            <p>
              Para cualquier consulta sobre esta política o sobre tus datos, escribinos a <MailLink />.
            </p>
          </PolicySection>

          <PolicySection id="datos" number={2} title="Qué datos recolectamos y para qué">
            <h3>Si visitás el sitio</h3>
            <p>
              Para ver el sitio no tenés que crear una cuenta ni dejarnos ningún dato. No hay formularios, no usamos
              herramientas de analítica ni de publicidad y no te pedimos que inicies sesión con Google ni con ninguna otra
              cuenta.
            </p>
            <p>
              Los botones de WhatsApp, Instagram y Google Maps te llevan a esos servicios. Lo que hagas ahí (por ejemplo,
              mandarnos un mensaje) queda sujeto a las políticas de privacidad de cada uno.
            </p>
            <p>
              Como cualquier página web, para mostrarte el sitio tu navegador se conecta con los servidores de nuestros
              proveedores (ver la sección 4). Esos servidores reciben datos técnicos como tu dirección IP, el tipo de
              navegador y la página que pediste, y los usan para entregarte el contenido y proteger el sitio de ataques.
              Nosotros no usamos esos datos para identificarte.
            </p>

            <h3>Si sos profesor del gimnasio</h3>
            <p>
              El sitio tiene un panel privado para que los profesores suban y borren videos. No hay registro abierto:
              las cuentas las creamos nosotros. De cada profesor guardamos:
            </p>
            <ul>
              <li>Nombre y correo electrónico, para identificarlo al iniciar sesión.</li>
              <li>
                Contraseña, guardada cifrada (con un algoritmo de un solo sentido, así que ni nosotros podemos leerla).
              </li>
              <li>Su rol, para saber que puede usar el panel.</li>
            </ul>
            <p>
              Al iniciar sesión, el navegador guarda un código de sesión para que no tengas que volver a ingresar la
              contraseña cada vez (ver la sección 7).
            </p>

            <h3>Videos del gimnasio</h3>
            <p>
              Cuando un profesor sube un video, el archivo pasa por nuestro servidor solo de forma temporal: se envía a
              YouTube y se borra de inmediato del servidor, tanto si la subida sale bien como si falla. Lo que sí
              guardamos es la información para mostrarlo en el sitio: título, descripción, tipo de entrenamiento,
              categoría, fecha, duración, nombre y tamaño del archivo original, el identificador del video en YouTube y
              qué profesor lo subió.
            </p>
            <p>
              Los videos muestran entrenamientos, guanteos y exhibiciones, así que pueden aparecer alumnos y otras
              personas del gimnasio, y se publican de forma pública en el canal de YouTube del gimnasio. Si aparecés en
              un video y querés que lo saquemos, escribinos a <MailLink /> y lo bajamos.
            </p>
          </PolicySection>

          <PolicySection id="youtube" number={3} title="Uso de los servicios de la API de YouTube">
            <p>
              Este sitio usa los servicios de la API de YouTube para publicar los videos del gimnasio. Al usar las
              funciones del sitio que dependen de YouTube (por ejemplo, reproducir un video), aceptás los{" "}
              <ExternalLink href="https://www.youtube.com/t/terms">Términos del Servicio de YouTube</ExternalLink>, y se
              aplica la{" "}
              <ExternalLink href="https://policies.google.com/privacy">Política de Privacidad de Google</ExternalLink>.
            </p>

            <h3>Para qué usamos el acceso a la cuenta de Google</h3>
            <p>
              El gimnasio autorizó a este sitio a acceder a su propia cuenta de Google con un único permiso: subir
              videos a YouTube. Ese acceso se usa <strong>solamente para subir videos al canal de YouTube del
              gimnasio</strong>, cuando un profesor lo pide desde el panel. No usamos los datos de esa cuenta para ningún
              otro fin: no leemos comentarios, estadísticas, suscriptores ni ningún otro dato del canal o de la cuenta.
            </p>
            <p>
              El acceso es solo a la cuenta del gimnasio. A los visitantes y a los profesores nunca les pedimos que
              conecten su cuenta de Google.
            </p>

            <h3>Qué información de Google guardamos</h3>
            <ul>
              <li>
                Una credencial de acceso que entrega Google, guardada de forma privada en la configuración de nuestro
                servidor. Nunca se envía al navegador ni se comparte.
              </li>
              <li>
                El identificador que YouTube le asigna a cada video subido, para poder mostrarlo en el sitio.
              </li>
            </ul>

            <h3>Uso Limitado</h3>
            <p>
              El uso que hace este sitio de la información recibida de las APIs de Google cumple con la{" "}
              <ExternalLink href="https://developers.google.com/terms/api-services-user-data-policy">
                Política de Datos de Usuario de los Servicios de API de Google
              </ExternalLink>
              , incluidos los requisitos de Uso Limitado. En concreto: esa información no se vende, no se transfiere a
              terceros, no se usa para publicidad y no se usa para nada distinto de subir los videos del gimnasio.
            </p>

            <h3>Cómo revocar el acceso</h3>
            <p>
              El titular de la cuenta de Google puede quitarle el acceso a este sitio en cualquier momento desde{" "}
              <ExternalLink href="https://myaccount.google.com/connections">
                myaccount.google.com/connections
              </ExternalLink>
              . A partir de ese momento el sitio deja de poder subir videos. Los videos ya publicados siguen en el canal
              hasta que se borren desde YouTube.
            </p>
          </PolicySection>

          <PolicySection id="compartir" number={4} title="Con quién compartimos los datos">
            <p>
              <strong>No vendemos ni alquilamos tus datos.</strong> Solo los procesan los proveedores que necesitamos para
              que el sitio funcione, y únicamente para eso:
            </p>
            <ul>
              <li>
                <strong>Vercel</strong>: aloja las páginas del sitio.
              </li>
              <li>
                <strong>Cloudflare</strong>: gestiona el dominio y protege el sitio; recibe los datos técnicos de cada
                visita.
              </li>
              <li>
                <strong>Render</strong>: aloja el servidor que maneja el inicio de sesión y la subida de videos.
              </li>
              <li>
                <strong>Supabase</strong>: aloja la base de datos donde están las cuentas de los profesores y la
                información de los videos.
              </li>
              <li>
                <strong>Google</strong>: YouTube aloja y reproduce los videos, Google Fonts sirve las tipografías del
                sitio y Google Maps muestra el mapa del gimnasio.
              </li>
            </ul>
            <p>
              Algunos de estos proveedores guardan la información en servidores fuera de Argentina (por ejemplo, en Brasil
              o en Estados Unidos). Solo entregaríamos datos a otra persona u organismo si una ley o una orden judicial
              nos obligara.
            </p>
          </PolicySection>

          <PolicySection id="conservacion" number={5} title="Cuánto tiempo guardamos los datos y cómo los protegemos">
            <h3>Cuánto tiempo</h3>
            <ul>
              <li>
                <strong>Cuentas de profesores</strong>: mientras la persona dé clases en el gimnasio, o hasta que pida que
                la borremos.
              </li>
              <li>
                <strong>Sesión en el navegador</strong>: vence a los 7 días o cuando el profesor cierra sesión, lo que
                pase primero.
              </li>
              <li>
                <strong>Archivo de video en nuestro servidor</strong>: solo durante la subida; después se borra.
              </li>
              <li>
                <strong>Información de cada video</strong>: mientras el video esté publicado en el sitio. Al borrarlo
                desde el panel, se elimina de nuestra base de datos.
              </li>
              <li>
                <strong>Datos técnicos de las visitas</strong>: los conservan nuestros proveedores según sus propias
                políticas.
              </li>
            </ul>

            <h3>Cómo los protegemos</h3>
            <ul>
              <li>Todo el tráfico del sitio viaja cifrado (HTTPS).</li>
              <li>Las contraseñas se guardan cifradas y nunca en texto plano.</li>
              <li>El panel de videos solo funciona para cuentas de profesor; no hay registro público.</li>
              <li>
                Las credenciales de Google y de la base de datos están solo en el servidor, nunca en el navegador ni en
                el código público.
              </li>
            </ul>
          </PolicySection>

          <PolicySection id="derechos" number={6} title="Tus derechos">
            <p>
              Según la Ley 25.326 de Protección de Datos Personales de Argentina, tenés derecho a:
            </p>
            <ul>
              <li>
                <strong>Acceso</strong>: saber qué datos tuyos tenemos.
              </li>
              <li>
                <strong>Rectificación y actualización</strong>: pedir que corrijamos datos equivocados o desactualizados.
              </li>
              <li>
                <strong>Supresión</strong>: pedir que borremos tus datos, incluido un video en el que aparezcas.
              </li>
            </ul>
            <p>
              Para ejercerlos, escribinos a <MailLink /> contándonos qué necesitás. Te vamos a responder dentro de los
              plazos que fija la ley: 10 días corridos para los pedidos de acceso y 5 días hábiles para los de
              rectificación, actualización o supresión.
            </p>
            <p>
              El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
              gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto,
              conforme lo establecido en el artículo 14, inciso 3 de la Ley 25.326.
            </p>
            <p>
              La{" "}
              <ExternalLink href="https://www.argentina.gob.ar/aaip">
                Agencia de Acceso a la Información Pública (AAIP)
              </ExternalLink>
              , en su carácter de Órgano de Control de la Ley 25.326, tiene la atribución de atender las denuncias y
              reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas
              vigentes en materia de protección de datos personales.
            </p>
          </PolicySection>

          <PolicySection id="cookies" number={7} title="Cookies y almacenamiento en el navegador">
            <p>
              Este sitio <strong>no usa cookies propias</strong>, ni de analítica ni de publicidad.
            </p>
            <p>
              Lo único que guardamos en tu navegador es el código de sesión de los profesores, en el almacenamiento local
              del navegador. Solo existe si iniciaste sesión en el panel y se borra al cerrar sesión. Si sos visitante,
              no guardamos nada.
            </p>
            <p>
              Google puede poner sus propias cookies si tocás "Ver mapa" o reproducís un video, porque en ese momento se
              carga contenido de Google Maps o de YouTube. Hasta que no lo hacés, el mapa y los reproductores no se
              cargan. Para los videos usamos el modo de privacidad mejorada de YouTube. Esas cookies se rigen por la{" "}
              <ExternalLink href="https://policies.google.com/privacy">Política de Privacidad de Google</ExternalLink>.
            </p>
          </PolicySection>

          <PolicySection id="cambios" number={8} title="Cambios a esta política">
            <p>
              Si cambiamos la forma en que tratamos los datos, vamos a actualizar esta página y la fecha de "Última
              actualización" de arriba. Te recomendamos revisarla cada tanto.
            </p>
            <p>
              Última actualización: <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED}</time>.
            </p>
          </PolicySection>
        </div>
      </article>
    </main>
  );
}
