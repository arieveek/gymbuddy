import { Capacitor } from '@capacitor/core'

export interface StoredTokens {
  access: string
  refresh: string
  email: string
  /** Only decides whether the admin link shows; the API enforces the real check. */
  role: 'user' | 'admin'
}

const KEY = 'gymbuddy.auth'

/** Tokens live in Capacitor Preferences in the app and in localStorage on the web, behind one small interface. */
export function useTokenStore() {
  const native = Capacitor.isNativePlatform()

  async function read(): Promise<StoredTokens | null> {
    try {
      let raw: string | null
      if (native) {
        const { Preferences } = await import('@capacitor/preferences')
        raw = (await Preferences.get({ key: KEY })).value
      }
      else raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) as StoredTokens : null
    }
    catch {
      return null
    }
  }

  async function write(tokens: StoredTokens | null) {
    const raw = tokens ? JSON.stringify(tokens) : null
    if (native) {
      const { Preferences } = await import('@capacitor/preferences')
      await (raw ? Preferences.set({ key: KEY, value: raw }) : Preferences.remove({ key: KEY }))
    }
    else if (raw) localStorage.setItem(KEY, raw)
    else localStorage.removeItem(KEY)
  }

  return { read, write }
}
