<script setup lang="ts">
import { EXERCISES } from '~/data/exercises'
import { todayISO } from '~/utils/date'
import { sessionsInWeek, WEEKLY_TARGET } from '~/utils/progress'

definePageMeta({ layout: 'bare' })
const { t } = useI18n()
const text = useText()
const training = useTraining()
const feedback = useFeedback()
const timer = useTimer()

/** Snapshot at start, so the plan doesn't change mid-workout. */
const plan = {
  steps: training.workout.value,
  level: training.level.value,
  step: training.step.value,
  lightWeek: training.lightWeek.value
}
const REST = 60

const i = ref(0)
const set = ref(0)
const phase = ref<'work' | 'rest' | 'done'>('work')
let reps = 0
let holdSeconds = 0

const current = computed(() => plan.steps[i.value]!)
const ex = computed(() => EXERCISES[current.value.ex])
const totalSets = plan.steps.reduce((a, s) => a + s.sets, 0)
const pct = computed(() => phase.value === 'done'
  ? 100
  : Math.round((plan.steps.slice(0, i.value).reduce((a, s) => a + s.sets, 0) + set.value) / totalSets * 100))
const weekCount = computed(() => sessionsInWeek(training.store.activeSessions, todayISO()))

onMounted(() => feedback.keepAwake(true))
onBeforeUnmount(() => feedback.keepAwake(false))

const tickBeep = (left: number) => { if (left <= 3 && left > 0) feedback.tick() }

function nextAfterSet() {
  set.value++
  if (set.value >= current.value.sets) {
    i.value++
    set.value = 0
    if (i.value >= plan.steps.length) return finish()
    if (i.value === 1) return // no rest after the warm-up
  }
  phase.value = 'rest'
  timer.start(REST, () => { phase.value = 'work'; feedback.done() }, tickBeep)
}

function setDone() {
  if (ex.value.type === 'reps') reps += current.value.value
  nextAfterSet()
}

function startHold() {
  feedback.start()
  const secs = current.value.value
  timer.start(secs, () => {
    holdSeconds += secs
    feedback.done()
    nextAfterSet()
  }, tickBeep)
}

function stopHold() {
  holdSeconds += timer.elapsed(current.value.value)
  timer.stop()
  nextAfterSet()
}

function skipRest() {
  timer.stop()
  phase.value = 'work'
}

function finish() {
  training.store.addSession({ level: plan.level, step: plan.step, lightWeek: plan.lightWeek, repsTotal: reps, holdSecondsTotal: holdSeconds })
  phase.value = 'done'
}
</script>

<template>
  <div class="stack" role="region" :aria-label="t('workout.label')">
    <div class="row between">
      <NuxtLink to="/" class="btn ghost small">{{ phase === 'done' ? t('common.close') : t('workout.end') }}</NuxtLink>
      <span class="sub">{{ phase === 'done' ? t('workout.finished') : t('workout.position', { n: i + 1, total: plan.steps.length }) }}</span>
    </div>
    <div class="progressbar" role="progressbar" :aria-valuenow="pct" aria-valuemin="0" aria-valuemax="100"><i :style="{ width: pct + '%' }" /></div>

    <div v-if="phase === 'done'" class="celebrate stack" style="margin-top: 24px">
      <div class="clock pop">{{ weekCount }}</div>
      <h2 class="h2">{{ t('workout.doneTitle') }}</h2>
      <p class="sub">{{ weekCount >= WEEKLY_TARGET ? t('workout.weekReached', { n: weekCount }) : t('workout.weekProgress', { n: weekCount, target: WEEKLY_TARGET }) }}</p>
      <NuxtLink to="/" class="btn big">{{ t('workout.back') }}</NuxtLink>
    </div>

    <template v-else-if="phase === 'rest'">
      <p class="target" style="margin-top: 12px">{{ t('workout.rest') }}</p>
      <div class="clock rest" aria-live="off">{{ formatClock(timer.remaining.value) }}</div>
      <div class="card row">
        <div style="width: 64px"><ExerciseAnimation :id="current.ex" :animate="false" /></div>
        <div>
          <div class="sub">{{ t('workout.upNext', { n: set + 1, total: current.sets }) }}</div>
          <div class="exname">{{ text(ex.name) }}</div>
        </div>
      </div>
      <div class="btnrow">
        <button class="btn ghost" @click="timer.addSeconds(15)">+15s</button>
        <button class="btn" @click="skipRest">{{ t('workout.skipRest') }}</button>
      </div>
    </template>

    <template v-else>
      <div class="bigpose"><ExerciseAnimation :id="current.ex" /></div>
      <h1 class="pname">{{ text(ex.name) }}</h1>

      <template v-if="ex.type === 'list'">
        <ol class="cues card">
          <li v-for="(c, k) in ex.cues" :key="k">{{ text(c) }}</li>
        </ol>
        <button class="btn big" @click="setDone">{{ t('workout.warmupDone') }}</button>
      </template>

      <template v-else>
        <div class="setdots" :aria-label="t('workout.setOf', { n: set + 1, total: current.sets })">
          <span v-for="k in current.sets" :key="k" :class="{ done: k - 1 < set, now: k - 1 === set }" />
        </div>
        <template v-if="ex.type === 'hold'">
          <p class="target">{{ t('workout.holdTarget', { n: set + 1, total: current.sets, s: current.value }) }}</p>
          <div class="clock">{{ timer.running.value ? formatClock(timer.remaining.value) : current.value }}</div>
          <button v-if="timer.running.value" class="btn big ghost" @click="stopHold">{{ t('workout.stopEarly') }}</button>
          <button v-else class="btn big" @click="startHold">{{ t('workout.startHold') }}</button>
        </template>
        <template v-else>
          <p class="target">{{ t('workout.setOf', { n: set + 1, total: current.sets }) }}</p>
          <div class="clock">{{ current.value }}</div>
          <p class="target">{{ ex.tempo ? text(ex.tempo) : t('workout.reps') }}</p>
          <button class="btn big" @click="setDone">{{ t('workout.setDone') }}</button>
        </template>
        <details class="card">
          <summary style="font-weight: 700; cursor: pointer; min-height: 32px">{{ t('workout.how') }}</summary>
          <ol class="cues" style="margin-top: 10px">
            <li v-for="(c, k) in ex.cues" :key="k">{{ text(c) }}</li>
          </ol>
        </details>
      </template>
    </template>
  </div>
</template>

<style scoped>
.bigpose { width: min(260px, 70vw); margin: 0 auto; }
</style>
