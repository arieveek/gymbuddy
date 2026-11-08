<script setup lang="ts">
import { TIPS } from '~/data/tips'

const { t } = useI18n()
const text = useText()
const store = useTrainingStore()
const sections = computed(() => TIPS[store.active?.ageGroup ?? 'child'])
</script>

<template>
  <section class="stack" :aria-label="t('nav.tips')">
    <div v-for="(s, k) in sections" :key="k" class="card stack">
      <h2>{{ text(s.title) }}</h2>
      <p v-for="(p, n) in s.paragraphs" :key="n" style="margin: 0">{{ text(p) }}</p>
    </div>
  </section>
</template>
