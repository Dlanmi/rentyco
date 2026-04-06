'use client';

/**
 * Scrolls smoothly to the top when clicked. Visibility toggled by
 * GlobalScrollController based on scroll depth.
 */
export default function BackToTop() {
  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      type="button"
      data-back-to-top
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-40 flex h-10 w-10 translate-y-20 items-center justify-center rounded-full border border-border bg-surface opacity-0 shadow-lg transition-all duration-300 hover:border-teal hover:text-teal"
      style={{ pointerEvents: 'none' }}
      tabIndex={-1}
      aria-hidden="true"
      aria-label="Volver al inicio"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
