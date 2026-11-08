/** One shared requestAnimationFrame clock for every animation on the page. */
const now = ref(0)
let users = 0
let handle = 0

function loop(t: number) {
  now.value = t
  handle = requestAnimationFrame(loop)
}

export function useAnimationClock(enabled: Ref<boolean>) {
  let counted = false
  const acquire = () => {
    if (counted) return
    counted = true
    if (users++ === 0) handle = requestAnimationFrame(loop)
  }
  const release = () => {
    if (!counted) return
    counted = false
    if (--users === 0) cancelAnimationFrame(handle)
  }
  watch(enabled, on => (on ? acquire() : release()), { immediate: true })
  onBeforeUnmount(release)
  return now
}

/** True when the user asked the system for reduced motion. */
export function useReducedMotion() {
  const reduced = ref(false)
  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = mq.matches
    const update = () => { reduced.value = mq.matches }
    mq.addEventListener('change', update)
    onBeforeUnmount(() => mq.removeEventListener('change', update))
  })
  return reduced
}
