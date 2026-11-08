import { defineStore } from 'pinia'
import type { StoredTokens } from '~/composables/useTokenStore'

interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface Me {
  id: string
  email: string
  role: 'user' | 'admin'
  status: 'pending' | 'approved' | 'blocked'
}

/** Error code from the API (`{ code }`), or NETWORK when the server could not be reached. */
export function errorCode(e: unknown): string {
  const data = (e as { data?: { code?: unknown } })?.data
  if (data && typeof data.code === 'string') return data.code
  const status = (e as { status?: number, statusCode?: number })?.status ?? (e as { statusCode?: number })?.statusCode
  return status ? 'UNKNOWN' : 'NETWORK'
}

/**
 * Login is required, and only accounts the admin approved get tokens. The tokens stay on the device,
 * so the app keeps working offline at the gym. Talks to /api/auth with $fetch; the $api plugin uses
 * `accessToken()` and `refresh()` from here.
 */
export const useAuthStore = defineStore('auth', () => {
  const tokens = ref<StoredTokens | null>(null)
  const ready = ref(false)
  const signedIn = computed(() => tokens.value !== null)
  const email = computed(() => tokens.value?.email ?? null)
  const isAdmin = computed(() => tokens.value?.role === 'admin')
  const store = useTokenStore()
  let refreshing: Promise<boolean> | null = null

  const base = () => useRuntimeConfig().public.apiBase as string

  async function init() {
    if (ready.value) return
    tokens.value = await store.read()
    ready.value = true
  }

  async function save(res: TokenResponse, mail: string, role: StoredTokens['role']) {
    tokens.value = { access: res.accessToken, refresh: res.refreshToken, email: mail, role }
    await store.write(tokens.value)
  }

  /** Reads the role from the server, so the admin page shows for the admin only. */
  async function loadMe() {
    if (!tokens.value) return
    const me = await $fetch<Me>(`${base()}/me`, { headers: { Authorization: `Bearer ${tokens.value.access}` } })
    tokens.value = { ...tokens.value, role: me.role, email: me.email }
    await store.write(tokens.value)
  }

  async function login(mail: string, password: string) {
    const res = await $fetch<TokenResponse>(`${base()}/auth/login`, { method: 'POST', body: { email: mail, password } })
    await save(res, mail.trim().toLowerCase(), 'user')
    await loadMe()
  }

  /** Creates an account that waits for the admin's approval. No tokens until then. */
  async function register(mail: string, password: string) {
    await $fetch(`${base()}/auth/register`, { method: 'POST', body: { email: mail, password } })
  }

  /** Forgets the tokens on this device (local training data is handled by the caller). */
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

  /** The session ended on the server side (expired, blocked or deleted): back to the login screen. */
  async function sessionEnded(reason: string) {
    await forget()
    await navigateTo({ path: '/login', query: { reason } })
  }

  /** Gets a new token pair. Concurrent callers share one request, so a token is never presented twice. */
  function refresh(): Promise<boolean> {
    if (!tokens.value) return Promise.resolve(false)
    refreshing ??= (async () => {
      const current = tokens.value!
      try {
        const res = await $fetch<TokenResponse>(`${base()}/auth/refresh`, { method: 'POST', body: { refreshToken: current.refresh } })
        await save(res, current.email, current.role)
        return true
      }
      catch (e) {
        const code = errorCode(e)
        if (code !== 'NETWORK') await sessionEnded(code === 'ACCOUNT_BLOCKED' || code === 'ACCOUNT_PENDING' ? 'not-approved' : 'expired')
        return false
      }
      finally {
        refreshing = null
      }
    })()
    return refreshing
  }

  const accessToken = () => tokens.value?.access ?? null

  return { ready, signedIn, email, isAdmin, init, login, register, logout, loadMe, sessionEnded, refresh, accessToken }
})
