<script setup lang="ts">
import { HEAD_R, POSES, RUNG, VIEW, barOf, hasLeftLimbs, poseOf, solve, stateAt, type PoseFrame, type Vec } from '~/data/poses'
import type { ExerciseId } from '~/data/types'

const props = withDefaults(defineProps<{
  id: ExerciseId
  /** Loop the animation; false shows one still key pose (list thumbnails). */
  animate?: boolean
  /** Show this key frame still (the key-poses review page). */
  frame?: number
  label?: string
}>(), { animate: true })

const emit = defineEmits<{ caption: [text: string] }>()
const text = useText()
const reduced = useReducedMotion()
const anim = computed(() => POSES[props.id])
const playing = computed(() => props.animate && props.frame === undefined && !reduced.value)
const now = useAnimationClock(playing)
const start = performance.now()

/** The still pose: a chosen frame, or the frame held longest (the shape the exercise is about). */
const stillFrame = computed<PoseFrame>(() => props.frame !== undefined
  ? anim.value.frames[props.frame] ?? anim.value.frames[0]!
  : [...anim.value.frames].sort((a, b) => (b.hold ?? 0) - (a.hold ?? 0))[0]!)
const state = computed(() => playing.value
  ? stateAt(anim.value, now.value - start)
  : { pose: poseOf(anim.value, stillFrame.value), frame: stillFrame.value, ring: null, count: null })
const j = computed(() => solve(anim.value, state.value.pose))
const front = computed(() => anim.value.view === 'front')
const twoLimbs = computed(() => hasLeftLimbs(anim.value))

const caption = computed(() => text(state.value.frame.cap ?? anim.value.frames.find(f => f.cap)?.cap))
watch(caption, c => emit('caption', c), { immediate: true })

const p = (pts: Vec[]) => pts.map(v => `${v[0].toFixed(2)},${v[1].toFixed(2)}`).join(' ')
/** Point `k` units from a towards b. */
const toward = (a: Vec, b: Vec, k: number): Vec => {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const l = Math.max(1, Math.hypot(dx, dy))
  return [a[0] + dx / l * k, a[1] + dy / l * k]
}
const limb = (root: Vec, mid: Vec, end: Vec) => ({
  // A background-coloured halo keeps a limb readable where it crosses the torso.
  halo: p([toward(root, mid, 4), mid, toward(end, mid, 2)]),
  line: p([root, mid, end])
})

const shapes = computed(() => {
  const J = j.value
  const neckLen = Math.max(0, state.value.pose.len.hd - HEAD_R + 1)
  const neckEnd: Vec = [J.shoulder[0] + J.neck[0] * neckLen, J.shoulder[1] + J.neck[1] * neckLen]
  const side: Vec = [-J.neck[1], J.neck[0]]
  const eyes: Vec[] = front.value
    ? [-1, 1].map(s => [J.head[0] + side[0] * 2.3 * s - J.neck[0] * 0.5, J.head[1] + side[1] * 2.3 * s - J.neck[1] * 0.5] as Vec)
    : [[J.head[0] + side[0] * 2.9 + J.neck[0] * 0.9, J.head[1] + side[1] * 2.9 + J.neck[1] * 0.9]]
  return {
    torso: p([neckEnd, J.shoulder, J.hip]),
    leg: limb(J.hip, J.knee, J.foot),
    arm: limb(J.shoulder, J.elbow, J.hand),
    lleg: J.left ? limb(J.hip, J.left.knee, J.left.foot) : null,
    larm: J.left ? limb(J.shoulder, J.left.elbow, J.left.hand) : null,
    head: J.head,
    eyes
  }
})

const scene = computed(() => anim.value.scene ?? {})
const ground = computed(() => anim.value.ground ?? 108)
const groundY = computed(() => (ground.value === false ? VIEW[1] : ground.value))
const rungs = computed(() => {
  const ys: number[] = []
  for (let y = groundY.value - RUNG; y > 2; y -= RUNG) ys.push(y)
  return ys
})
const bar = computed(() => barOf(anim.value))
const propHands = computed<Vec[]>(() => {
  if (!anim.value.prop) return []
  const J = j.value
  return anim.value.propBoth && J.left ? [J.hand, J.left.hand] : [J.hand]
})
const ringLen = 2 * Math.PI * 7
</script>

