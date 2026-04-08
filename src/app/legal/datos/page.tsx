import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';

const pageSeo = {
  title: 'Política de Tratamiento de Datos — Renty',
  description:
    'Política de tratamiento de datos personales de Renty conforme a la Ley 1581 de 2012. Tipos de datos, derechos ARCO, procedimientos y medidas de seguridad.',
  path: '/legal/datos',
  ogSlug: 'legal-datos',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Legal', url: '/legal/terminos' },
  { name: 'Tratamiento de datos', url: '/legal/datos' },
];

export default function Page() {
  return (
    <article>
      <JsonLd data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })} id="ld-webpage" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
          {/* Header */}
          <header className="mb-12 border-b border-border pb-8">
            <p className="mb-3 font-heading text-[13px] font-600 uppercase tracking-[0.08em] text-teal">Documento legal</p>
            <h1 className="font-display text-3xl text-ink lg:text-4xl">Política de Tratamiento de Datos Personales</h1>
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
              <p>En cumplimiento de lo dispuesto en la Ley Estatutaria 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y el Decreto 1074 de 2015, Renty SAS (en adelante &quot;Renty&quot;) adopta la presente Política de Tratamiento de Datos Personales con el fin de establecer los criterios, procedimientos y lineamientos aplicables al tratamiento de los datos personales de los Titulares que interactúan con la Plataforma.</p>
              <p className="mt-3">Esta política es de obligatorio cumplimiento para Renty, sus empleados, contratistas y cualquier tercero que, en virtud de una relación contractual, tenga acceso a las bases de datos de la organización.</p>
            </section>

            {/* 1. Tipos de datos tratados */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">1. Tipos de Datos Tratados</h2>
              <p>Renty trata las siguientes categorías de datos personales, clasificadas según su naturaleza y finalidad:</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">1.1 Datos de identificación</h3>
              <p>Nombre completo, tipo y número de documento de identidad (cédula de ciudadanía, cédula de extranjería, pasaporte), fecha de nacimiento, lugar de expedición del documento, nacionalidad, género y estado civil. Estos datos permiten la identificación inequívoca del Titular y son necesarios para el registro en la Plataforma y el cumplimiento de obligaciones legales de verificación de identidad.</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">1.2 Datos de contacto</h3>
              <p>Dirección de domicilio, ciudad, departamento, código postal, correo electrónico personal y laboral, número de teléfono celular y número de teléfono fijo. Estos datos son necesarios para la comunicación con el Titular, la prestación de los servicios y la gestión de PQRS.</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">1.3 Datos financieros</h3>
              <p>Nivel de ingresos mensuales, ocupación, nombre del empleador, tipo de contrato laboral, antigüedad laboral, extractos bancarios proporcionados voluntariamente, historial de pagos de servicios públicos (energía, agua, gas), historial de pagos de telecomunicaciones (telefonía celular, internet) y otros pagos recurrentes que el Titular autorice reportar. Estos datos son fundamentales para el cálculo del Renty Score y la evaluación del perfil arrendatario.</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">1.4 Datos de arriendo</h3>
              <p>Historial de contratos de arrendamiento celebrados, direcciones de inmuebles arrendados previamente, montos de canon de arrendamiento, fechas de inicio y terminación de contratos, causales de terminación, referencias de arrendadores anteriores, estado de cumplimiento de obligaciones contractuales y calificaciones recibidas dentro de la Plataforma. Esta información permite construir un historial arrendatario verificable.</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">1.5 Datos de comportamiento en la Plataforma</h3>
              <p>Fecha y hora de acceso, páginas visitadas, funcionalidades utilizadas, búsquedas realizadas, interacciones con otros usuarios, frecuencia de uso, dirección IP, tipo de dispositivo, sistema operativo, navegador web, datos de geolocalización aproximada derivados de la dirección IP y cookies técnicas, analíticas y de personalización. Estos datos permiten mejorar la experiencia del usuario y la funcionalidad de la Plataforma.</p>
            </section>

            {/* 2. Base legal para el tratamiento */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">2. Base Legal para el Tratamiento</h2>
              <p>El tratamiento de datos personales por parte de Renty se fundamenta en las siguientes bases legales, según corresponda:</p>
              <ol className="mt-3 list-decimal space-y-2 pl-6">
                <li><strong className="text-ink">Consentimiento del Titular:</strong> la autorización previa, expresa e informada otorgada por el Titular al momento de su registro en la Plataforma y mediante la aceptación de la presente política. El consentimiento es libre, previo, expreso e informado, conforme al artículo 9 de la Ley 1581 de 2012.</li>
                <li><strong className="text-ink">Ejecución contractual:</strong> el tratamiento necesario para la ejecución del contrato de prestación de servicios entre Renty y el Usuario, incluyendo el cálculo del Renty Score y la facilitación del proceso de arrendamiento.</li>
                <li><strong className="text-ink">Cumplimiento de obligación legal:</strong> el tratamiento requerido para el cumplimiento de obligaciones legales aplicables a Renty, incluyendo obligaciones tributarias, de prevención de lavado de activos y financiación del terrorismo, y requerimientos de autoridades competentes.</li>
                <li><strong className="text-ink">Interés legítimo:</strong> el tratamiento necesario para la prevención de fraudes, la seguridad de la Plataforma y la mejora continua de los servicios, siempre que no prevalezcan los derechos fundamentales del Titular.</li>
              </ol>
            </section>

            {/* 3. Tiempo de conservación */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">3. Tiempo de Conservación de los Datos</h2>
              <p>Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades del tratamiento y de conformidad con los siguientes criterios:</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-[14px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-4 text-left font-heading font-600 text-ink">Categoría de datos</th>
                      <th className="py-3 text-left font-heading font-600 text-ink">Tiempo de conservación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">Datos de identificación y contacto</td>
                      <td className="py-3">Durante la vigencia de la cuenta del Usuario y hasta cinco (5) años después de su cancelación.</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">Datos financieros</td>
                      <td className="py-3">Durante la vigencia de la cuenta y hasta tres (3) años después de su cancelación, salvo obligación legal que exija un plazo mayor.</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">Datos de arriendo</td>
                      <td className="py-3">Durante la vigencia de la cuenta y hasta diez (10) años, conforme al plazo de prescripción de las acciones derivadas del contrato de arrendamiento (Ley 820 de 2003).</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">Datos de comportamiento en plataforma</td>
                      <td className="py-3">Doce (12) meses desde su recolección, salvo que sean anonimizados para fines estadísticos.</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Datos de Renty Score</td>
                      <td className="py-3">Durante la vigencia de la cuenta y hasta dos (2) años después de la cancelación, período tras el cual serán anonimizados.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">Transcurridos los plazos anteriores, los datos serán eliminados de forma segura o anonimizados de manera irreversible.</p>
            </section>

            {/* 4. Derechos ARCO */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">4. Derechos ARCO del Titular</h2>
              <p>De conformidad con la Ley 1581 de 2012, los Titulares de datos personales gozan de los siguientes derechos, conocidos como derechos ARCO:</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">4.1 Acceso</h3>
              <p>El Titular tiene derecho a conocer y acceder de forma gratuita a sus datos personales que hayan sido objeto de tratamiento por parte de Renty. Este derecho incluye la posibilidad de obtener copia de los datos almacenados, conocer el uso que se les ha dado y las personas o entidades a las que se les han comunicado.</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">4.2 Rectificación</h3>
              <p>El Titular tiene derecho a solicitar la corrección de sus datos personales cuando estos sean inexactos, incompletos, fraccionados o induzcan a error. Renty procederá a la actualización de los datos dentro de los quince (15) días hábiles siguientes a la recepción de la solicitud, siempre que el Titular aporte los documentos o la información que sustente la corrección solicitada.</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">4.3 Cancelación (Supresión)</h3>
              <p>El Titular tiene derecho a solicitar la supresión de sus datos personales de las bases de datos de Renty cuando considere que los mismos no están siendo tratados conforme a los principios, deberes y obligaciones establecidos en la Ley 1581 de 2012. La supresión no procederá cuando el Titular tenga un deber legal o contractual de permanecer en la base de datos, o cuando los datos sean necesarios para el cumplimiento de una obligación legal por parte de Renty.</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">4.4 Oposición</h3>
              <p>El Titular tiene derecho a oponerse al tratamiento de sus datos personales cuando existan motivos fundados y legítimos relativos a su situación particular, o cuando el tratamiento tenga por finalidad la mercadotecnia directa. En caso de que la oposición resulte procedente, Renty dejará de tratar los datos del Titular para las finalidades objetadas.</p>
            </section>

            {/* 5. Procedimiento para ejercer derechos */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">5. Procedimiento para Ejercer los Derechos</h2>
              <p>Para ejercer cualquiera de los derechos ARCO, el Titular o su representante legal debidamente acreditado deberá seguir el siguiente procedimiento:</p>
              <ol className="mt-3 list-decimal space-y-3 pl-6">
                <li>
                  <strong className="text-ink">Presentación de la solicitud:</strong> enviar un correo electrónico a <a href="mailto:datos@rentyco.app" className="text-teal underline hover:text-teal-dark">datos@rentyco.app</a> con el asunto &quot;Ejercicio de derechos ARCO&quot;, incluyendo:
                  <ul className="mt-2 list-disc space-y-1 pl-6">
                    <li>Nombre completo del Titular.</li>
                    <li>Tipo y número de documento de identidad.</li>
                    <li>Descripción clara y precisa del derecho que desea ejercer.</li>
                    <li>Datos de contacto (correo electrónico y teléfono).</li>
                    <li>Documentos de soporte, cuando aplique (por ejemplo, para solicitudes de rectificación).</li>
                    <li>En caso de actuar mediante representante: poder o documento que acredite la representación.</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-ink">Acuse de recibo:</strong> Renty acusará recibo de la solicitud dentro de los dos (2) días hábiles siguientes a su recepción.
                </li>
                <li>
                  <strong className="text-ink">Evaluación y respuesta:</strong>
                  <ul className="mt-2 list-disc space-y-1 pl-6">
                    <li><strong>Consultas:</strong> serán atendidas en un término máximo de diez (10) días hábiles contados a partir de la fecha de recibo. Cuando no fuere posible atender la consulta dentro de dicho término, se informará al Titular los motivos de la demora y se señalará la fecha en que será atendida, la cual no podrá superar los cinco (5) días hábiles siguientes al vencimiento del primer término.</li>
                    <li><strong>Reclamos:</strong> serán atendidos en un término máximo de quince (15) días hábiles contados a partir del día siguiente a la fecha de recibo. Si el reclamo resulta incompleto, se requerirá al interesado dentro de los cinco (5) días siguientes a la recepción para que subsane las fallas. Transcurridos dos (2) meses desde la fecha del requerimiento sin que el solicitante presente la información requerida, se entenderá que ha desistido del reclamo.</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-ink">Ejecución:</strong> una vez evaluada la solicitud y de resultar procedente, Renty adoptará las medidas necesarias dentro de los quince (15) días hábiles siguientes a la comunicación de la respuesta al Titular.
                </li>
              </ol>
            </section>

            {/* 6. Transferencias nacionales e internacionales */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">6. Transferencias Nacionales e Internacionales</h2>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">6.1 Transferencias nacionales</h3>
              <p>Renty podrá transferir datos personales a terceros ubicados en el territorio colombiano en los siguientes supuestos:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>A arrendadores registrados y verificados en la Plataforma, limitándose al Renty Score y a datos de identificación básicos necesarios para la evaluación del perfil arrendatario.</li>
                <li>A proveedores de servicios tecnológicos, de alojamiento de datos (hosting), de análisis y de procesamiento de pagos que actúen como Encargados del Tratamiento.</li>
                <li>A asesores legales, contables y auditores de Renty que requieran acceder a los datos en el marco de sus funciones profesionales.</li>
                <li>A autoridades judiciales, administrativas o de control que lo requieran en ejercicio legítimo de sus funciones.</li>
              </ul>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">6.2 Transferencias internacionales</h3>
              <p>Renty podrá transferir datos personales a terceros ubicados fuera del territorio colombiano, observando las siguientes condiciones:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>El país destinatario deberá contar con niveles adecuados de protección de datos, según la calificación emitida por la Superintendencia de Industria y Comercio, conforme al artículo 26 de la Ley 1581 de 2012.</li>
                <li>En caso de transferencia a países que no cuenten con niveles adecuados, Renty obtendrá la autorización previa y expresa del Titular o se amparará en alguna de las excepciones previstas en el artículo 26 de la Ley 1581 de 2012.</li>
                <li>Los proveedores internacionales de servicios en la nube y de infraestructura tecnológica suscribirán contratos de transmisión de datos que incluyan cláusulas de protección equivalentes a las establecidas por la normatividad colombiana.</li>
              </ul>
              <p className="mt-3">Renty informará a los Titulares, a través de la presente política, sobre los países a los cuales se realicen transferencias internacionales y las garantías implementadas. Actualmente, Renty puede transferir datos a servidores ubicados en Estados Unidos, proporcionados por servicios de infraestructura en la nube que cumplen con certificaciones de seguridad reconocidas internacionalmente.</p>
            </section>

            {/* 7. Medidas técnicas y organizativas de seguridad */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">7. Medidas Técnicas y Organizativas de Seguridad</h2>
              <p>Renty adopta las siguientes medidas de seguridad para garantizar la confidencialidad, integridad y disponibilidad de los datos personales:</p>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">7.1 Medidas técnicas</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Cifrado de datos personales en tránsito mediante protocolos TLS 1.2 o superior.</li>
                <li>Cifrado de datos personales en reposo mediante algoritmos de cifrado estándar de la industria (AES-256).</li>
                <li>Autenticación multifactor (MFA) para el acceso a sistemas internos que contengan datos personales.</li>
                <li>Firewalls, sistemas de detección y prevención de intrusiones (IDS/IPS).</li>
                <li>Copias de seguridad periódicas con almacenamiento cifrado en ubicaciones geográficamente separadas.</li>
                <li>Evaluaciones periódicas de vulnerabilidades y pruebas de penetración realizadas por terceros independientes.</li>
                <li>Registro de auditoría (logs) de accesos y operaciones realizadas sobre datos personales.</li>
              </ul>

              <h3 className="mb-2 mt-5 font-heading text-[15px] font-600 text-ink">7.2 Medidas organizativas</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Política interna de seguridad de la información y protección de datos personales.</li>
                <li>Acuerdos de confidencialidad con todos los empleados, contratistas y proveedores que tengan acceso a datos personales.</li>
                <li>Control de acceso basado en roles (RBAC) y principio de mínimo privilegio: cada colaborador accede únicamente a los datos estrictamente necesarios para el desempeño de sus funciones.</li>
                <li>Programas de capacitación y sensibilización periódica en materia de protección de datos personales y seguridad de la información.</li>
                <li>Procedimientos documentados de gestión de incidentes de seguridad, incluyendo protocolos de notificación a la Superintendencia de Industria y Comercio y a los Titulares afectados.</li>
                <li>Revisión y actualización periódica de las políticas y procedimientos de seguridad, al menos una vez al año.</li>
              </ul>
            </section>

            {/* 8. Autoridad de control */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">8. Autoridad de Control</h2>
              <p>La Superintendencia de Industria y Comercio (SIC) es la autoridad nacional competente para la vigilancia y control del cumplimiento de la normatividad sobre protección de datos personales en Colombia, de conformidad con lo establecido en la Ley 1581 de 2012 y el Decreto 1377 de 2013.</p>
              <p className="mt-3">Los Titulares que consideren que Renty ha vulnerado sus derechos en materia de protección de datos personales podrán, una vez agotado el trámite de consulta o reclamo ante Renty, presentar una queja ante la SIC a través de los siguientes canales:</p>
              <div className="mt-4 rounded-lg border border-border bg-surface p-5">
                <ul className="space-y-2 text-[14px]">
                  <li><strong className="text-ink">Entidad:</strong> Superintendencia de Industria y Comercio</li>
                  <li><strong className="text-ink">Sitio web:</strong> <a href="https://www.sic.gov.co" className="text-teal underline hover:text-teal-dark" target="_blank" rel="noopener noreferrer">www.sic.gov.co</a></li>
                  <li><strong className="text-ink">Línea telefónica:</strong> (601) 587 0000</li>
                  <li><strong className="text-ink">Dirección:</strong> Carrera 13 No. 27-00, Bogotá D.C., Colombia</li>
                </ul>
              </div>
            </section>

            {/* 9. Canal de atención */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">9. Canal de Atención</h2>
              <p>Para cualquier solicitud, consulta, reclamo o inquietud relacionada con el tratamiento de sus datos personales, el Titular podrá comunicarse con el Oficial de Protección de Datos de Renty a través del siguiente canal:</p>
              <div className="mt-4 rounded-lg border border-border bg-surface p-5">
                <ul className="space-y-2 text-[14px]">
                  <li><strong className="text-ink">Responsable del tratamiento:</strong> Renty SAS</li>
                  <li><strong className="text-ink">Domicilio:</strong> Bogotá D.C., Colombia</li>
                  <li><strong className="text-ink">Correo de protección de datos:</strong> <a href="mailto:datos@rentyco.app" className="text-teal underline hover:text-teal-dark">datos@rentyco.app</a></li>
                  <li><strong className="text-ink">Horario de atención:</strong> lunes a viernes, de 8:00 a.m. a 6:00 p.m. (hora colombiana, GMT-5)</li>
                </ul>
              </div>
            </section>

            {/* 10. Vigencia y modificaciones */}
            <section>
              <h2 className="mb-4 font-heading text-lg font-700 text-ink">10. Vigencia y Modificaciones</h2>
              <p>La presente Política de Tratamiento de Datos Personales entra en vigencia a partir de abril de 2026 y permanecerá vigente mientras Renty SAS continúe operando y tratando datos personales.</p>
              <p className="mt-3">Renty se reserva el derecho de modificar la presente política en cualquier momento, dando cumplimiento al procedimiento establecido en el artículo 13 del Decreto 1377 de 2013. Las modificaciones serán publicadas en la Plataforma y comunicadas a los Titulares a través de los medios habituales de comunicación, incluyendo correo electrónico, con al menos diez (10) días calendario de antelación a su entrada en vigencia.</p>
              <p className="mt-3">Si el Titular no manifiesta su oposición a las modificaciones dentro del plazo señalado, se entenderá que ha aceptado las nuevas condiciones, de conformidad con lo establecido en el artículo 14 del Decreto 1377 de 2013.</p>
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
