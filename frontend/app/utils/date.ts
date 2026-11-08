/** Dates are local calendar days as YYYY-MM-DD strings, so a workout belongs to the day it was done. */

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, (m ?? 1) - 1, d ?? 1)
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

/** Whole days from a to b (b later is positive). Uses UTC to ignore daylight-saving shifts. */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  return Math.round((Date.UTC(by!, bm! - 1, bd!) - Date.UTC(ay!, am! - 1, ad!)) / 86_400_000)
}

/** Monday of the week containing the date. */
export function weekStart(iso: string): string {
  const d = parseISODate(iso)
  const offset = (d.getDay() + 6) % 7
  return addDays(iso, -offset)
}

export function weeksBetween(a: string, b: string): number {
  return Math.round(daysBetween(weekStart(a), weekStart(b)) / 7)
}

export function formatDate(iso: string, locale: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }): string {
  return parseISODate(iso).toLocaleDateString(locale, opts)
}
