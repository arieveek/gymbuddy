<script setup lang="ts">
import { HEAD_R, POSES, VIEW, poseOf, solve, stateAt, type Vec } from '~/data/poses'
import type { ExerciseId } from '~/data/types'

const props = withDefaults(defineProps<{
  id: ExerciseId
  /** Loop the animation; false shows one still key pose (used for list thumbnails). */
  animate?: boolean
  label?: string
}>(), { animate: true })

const emit = defineEmits<{ caption: [text: string] }>()
const text = useText()
const reduced = useReducedMotion()
const anim = computed(() => POSES[props.id])
const playing = computed(() => props.animate && !reduced.value)
const now = useAnimationClock(playing)
const start = performance.now()

/** The still pose: the frame held longest, which is the shape the exercise is about. */
const stillFrame = computed(() => [...anim.value.frames].sort((a, b) => (b.hold ?? 0) - (a.hold ?? 0))[0]!)
const state = computed(() => playing.value
  ? stateAt(anim.value, now.value - start)
  : { pose: poseOf(stillFrame.value), frame: stillFrame.value, ring: null, count: null })
const j = computed(() => solve(anim.value, state.value.pose))

const caption = computed(() => text(state.value.frame.cap ?? anim.value.frames[0]!.cap))
watch(caption, c => emit('caption', c), { immediate: true })

const p = (pts: Vec[]) => pts.map(v => `${v[0].toFixed(2)},${v[1].toFixed(2)}`).join(' ')
/** Point `k` units from a towards b. */
const toward = (a: Vec, b: Vec, k: number): Vec => {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const l = Math.max(1, Math.hypot(dx, dy))
  return [a[0] + dx / l * k, a[1] + dy / l * k]
}

const shapes = computed(() => {
  const J = j.value
  const neckEnd: Vec = [J.shoulder[0] + J.neck[0] * (state.value.pose.len.hd - HEAD_R + 1), J.shoulder[1] + J.neck[1] * (state.value.pose.len.hd - HEAD_R + 1)]
  const front: Vec = [-J.neck[1], J.neck[0]]
  return {
    torso: p([neckEnd, J.shoulder, J.hip]),
    // A background-coloured halo keeps arm and leg readable where they cross the torso.
    legHalo: p([toward(J.hip, J.knee, 4), J.knee, toward(J.foot, J.knee, 2)]),
    leg: p([J.hip, J.knee, J.foot]),
    armHalo: p([toward(J.shoulder, J.elbow, 4), J.elbow, toward(J.hand, J.elbow, 2)]),
    arm: p([J.shoulder, J.elbow, J.hand]),
    head: J.head,
    eye: [J.head[0] + front[0] * 2.9 + J.neck[0] * 0.9, J.head[1] + front[1] * 2.9 + J.neck[1] * 0.9] as Vec
  }
})

const bar = computed(() => anim.value.root === 'hand' ? anim.value.at : anim.value.bar)
const ground = computed(() => anim.value.ground ?? 108)
const ringLen = 2 * Math.PI * 7
</script>

<template>
  <svg :viewBox="`0 0 ${VIEW[0]} ${VIEW[1]}`" role="img" :aria-label="label ?? caption" class="anim">
    <line x1="4" :x2="VIEW[0] - 4" :y1="ground" :y2="ground" class="faint" stroke-width="1.5" />
    <line v-if="anim.root === 'hand'" :x1="anim.at[0]" :x2="anim.at[0]" y1="0" :y2="anim.at[1]" class="faint" stroke-width="1.5" />
    <rect v-if="anim.box" :x="anim.box[0]" :y="anim.box[1]" :width="anim.box[2]" :height="anim.box[3]" rx="2" class="box" />
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline :points="shapes.torso" class="limb" />
      <polyline :points="shapes.legHalo" class="halo" />
      <polyline :points="shapes.leg" class="limb" />
      <polyline :points="shapes.armHalo" class="halo" />
      <polyline :points="shapes.arm" class="limb" />
    </g>
    <circle :cx="shapes.head[0]" :cy="shapes.head[1]" :r="HEAD_R" class="head" />
    <circle :cx="shapes.eye[0]" :cy="shapes.eye[1]" r="1.15" class="eye" />
    <circle v-if="bar" :cx="bar[0]" :cy="bar[1]" r="3.6" class="bar" />
    <template v-if="state.ring !== null">
      <circle cx="107" cy="13" r="7" class="ring-track" />
      <circle cx="107" cy="13" r="7" class="ring" transform="rotate(-90 107 13)" :stroke-dasharray="`${ringLen * state.ring} ${ringLen}`" />
    </template>
    <text v-if="state.count" x="107" y="19" text-anchor="middle" class="count">{{ state.count }}</text>
  </svg>
</template>

<style scoped>
.anim { width: 100%; height: auto; display: block; background: var(--bg); border-radius: 10px; }
.faint { stroke: var(--muted); stroke-opacity: .4; }
.box { fill: var(--muted); fill-opacity: .15; stroke: var(--muted); stroke-opacity: .5; stroke-width: 1.2; }
.limb { stroke: var(--ink); stroke-width: 5; }
.halo { stroke: var(--bg); stroke-width: 8.5; }
.head { fill: var(--ink); }
.eye { fill: var(--bg); }
.bar { fill: var(--accent); }
.ring-track { fill: none; stroke: var(--line); stroke-width: 2.5; }
.ring { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-linecap: round; }
.count { font-family: var(--display); font-weight: 900; font-size: 17px; fill: var(--accent); }
</style>
