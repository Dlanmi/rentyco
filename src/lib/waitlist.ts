/**
 * Central source of truth for waitlist count messaging.
 * Update WAITLIST_COUNT as the list grows; all pages reflect the new value.
 */

export const WAITLIST_COUNT = 98;

/** Exact count + "+" suffix for coherence with the animated counter. */
export const WAITLIST_COUNT_LABEL = `${WAITLIST_COUNT}+`;
