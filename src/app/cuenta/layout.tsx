import { requireUser } from '@/lib/auth';
import { DashboardSidebar, DashboardTabs } from '@/components/account/DashboardSidebar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const current = await requireUser('/cuenta');
  const hasScore = current.profile.renty_score !== null;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-sand">
        <div className="mx-auto max-w-6xl px-6 pt-4 lg:px-12 lg:pt-8">
          <DashboardTabs role={current.profile.role} hasScore={hasScore} />
          <div className="flex gap-0 py-6 lg:gap-12 lg:py-10">
            <DashboardSidebar
              role={current.profile.role}
              fullName={current.profile.full_name}
              avatarUrl={current.profile.avatar_url}
              hasScore={hasScore}
            />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
