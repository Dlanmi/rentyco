'use client';

import dynamic from 'next/dynamic';

const FloatingCTA = dynamic(() => import('./FloatingCTA'), { ssr: false });
const BackToTop = dynamic(() => import('./BackToTop'), { ssr: false });
const GlobalScrollController = dynamic(() => import('./GlobalScrollController'), { ssr: false });
const GlobalGsapBindings = dynamic(() => import('./GlobalGsapBindings'), { ssr: false });

export function DeferredComponents() {
  return (
    <>
      <FloatingCTA />
      <BackToTop />
      <GlobalScrollController />
      <GlobalGsapBindings />
    </>
  );
}
