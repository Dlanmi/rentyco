/**
 * Rate limiting backed by Upstash Redis.
 *
 * Activated by setting UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 * Without them, `limit()` always allows through — so local dev and preview
 * without Upstash keys don't crash the form flow.
 *
 * Usage (server action):
 *   const { success } = await limit(`waitlist:${ip}`, { requests: 5, window: '1 m' });
 *   if (!success) return { success: false, error: 'Demasiados intentos, intenta en 1 minuto.' };
 *
 * All limiters share one Redis client; per-endpoint config is inlined at the
 * call site so intent is visible without jumping to a shared config file.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

interface LimitOpts {
  /** Maximum requests allowed within the window. */
  requests: number;
  /** ISO 8601-ish duration, e.g. '1 m', '10 s', '1 h'. */
  window: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;
  /** Namespace prefix in Redis so different limiters don't collide. */
  prefix?: string;
}

export interface LimitResult {
  success: boolean;
  /** Seconds until reset. 0 if success. */
  retryAfter: number;
}

export async function limit(identifier: string, opts: LimitOpts): Promise<LimitResult> {
  const client = getRedis();
  // Graceful degradation: Upstash unconfigured → allow through.
  if (!client) return { success: true, retryAfter: 0 };

  const rl = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(opts.requests, opts.window),
    prefix: opts.prefix || 'renty:rl',
    analytics: false,
  });

  try {
    const { success, reset } = await rl.limit(identifier);
    const retryAfter = success ? 0 : Math.max(0, Math.ceil((reset - Date.now()) / 1000));
    return { success, retryAfter };
  } catch {
    // Never fail closed: if Upstash blips, let the request through but log.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ratelimit] Upstash error, allowing request through');
    }
    return { success: true, retryAfter: 0 };
  }
}