<template>
  <svg :viewBox="`0 0 ${VIEW[0]} ${VIEW[1]}`" role="img" :aria-label="label ?? caption" class="anim">
    <line v-if="ground !== false" x1="4" :x2="VIEW[0] - 4" :y1="ground" :y2="ground" class="faint" stroke-width="1.5" />
    <line v-if="bar && !anim.bar" :x1="bar[0]" :x2="bar[0]" y1="0" :y2="bar[1]" class="faint" stroke-width="1.5" />

    <!-- Equipment -->
    <g v-if="scene.wallbars !== undefined" class="equip">
      <line :x1="scene.wallbars" :x2="scene.wallbars" y1="0" :y2="groundY" class="rail" />
      <circle v-for="y in rungs" :key="y" :cx="scene.wallbars" :cy="y" r="2.1" class="rung" />
    </g>
    <g v-if="scene.ladder" class="equip">
      <line :x1="scene.ladder[0]" :x2="scene.ladder[0]" y1="0" :y2="groundY" class="rail" />
      <line :x1="scene.ladder[1]" :x2="scene.ladder[1]" y1="0" :y2="groundY" class="rail" />
      <line v-for="y in rungs" :key="y" :x1="scene.ladder[0]" :x2="scene.ladder[1]" :y1="y" :y2="y" class="rail" />
    </g>
    <g v-if="scene.dipbar" class="equip">
      <line :x1="scene.dipbar.x0" :x2="scene.dipbar.x1" :y1="scene.dipbar.y + 2" :y2="scene.dipbar.y + 2" class="handle" />
    </g>
    <line v-if="scene.bench" :x1="scene.bench[0][0]" :y1="scene.bench[0][1]" :x2="scene.bench[1][0]" :y2="scene.bench[1][1]" class="bench" />
    <line v-if="scene.wall !== undefined" :x1="scene.wall + 1.5" :x2="scene.wall + 1.5" y1="0" :y2="groundY" class="wall" />
    <rect v-if="anim.box" :x="anim.box[0]" :y="anim.box[1]" :width="anim.box[2]" :height="anim.box[3]" rx="2" class="box" />

    <!-- Figure: far-side limbs first (faded in side view), then the near side -->
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g v-if="twoLimbs" :class="{ far: !front }">
        <polyline v-if="shapes.lleg" :points="shapes.lleg.line" class="limb" />
        <polyline v-if="shapes.larm" :points="shapes.larm.line" class="limb" />
      </g>
      <polyline :points="shapes.torso" class="limb" />
      <polyline :points="shapes.leg.halo" class="halo" />
      <polyline :points="shapes.leg.line" class="limb" />
      <polyline :points="shapes.arm.halo" class="halo" />
      <polyline :points="shapes.arm.line" class="limb" />
    </g>
    <circle :cx="shapes.head[0]" :cy="shapes.head[1]" :r="HEAD_R" class="head" />
    <circle v-for="(e, i) in shapes.eyes" :key="i" :cx="e[0]" :cy="e[1]" r="1.15" class="eye" />
    <template v-for="(h, i) in propHands" :key="`prop-${i}`">
      <g v-if="anim.prop === 'dumbbell'" class="prop">
        <circle :cx="h[0]" :cy="h[1]" r="4" />
      </g>
      <g v-else-if="anim.prop === 'kettlebell'" class="prop">
        <path :d="`M ${h[0] - 2.4} ${h[1] + 2.2} Q ${h[0]} ${h[1] - 2.2} ${h[0] + 2.4} ${h[1] + 2.2}`" class="handle-kb" />
        <circle :cx="h[0]" :cy="h[1] + 6.4" r="4.8" />
      </g>
    </template>
    <circle v-if="bar" :cx="bar[0]" :cy="bar[1]" r="3.6" class="bar" />
    <circle v-for="(post, i) in scene.posts ?? []" :key="`post-${i}`" :cx="post[0]" :cy="post[1]" r="3" class="bar" />

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
.equip .rail { stroke: var(--muted); stroke-opacity: .45; stroke-width: 1.5; }
.equip .rung { fill: var(--muted); fill-opacity: .55; }
.handle { stroke: var(--accent); stroke-width: 3.2; stroke-linecap: round; }
.bench { stroke: var(--muted); stroke-opacity: .6; stroke-width: 4; stroke-linecap: round; }
.wall { stroke: var(--muted); stroke-opacity: .45; stroke-width: 3; }
.box { fill: var(--muted); fill-opacity: .15; stroke: var(--muted); stroke-opacity: .5; stroke-width: 1.2; }
.limb { stroke: var(--ink); stroke-width: 5; }
.far .limb { stroke-opacity: .5; }
.halo { stroke: var(--bg); stroke-width: 8.5; }
.head { fill: var(--ink); }
.eye { fill: var(--bg); }
.bar { fill: var(--accent); }
.prop circle { fill: var(--accent); stroke: var(--bg); stroke-width: 1.2; }
.handle-kb { fill: none; stroke: var(--accent); stroke-width: 2; }
.ring-track { fill: none; stroke: var(--line); stroke-width: 2.5; }
.ring { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-linecap: round; }
.count { font-family: var(--display); font-weight: 900; font-size: 17px; fill: var(--accent); }
</style>
