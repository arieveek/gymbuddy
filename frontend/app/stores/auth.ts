import { defineStore } from 'pinia'
import type { StoredTokens } from '~/composables/useTokenStore'

interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/** Error code from the API (`{ code }`), or NETWORK when the server could not be reached. */
export function errorCode(e: unknown): string {
  const data = (e as { data?: { code?: unknown } })?.data
  if (data && typeof data.code === 'string') return data.code
  const status = (e as { status?: number, statusCode?: number })?.status ?? (e as { statusCode?: number })?.statusCode
  return status ? 'UNKNOWN' : 'NETWORK'
}

/**
 * Sign-in is optional: the app works fully on the device, and an account adds sync between devices.
 * Talks to /api/auth directly with $fetch; the $api plugin uses `accessToken()` and `refresh()` from here.
 */
export const useAuthStore = defineStore('auth', () => {
  const tokens = ref<StoredTokens | null>(null)
  const ready = ref(false)
  const signedIn = computed(() => tokens.value !== null)
  const email = computed(() => tokens.value?.email ?? null)
  const store = useTokenStore()
  let refreshing: Promise<boolean> | null = null

  const base = () => useRuntimeConfig().public.apiBase as string

  async function init() {
    if (ready.value) return
    tokens.value = await store.read()
    ready.value = true
  }

  async function save(res: TokenResponse, mail: string) {
    tokens.value = { access: res.accessToken, refresh: res.refreshToken, email: mail }
    await store.write(tokens.value)
  }

  async function login(mail: string, password: string) {
    const res = await $fetch<TokenResponse>(`${base()}/auth/login`, { method: 'POST', body: { email: mail, password } })
    await save(res, mail.trim().toLowerCase())
  }

  async function register(mail: string, password: string) {
    const res = await $fetch<TokenResponse>(`${base()}/auth/register`, { method: 'POST', body: { email: mail, password } })
    await save(res, mail.trim().toLowerCase())
  }

  /** Forgets the tokens on this device. Local training data stays. */
  async function forget() {
    tokens.value = null
    await store.write(null)
  }

  async function logout() {
    const refresh = tokens.value?.refresh
    await forget()
    if (refresh) {
      try {
        await $fetch(`${base()}/auth/logout`, { method: 'POST', body: { refreshToken: refresh } })
      }
      catch { /* offline: the token expires on its own */ }
    }
  }

  /** Gets a new token pair. Concurrent callers share one request, so a token is never presented twice. */
  function refresh(): Promise<boolean> {
    if (!tokens.value) return Promise.resolve(false)
    refreshing ??= (async () => {
      const current = tokens.value!
      try {
        const res = await $fetch<TokenResponse>(`${base()}/auth/refresh`, { method: 'POST', body: { refreshToken: current.refresh } })
        await save(res, current.email)
        return true
      }
      catch (e) {
        if (errorCode(e) !== 'NETWORK') await forget()
        return false
      }
      finally {
        refreshing = null
      }
    })()
    return refreshing
  }

  const accessToken = () => tokens.value?.access ?? null

  return { ready, signedIn, email, init, login, register, logout, refresh, accessToken }
})
