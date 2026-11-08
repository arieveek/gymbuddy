<script setup lang="ts">
import { BODY_AREAS, type BodyArea } from '~/data/types'

const { t } = useI18n()
const store = useTrainingStore()
const injuries = computed<BodyArea[]>(() => store.active?.injuries ?? [])

function toggle(area: BodyArea) {
  const next = injuries.value.includes(area) ? injuries.value.filter(a => a !== area) : [...injuries.value, area]
  store.updateAthlete({ injuries: BODY_AREAS.filter(a => next.includes(a)) })
}
</script>

<template>
  <div class="card stack">
    <h2>{{ t('injury.title') }}</h2>
    <p class="sub">{{ t('injury.intro') }}</p>
    <div class="chips" role="group" :aria-label="t('injury.title')">
      <button v-for="a in BODY_AREAS" :key="a" type="button" :aria-pressed="injuries.includes(a)" @click="toggle(a)">
        {{ t(`injury.area.${a}`) }}
      </button>
    </div>
    <p v-if="injuries.length" class="safety" role="note">{{ t('injury.advice') }}</p>
  </div>
</template>

<style scoped>
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips button { min-height: 44px; padding: 6px 14px; border-radius: 999px; border: 2px solid var(--line); background: var(--bg); font-weight: 600; }
.chips button[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
.safety { margin: 0; padding: 10px 12px; border-radius: 10px; background: var(--accent-soft); font-size: 15px; }
</style>
