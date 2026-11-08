import type { Text } from '../types'
import type { Angles, Vec } from './engine'

export const t = (en: string, nl: string): Text => ({ en, nl })

/** Pull-up bar position for hanging drawings (floor at 108). */
export const BAR: Vec = [62, 20]
/** Floor for standing and floor drawings, and where a standing foot sits on it. */
export const G = 104
export const FOOT_Y = 101.5
/** Where a body lying on the floor sits. */
export const LIE_Y = 101

export const HANG: Angles = { ua: -90, fa: -90, to: 90, th: 86, sh: 88, hd: -72 }
export const TOP: Angles = { ua: 60, fa: -80, to: 92, th: 82, sh: 88, hd: -80 }
export const HALF: Angles = { ua: 0, fa: -90, to: 78, th: 84, sh: 90, hd: -80 }
export const STAND: Angles = { ua: 90, fa: 90, to: 90, th: 90, sh: 90, hd: -90 }
/** Lying on the back, head left, arms along the body. */
export const SUPINE: Angles = { ua: 0, fa: 0, to: 0, th: 0, sh: 0, hd: 180 }
export const PASSIVE = { ua: 15 }
export const ACTIVE = { ua: 13 }
