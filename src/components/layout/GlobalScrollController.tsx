'use client';

/**
 * Unified scroll controller — mirrors the inline script from the Astro Layout.
 * Handles: scroll progress bar, navbar scrolled state, floating CTA visibility,
 * back-to-top visibility, and parallax. All rAF-batched for 60fps.
 */
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalScrollController() {
  const pathname = usePathname();
  const isPopState = useRef(false);

  // Detect back/forward navigation via popstate
  useEffect(() => {
    const onPopState = () => { isPopState.current = true; };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    // On back/forward, let the browser restore the previous scroll position
    // (e.g. user was at middle of marketplace, entered a listing, pressed back)
    if (isPopState.current) {
      isPopState.current = false;
    } else if (!window.location.hash) {
      // Forward navigation: scroll to top instantly. 'instant' bypasses
      // CSS scroll-behavior:smooth which races on mobile Safari.
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const navbar = document.querySelector<HTMLElement>('[data-navbar]');
    const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]');
    const floatingCta = document.querySelector<HTMLElement>('[data-floating-cta]');
    const floatingLink = floatingCta ? floatingCta.querySelector('a') : null;
    const backToTop = document.querySelector<HTMLElement>('[data-back-to-top]');
    const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
    const waitlistEl = document.getElementById('waitlist');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let floatingShown = false;
    let bttShown = false;
    let nearWaitlist = false;
    let latestScrollY = window.scrollY;
    let ticking = false;

    const setFloatingState = (visible: boolean) => {
      if (!floatingCta || !floatingLink || visible === floatingShown) return;
      floatingCta.style.pointerEvents = visible ? '' : 'none';
      floatingCta.style.opacity = visible ? '1' : '0';
      floatingCta.style.transform = visible ? 'translateY(0)' : 'translateY(20px)';
      floatingCta.setAttribute('aria-hidden', String(!visible));
      if (visible) floatingLink.removeAttribute('tabindex');
      else floatingLink.setAttribute('tabindex', '-1');
      floatingShown = visible;
    };

    const setBackToTopState = (visible: boolean) => {
      if (!backToTop || visible === bttShown) return;
      backToTop.style.pointerEvents = visible ? '' : 'none';
      backToTop.style.opacity = visible ? '1' : '0';
      backToTop.style.transform = visible ? 'translateY(0)' : 'translateY(20px)';
      backToTop.setAttribute('aria-hidden', String(!visible));
      if (visible) backToTop.removeAttribute('tabindex');
      else backToTop.setAttribute('tabindex', '-1');
      bttShown = visible;
    };

    const updateUI = () => {
      const scrollY = latestScrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? scrollY / h : 0;

      if (navbar) navbar.classList.toggle('is-scrolled', scrollY > 80);
      if (progressBar) progressBar.style.width = `${pct * 100}%`;

      if (floatingCta) {
        if (waitlistEl && typeof IntersectionObserver === 'undefined') {
          const rect = waitlistEl.getBoundingClientRect();
          nearWaitlist = rect.top < window.innerHeight && rect.bottom > 0;
        }
        setFloatingState(pct > 0.15 && !nearWaitlist);
      }

      setBackToTopState(scrollY > window.innerHeight);

      if (!reducedMotion && parallaxEls.length) {
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || '0') || 0;
          el.style.transform = `translateY(${scrollY * speed}px)`;
        });
      }
    };

    const queueUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateUI();
        ticking = false;
      });
    };

    let waitlistObserver: IntersectionObserver | null = null;
    if (waitlistEl && typeof IntersectionObserver !== 'undefined') {
      waitlistObserver = new IntersectionObserver(
        (entries) => {
          nearWaitlist = Boolean(entries[0] && entries[0].isIntersecting);
          queueUpdate();
        },
        { threshold: 0.15 }
      );
      waitlistObserver.observe(waitlistEl);
    }

    const onScroll = () => {
      latestScrollY = window.scrollY;
      queueUpdate();
    };
    const onResize = onScroll;

    updateUI();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      waitlistObserver?.disconnect();
    };
  }, [pathname]);

  return null;
}
