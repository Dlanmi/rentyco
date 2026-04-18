import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LegalNav } from '@/components/legal/LegalNav';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="bg-sand">
        <div className="mx-auto max-w-[1200px] px-5 pt-12 sm:px-8 lg:px-12 lg:pt-16">
          <LegalNav />
        </div>
        {children}
      </main>
      <Footer />
    </>
  );
}
