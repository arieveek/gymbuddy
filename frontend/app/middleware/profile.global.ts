/** Without a profile there is nothing to train: send first-time users to the welcome screen. */
export default defineNuxtRouteMiddleware((to) => {
  const store = useTrainingStore()
  if (store.athletes.length === 0 && to.path !== '/welcome' && to.path !== '/login') return navigateTo('/welcome')
})
