import { Capacitor } from '@capacitor/core'
import { REMINDER_ID_MAX, REMINDER_ID_MIN, reminderNotifications } from '~/utils/reminders'

/**
 * Workout-day reminders as local notifications on the phone (iPhone/iPad app only; a website cannot
 * schedule notifications without a push server). Settings live in the device-only part of the store.
 */
export function useReminders() {
  const store = useTrainingStore()
  const native = Capacitor.isNativePlatform()

  /** Cancels this app's reminders and schedules them again from the current settings. Returns false if not allowed. */
  async function apply(): Promise<boolean> {
    if (!native) return false
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    const pending = await LocalNotifications.getPending()
    const ours = pending.notifications.filter(n => n.id >= REMINDER_ID_MIN && n.id <= REMINDER_ID_MAX)
    if (ours.length) await LocalNotifications.cancel({ notifications: ours.map(n => ({ id: n.id })) })

    const wanted = reminderNotifications(store.athletes.map((a, index) => ({
      index, name: a.name, language: a.language, settings: store.deviceOnly[a.id]?.reminders
    })))
    if (!wanted.length) return true

    let perm = await LocalNotifications.checkPermissions()
    if (perm.display !== 'granted') perm = await LocalNotifications.requestPermissions()
    if (perm.display !== 'granted') return false

    await LocalNotifications.schedule({
      notifications: wanted.map(n => ({
        id: n.id,
        title: n.title,
        body: n.body,
        schedule: { on: { weekday: n.weekday, hour: n.hour, minute: n.minute }, allowWhileIdle: true }
      }))
    })
    return true
  }

  return { native, apply }
}
