/** Structured logger — single point for all server-side logging.
 *  Swap internals later (Sentry, Axiom) without touching call sites. */

function log(level: 'error' | 'warn' | 'info', msg: string, ctx?: Record<string, unknown>) {
  const entry = { level, msg, ts: new Date().toISOString(), ...ctx };
  if (level === 'error') console.error(JSON.stringify(entry));
  else if (level === 'warn') console.warn(JSON.stringify(entry));
  else console.info(JSON.stringify(entry));
}

export const logger = {
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
};
