import { notFound } from 'next/navigation';
import { getCity } from '@/lib/cities';
import { getCityBySlug } from '@/lib/db/cities.repository';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default async function CityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  // Validate against both config + DB; DB wins when set, config provides copy fallback.
  const config = getCity(city);
  const dbCity = await getCityBySlug(city);
  if (!config && !(dbCity && dbCity.active)) notFound();
  return (
    <NuqsAdapter>
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </NuqsAdapter>
  );
}
