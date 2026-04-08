import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getCityBySlug, listNeighborhoodsByCity } from '@/lib/db/cities.repository';
import { ListingForm } from '@/components/admin/ListingForm';

export const dynamic = 'force-dynamic';

export default async function NewListingPage() {
  const current = await requireUser('/cuenta/publicaciones/nuevo');
  if (current.profile.role !== 'landlord' && current.profile.role !== 'admin') {
    redirect('/bienvenido?next=/cuenta/publicaciones/nuevo');
  }

  const city = await getCityBySlug('bogota');
  const neighborhoods = city ? await listNeighborhoodsByCity(city.id) : [];

  return (
    <div>
      <nav className="mb-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        <Link href="/cuenta/publicaciones" className="no-underline hover:text-ink">Mis arriendos</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Nuevo</span>
      </nav>
      <h1 className="mb-1 font-display text-[28px] text-ink">Nuevo arriendo</h1>
      <p className="mb-6 font-body text-[14px] text-ink-muted">
        Completa la información. Podrás agregar fotos después de crear el borrador.
      </p>
      <ListingForm mode="create" neighborhoods={neighborhoods} isAdmin={false} />
    </div>
  );
}
