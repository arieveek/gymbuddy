import { Capacitor } from '@capacitor/core'

let audio: AudioContext | null = null

/**
 * Beeps on every platform; haptics and keep-awake only in the native app
 * (plugins are loaded lazily so the web build stays small).
 */
export function useFeedback() {
  const native = Capacitor.isNativePlatform()

  function beep(freq: number, duration: number) {
    try {
      audio ??= new AudioContext()
      const o = audio.createOscillator()
      const g = audio.createGain()
      o.frequency.value = freq
      o.connect(g)
      g.connect(audio.destination)
      g.gain.setValueAtTime(0.2, audio.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration)
      o.start()
      o.stop(audio.currentTime + duration)
    } catch { /* no audio available */ }
  }

  async function buzz(strong = false) {
    if (!native) return
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
      await Haptics.impact({ style: strong ? ImpactStyle.Heavy : ImpactStyle.Light })
    } catch { /* plugin missing */ }
  }

  async function keepAwake(on: boolean) {
    if (!native) return
    try {
      const { KeepAwake } = await import('@capacitor-community/keep-awake')
      await (on ? KeepAwake.keepAwake() : KeepAwake.allowSleep())
    } catch { /* plugin missing */ }
  }

  return {
    /** Call from a tap, so iOS allows audio later on. */
    unlock: () => beep(660, 0.05),
    tick: () => beep(520, 0.08),
    done: () => { beep(880, 0.35); void buzz(true) },
    start: () => { beep(660, 0.1); void buzz() },
    keepAwake
  }
}
