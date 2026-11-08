import type { Text } from '../types'

/** English first, Dutch second. Dutch gymnastics terms to be checked by the coach. */
export const t = (en: string, nl: string): Text => ({ en, nl })
