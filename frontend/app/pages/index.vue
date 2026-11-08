<script setup lang="ts">
import { EXERCISES } from '~/data/exercises'
import { todayISO } from '~/utils/date'
import { retestNudge } from '~/utils/progress'

const { t } = useI18n()
const text = useText()
const { store, def, workout, minutes, doneToday, lightWeek, level } = useTraining()
const testOpen = ref(false)

const nudge = computed(() => retestNudge(store.activeSessions, store.activeTests, level.value, todayISO()))
const items = computed(() => workout.value.slice(1))
const doseLabel = (ex: (typeof items.value)[number]) => EXERCISES[ex.ex].type === 'hold'
  ? `${ex.sets} × ${ex.value}s`
  : `${ex.sets} × ${ex.value}`
</script>

<template>
  <section class="stack" :aria-label="t('nav.today')">
    <div v-if="nudge" class="card stack">
      <h2>{{ t(`today.nudge.${nudge}.title`) }}</h2>
      <p class="sub">{{ t(`today.nudge.${nudge}.body`) }}</p>
      <button class="btn" @click="testOpen = true">{{ t(`today.nudge.${nudge}.action`) }}</button>
    </div>

    <div class="card stack">
      <div class="row between">
        <h2>{{ t('today.title') }}</h2>
        <span class="chip" :class="{ good: doneToday }">{{ doneToday ? t('today.done') : t('today.minutes', { n: minutes }) }}</span>
      </div>
      <p class="sub">{{ text(def.goal) }}</p>
      <p v-if="lightWeek" class="chip good" style="align-self: flex-start">{{ t('today.lightWeek') }}</p>
      <ul class="exlist">
        <ExerciseRow v-for="item in items" :id="item.ex" :key="item.ex">
          <div class="dose">
            {{ doseLabel(item) }}
            <small>{{ EXERCISES[item.ex].type === 'hold' ? t('today.setsSeconds') : t('today.setsReps') }}</small>
          </div>
        </ExerciseRow>
      </ul>
      <NuxtLink to="/workout" class="btn big">{{ doneToday ? t('today.again') : t('today.start') }}</NuxtLink>
      <p class="note">{{ t('today.note') }}</p>
    </div>

    <TestDialog v-model:open="testOpen" />
  </section>
</template>
