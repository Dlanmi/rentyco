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
  title: 'Renty | Arrienda sin codeudor en Colombia',
  description:
    'Renty es el sistema de scoring alternativo que permite a los colombianos arrendar sin codeudor. Basado en historial de pagos reales, no solo en Datacrédito. Calcula tu Renty Score gratis.',
  path: '/',
  ogSlug: 'home',
};

export const metadata: Metadata = buildMetadata(pageSeo);

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebPageSchema(pageSeo)} id="ld-webpage" />
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
