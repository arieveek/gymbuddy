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

    // Refresh the role (admin link) when online; failures are fine, the next sync refreshes the token.
    if (auth.signedIn) auth.loadMe().catch(() => {})
    void sync()
    window.addEventListener('online', () => void sync())
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void sync() })
    if (Capacitor.isNativePlatform()) {
      const { App } = await import('@capacitor/app')
      await App.addListener('resume', () => void sync())
    }

    let timer: ReturnType<typeof setTimeout> | null = null
    watch(() => store.outbox, (box) => {
      if (!box.length) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => void sync(), 1500)
    }, { deep: true })
  }
})
