/**
 * Countdown on the wall clock (like the prototype's startCountdown), so it stays right
 * when the phone throttles timers. Ticks every 200 ms.
 */
export function useTimer() {
  const remaining = ref(0)
  const running = ref(false)
  let end = 0
  let handle: ReturnType<typeof setInterval> | null = null
  let onDone: (() => void) | null = null
  let onTick: ((left: number) => void) | null = null

  function stop() {
    if (handle) clearInterval(handle)
    handle = null
    running.value = false
  }

  function start(seconds: number, done: () => void, tick?: (left: number) => void) {
    stop()
    end = Date.now() + seconds * 1000
    remaining.value = seconds
    running.value = true
    onDone = done
    onTick = tick ?? null
    handle = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000))
      if (left !== remaining.value) {
        remaining.value = left
        onTick?.(left)
      }
      if (left <= 0) {
        stop()
        onDone?.()
      }
    }, 200)
  }

  function addSeconds(s: number) {
    end += s * 1000
    remaining.value = Math.max(0, Math.ceil((end - Date.now()) / 1000))
  }

  /** Seconds elapsed out of a countdown of `total` seconds. */
  const elapsed = (total: number) => Math.max(0, Math.min(total, total - remaining.value))

  onBeforeUnmount(stop)
  return { remaining, running, start, stop, addSeconds, elapsed }
}

export function formatClock(s: number): string {
  return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : String(s)
}
