import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LegalNav } from '@/components/legal/LegalNav';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="bg-sand py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <LegalNav />
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
