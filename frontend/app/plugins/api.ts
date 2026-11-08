import { errorCode } from '~/stores/auth'

type ApiOptions = NonNullable<Parameters<typeof $fetch>[1]>

/**
 * `$api(path, options)`: $fetch against the API with the bearer token. On a 401 it refreshes the token once
 * and retries. A 403 ACCOUNT_NOT_APPROVED means the admin blocked or deleted the account: back to login.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const call = () => {
      const token = auth.accessToken()
      return $fetch<T>(`${config.public.apiBase}${path}`, {
        ...options,
        headers: { ...(options.headers as Record<string, string> | undefined), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      } as ApiOptions) as Promise<T>
    }
    try {
      return await call()
    }
    catch (e) {
      const status = (e as { status?: number }).status
      if (status === 401 && await auth.refresh()) return await call()
      if (status === 403 && errorCode(e) === 'ACCOUNT_NOT_APPROVED') await auth.sessionEnded('not-approved')
      throw e
    }
  }

  return { provide: { api } }
})
