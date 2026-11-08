import { deviceLocale } from '~/utils/locale'

/** Before a profile exists the app follows the device language; after that, the active athlete's language. */
export default defineNuxtPlugin((nuxtApp) => {
  const store = useTrainingStore()
  const i18n = nuxtApp.$i18n
  watch(
    () => store.active?.language ?? deviceLocale(),
    (lang) => {
      if (i18n.locale.value !== lang) void i18n.setLocale(lang)
      document.documentElement.lang = lang
    },
    { immediate: true }
  )
})
