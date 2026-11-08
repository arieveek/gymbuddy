<script setup lang="ts">
import { EXERCISES, MOVE_ORDER } from '~/data/exercises'
import { POSES } from '~/data/poses'
import { CATEGORIES, EQUIPMENT, type Category, type Equipment } from '~/data/types'

/** Every drawing with all its key frames and captions, for checking with the coach. Not in the tab bar. */
definePageMeta({ layout: 'bare' })
const { t } = useI18n()
const text = useText()
const route = useRoute()

const only = computed(() => (CATEGORIES as readonly string[]).includes(String(route.query.cat)) ? route.query.cat as Category : null)
const eq = computed(() => (EQUIPMENT as readonly string[]).includes(String(route.query.eq)) ? route.query.eq as Equipment : null)
const list = computed(() => MOVE_ORDER.map(id => EXERCISES[id])
  .filter(e => (!only.value || e.category === only.value) && (!eq.value || e.equipment.includes(eq.value))))
</script>

<template>
  <div class="stack">
    <h1 class="h2" style="font-size: 36px">{{ t('poses.title') }}</h1>
    <p class="sub">{{ t('poses.intro') }}</p>
    <article v-for="ex in list" :key="ex.id" class="card stack">
      <h2>{{ text(ex.name) }} <span class="sub">· {{ t(`library.category.${ex.category}`) }}</span></h2>
      <div class="frames">
        <figure v-for="(f, i) in POSES[ex.id].frames" :key="i">
          <ExerciseAnimation :id="ex.id" :frame="i" />
          <figcaption v-if="f.cap" class="sub">{{ text(f.cap) }}</figcaption>
        </figure>
      </div>
    </article>
  </div>
</template>

<style scoped>
.frames { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
figure { margin: 0; display: flex; flex-direction: column; gap: 4px; }
</style>
