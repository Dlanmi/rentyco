/**
 * Markdown representations of key public pages for AI agent content negotiation.
 * When a request includes `Accept: text/markdown`, the middleware returns
 * the markdown version instead of rendering the React page.
 *
 * @see https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 */

import { SITE, SITE_URL, SOCIAL } from '@/lib/site';

const HOME_MD = `# ${SITE.name} — ${SITE.tagline}

${SITE.description}

## ¿Qué es Renty?

Renty es la plataforma de arriendos en Colombia que elimina la barrera del codeudor. Usamos un sistema de scoring alternativo llamado **Renty Score** que evalúa tu historial de pagos reales para que puedas arrendar sin fiador.

## Servicios

### Para Inquilinos
- **Renty Score**: Calcula tu puntaje como inquilino en 3 minutos sin codeudor
- **Marketplace de arriendos**: Busca apartamentos y casas en arriendo en Colombia
- **Sin codeudor**: Arrienda con tu historial de pagos, no con un fiador

### Para Arrendadores
- **Verificación de inquilinos**: Evalúa candidatos con datos reales, no subjetivos
- **Publicación de inmuebles**: Publica tu propiedad y encuentra inquilinos verificados
- **Gestión de mensajes**: Comunícate con inquilinos directamente

## Ciudades disponibles
- [Bogotá](${SITE_URL}/bogota/arriendos)
- [Medellín](${SITE_URL}/medellin/arriendos)
- [Cali](${SITE_URL}/cali/arriendos)
- [Barranquilla](${SITE_URL}/barranquilla/arriendos)

## Enlaces útiles
- [Cómo funciona](${SITE_URL}/como-funciona)
- [Para inquilinos](${SITE_URL}/inquilinos)
- [Para arrendadores](${SITE_URL}/arrendadores)
- [Renty Score](${SITE_URL}/renty-score)
- [Blog](${SITE_URL}/blog)
- [Nosotros](${SITE_URL}/nosotros)

## Contacto
- Email: ${SITE.email}
- Twitter: ${SOCIAL.twitter}
- Instagram: ${SOCIAL.instagram}
- LinkedIn: ${SOCIAL.linkedin}

## Legal
- [Términos y condiciones](${SITE_URL}/legal/terminos)
- [Política de privacidad](${SITE_URL}/legal/privacidad)
- [Habeas Data](${SITE_URL}/legal/datos)

---
© ${SITE.legalName} — ${SITE.city}, Colombia
`;

const COMO_FUNCIONA_MD = `# Cómo funciona Renty

## 1. Calcula tu Renty Score
Completa un formulario de 3 minutos con tu información financiera básica. Evaluamos tu relación ingreso-renta y tu historial de pagos.

## 2. Busca tu arriendo
Explora el marketplace de arriendos en tu ciudad. Filtra por precio, ubicación, tipo de propiedad y características.

## 3. Contacta al arrendador
Con tu Renty Score calculado, contacta directamente al arrendador. Tu puntaje demuestra que eres un inquilino confiable.

## 4. Arrienda sin codeudor
Sin fiador, sin trámites engorrosos. Tu historial de pagos es tu mejor carta de presentación.

Más información: ${SITE_URL}/como-funciona
`;

const INQUILINOS_MD = `# Renty para Inquilinos

## Arrienda sin codeudor en Colombia

¿Cansado de buscar fiador? Con Renty, tu historial de pagos habla por ti.

### ¿Cómo funciona?
1. **Calcula tu Renty Score** gratis en 3 minutos
2. **Busca arriendos** en el marketplace
3. **Contacta arrendadores** con tu score como respaldo
4. **Arrienda** sin necesidad de codeudor

### Beneficios
- Sin codeudor ni fiador
- Score calculado en minutos, no días
- Marketplace con arriendos verificados
- Comunicación directa con arrendadores

Empieza ahora: ${SITE_URL}/renty-score
`;

const ARRENDADORES_MD = `# Renty para Arrendadores

## Encuentra inquilinos verificados

### ¿Cómo funciona?
1. **Publica tu inmueble** con fotos y descripción
2. **Recibe solicitudes** de inquilinos con Renty Score
3. **Evalúa candidatos** con datos objetivos
4. **Arrienda con confianza** sabiendo que tu inquilino está verificado

### Beneficios
- Verificación basada en datos reales de pago
- Reduce el riesgo de impago
- Gestiona mensajes y solicitudes desde tu cuenta
- Sin intermediarios costosos

Publica tu inmueble: ${SITE_URL}/cuenta/publicaciones/nuevo
`;

const RENTY_SCORE_MD = `# Renty Score — Scoring Alternativo para Inquilinos

## ¿Qué es el Renty Score?
Es un puntaje crediticio alternativo para inquilinos en Colombia. Evaluamos tu capacidad de pago real basándonos en tu historial de pagos, en vez de exigir un codeudor.

## ¿Cómo se calcula?
- **Relación ingreso-renta**: Qué porcentaje de tus ingresos destinas al arriendo
- **Historial de pagos**: Tu récord de pagos puntuales
- **Estabilidad financiera**: Verificación de empleo e ingresos
- **Verificación de identidad**: Cédula y selfie

## ¿Cuánto tarda?
Aproximadamente 3 minutos completar el formulario.

## ¿Es gratis?
Sí, calcular tu Renty Score es completamente gratis.

Calcúlalo ahora: ${SITE_URL}/renty-score/formulario
`;

const NOSOTROS_MD = `# Sobre Rentyco

**${SITE.legalName}** es una startup colombiana fundada en ${SITE.foundingDate} con la misión de democratizar el acceso a la vivienda en arriendo.

## Nuestra misión
Eliminar la barrera del codeudor en Colombia usando tecnología de scoring alternativo.

## El problema
En Colombia, millones de personas no pueden arrendar porque no tienen codeudor. El sistema tradicional excluye a quienes no tienen un familiar o amigo con propiedades que sirva de fiador.

## Nuestra solución
El **Renty Score** evalúa a los inquilinos por su historial real de pagos, no por tener un codeudor. Así, más colombianos pueden acceder a vivienda digna.

## Contacto
- Email: ${SITE.email}
- Twitter: ${SOCIAL.twitter}
- Instagram: ${SOCIAL.instagram}
- LinkedIn: ${SOCIAL.linkedin}
`;

/** Map of path → markdown content for public pages. */
export const AGENT_MARKDOWN: ReadonlyMap<string, string> = new Map([
  ['/', HOME_MD],
  ['/como-funciona', COMO_FUNCIONA_MD],
  ['/inquilinos', INQUILINOS_MD],
  ['/arrendadores', ARRENDADORES_MD],
  ['/renty-score', RENTY_SCORE_MD],
  ['/nosotros', NOSOTROS_MD],
]);
