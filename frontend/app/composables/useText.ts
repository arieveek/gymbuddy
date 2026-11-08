import type { Locale, Text } from '~/data/types'

/** Picks the active language from a `{ nl, en }` content text. */
export function useText() {
  const { locale } = useI18n()
  return (text: Text | undefined) => (text ? text[locale.value as Locale] ?? text.en : '')
}
