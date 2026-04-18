import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { LegalSection } from '@/components/legal/LegalSection';

const pageSeo = {
  title: 'Términos y Condiciones — Renty',
  description:
    'Términos y condiciones de uso de la plataforma Renty. Conoce tus derechos y obligaciones al utilizar nuestros servicios de scoring alternativo para arriendo en Colombia.',
  path: '/legal/terminos',
  ogSlug: 'legal-terminos',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Legal', url: '/legal/terminos' },
  { name: 'Términos y condiciones', url: '/legal/terminos' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })} id="ld-webpage" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
      <LegalPageShell
        eyebrow="Documento legal"
        title="Términos y Condiciones de Uso"
        summary="Las reglas que rigen el uso de la plataforma Renty. Lee este documento antes de registrarte o contratar cualquiera de nuestros servicios."
        updatedAt="2026-04-15"
        version="v1.0"
      >
        <LegalSection title="1. Definiciones">
          <p>Para los efectos de los presentes Términos y Condiciones, los siguientes términos tendrán el significado que a continuación se les asigna:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong className="text-ink">Plataforma:</strong> el sitio web rentyco.app y cualquier aplicación móvil o herramienta digital operada por Renty SAS.</li>
            <li><strong className="text-ink">Usuario:</strong> toda persona natural o jurídica que acceda, se registre o utilice los servicios de la Plataforma, ya sea en calidad de arrendatario potencial o arrendador.</li>
            <li><strong className="text-ink">Renty Score:</strong> puntuación alternativa de perfil arrendatario generada por Renty a partir de fuentes de datos autorizadas por el Usuario, que complementa —pero no sustituye— la información de las centrales de riesgo.</li>
            <li><strong className="text-ink">Servicios:</strong> el conjunto de funcionalidades ofrecidas a través de la Plataforma, incluyendo la generación del Renty Score, la conexión entre arrendatarios y arrendadores, y las herramientas de gestión de arriendo.</li>
            <li><strong className="text-ink">Contenido:</strong> cualquier texto, imagen, dato, gráfico, marca, logotipo, interfaz o código fuente disponible en la Plataforma.</li>
          </ul>
        </LegalSection>

        <LegalSection title="2. Uso de la Plataforma">
          <p>El acceso y uso de la Plataforma implica la aceptación plena e incondicional de estos Términos y Condiciones, así como de la Política de Privacidad y la Política de Tratamiento de Datos de Renty. Si usted no está de acuerdo con alguna de estas condiciones, deberá abstenerse de utilizar la Plataforma.</p>
          <p>La Plataforma está destinada exclusivamente a personas mayores de dieciocho (18) años con capacidad legal para celebrar contratos en la República de Colombia. Renty se reserva el derecho de suspender o cancelar cuentas de usuarios que no cumplan con este requisito.</p>
          <p>El Usuario se compromete a utilizar la Plataforma de buena fe, con fines lícitos y de conformidad con la legislación colombiana vigente, incluyendo la Ley 820 de 2003 sobre arrendamiento de vivienda urbana y el Estatuto del Consumidor (Ley 1480 de 2011).</p>
        </LegalSection>

        <LegalSection title="3. Registro de Usuario">
          <p>Para acceder a determinados Servicios, el Usuario deberá completar el proceso de registro proporcionando información veraz, completa y actualizada. El Usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta.</p>
          <p>Renty se reserva el derecho de verificar la identidad del Usuario mediante los mecanismos que considere pertinentes, incluyendo la validación de documento de identidad, correo electrónico y número de teléfono celular.</p>
          <p>El Usuario deberá notificar de manera inmediata a Renty cualquier uso no autorizado de su cuenta o cualquier otra vulneración de seguridad de la que tenga conocimiento, a través del correo electrónico soporte@rentyco.app.</p>
        </LegalSection>

        <LegalSection title="4. Renty Score">
          <p>El Renty Score es una puntuación alternativa diseñada para evaluar el perfil de confiabilidad de un arrendatario potencial. Su cálculo se basa en múltiples variables, entre las que se incluyen:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Historial verificable de pagos de arriendo anteriores.</li>
            <li>Estabilidad laboral y fuentes de ingreso documentadas.</li>
            <li>Historial de pagos de servicios públicos y telecomunicaciones.</li>
            <li>Comportamiento financiero general reportado por el Usuario.</li>
            <li>Referencias personales y profesionales verificadas.</li>
          </ul>
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="font-heading text-label font-600 text-ink">Aviso importante</p>
            <p className="mt-1.5 text-[14px]">El Renty Score es una herramienta complementaria de evaluación y <strong className="text-ink">no constituye ni sustituye</strong> los reportes emitidos por las centrales de información financiera (operadores de información de la Ley 1266 de 2008). Su propósito es ampliar las posibilidades de acceso al arriendo para personas que carecen de historial crediticio tradicional o de codeudor. El Renty Score no representa una calificación crediticia y no debe interpretarse como tal.</p>
          </div>
          <p>Renty emplea algoritmos propietarios cuya metodología general se describe en la Plataforma, pero cuyos detalles técnicos específicos constituyen secreto empresarial. La puntuación puede variar a lo largo del tiempo en función de la información disponible y de las actualizaciones del modelo de evaluación.</p>
        </LegalSection>

        <LegalSection title="5. Obligaciones del Usuario">
          <p>Al utilizar la Plataforma, el Usuario se obliga a:</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Suministrar información veraz, completa y actualizada durante el proceso de registro y en cualquier interacción con la Plataforma.</li>
            <li>No utilizar la Plataforma para fines fraudulentos, ilegales o contrarios a la moral y las buenas costumbres.</li>
            <li>No intentar acceder de manera no autorizada a sistemas, servidores o bases de datos de Renty.</li>
            <li>No reproducir, distribuir, modificar ni crear obras derivadas del Contenido de la Plataforma sin autorización previa y por escrito de Renty.</li>
            <li>No suplantar la identidad de terceros ni proporcionar documentación falsificada.</li>
            <li>Mantener actualizada la información de su perfil, especialmente aquella que incida en el cálculo del Renty Score.</li>
            <li>Cumplir con las obligaciones derivadas de cualquier contrato de arrendamiento celebrado a través de o con ocasión de la Plataforma, de conformidad con la Ley 820 de 2003.</li>
          </ol>
        </LegalSection>

        <LegalSection title="6. Propiedad Intelectual">
          <p>Todo el Contenido disponible en la Plataforma, incluyendo pero sin limitarse a textos, gráficos, logotipos, íconos, imágenes, código fuente, software, bases de datos, marcas, nombres comerciales, diseños y la arquitectura de información, es propiedad exclusiva de Renty SAS o de sus licenciantes, y se encuentra protegido por las leyes colombianas e internacionales de propiedad intelectual, incluyendo la Decisión Andina 486 de 2000.</p>
          <p>Queda expresamente prohibida cualquier reproducción, distribución, comunicación pública, transformación o puesta a disposición del Contenido sin la autorización previa, expresa y por escrito de Renty SAS. El uso no autorizado constituirá una infracción de los derechos de propiedad intelectual y podrá dar lugar a las acciones civiles y penales correspondientes.</p>
        </LegalSection>

        <LegalSection title="7. Limitación de Responsabilidad">
          <p>Renty actúa como plataforma tecnológica de intermediación y evaluación de perfiles arrendatarios. En consecuencia:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Renty no es parte en los contratos de arrendamiento que puedan celebrarse entre usuarios de la Plataforma y no asume responsabilidad alguna por el cumplimiento o incumplimiento de dichos contratos.</li>
            <li>Renty no garantiza la exactitud, integridad o actualidad de la información proporcionada por terceros ni de los datos suministrados por los usuarios.</li>
            <li>Renty no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos que se deriven del uso o la imposibilidad de uso de la Plataforma.</li>
            <li>Renty no garantiza la disponibilidad ininterrumpida de la Plataforma y podrá realizar labores de mantenimiento que impliquen interrupciones temporales del servicio.</li>
          </ul>
          <p>La responsabilidad total de Renty frente al Usuario, por cualquier concepto, estará limitada al monto efectivamente pagado por el Usuario a Renty durante los doce (12) meses anteriores al evento que dé lugar a la reclamación, de conformidad con los límites establecidos en el Estatuto del Consumidor (Ley 1480 de 2011).</p>
        </LegalSection>

        <LegalSection title="8. Resolución de Conflictos">
          <p>Cualquier controversia que surja entre el Usuario y Renty con ocasión de los presentes Términos y Condiciones se resolverá de la siguiente manera:</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li><strong className="text-ink">Reclamación directa:</strong> el Usuario podrá presentar su reclamación directamente a Renty a través del correo electrónico soporte@rentyco.app. Renty se compromete a responder en un plazo máximo de quince (15) días hábiles.</li>
            <li><strong className="text-ink">Autoridad de protección al consumidor:</strong> en caso de no llegar a un acuerdo, el Usuario podrá acudir ante la Superintendencia de Industria y Comercio (SIC), entidad competente para conocer de asuntos relacionados con la protección del consumidor en Colombia.</li>
            <li><strong className="text-ink">Jurisdicción ordinaria:</strong> subsidiariamente, las partes se someten a la jurisdicción de los jueces de la República de Colombia, con domicilio en la ciudad de Bogotá D.C.</li>
          </ol>
        </LegalSection>

        <LegalSection title="9. Ley Aplicable">
          <p>Los presentes Términos y Condiciones se rigen e interpretan de conformidad con las leyes de la República de Colombia, incluyendo, entre otras:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Ley 820 de 2003 — Régimen de arrendamiento de vivienda urbana.</li>
            <li>Ley 1480 de 2011 — Estatuto del Consumidor.</li>
            <li>Ley 1581 de 2012 — Régimen General de Protección de Datos Personales.</li>
            <li>Ley 527 de 1999 — Comercio electrónico y firmas digitales.</li>
            <li>Ley 1266 de 2008 — Habeas data financiero.</li>
          </ul>
        </LegalSection>

        <LegalSection title="10. Modificaciones">
          <p>Renty se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigencia a partir de su publicación en la Plataforma. Se notificará a los usuarios registrados de los cambios sustanciales mediante correo electrónico o aviso destacado dentro de la Plataforma con al menos diez (10) días calendario de antelación.</p>
          <p>El uso continuado de la Plataforma después de la fecha de entrada en vigencia de las modificaciones constituirá la aceptación de los nuevos Términos y Condiciones. Si el Usuario no está de acuerdo con las modificaciones, deberá dejar de utilizar la Plataforma y solicitar la eliminación de su cuenta.</p>
        </LegalSection>

        <LegalSection title="11. Contacto">
          <p>Para cualquier consulta, comentario o reclamación relacionada con los presentes Términos y Condiciones, el Usuario podrá comunicarse con Renty a través de los siguientes canales:</p>
          <div className="rounded-xl border border-border bg-surface p-5">
            <ul className="space-y-2 text-[14px]">
              <li><strong className="text-ink">Razón social:</strong> Renty SAS</li>
              <li><strong className="text-ink">Domicilio:</strong> Bogotá D.C., Colombia</li>
              <li><strong className="text-ink">Correo electrónico:</strong> <a href="mailto:soporte@rentyco.app" className="text-teal no-underline hover:text-teal-dark hover:underline">soporte@rentyco.app</a></li>
              <li><strong className="text-ink">Protección de datos:</strong> <a href="mailto:datos@rentyco.app" className="text-teal no-underline hover:text-teal-dark hover:underline">datos@rentyco.app</a></li>
            </ul>
          </div>
        </LegalSection>
      </LegalPageShell>
    </>
  );
}
