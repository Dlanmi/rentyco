import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';

const pageSeo = {
  title: 'Política de Privacidad — Renty',
  description:
    'Política de privacidad de Renty. Conoce cómo recopilamos, usamos y protegemos tus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.',
  path: '/legal/privacidad',
  ogSlug: 'legal-privacidad',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Legal', url: '/legal/terminos' },
  { name: 'Política de privacidad', url: '/legal/privacidad' },
];

export default function Page() {
  return (
    <article>
      <JsonLd data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })} id="ld-webpage" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
          {/* Header */}
          <header className="mb-12 border-b border-border pb-8">
            <p className="mb-3 font-heading text-[13px] font-600 uppercase tracking-[0.08em] text-teal">Documento legal</p>
            <h1 className="font-display text-3xl text-ink lg:text-4xl">Política de Privacidad</h1>
            <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-secondary">
              Última actualización: abril de 2026
            </p>
            <p className="mt-2 font-body text-[14px] text-ink-muted">
              Renty SAS · Bogotá D.C., Colombia
            </p>
          </header>

          <div className="legal-content space-y-10 font-body text-[15px] leading-[1.8] text-ink-secondary">
            {/* Introducción */}
            <section>
              <p>La presente Política de Privacidad describe la manera en que Renty SAS (en adelante &quot;Renty&quot;), en calidad de Responsable del Tratamiento de datos personales, recopila, almacena, usa, circula y trata la información personal de los usuarios de la plataforma rentyco.app. Esta política se rige por lo dispuesto en la Ley Estatutaria 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y demás normas concordantes vigentes en la República de Colombia.</p>
            </section>

            {/* 1. Responsable del tratamiento */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">1. Responsable del Tratamiento</h2>
              <div className="rounded-lg border border-border bg-surface p-5">
                <ul className="space-y-2 text-[14px]">
                  <li><strong className="text-ink">Razón social:</strong> Renty SAS</li>
                  <li><strong className="text-ink">Domicilio:</strong> Bogotá D.C., Colombia</li>
                  <li><strong className="text-ink">Correo electrónico:</strong> <a href="mailto:datos@rentyco.app" className="text-teal underline hover:text-teal-dark">datos@rentyco.app</a></li>
                  <li><strong className="text-ink">Sitio web:</strong> <a href="https://rentyco.app" className="text-teal underline hover:text-teal-dark">rentyco.app</a></li>
                </ul>
              </div>
            </section>

            {/* 2. Datos que recopilamos */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">2. Datos que Recopilamos</h2>
              <p>En desarrollo de su objeto social y para la prestación de sus servicios, Renty podrá recopilar las siguientes categorías de datos personales:</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">2.1 Datos de identificación personal</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Nombre completo, número de cédula de ciudadanía o cédula de extranjería.</li>
                <li>Fecha de nacimiento, género, estado civil.</li>
                <li>Dirección de residencia actual, ciudad y departamento.</li>
                <li>Correo electrónico, número de teléfono celular.</li>
                <li>Fotografía de perfil y copia del documento de identidad.</li>
              </ul>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">2.2 Datos financieros y económicos</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Nivel de ingresos mensuales, fuentes de ingreso y ocupación.</li>
                <li>Extractos bancarios (proporcionados voluntariamente por el Usuario).</li>
                <li>Historial de pagos de servicios públicos, telecomunicaciones y otros pagos recurrentes.</li>
                <li>Información laboral: nombre del empleador, cargo, antigüedad, tipo de contrato.</li>
              </ul>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">2.3 Datos de arriendo</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Historial de contratos de arrendamiento previos.</li>
                <li>Referencias de arrendadores anteriores.</li>
                <li>Montos de canon de arrendamiento pagados históricamente.</li>
                <li>Información sobre el inmueble arrendado o por arrendar.</li>
                <li>Estado de pagos y cumplimiento de obligaciones contractuales de arriendo.</li>
              </ul>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">2.4 Datos de navegación y uso</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Dirección IP, tipo de navegador, sistema operativo y dispositivo.</li>
                <li>Páginas visitadas, tiempo de permanencia, acciones realizadas en la Plataforma.</li>
                <li>Cookies y tecnologías similares de seguimiento, conforme a nuestra política de cookies.</li>
              </ul>
            </section>

            {/* 3. Finalidad del tratamiento */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">3. Finalidad del Tratamiento</h2>
              <p>Los datos personales recopilados serán tratados para las siguientes finalidades:</p>
              <ol className="mt-3 list-decimal space-y-2 pl-6">
                <li>Gestionar el registro y la creación de cuentas de usuario en la Plataforma.</li>
                <li>Calcular, generar y actualizar el Renty Score del Usuario.</li>
                <li>Facilitar la conexión entre arrendatarios potenciales y arrendadores verificados.</li>
                <li>Verificar la identidad y la información proporcionada por los usuarios.</li>
                <li>Enviar comunicaciones relacionadas con el servicio, incluyendo notificaciones, alertas y actualizaciones de la Plataforma.</li>
                <li>Enviar comunicaciones comerciales y promocionales, siempre que el Usuario haya otorgado su consentimiento previo y expreso para ello.</li>
                <li>Atender solicitudes, peticiones, quejas y reclamos (PQRS) del Usuario.</li>
                <li>Cumplir con obligaciones legales, regulatorias y contractuales aplicables.</li>
                <li>Realizar análisis estadísticos, estudios de mercado y mejora continua de los servicios, utilizando datos anonimizados o agregados cuando sea posible.</li>
                <li>Prevenir fraudes, actividades ilícitas y proteger la seguridad de la Plataforma y sus usuarios.</li>
              </ol>
            </section>

            {/* 4. Derechos del titular */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">4. Derechos del Titular</h2>
              <p>De conformidad con el artículo 8 de la Ley 1581 de 2012 y el artículo 21 del Decreto 1377 de 2013, el Titular de los datos personales tiene los siguientes derechos:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li><strong className="text-ink">Derecho de consulta:</strong> conocer, acceder y obtener los datos personales que reposen en las bases de datos de Renty.</li>
                <li><strong className="text-ink">Derecho de rectificación:</strong> solicitar la corrección de los datos personales cuando estos resulten inexactos, incompletos o desactualizados.</li>
                <li><strong className="text-ink">Derecho de actualización:</strong> solicitar la actualización de sus datos personales cuando estos hayan cambiado.</li>
                <li><strong className="text-ink">Derecho de supresión:</strong> solicitar la eliminación de sus datos personales de las bases de datos de Renty, salvo cuando exista un deber legal o contractual que impida dicha eliminación.</li>
                <li><strong className="text-ink">Derecho de revocatoria:</strong> revocar la autorización otorgada para el tratamiento de datos personales, en los casos en que legalmente sea procedente.</li>
                <li><strong className="text-ink">Derecho a presentar quejas:</strong> presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a lo dispuesto en la Ley 1581 de 2012 y demás normas que la modifiquen, adicionen o complementen.</li>
              </ul>
              <p className="mt-3">Para ejercer cualquiera de estos derechos, el Titular podrá enviar su solicitud al correo electrónico <a href="mailto:datos@rentyco.app" className="text-teal underline hover:text-teal-dark">datos@rentyco.app</a>, indicando de manera clara el derecho que desea ejercer, su nombre completo, número de identificación y datos de contacto.</p>
            </section>

            {/* 5. Autorización */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">5. Autorización</h2>
              <p>De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013, Renty obtendrá la autorización previa, expresa e informada del Titular para el tratamiento de sus datos personales. Dicha autorización será recabada al momento del registro en la Plataforma mediante la aceptación expresa de la presente Política de Privacidad y del formulario de autorización de tratamiento de datos.</p>
              <p className="mt-3">La autorización podrá ser otorgada por cualquier medio que permita ser consultado con posterioridad, incluyendo medios electrónicos. El Titular podrá revocar su autorización en cualquier momento, salvo que exista una disposición legal que impida dicha revocatoria.</p>
              <p className="mt-3">Renty no requerirá autorización del Titular en los casos expresamente exceptuados por la ley, tales como: datos requeridos por una entidad pública en ejercicio de sus funciones, datos de naturaleza pública, casos de urgencia médica o sanitaria, y tratamiento de información autorizado por la ley para fines históricos, estadísticos o científicos.</p>
            </section>

            {/* 6. Transferencia de datos */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">6. Transferencia y Transmisión de Datos</h2>
              <p>Renty podrá realizar transferencias y transmisiones de datos personales a terceros, nacionales o internacionales, en los siguientes casos:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>A proveedores de servicios tecnológicos que actúen como Encargados del Tratamiento y que hayan suscrito contratos de transmisión de datos que garanticen niveles adecuados de protección, de conformidad con el artículo 25 del Decreto 1377 de 2013.</li>
                <li>A arrendadores verificados en la Plataforma, limitándose a la información estrictamente necesaria para la evaluación del perfil arrendatario (Renty Score y datos de identificación básicos).</li>
                <li>A autoridades judiciales, administrativas o de control que lo requieran en ejercicio de sus funciones legales.</li>
                <li>A países que cuenten con niveles adecuados de protección de datos, según lo determinado por la Superintendencia de Industria y Comercio, o cuando el Titular haya otorgado su autorización expresa para la transferencia internacional.</li>
              </ul>
              <p className="mt-3">En todo caso, Renty adoptará las medidas contractuales y técnicas necesarias para garantizar que los datos transferidos reciban un nivel de protección equivalente al otorgado por la legislación colombiana.</p>
            </section>

            {/* 7. Medidas de seguridad */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">7. Medidas de Seguridad</h2>
              <p>Renty implementa medidas técnicas, humanas y administrativas razonables para proteger los datos personales contra acceso no autorizado, pérdida, alteración, destrucción o uso indebido. Entre estas medidas se incluyen:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Cifrado de datos en tránsito (TLS/SSL) y en reposo.</li>
                <li>Controles de acceso basados en roles y principio de mínimo privilegio.</li>
                <li>Monitoreo y auditoría continua de los sistemas de información.</li>
                <li>Capacitación periódica del personal en materia de protección de datos personales.</li>
                <li>Políticas de gestión de incidentes de seguridad de la información.</li>
                <li>Pruebas periódicas de vulnerabilidad y análisis de riesgos.</li>
              </ul>
              <p className="mt-3">No obstante, ningún sistema de seguridad es infalible. En caso de presentarse un incidente de seguridad que comprometa datos personales, Renty notificará a los Titulares afectados y a la Superintendencia de Industria y Comercio dentro de los términos establecidos por la normatividad vigente.</p>
            </section>

            {/* 8. Oficial de protección de datos */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">8. Oficial de Protección de Datos</h2>
              <p>Renty ha designado un Oficial de Protección de Datos Personales, responsable de velar por el cumplimiento de la Ley 1581 de 2012 y demás normas aplicables, así como de atender las solicitudes de los Titulares en relación con el ejercicio de sus derechos. El Oficial de Protección de Datos puede ser contactado a través del correo electrónico <a href="mailto:datos@rentyco.app" className="text-teal underline hover:text-teal-dark">datos@rentyco.app</a>.</p>
            </section>

            {/* 9. Vigencia */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">9. Vigencia</h2>
              <p>La presente Política de Privacidad entra en vigencia a partir de abril de 2026 y permanecerá vigente mientras Renty SAS continúe operando y tratando datos personales. Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades descritas en esta política y de conformidad con los plazos establecidos por la legislación colombiana aplicable.</p>
              <p className="mt-3">Una vez cumplida la finalidad del tratamiento o cuando el Titular solicite la supresión de sus datos y no exista deber legal o contractual que impida su eliminación, Renty procederá a la supresión segura de los datos personales en un plazo máximo de quince (15) días hábiles.</p>
            </section>

            {/* 10. Canal PQRS */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">10. Canal de Peticiones, Quejas, Reclamos y Sugerencias (PQRS)</h2>
              <p>Los Titulares de datos personales pueden ejercer sus derechos y presentar peticiones, quejas, reclamos y sugerencias a través de los siguientes canales:</p>
              <div className="mt-4 rounded-lg border border-border bg-surface p-5">
                <ul className="space-y-2 text-[14px]">
                  <li><strong className="text-ink">Correo electrónico:</strong> <a href="mailto:datos@rentyco.app" className="text-teal underline hover:text-teal-dark">datos@rentyco.app</a></li>
                  <li><strong className="text-ink">Asunto sugerido:</strong> &quot;PQRS - Datos Personales&quot; seguido de una descripción breve de la solicitud.</li>
                </ul>
              </div>
              <p className="mt-4">Renty atenderá las consultas dentro de un término máximo de diez (10) días hábiles contados a partir de la fecha de recibo de la solicitud, conforme al artículo 14 de la Ley 1581 de 2012. Los reclamos serán atendidos en un término máximo de quince (15) días hábiles, prorrogables por ocho (8) días hábiles adicionales, conforme al artículo 15 de la misma ley.</p>
              <p className="mt-3">Si el Titular considera que Renty ha vulnerado sus derechos en materia de protección de datos personales, podrá presentar una queja ante la Superintendencia de Industria y Comercio (SIC), autoridad nacional de protección de datos en Colombia, a través del sitio web <a href="https://www.sic.gov.co" className="text-teal underline hover:text-teal-dark" target="_blank" rel="noopener noreferrer">www.sic.gov.co</a>.</p>
            </section>

            {/* Marco normativo */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">Marco Normativo</h2>
              <p>La presente Política de Privacidad se rige por las siguientes disposiciones legales:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Ley Estatutaria 1581 de 2012 — Régimen General de Protección de Datos Personales.</li>
                <li>Decreto 1377 de 2013 — Reglamentario parcial de la Ley 1581 de 2012.</li>
                <li>Decreto 1074 de 2015 — Decreto Único Reglamentario del Sector Comercio, Industria y Turismo (Título 2, Parte 2, Libro 2, Capítulo 25 y 26).</li>
                <li>Ley 1266 de 2008 — Habeas data financiero.</li>
                <li>Artículo 15 de la Constitución Política de Colombia — Derecho a la intimidad y al habeas data.</li>
              </ul>
            </section>
          </div>

      {/* Back link */}
      <div className="mt-14 border-t border-border pt-6">
        <a href="/" className="font-heading text-[14px] font-600 text-teal no-underline hover:text-teal-dark">
          &larr; Volver al inicio
        </a>
      </div>
    </article>
  );
}
