/**
 * Registry of OG image variants. Every marketing page has a unique card.
 * Blog posts are looked up dynamically by slug prefixed with `blog-`.
 */
export interface OgPageDef {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  accent?: 'teal' | 'coral';
}

export const OG_PAGES: OgPageDef[] = [
  {
    slug: 'default',
    title: 'El arriendo sin barreras',
    subtitle: 'Scoring alternativo para arrendar en Colombia sin codeudor',
    category: 'Renty',
    accent: 'teal',
  },
  {
    slug: 'home',
    title: 'Arrienda sin codeudor en Colombia',
    subtitle: 'Tu historial real de pago es tu mejor garantía. Sin codeudor, sin barreras.',
    category: 'Bogotá 2026',
    accent: 'teal',
  },
  {
    slug: 'renty-score',
    title: 'Un puntaje que mide cómo pagas, no cuánto tienes',
    subtitle:
      'Scoring alternativo basado en historial de pagos, referencias y comportamiento real.',
    category: 'Renty Score',
    accent: 'teal',
  },
  {
    slug: 'inquilinos',
    title: 'Arrienda con tu historial, no con el de otros',
    subtitle: 'Para los 12.6 millones de colombianos rechazados por no tener codeudor.',
    category: 'Para inquilinos',
    accent: 'teal',
  },
  {
    slug: 'arrendadores',
    title: 'Arriende con datos, no con fe',
    subtitle: 'Perfiles con Renty Score. Reduzca vacancia y riesgo de impago.',
    category: 'Para arrendadores',
    accent: 'coral',
  },
  {
    slug: 'como-funciona',
    title: 'Tu Renty Score en 4 pasos simples',
    subtitle: 'Sin codeudor, sin documentos imposibles. Basado en tu historial real de pagos.',
    category: 'Cómo funciona',
    accent: 'teal',
  },
  {
    slug: 'nosotros',
    title: 'Creemos en el arriendo justo para Colombia',
    subtitle:
      'Somos una startup bogotana midiendo confiabilidad por comportamiento, no por patrimonio.',
    category: 'Nosotros',
    accent: 'coral',
  },
  {
    slug: 'blog',
    title: 'Guías sobre arriendo en Colombia',
    subtitle:
      'Derechos del inquilino, scoring alternativo, Ley 820 y cómo arrendar sin codeudor.',
    category: 'Blog',
    accent: 'teal',
  },
  {
    slug: 'legal-privacidad',
    title: 'Política de Privacidad',
    subtitle: 'Cómo protegemos tus datos personales conforme a la Ley 1581 de 2012.',
    category: 'Documento legal',
    accent: 'teal',
  },
  {
    slug: 'legal-terminos',
    title: 'Términos y Condiciones',
    subtitle: 'Tus derechos y obligaciones al utilizar la plataforma Renty.',
    category: 'Documento legal',
    accent: 'teal',
  },
  {
    slug: 'legal-datos',
    title: 'Tratamiento de Datos Personales',
    subtitle: 'Derechos ARCO, procedimientos y medidas de seguridad para tus datos.',
    category: 'Documento legal',
    accent: 'teal',
  },
];

export function findOgPage(slug: string): OgPageDef | undefined {
  return OG_PAGES.find((p) => p.slug === slug);
}
