import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const current = await requireAdmin();
  return (
    <div className="min-h-screen bg-sand">
      <div className="flex min-h-screen">
        <AdminSidebar fullName={current.profile.full_name} avatarUrl={current.profile.avatar_url} />
        <main className="flex-1 min-w-0">
          <div className="border-b border-border bg-white lg:hidden">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="font-display text-[18px] text-ink">Renty admin</div>
              <form action="/auth/logout" method="post">
                <button type="submit" className="font-mono text-[11px] uppercase tracking-wide text-ink-muted underline">
                  Salir
                </button>
              </form>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
