import { Capacitor } from '@capacitor/core'

export interface StoredTokens {
  access: string
  refresh: string
  email: string
  /** Only decides whether the admin link shows; the API enforces the real check. */
  role: 'user' | 'admin'
  /** "Keep me logged in": kept on the device. Otherwise only for this browser session / app run. */
  remember: boolean
}

const KEY = 'gymbuddy.auth'
/** Native app without "keep me logged in": tokens live in memory and are gone when the app is closed. */
let memory: string | null = null

/**
 * Remembered logins live in Capacitor Preferences in the app and in localStorage on the web.
 * Others live in memory (app) or sessionStorage (web), so closing the app or tab logs out.
 */
export function useTokenStore() {
  const native = Capacitor.isNativePlatform()

  async function readPersistent(): Promise<string | null> {
    if (native) {
      const { Preferences } = await import('@capacitor/preferences')
      return (await Preferences.get({ key: KEY })).value
    }
    return localStorage.getItem(KEY)
  }

  async function read(): Promise<StoredTokens | null> {
    try {
      const raw = (await readPersistent()) ?? (native ? memory : sessionStorage.getItem(KEY))
      if (!raw) return null
      const t = JSON.parse(raw) as StoredTokens
      return { ...t, remember: t.remember ?? true }
    }
    catch {
      return null
    }
  }

  async function write(tokens: StoredTokens | null) {
    const raw = tokens ? JSON.stringify(tokens) : null
    const persistent = raw && tokens!.remember ? raw : null
    const session = raw && !tokens!.remember ? raw : null
    if (native) {
      const { Preferences } = await import('@capacitor/preferences')
      await (persistent ? Preferences.set({ key: KEY, value: persistent }) : Preferences.remove({ key: KEY }))
      memory = session
    }
    else {
      if (persistent) localStorage.setItem(KEY, persistent)
      else localStorage.removeItem(KEY)
      if (session) sessionStorage.setItem(KEY, session)
      else sessionStorage.removeItem(KEY)
    }
  }

  return { read, write }
}
