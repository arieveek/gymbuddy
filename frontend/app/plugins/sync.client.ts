import { Capacitor } from '@capacitor/core'

/**
 * Syncs on start, when the connection comes back, when the app returns to the foreground, and shortly after each change.
 * Runs after plugins/api.ts (plugins load in file-name order).
 */
export default defineNuxtPlugin({
  name: 'sync',
  async setup() {
    const auth = useAuthStore()
    const store = useTrainingStore()
    await auth.init()
    const { sync } = useSync()

    // Opening the app starts a remembered login's 30 days over (refresh), then syncs.
    const opened = async () => {
      await auth.touch()
      await sync()
    }
    if (auth.signedIn) {
      void opened().then(() => auth.loadMe()).catch(() => {}) // also refreshes the role for the admin link
    }
    window.addEventListener('online', () => void opened())
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void opened() })
    if (Capacitor.isNativePlatform()) {
      const { App } = await import('@capacitor/app')
      await App.addListener('resume', () => void opened())
      // Keep the scheduled workout reminders in step with the settings (e.g. after a reinstall or a name change).
      useReminders().apply().catch(() => {})
    }

    let timer: ReturnType<typeof setTimeout> | null = null
    watch(() => store.outbox, (box) => {
      if (!box.length) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => void sync(), 1500)
    }, { deep: true })
  }
})
