import { requireUser } from '@/lib/auth';
import { Avatar } from '@/components/ui/Avatar';
import { ProfileForm } from './ProfileForm';

export const dynamic = 'force-dynamic';

const ROLE_LABEL: Record<string, string> = {
  tenant: 'Inquilino',
  landlord: 'Arrendador',
  admin: 'Administrador',
};

export default async function ProfilePage() {
  const current = await requireUser();
  const memberSince = new Date(current.user.created_at).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-[28px] text-ink sm:text-[32px]">Perfil</h1>
      <p className="mt-1 font-body text-md text-ink-secondary">
        Tu información personal y configuración de cuenta.
      </p>

      {/* Profile card */}
      <div className="mt-8 rounded-2xl border border-border bg-white">
        {/* Header with avatar */}
        <div className="flex items-center gap-5 border-b border-border p-6">
          <Avatar
            src={current.profile.avatar_url}
            name={current.profile.full_name}
            size={72}
            className="ring-2 ring-white shadow-md"
          />
          <div>
            <h2 className="font-heading text-[20px] font-700 text-ink">
              {current.profile.full_name ?? 'Sin nombre'}
            </h2>
            <p className="mt-0.5 font-body text-label text-ink-muted">{current.user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 font-mono text-2xs uppercase tracking-wider text-ink-secondary">
                {ROLE_LABEL[current.profile.role] ?? current.profile.role}
              </span>
              <span className="font-mono text-2xs text-ink-muted">
                Miembro desde {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <ProfileForm
            initial={{ fullName: current.profile.full_name, phone: current.profile.phone }}
            email={current.user.email}
          />
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 rounded-2xl border border-border bg-white p-6">
        <h3 className="font-heading text-[14px] font-600 text-ink-secondary">Sesión</h3>
        <p className="mt-1 font-body text-label text-ink-muted">
          Cierra tu sesión en este dispositivo.
        </p>
        <form action="/auth/logout" method="post" className="mt-4">
          <button
            type="submit"
            className="rounded-xl border border-error/25 bg-white px-4 py-2 font-heading text-label font-500 text-error transition-colors hover:bg-error/5 hover:border-error/40"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
