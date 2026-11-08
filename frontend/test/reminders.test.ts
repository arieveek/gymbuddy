import { describe, expect, it } from 'vitest'
import { DEFAULT_REMINDERS, REMINDER_ID_MAX, REMINDER_ID_MIN, parseTime, reminderNotifications, toCapacitorWeekday } from '../app/utils/reminders'

describe('reminders', () => {
  it('maps ISO weekdays to Capacitor weekdays (Sunday = 1)', () => {
    expect(toCapacitorWeekday(1)).toBe(2) // Monday
    expect(toCapacitorWeekday(6)).toBe(7) // Saturday
    expect(toCapacitorWeekday(7)).toBe(1) // Sunday
  })

  it('parses times and rejects nonsense', () => {
    expect(parseTime('16:00')).toEqual({ hour: 16, minute: 0 })
    expect(parseTime('7:05')).toEqual({ hour: 7, minute: 5 })
    expect(parseTime('25:00')).toBeNull()
    expect(parseTime('')).toBeNull()
  })

  it('schedules one weekly notification per chosen day, in the athlete\'s language', () => {
    const n = reminderNotifications([
      { index: 0, name: 'Daan', language: 'nl', settings: { ...DEFAULT_REMINDERS, enabled: true } },
      { index: 1, name: 'Sam', language: 'en', settings: { enabled: true, days: [6, 6], time: '09:30' } },
      { index: 2, name: 'Off', language: 'en', settings: DEFAULT_REMINDERS }
    ])
    expect(n).toHaveLength(4)
    expect(n.map(x => x.weekday)).toEqual([2, 4, 6, 7]) // Mon, Wed, Fri for Daan; Sat once for Sam
    expect(n[0]).toMatchObject({ hour: 16, minute: 0, body: 'Tijd voor je training, Daan! Ongeveer 15 minuten.' })
    expect(n[3]).toMatchObject({ hour: 9, minute: 30, body: 'Time for your workout, Sam! About 15 minutes.' })
    for (const x of n) expect(x.id >= REMINDER_ID_MIN && x.id <= REMINDER_ID_MAX).toBe(true)
    expect(new Set(n.map(x => x.id)).size).toBe(n.length)
  })
})
