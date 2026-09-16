/**
 * One place that decides what a price looks like.
 *
 * Shelf prices are whole dollars and read better without the trailing `.00`;
 * computed amounts (tax, a subtotal) are not, and `$15.6` looks like a bug.
 * So the decimals follow the number rather than a fixed setting.
 */
export function money(value) {
  const n = Number(value) || 0
  const whole = Number.isInteger(n)
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(n)
}

/** "3h 30m" / "45 min" — durations read better than raw minutes. */
export function duration(mins) {
  const m = Number(mins) || 0
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? `${h}h ${r}m` : `${h}h`
}
