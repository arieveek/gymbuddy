<script setup lang="ts">
import { formatDate, todayISO } from '~/utils/date'
import { lastWeeks, milestoneStatus, nextGoals, personalBests, weeklyStreak, longestStreak } from '~/utils/progress'
import { LEVELS, MAX_STEPS } from '~/data/levels'

const { t, locale } = useI18n()
const text = useText()
const { store, level, step, workout } = useTraining()
const testOpen = ref(false)

const today = todayISO()
const streak = computed(() => weeklyStreak(store.activeSessions, today))
const best = computed(() => longestStreak(store.activeSessions))
const weeks = computed(() => lastWeeks(store.activeSessions, today))
const bests = computed(() => personalBests(store.activeTests))
const goals = computed(() => nextGoals(level.value, store.activeTests))
const milestones = computed(() => milestoneStatus(store.activeSessions, store.activeTests))
const mainDose = computed(() => workout.value.find(s => s.ex === 'pullup'))

const history = computed(() => {
  const items = [
    ...store.activeTests.map(r => ({ id: r.id, date: r.date, kind: 1, text: t('progress.historyTest', { p: r.pullups, h: r.hangSeconds }) })),
    ...store.activeSessions.map(s => ({ id: s.id, date: s.date, kind: 0, text: t('progress.historyWorkout', { n: s.level }) + (s.lightWeek ? ` · ${t('progress.light')}` : '') }))
  ]
  return items.sort((a, b) => b.date.localeCompare(a.date) || b.kind - a.kind).slice(0, 40)
})
</script>

<template>
  <section class="stack" :aria-label="t('nav.progress')">
    <!-- 1. Consistency -->
    <div class="card stack">
      <div class="row between">
        <h2>{{ t('progress.streakTitle') }}</h2>
        <span class="chip good">{{ t('progress.streakBest', { n: best }) }}</span>
      </div>
      <p class="streak"><b>{{ streak }}</b> {{ t('progress.streakWeeks', streak) }}</p>
      <p class="sub">{{ t('progress.streakHint') }}</p>
      <StreakGrid :weeks="weeks" />
    </div>

    <!-- 2. Next goal and personal bests -->
    <div class="two">
      <div class="card stack">
        <h2>{{ t('progress.goalTitle') }}</h2>
        <div v-for="g in goals" :key="g.kind" class="goal">
          <div class="row between">
            <span class="exname">{{ t(`progress.goal.${g.kind}`, { n: g.target }) }}</span>
            <span class="sub">{{ g.current }} / {{ g.target }}</span>
          </div>
          <div class="progressbar"><i :style="{ width: Math.min(100, Math.round(g.current / Math.max(1, g.target) * 100)) + '%' }" /></div>
        </div>
        <button class="btn" @click="testOpen = true">{{ t('progress.recordTest') }}</button>
        <p class="sub">{{ t('progress.testHint') }}</p>
      </div>
      <div class="card stack">
        <h2>{{ t('progress.bestsTitle') }}</h2>
        <div class="stats">
          <div class="stat"><b>{{ bests.pullups }}</b><span>{{ t('progress.bestPullups') }}</span></div>
          <div class="stat"><b>{{ bests.hangSeconds }}s</b><span>{{ t('progress.bestHang') }}</span></div>
          <div class="stat"><b>{{ store.activeSessions.length }}</b><span>{{ t('progress.workouts') }}</span></div>
        </div>
        <ProgressChart :tests="store.activeTests" />
      </div>
    </div>

    <!-- 3. Milestones -->
    <div class="card stack">
      <h2>{{ t('progress.milestonesTitle') }}</h2>
      <div v-for="m in milestones" :key="m.kind" class="stack" style="gap: 6px">
        <div class="row between">
          <span class="exname">{{ t(`progress.milestone.${m.kind}`) }}</span>
          <span class="sub">{{ t('progress.milestoneNext', { n: m.next }) }}</span>
        </div>
        <div class="badges">
          <span v-for="e in m.earned" :key="e" class="chip">{{ e }}</span>
          <span class="chip next">{{ m.next }}</span>
        </div>
      </div>
    </div>

    <!-- 4. Where he is -->
    <div class="card stack">
      <h2>{{ t('progress.whereTitle') }}</h2>
      <p class="exname">
        {{ t('common.level', { n: level }) }}: {{ text(LEVELS[level - 1]!.name) }} ·
        {{ level === 5 ? t('board.ongoing') : t('board.step', { step, max: MAX_STEPS }) }}
      </p>
      <p v-if="level === 5 && mainDose" class="sub">{{ t('progress.level5Dose', { sets: mainDose.sets, reps: mainDose.value }) }}</p>
      <p class="sub">{{ text(LEVELS[level - 1]!.goal) }}</p>
    </div>

    <!-- 5. History -->
    <div class="card stack">
      <h2>{{ t('progress.historyTitle') }}</h2>
      <ul class="log">
        <li v-for="h in history" :key="h.id"><span>{{ h.text }}</span><span class="sub">{{ formatDate(h.date, locale) }}</span></li>
        <li v-if="!history.length"><span class="sub">{{ t('progress.historyEmpty') }}</span></li>
      </ul>
    </div>

    <TestDialog v-model:open="testOpen" />
  </section>
</template>

<style scoped>
.streak { margin: 0; font-size: 18px; font-weight: 600; }
.streak b { font-family: var(--display); font-weight: 900; font-size: 56px; line-height: 1; margin-right: 4px; }
.goal { display: flex; flex-direction: column; gap: 6px; }
.badges { display: flex; flex-wrap: wrap; gap: 6px; }
.chip.next { background: transparent; border: 2px dashed var(--line); color: var(--muted); }
</style>
