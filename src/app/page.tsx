import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Comparison from '@/components/sections/Comparison';
import Steps from '@/components/sections/Steps';
import Score from '@/components/sections/Score';
import Testimonial from '@/components/sections/Testimonial';
import Landlords from '@/components/sections/Landlords';
import Waitlist from '@/components/sections/Waitlist';

const pageSeo = {
  title: 'Arrienda sin Codeudor en Colombia | Renty — Scoring Alternativo de Arriendo',
  description:
    'Arrienda sin codeudor ni fiador en Colombia. Renty evalúa tu historial de pagos reales y te da un puntaje como inquilino en 3 minutos. Calcula tu Renty Score gratis.',
  path: '/',
  ogSlug: 'home',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const faqItems = [
  {
    q: '¿Qué es Renty?',
    a: 'Renty es una plataforma colombiana que permite a los inquilinos arrendar sin codeudor usando un sistema de scoring alternativo llamado Renty Score, basado en historial de pagos reales.',
  },
  {
    q: '¿Cómo arrendar sin codeudor en Colombia?',
    a: 'Con Renty puedes arrendar sin codeudor ni fiador. Calculas tu Renty Score respondiendo 12 preguntas sobre tu historial de arriendo y perfil financiero. Tu puntaje demuestra a los arrendadores que eres un inquilino confiable.',
  },
  {
    q: '¿Qué es el Renty Score?',
    a: 'El Renty Score es una puntuación de 0 a 1000 que mide tu perfil como inquilino. Evalúa tu historial de arriendo, capacidad de pago, estabilidad y responsabilidad financiera. No es un reporte crediticio — complementa a Datacrédito.',
  },
  {
    q: '¿Cuánto cuesta Renty?',
    a: 'Calcular tu Renty Score es completamente gratis. Puedes calcularlo cuantas veces quieras sin costo durante el lanzamiento.',
  },
  {
    q: '¿En qué ciudades está disponible Renty?',
    a: 'Renty está disponible en Bogotá. Próximamente expandiremos a Medellín y Cali. Calcula tu Renty Score desde cualquier ciudad de Colombia.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebPageSchema(pageSeo)} id="ld-webpage" />
      <JsonLd data={faqSchema} id="ld-faq" />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Problem />
        <Comparison />
        <Steps />
        <Score />
        <Testimonial />
        <Landlords />
      </main>
      <Waitlist />
      <Footer />
    </>
  );
}
