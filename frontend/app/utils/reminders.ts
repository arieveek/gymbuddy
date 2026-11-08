import type { Locale } from '../data/types'

/** Workout-day reminders, per athlete, stored on this device only. days: ISO weekdays, 1 = Monday … 7 = Sunday. */
export interface ReminderSettings {
  enabled: boolean
  days: number[]
  /** "HH:MM", 24-hour. */
  time: string
}

export const DEFAULT_REMINDERS: ReminderSettings = { enabled: false, days: [1, 3, 5], time: '16:00' }

export interface ReminderNotification {
  id: number
  title: string
  body: string
  /** Capacitor weekday: 1 = Sunday … 7 = Saturday. */
  weekday: number
  hour: number
  minute: number
}

/** Notification ids this app owns, so rescheduling only cancels its own. */
export const REMINDER_ID_MIN = 1000
export const REMINDER_ID_MAX = 1999

const TEXT: Record<Locale, (name: string) => string> = {
  nl: name => `Tijd voor je training, ${name}! Ongeveer 15 minuten.`,
  en: name => `Time for your workout, ${name}! About 15 minutes.`
}

/** ISO weekday (Mon = 1 … Sun = 7) to Capacitor's (Sun = 1 … Sat = 7). */
export const toCapacitorWeekday = (iso: number) => (iso % 7) + 1

export function parseTime(time: string): { hour: number, minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time)
  if (!m) return null
  const hour = Number(m[1])
  const minute = Number(m[2])
  return hour < 24 && minute < 60 ? { hour, minute } : null
}

/** One weekly repeating notification per chosen day per athlete with reminders on. */
export function reminderNotifications(
  athletes: { index: number, name: string, language: Locale, settings?: ReminderSettings }[]
): ReminderNotification[] {
  const out: ReminderNotification[] = []
  for (const a of athletes) {
    const s = a.settings
    const time = s && parseTime(s.time)
    if (!s?.enabled || !time) continue
    for (const day of [...new Set(s.days)].filter(d => d >= 1 && d <= 7).sort()) {
      out.push({
        id: REMINDER_ID_MIN + a.index * 10 + day,
        title: 'GymBuddy',
        body: TEXT[a.language](a.name),
        weekday: toCapacitorWeekday(day),
        ...time
      })
    }
  }
  return out
}
