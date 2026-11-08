import type { Locale } from '../data/types'

/** The device or browser language: Dutch for `nl*`, English for anything else. */
export function deviceLocale(): Locale {
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('nl') ? 'nl' : 'en'
}
