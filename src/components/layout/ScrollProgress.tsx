/**
 * Top-of-page scroll progress bar. The width is set by GlobalScrollController.
 * Rendered as static markup so it shows up on SSR without layout shift.
 */
export default function ScrollProgress() {
  return (
    <div
      data-scroll-progress
      className="fixed top-0 left-0 z-[60] h-[3px] w-0 bg-gradient-to-r from-teal to-teal-light"
      style={{ willChange: 'width' }}
    />
  );
}
