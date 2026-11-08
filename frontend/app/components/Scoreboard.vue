<script setup lang="ts">
import { todayISO } from '~/utils/date'
import { sessionsInWeek, WEEKLY_TARGET } from '~/utils/progress'
import { MAX_STEPS } from '~/data/levels'

const { t } = useI18n()
const text = useText()
const { store, def, step, level } = useTraining()
const thisWeek = computed(() => sessionsInWeek(store.activeSessions, todayISO()))
const stepLabel = computed(() => level.value === 5
  ? t('board.ongoing')
  : t('board.step', { step: step.value, max: MAX_STEPS }))
</script>

<template>
  <header class="board" aria-live="polite">
    <NuxtLink to="/profile" class="hi" :aria-label="t('board.openProfile')">
      {{ store.active?.name ? t('board.hi', { name: store.active.name }) : t('board.hiAnon') }}
      <UIcon name="i-lucide-settings" class="gear" />
    </NuxtLink>
    <div class="lvlname">{{ text(def.name) }}</div>
    <div class="step">{{ stepLabel }}</div>
    <div class="score">{{ level }}<small>/5</small></div>
    <div class="week">
      <span v-for="i in WEEKLY_TARGET" :key="i" class="dot" :class="{ on: i <= thisWeek }" />
      <span>&nbsp;{{ t('board.week', { n: Math.min(thisWeek, WEEKLY_TARGET), target: WEEKLY_TARGET }) }}</span>
      <span v-if="thisWeek > WEEKLY_TARGET">&nbsp;{{ t('board.extra', { n: thisWeek - WEEKLY_TARGET }) }}</span>
    </div>
  </header>
</template>

<style scoped>
.board { background: var(--ink); color: var(--bg); border-radius: var(--r); padding: 18px 20px; display: grid; grid-template-columns: 1fr auto; gap: 4px 16px; align-items: end; position: relative; overflow: hidden; }
.board::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 5px; background: var(--accent); }
.hi { font-weight: 600; opacity: .8; font-size: 14px; letter-spacing: .02em; color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; min-height: 32px; }
.gear { width: 16px; height: 16px; }
.lvlname { font-family: var(--display); font-weight: 800; font-size: 38px; line-height: 1; text-transform: uppercase; letter-spacing: .01em; }
.step { font-size: 14px; font-weight: 600; opacity: .8; }
.score { font-family: var(--display); font-weight: 900; font-size: 72px; line-height: .85; font-variant-numeric: tabular-nums; grid-row: 1 / span 4; grid-column: 2; text-align: right; }
.score small { font-size: 28px; opacity: .5; }
.week { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 13px; opacity: .85; margin-top: 8px; }
.dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid currentColor; opacity: .6; }
.dot.on { background: var(--accent); border-color: var(--accent); opacity: 1; }
</style>
