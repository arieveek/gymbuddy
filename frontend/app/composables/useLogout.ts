/**
 * Logging out removes this device's training data (devices can be shared). Unsynced changes are uploaded
 * first; if that is not possible the user is asked before anything is thrown away.
 */
export function useLogout() {
  const auth = useAuthStore()
  const store = useTrainingStore()
  const { sync } = useSync()
  const { t } = useI18n()
  const reminders = useReminders()

  return async function logout() {
    if (store.outbox.length) await sync()
    if (store.outbox.length && !window.confirm(t('account.logoutUnsynced', { n: store.outbox.length }))) return
    await auth.logout()
    store.reset()
    await reminders.apply().catch(() => {}) // no athletes left: cancels this device's reminders
    await navigateTo('/login')
  }
}
