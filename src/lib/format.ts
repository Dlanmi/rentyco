/** Colombian peso formatter — no decimals, thousand separators. */
export function formatCOP(amount: number | null | undefined, opts?: { short?: boolean }): string {
  if (amount == null || Number.isNaN(amount)) return '—';
  if (opts?.short && amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `$${m.toFixed(m < 10 ? 1 : 0).replace('.0', '')}M`;
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(m2: number | null | undefined): string {
  if (m2 == null) return '—';
  return `${m2} m²`;
}

export function formatDate(input: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(date);
}

export function formatRelative(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const diffMs = date.getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60_000);
  const abs = Math.abs(diffMin);
  const rtf = new Intl.RelativeTimeFormat('es-CO', { numeric: 'auto' });
  if (abs < 60) return rtf.format(diffMin, 'minute');
  if (abs < 60 * 24) return rtf.format(Math.round(diffMin / 60), 'hour');
  if (abs < 60 * 24 * 30) return rtf.format(Math.round(diffMin / (60 * 24)), 'day');
  return formatDate(date);
}
