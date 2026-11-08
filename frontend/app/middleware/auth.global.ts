/**
 * Login is required for everything except the login page. Signed in without a profile → welcome.
 * The admin page is for the admin (the API checks that too). Works offline: only stored tokens are checked.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  await auth.init()
  if (!auth.signedIn) return to.path === '/login' ? undefined : navigateTo('/login')
  if (to.path === '/login') return navigateTo('/')
  if (to.path === '/admin') return auth.isAdmin ? undefined : navigateTo('/')
  const store = useTrainingStore()
  if (store.athletes.length === 0 && to.path !== '/welcome') return navigateTo('/welcome')
})
