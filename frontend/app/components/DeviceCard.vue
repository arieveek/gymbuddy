<script setup lang="ts">
import { AGE_BANDS } from '~/data/kngu'

/** Age band and growth-spurt mode: stored on this phone only, never sent to the server. */
const { t } = useI18n()
const store = useTrainingStore()
const isChild = computed(() => store.active?.ageGroup === 'child')
</script>

<template>
  <div v-if="isChild" class="card stack">
    <div class="row between">
      <h2>{{ t('device.title') }}</h2>
      <span class="chip good">{{ t('device.badge') }}</span>
    </div>
    <p class="sub">{{ t('device.intro') }}</p>

    <fieldset class="field" style="border: 0; padding: 0; margin: 0">
      <legend>{{ t('device.ageBand') }}</legend>
      <div class="segmented">
        <button v-for="b in AGE_BANDS" :key="b" type="button" :aria-pressed="store.device.ageBand === b" @click="store.setDevice({ ageBand: b })">
          {{ t('device.years', { band: b.replace('-', '–') }) }}
        </button>
      </div>
      <p class="sub">{{ t('device.ageBandHint') }}</p>
    </fieldset>

    <label class="toggle">
      <input type="checkbox" :checked="!!store.device.growthSpurt" @change="store.setDevice({ growthSpurt: ($event.target as HTMLInputElement).checked })">
      <span>
        <span class="exname">{{ t('growth.toggle') }}</span>
        <span class="sub">{{ t('growth.hint') }}</span>
      </span>
    </label>
  </div>
</template>

<style scoped>
.toggle { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; cursor: pointer; }
.toggle input { width: 24px; height: 24px; margin-top: 2px; accent-color: var(--accent); }
.toggle > span { display: flex; flex-direction: column; gap: 2px; }
</style>
