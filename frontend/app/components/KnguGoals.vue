<script setup lang="ts">
import { KNGU_GOALS } from '~/data/kngu'
import { EXERCISES } from '~/data/exercises'

/** The KNGU physical-preparation goals for the athlete's age band, ticked off on this device only. */
const { t } = useI18n()
const text = useText()
const { store, ageBand } = useTraining()
const goals = computed(() => (ageBand.value ? KNGU_GOALS[ageBand.value] : []))
const done = computed(() => new Set(store.device.knguDone ?? []))
const count = computed(() => goals.value.filter(g => done.value.has(g.id)).length)
</script>

<template>
  <div class="card stack">
    <div class="row between">
      <h2>{{ t('kngu.title') }}</h2>
      <span v-if="ageBand" class="chip">{{ count }}/{{ goals.length }}</span>
    </div>
    <template v-if="ageBand">
      <p class="sub">{{ t('kngu.intro', { band: ageBand.replace('-', '–') }) }}</p>
      <ul class="goals">
        <li v-for="g in goals" :key="g.id" :class="{ done: done.has(g.id) }">
          <label>
            <input type="checkbox" :checked="done.has(g.id)" @change="store.toggleGoal(g.id)">
            <span class="body">
              <span class="exname">{{ text(g.name) }}</span>
              <span class="sub">{{ text(g.standard) }}</span>
              <span class="meta">
                <span class="chip" :class="{ good: g.where === 'home' }">{{ g.where === 'home' ? t('kngu.home') : t('kngu.club') }}</span>
                <NuxtLink v-if="g.exercise" :to="{ path: '/moves', query: { open: g.exercise } }" class="link">
                  {{ t('kngu.practise', { name: text(EXERCISES[g.exercise].name) }) }}
                </NuxtLink>
              </span>
            </span>
          </label>
        </li>
      </ul>
      <p class="note">{{ t('kngu.source') }}</p>
    </template>
    <template v-else>
      <p class="sub">{{ t('kngu.setBand') }}</p>
      <NuxtLink to="/profile" class="btn ghost small" style="align-self: flex-start">{{ t('kngu.toProfile') }}</NuxtLink>
    </template>
  </div>
</template>

<style scoped>
.goals { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.goals li { border-top: 1px solid var(--line); padding: 10px 0; }
.goals li:first-child { border-top: 0; }
.goals label { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; cursor: pointer; }
.goals input { width: 24px; height: 24px; margin-top: 2px; accent-color: var(--good); }
.body { display: flex; flex-direction: column; gap: 4px; }
.meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.link { color: var(--accent); font-weight: 600; font-size: 14px; }
.done .exname { text-decoration: line-through; opacity: .7; }
</style>
