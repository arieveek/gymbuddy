import { defineStore } from 'pinia'
import type { StoredTokens } from '~/composables/useTokenStore'

interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  /** Seconds until the login ends unless the app is used again; every refresh starts it over. */
  refreshExpiresIn: number
  remember: boolean
}

/**
 * Opening the app always refreshes the login (which starts its 30 days over). While the app stays open,
 * coming back to it (tab switch, resume) refreshes at most this often.
 */
const TOUCH_EVERY_MS = 5 * 60 * 1000

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
  let lastTouch = 0

  const base = () => useRuntimeConfig().public.apiBase as string

  async function init() {
    if (ready.value) return
    tokens.value = await store.read()
    ready.value = true
  }

  async function save(res: TokenResponse, mail: string, role: StoredTokens['role']) {
    tokens.value = { access: res.accessToken, refresh: res.refreshToken, email: mail, role, remember: res.remember }
    await store.write(tokens.value)
  }

  /** Reads the role from the server, so the admin page shows for the admin only. */
  async function loadMe() {
    if (!tokens.value) return
    const me = await $fetch<Me>(`${base()}/me`, { headers: { Authorization: `Bearer ${tokens.value.access}` } })
    tokens.value = { ...tokens.value, role: me.role, email: me.email }
    await store.write(tokens.value)
  }

  async function login(mail: string, password: string, rememberMe: boolean) {
    const res = await $fetch<TokenResponse>(`${base()}/auth/login`, { method: 'POST', body: { email: mail, password, rememberMe } })
    await save(res, mail.trim().toLowerCase(), 'user')
    lastTouch = Date.now()
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

  /**
   * Gets a new token pair, which also starts the login's lifetime over. A refresh token may be used only once
   * (reuse signs the account out everywhere), so: calls in this tab share one request, and across browser tabs a
   * Web Lock serialises them and a tab first picks up a token another tab already rotated.
   */
  function refresh(): Promise<boolean> {
    if (!tokens.value) return Promise.resolve(false)
    refreshing ??= withLock(async () => {
      const held = tokens.value
      if (!held) return false
      const stored = await store.read()
      if (stored && stored.refresh !== held.refresh) {
        tokens.value = stored // another tab already rotated it
        return true
      }
      try {
        const res = await $fetch<TokenResponse>(`${base()}/auth/refresh`, { method: 'POST', body: { refreshToken: held.refresh } })
        await save(res, held.email, held.role)
        lastTouch = Date.now()
        return true
      }
      catch (e) {
        const code = errorCode(e)
        if (code !== 'NETWORK') await sessionEnded(code === 'ACCOUNT_BLOCKED' || code === 'ACCOUNT_PENDING' ? 'not-approved' : 'expired')
        return false
      }
    }).finally(() => { refreshing = null })
    return refreshing
  }

  /** Called when the app is opened or comes back to the front: keeps a remembered login alive for another 30 days. */
  async function touch() {
    if (!tokens.value || Date.now() - lastTouch < TOUCH_EVERY_MS) return
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return
    await refresh()
  }

  const accessToken = () => tokens.value?.access ?? null

  return { ready, signedIn, email, isAdmin, init, login, register, logout, loadMe, sessionEnded, refresh, touch, accessToken }
})

/** Runs `fn` under a cross-tab Web Lock where available (all current browsers and iOS 15.4+), otherwise directly. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined
  return locks ? locks.request('gymbuddy-refresh', fn) as Promise<T> : fn()
}
